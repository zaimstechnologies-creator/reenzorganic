import { randomUUID } from "node:crypto";
import {
  Binary,
  MongoClient,
  type Db,
  type Document,
  type Filter,
  type UpdateFilter,
} from "mongodb";
import {
  productCategories,
  type Product,
  type ProductImageChange,
  type ProductInput,
  type ProductVariant,
  type StoredProductImage,
} from "@/lib/products";
import type {
  CheckoutDetails,
  CheckoutLine,
  CustomerOrder,
  OrderItem,
  OrderStatus,
} from "@/lib/orders";
import { isOrderStatus } from "@/lib/orders";

type ProductDocument = Document & {
  _id: string;
  name: string;
  category: string;
  description: string;
  imageData?: Binary;
  imageContentType?: "image/jpeg" | "image/png" | "image/webp";
  imageUpdatedAt?: Date;
  alt: string;
  variants: unknown;
  published: boolean;
  homepageFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type OrderDocument = Document & {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: unknown;
  totalCents: number;
  status: string;
  createdAt: Date;
};

type MetadataDocument = Document & {
  _id: string;
  value: string;
  revision?: number;
};

type ContactMessageDocument = Document & {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
};

const globalDatabase = globalThis as typeof globalThis & {
  reenzMongoClientPromise?: Promise<MongoClient>;
  reenzSchemaPromise?: Promise<void>;
};

async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Set MONGODB_URI to a MongoDB Atlas connection string before starting the store.");
  }

  if (!globalDatabase.reenzMongoClientPromise) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
    globalDatabase.reenzMongoClientPromise = client.connect().then(
      () => client,
      (error: unknown) => {
        globalDatabase.reenzMongoClientPromise = undefined;
        throw error;
      },
    );
  }
  return globalDatabase.reenzMongoClientPromise;
}

async function getDatabase(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB || "reenzorganic");
}

async function ensureSchema() {
  if (!globalDatabase.reenzSchemaPromise) {
    globalDatabase.reenzSchemaPromise = (async () => {
      const db = await getDatabase();
      const products = db.collection<ProductDocument>("products");
      const orders = db.collection<OrderDocument>("orders");

      await Promise.all([
        products.createIndex({ published: 1, updatedAt: -1 }),
        products.createIndex({ homepageFeatured: 1, published: 1, updatedAt: -1 }),
        orders.createIndex({ createdAt: -1 }),
      ]);
    })().catch((error: unknown) => {
      globalDatabase.reenzSchemaPromise = undefined;
      throw error;
    });
  }
  await globalDatabase.reenzSchemaPromise;
}

function readVariants(value: unknown): ProductVariant[] {
  const parsed: unknown = typeof value === "string" ? JSON.parse(value) : value;
  if (!Array.isArray(parsed)) {
    throw new Error("The product database contains invalid option data.");
  }

  return parsed.map((item: unknown) => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("id" in item) ||
      typeof item.id !== "string" ||
      !("title" in item) ||
      typeof item.title !== "string" ||
      !("priceCents" in item) ||
      typeof item.priceCents !== "number"
    ) {
      throw new Error("The product database contains an invalid option.");
    }

    return { id: item.id, title: item.title, priceCents: item.priceCents };
  });
}

function readDate(value: unknown, label: string): string {
  const date =
    value instanceof Date ? value : typeof value === "string" ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) {
    throw new Error(`The database contains an invalid ${label} date.`);
  }
  return date.toISOString();
}

function readProduct(row: ProductDocument): Product {
  const category = productCategories.find((item) => item.value === row.category);
  if (!category || typeof row._id !== "string") {
    throw new Error("The product database contains an invalid product.");
  }
  const image =
    row.imageContentType && row.imageUpdatedAt instanceof Date
      ? `/api/products/${encodeURIComponent(row._id)}/image/${row.imageUpdatedAt.getTime()}`
      : "";
  return {
    id: row._id,
    name: row.name,
    category: category.value,
    description: row.description,
    image,
    alt: row.alt,
    variants: readVariants(row.variants),
    published: row.published === true,
    homepageFeatured: row.homepageFeatured === true,
    updatedAt: readDate(row.updatedAt, "product update"),
  };
}

function readOrderItems(value: unknown): OrderItem[] {
  const parsed: unknown = typeof value === "string" ? JSON.parse(value) : value;
  if (!Array.isArray(parsed)) {
    throw new Error("The order database contains invalid item data.");
  }
  return parsed.map((item: unknown) => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("productId" in item) ||
      typeof item.productId !== "string" ||
      !("variantId" in item) ||
      typeof item.variantId !== "string" ||
      !("name" in item) ||
      typeof item.name !== "string" ||
      !("option" in item) ||
      typeof item.option !== "string" ||
      !("image" in item) ||
      typeof item.image !== "string" ||
      !("quantity" in item) ||
      typeof item.quantity !== "number" ||
      !("unitPriceCents" in item) ||
      typeof item.unitPriceCents !== "number"
    ) {
      throw new Error("The order database contains an invalid item.");
    }
    return {
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      option: item.option,
      image: item.image,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
    };
  });
}

function readOrder(row: OrderDocument): CustomerOrder {
  if (!isOrderStatus(row.status) || typeof row._id !== "string") {
    throw new Error("The order database contains an invalid order.");
  }
  const totalCents = Number(row.totalCents);
  if (!Number.isSafeInteger(totalCents) || totalCents < 0) {
    throw new Error("The order database contains an invalid total.");
  }
  return {
    id: row._id,
    customerName: row.customerName,
    email: row.email,
    phone: row.phone,
    address: row.address,
    items: readOrderItems(row.items),
    totalCents,
    status: row.status,
    createdAt: readDate(row.createdAt, "order creation"),
  };
}

export async function getProducts(publishedOnly = true): Promise<Product[]> {
  await ensureSchema();
  const db = await getDatabase();
  const filter: Filter<ProductDocument> = publishedOnly ? { published: true } : {};
  const rows = await db
    .collection<ProductDocument>("products")
    .find(filter, { projection: { imageData: 0 } })
    .sort({ createdAt: -1, name: 1 })
    .toArray();
  return rows.map(readProduct);
}

export async function getHomepageProducts(): Promise<Product[]> {
  await ensureSchema();
  const db = await getDatabase();
  const rows = await db
    .collection<ProductDocument>("products")
    .find(
      { published: true, homepageFeatured: true },
      { projection: { imageData: 0 } },
    )
    .sort({ updatedAt: -1, name: 1 })
    .limit(4)
    .toArray();
  return rows.map(readProduct);
}

export async function setHomepageFeatured(
  id: string,
  featured: boolean,
): Promise<{ product: Product } | { reason: "not-found" | "unpublished" | "limit" }> {
  await ensureSchema();
  const client = await getMongoClient();
  const db = await getDatabase();
  const products = db.collection<ProductDocument>("products");
  const metadata = db.collection<MetadataDocument>("store_metadata");
  const session = client.startSession();
  let outcome:
    | { product: Product }
    | { reason: "not-found" | "unpublished" | "limit" } = { reason: "not-found" };

  try {
    await session.withTransaction(async () => {
      await metadata.updateOne(
        { _id: "homepage-feature-lock" },
        { $inc: { revision: 1 }, $setOnInsert: { value: "lock" } },
        { upsert: true, session },
      );
      const current = await products.findOne(
        { _id: id },
        { session, projection: { imageData: 0 } },
      );
      if (!current) {
        outcome = { reason: "not-found" };
        return;
      }
      if (featured && !current.published) {
        outcome = { reason: "unpublished" };
        return;
      }
      if (featured && !current.homepageFeatured) {
        const count = await products.countDocuments(
          { homepageFeatured: true, published: true },
          { session },
        );
        if (count >= 4) {
          outcome = { reason: "limit" };
          return;
        }
      }

      const update: UpdateFilter<ProductDocument> = {
        $set: { homepageFeatured: featured, updatedAt: new Date() },
      };
      await products.updateOne({ _id: id }, update, { session });
      const updated = await products.findOne(
        { _id: id },
        { session, projection: { imageData: 0 } },
      );
      if (!updated) {
        throw new Error("The updated homepage product could not be loaded.");
      }
      outcome = { product: readProduct(updated) };
    });
  } finally {
    await session.endSession();
  }
  return outcome;
}

export async function createProduct(
  product: ProductInput,
  imageChange: ProductImageChange,
): Promise<Product> {
  await ensureSchema();
  const db = await getDatabase();
  const now = new Date();
  const id = randomUUID();
  const document: ProductDocument = {
    _id: id,
    name: product.name,
    category: product.category,
    description: product.description,
    alt: product.alt,
    variants: product.variants,
    published: product.published,
    homepageFeatured: false,
    createdAt: now,
    updatedAt: now,
  };
  if (imageChange.type === "replace") {
    document.imageData = new Binary(Buffer.from(imageChange.bytes));
    document.imageContentType = imageChange.contentType;
    document.imageUpdatedAt = now;
  }
  await db.collection<ProductDocument>("products").insertOne(document);
  return readProduct(document);
}

export async function updateProduct(
  id: string,
  product: ProductInput,
  imageChange: ProductImageChange,
): Promise<Product | null> {
  await ensureSchema();
  const db = await getDatabase();
  const setFields: Partial<ProductDocument> = {
    name: product.name,
    category: product.category,
    description: product.description,
    alt: product.alt,
    variants: product.variants,
    published: product.published,
    updatedAt: new Date(),
  };
  if (!product.published) {
    setFields.homepageFeatured = false;
  }

  const products = db.collection<ProductDocument>("products");
  const update: UpdateFilter<ProductDocument> = { $set: setFields };
  if (imageChange.type === "replace") {
    setFields.imageData = new Binary(Buffer.from(imageChange.bytes));
    setFields.imageContentType = imageChange.contentType;
    setFields.imageUpdatedAt = new Date();
  } else if (imageChange.type === "remove") {
    update.$unset = { imageData: "", imageContentType: "", imageUpdatedAt: "" };
  }

  const result = await products.updateOne({ _id: id }, update);
  if (result.matchedCount === 0) {
    return null;
  }
  const updated = await products.findOne({ _id: id }, { projection: { imageData: 0 } });
  return updated ? readProduct(updated) : null;
}

export async function getProductImage(id: string): Promise<StoredProductImage | null> {
  await ensureSchema();
  const db = await getDatabase();
  const row = await db.collection<ProductDocument>("products").findOne(
    { _id: id },
    {
      projection: {
        _id: 1,
        imageData: 1,
        imageContentType: 1,
        imageUpdatedAt: 1,
        published: 1,
      },
    },
  );
  if (
    !row?.imageData ||
    !row.imageContentType ||
    !(row.imageUpdatedAt instanceof Date)
  ) {
    return null;
  }
  const bytes =
    row.imageData instanceof Binary
      ? Buffer.from(row.imageData.value())
      : Buffer.isBuffer(row.imageData)
        ? row.imageData
        : null;
  if (!bytes) {
    return null;
  }
  return {
    bytes,
    contentType: row.imageContentType,
    published: row.published === true,
    version: row.imageUpdatedAt.getTime(),
  };
}

export async function deleteProduct(id: string): Promise<boolean> {
  await ensureSchema();
  const db = await getDatabase();
  const result = await db.collection<ProductDocument>("products").deleteOne({ _id: id });
  return result.deletedCount === 1;
}

export async function hasVariantIdentifierConflict(
  product: ProductInput,
  excludeProductId?: string,
): Promise<boolean> {
  await ensureSchema();
  const incomingIds = new Set(product.variants.map((variant) => variant.id));
  if (incomingIds.size !== product.variants.length) {
    return true;
  }
  const db = await getDatabase();
  const filter: Filter<ProductDocument> = {
    "variants.id": { $in: [...incomingIds] },
  };
  if (excludeProductId) {
    filter._id = { $ne: excludeProductId };
  }
  return Boolean(
    await db.collection<ProductDocument>("products").findOne(filter, { projection: { _id: 1 } }),
  );
}

export async function createOrder(
  details: CheckoutDetails,
  lines: CheckoutLine[],
): Promise<CustomerOrder | null> {
  await ensureSchema();
  const products = await getProducts(true);
  const variants = new Map(
    products.flatMap((product) =>
      product.variants.map((variant) => [variant.id, { product, variant }] as const),
    ),
  );
  const items: OrderItem[] = [];
  for (const line of lines) {
    const match = variants.get(line.variantId);
    if (!match) {
      return null;
    }
    items.push({
      productId: match.product.id,
      variantId: match.variant.id,
      name: match.product.name,
      option: match.variant.title,
      image: match.product.image,
      quantity: line.quantity,
      unitPriceCents: match.variant.priceCents,
    });
  }
  const totalCents = items.reduce((total, item) => total + item.unitPriceCents * item.quantity, 0);
  if (!Number.isSafeInteger(totalCents)) {
    throw new Error("The order total exceeds the supported amount.");
  }
  const order: OrderDocument = {
    _id: randomUUID(),
    customerName: details.customerName,
    email: details.email,
    phone: details.phone,
    address: details.address,
    items,
    totalCents,
    status: "pending",
    createdAt: new Date(),
  };
  const db = await getDatabase();
  await db.collection<OrderDocument>("orders").insertOne(order);
  return readOrder(order);
}

export async function getOrders(): Promise<CustomerOrder[]> {
  await ensureSchema();
  const db = await getDatabase();
  const rows = await db
    .collection<OrderDocument>("orders")
    .find({})
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();
  return rows.map(readOrder);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<CustomerOrder | null> {
  await ensureSchema();
  const db = await getDatabase();
  const orders = db.collection<OrderDocument>("orders");
  const result = await orders.updateOne({ _id: id }, { $set: { status } });
  if (result.matchedCount === 0) {
    return null;
  }
  const updated = await orders.findOne({ _id: id });
  return updated ? readOrder(updated) : null;
}

export async function createContactMessage(details: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<void> {
  await ensureSchema();
  const db = await getDatabase();
  const message: ContactMessageDocument = {
    _id: randomUUID(),
    customerName: details.name,
    email: details.email,
    phone: details.phone,
    message: details.message,
    createdAt: new Date(),
  };
  await db.collection<ContactMessageDocument>("contact_messages").insertOne(message);
}
