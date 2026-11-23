"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Archive,
  CheckCircle2,
  Clock3,
  DollarSign,
  LayoutDashboard,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  productCategories,
  productCategoryLabel,
  type Product,
  type ProductCategory,
} from "@/lib/products";
import {
  isOrderStatus,
  orderStatuses,
  type CustomerOrder,
} from "@/lib/orders";
import { resolveStoreImage } from "@/lib/store-images";

type VariantForm = {
  id: string;
  title: string;
  price: string;
};

type ProductForm = {
  name: string;
  category: ProductCategory;
  description: string;
  image: string;
  published: boolean;
  variants: VariantForm[];
};

type ProductResponse = { product: Product };
type ProductListResponse = { products: Product[]; error?: string };
type OrderResponse = { order: CustomerOrder };
type OrderListResponse = { orders: CustomerOrder[]; error?: string };
export type AdminSection = "overview" | "products" | "orders";

const blankForm: ProductForm = {
  name: "",
  category: "dry-fruits",
  description: "",
  image: "",
  published: true,
  variants: [{ id: "", title: "", price: "" }],
};

function formFromProduct(product: Product): ProductForm {
  return {
    name: product.name,
    category: product.category,
    description: product.description,
    image: product.image,
    published: product.published,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      title: variant.title,
      price: (variant.priceCents / 100).toFixed(2),
    })),
  };
}

function formatPriceRange(product: Product): string {
  const prices = product.variants.map((variant) => variant.priceCents);
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  return low === high
    ? formatPrice(low)
    : `${formatPrice(low)} – ${formatPrice(high)}`;
}

function formatPrice(cents: number): string {
  return `Rs.${new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100)}`;
}

function formatOrderDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en-PK", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

async function responseError(response: Response): Promise<string> {
  try {
    const result: { error?: string } = await response.json();
    return result.error ?? `The request failed (${response.status}).`;
  } catch {
    return `The request failed (${response.status}). Check the server connection and try again.`;
  }
}

type ProductDescriptionInput = {
  name: string;
  category: ProductCategory;
};

async function requestProductDescription(
  input: ProductDescriptionInput,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch("/api/admin/ai/product-description", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });
  if (!response.ok) {
    throw new Error(await responseError(response));
  }

  const result: { description?: unknown } = await response.json();
  const lines =
    typeof result.description === "string"
      ? result.description.split(/\r?\n/).map((line) => line.trim())
      : [];
  if (lines.length !== 2 || lines.some((line) => !line || line.length > 180)) {
    throw new Error("The generated description was not exactly two lines. Please try again.");
  }
  return lines.join("\n");
}

function isProductCategory(value: string): value is ProductCategory {
  return productCategories.some((category) => category.value === value);
}

function ProductEditor({
  product,
  saving,
  onCancel,
  onSave,
}: {
  product: Product | null;
  saving: boolean;
  onCancel: () => void;
  onSave: (form: ProductForm, imageFile: File | null, removeImage: boolean) => Promise<void>;
}) {
  const [form, setForm] = useState<ProductForm>(product ? formFromProduct(product) : blankForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [descriptionStatus, setDescriptionStatus] = useState("");
  const [descriptionMode, setDescriptionMode] = useState<"auto" | "generated" | "manual">(
    product?.description.trim() ? "manual" : "auto",
  );
  const generatedDescriptionKey = useRef("");
  const descriptionRequestId = useRef(0);

  function invalidateDescriptionRequest() {
    descriptionRequestId.current += 1;
    setGeneratingDescription(false);
  }

  function setField<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    if (key === "name" || key === "category") {
      invalidateDescriptionRequest();
    }
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setVariant(index: number, patch: Partial<VariantForm>) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, itemIndex) =>
        itemIndex === index ? { ...variant, ...patch } : variant,
      ),
    }));
  }

  const generateDescription = useCallback(async (automatic = false, signal?: AbortSignal) => {
    const requestId = ++descriptionRequestId.current;
    const productName = form.name.trim();
    const key = JSON.stringify([productName, form.category]);
    if (!productName) {
      if (!automatic) setDescriptionStatus("Enter a product name first.");
      return;
    }
    if (automatic && (descriptionMode === "manual" || generatedDescriptionKey.current === key)) {
      return;
    }

    setGeneratingDescription(true);
    setDescriptionStatus(automatic ? "Creating a two-line suggestion…" : "");
    try {
      const description = await requestProductDescription(
        {
          name: productName,
          category: form.category,
        },
        signal,
      );
      if (signal?.aborted || descriptionRequestId.current !== requestId) {
        return;
      }

      generatedDescriptionKey.current = key;
      setForm((current) => ({ ...current, description }));
      setDescriptionMode("generated");
      setDescriptionStatus("AI suggestion ready. Review it before saving.");
    } catch (cause) {
      if (signal?.aborted || descriptionRequestId.current !== requestId) return;
      setDescriptionStatus(
        cause instanceof Error ? cause.message : "The description could not be generated.",
      );
    } finally {
      if (descriptionRequestId.current === requestId) {
        setGeneratingDescription(false);
      }
    }
  }, [descriptionMode, form.category, form.name]);

  useEffect(() => {
    if (!form.name.trim() || descriptionMode === "manual") return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void generateDescription(true, controller.signal);
    }, 800);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
      descriptionRequestId.current += 1;
    };
  }, [descriptionMode, form.category, form.name, generateDescription]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave(form, imageFile, removeImage);
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-form-grid">
        <div className="admin-form-field">
          <Label htmlFor="product-name">Product name</Label>
          <Input
            id="product-name"
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
            required
            maxLength={160}
          />
        </div>
        <div className="admin-form-field">
          <Label htmlFor="product-category">Category</Label>
          <Select
            value={form.category}
            onValueChange={(value) => {
              if (value && isProductCategory(value)) {
                setField("category", value);
              }
            }}
          >
            <SelectTrigger id="product-category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {productCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="admin-form-field">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="product-description">Description</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void generateDescription()}
            disabled={generatingDescription}
          >
            <Sparkles aria-hidden="true" size={16} />
            {generatingDescription ? "Writing..." : "Write with AI"}
          </Button>
        </div>
        <Textarea
          id="product-description"
          value={form.description}
          onChange={(event) => {
            invalidateDescriptionRequest();
            setField("description", event.target.value);
            setDescriptionMode("manual");
            setDescriptionStatus("");
          }}
          rows={3}
          maxLength={5000}
        />
        <p className="admin-file-note" role="status" aria-live="polite">
          {descriptionStatus || "Gemini suggests two friendly, easy-to-read lines from the product name. Weight and size details are left out. Edit the draft as needed."}
        </p>
      </div>

      <div className="admin-form-field">
        <Label htmlFor="product-image-file">Product photo (optional)</Label>
        <Input
          id="product-image-file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            setImageFile(file);
            if (file) setRemoveImage(false);
          }}
        />
        <p className="admin-file-note">
          Images are stored in the database. Upload JPEG, PNG or WebP up to 4 MB.
        </p>
        {form.image && !imageFile && !removeImage && (
          <div className="admin-form-field">
            <p className="admin-file-note">This product has an image stored in the database.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => setRemoveImage(true)}>
              Remove current image
            </Button>
          </div>
        )}
        {form.image && removeImage && (
          <div className="admin-form-field">
            <p className="admin-file-note">The current image will be removed when you save.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => setRemoveImage(false)}>
              Keep current image
            </Button>
          </div>
        )}
        {form.image && imageFile && (
          <p className="admin-file-note">The uploaded image will replace the current image when saved.</p>
        )}
      </div>

      <div className="admin-variant-heading">
        <div className="admin-form-field">
          <span>Options and pricing</span>
          <p className="admin-file-note">Add a size or leave its name blank for a single price.</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setForm((current) => ({
              ...current,
              variants: [...current.variants, { id: "", title: "", price: "" }],
            }))
          }
          disabled={form.variants.length >= 20}
        >
          Add option
        </Button>
      </div>
      {form.variants.map((variant, index) => (
        <div className="admin-variant" key={variant.id || `new-${index}`}>
          <div className="admin-form-field">
            <Label htmlFor={`variant-title-${index}`}>Option name</Label>
            <Input
              id={`variant-title-${index}`}
              value={variant.title}
              onChange={(event) => setVariant(index, { title: event.target.value })}
              maxLength={100}
              placeholder="250g"
            />
          </div>
          <div className="admin-form-field">
            <Label htmlFor={`variant-price-${index}`}>Price (PKR)</Label>
            <Input
              id={`variant-price-${index}`}
              value={variant.price}
              onChange={(event) => setVariant(index, { price: event.target.value })}
              inputMode="decimal"
              pattern="[0-9]+([.][0-9]{1,2})?"
              required
              placeholder="0.00"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label={`Remove option ${index + 1}`}
            onClick={() =>
              setForm((current) => ({
                ...current,
                variants: current.variants.filter((_, itemIndex) => itemIndex !== index),
              }))
            }
            disabled={form.variants.length === 1}
          >
            Remove
          </Button>
        </div>
      ))}

      <label className="admin-check-row">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(event) => setField("published", event.target.checked)}
        />
        Publish this product on the storefront
      </label>

      <div className="admin-dialog-footer">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : product ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>
  );
}

export function AdminDashboard({ section }: { section: AdminSection }) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [orderRefreshError, setOrderRefreshError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [productSearch, setProductSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const loadProducts = useCallback(async () => {
    const response = await fetch("/api/admin/products", { cache: "no-store" });
    if (response.status === 401) {
      router.replace("/admin/login");
      return;
    }
    if (!response.ok) {
      throw new Error(await responseError(response));
    }
    const result: ProductListResponse = await response.json();
    setProducts(result.products);
  }, [router]);

  const loadOrders = useCallback(async () => {
    const response = await fetch("/api/admin/orders", { cache: "no-store" });
    if (response.status === 401) {
      router.replace("/admin/login");
      return;
    }
    if (!response.ok) {
      throw new Error(await responseError(response));
    }
    const result: OrderListResponse = await response.json();
    setOrders(result.orders);
  }, [router]);

  const loadSectionData = useCallback(async () => {
    if (section === "products") {
      await loadProducts();
    } else if (section === "orders") {
      await loadOrders();
    } else {
      await Promise.all([loadProducts(), loadOrders()]);
    }
  }, [loadOrders, loadProducts, section]);

  const refreshOrders = useCallback(async () => {
    try {
      await loadOrders();
      setOrderRefreshError("");
    } catch (cause) {
      setOrderRefreshError(
        cause instanceof Error ? cause.message : "Orders could not be refreshed.",
      );
    }
  }, [loadOrders]);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/session", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await responseError(response));
        }
        const result: { authenticated: boolean } = await response.json();
        if (!result.authenticated) {
          router.replace("/admin/login");
          return;
        }
        await loadSectionData();
        if (active) {
          setDataReady(true);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "The product list could not be loaded.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [loadSectionData, router]);

  useEffect(() => {
    if (!dataReady || section === "products") return;

    let active = true;
    let refreshing = false;
    const refresh = async () => {
      if (!active || refreshing) return;
      refreshing = true;
      try {
        await refreshOrders();
      } finally {
        refreshing = false;
      }
    };
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const interval = window.setInterval(() => void refresh(), 30_000);

    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [dataReady, refreshOrders, section]);

  const visibleProducts = useMemo(
    () =>
      products.filter((product) =>
        (statusFilter === "all" ||
          (statusFilter === "published" && product.published) ||
          (statusFilter === "draft" && !product.published)) &&
        `${product.name} ${productCategoryLabel(product.category)}`
          .toLowerCase()
          .includes(productSearch.trim().toLowerCase()),
      ),
    [productSearch, products, statusFilter],
  );
  const visibleOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesStatus = orderStatusFilter === "all" || order.status === orderStatusFilter;
        const searchable = [
          order.id,
          order.customerName,
          order.phone,
          order.email,
          order.address,
          ...order.items.map((item) => item.name),
        ]
          .join(" ")
          .toLowerCase();
        return matchesStatus && searchable.includes(orderSearch.trim().toLowerCase());
      }),
    [orderSearch, orderStatusFilter, orders],
  );
  const publishedCount = products.filter((product) => product.published).length;
  const draftCount = products.length - publishedCount;
  const pendingOrderCount = orders.filter((order) => order.status === "pending").length;
  const completedOrderCount = orders.filter((order) => order.status === "completed").length;
  const placedOrderValue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((total, order) => total + order.totalCents, 0);

  async function saveProduct(
    form: ProductForm,
    imageFile: File | null,
    removeImage: boolean,
  ) {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const product = {
        name: form.name,
        category: form.category,
        description: form.description,
        alt: form.name,
        published: form.published,
        variants: form.variants.map((variant) => ({
          id: variant.id || undefined,
          title: variant.title,
          priceCents: Math.round(Number(variant.price) * 100),
        })),
      };
      const body = new FormData();
      body.set("product", JSON.stringify(product));
      if (imageFile) body.set("image", imageFile);
      if (removeImage) body.set("removeImage", "true");

      const endpoint = editingProduct
        ? `/api/admin/products/${encodeURIComponent(editingProduct.id)}`
        : "/api/admin/products";
      const response = await fetch(endpoint, {
        method: editingProduct ? "PUT" : "POST",
        body,
      });
      if (!response.ok) {
        throw new Error(await responseError(response));
      }

      const result: ProductResponse = await response.json();
      setProducts((current) =>
        editingProduct
          ? current.map((product) => (product.id === result.product.id ? result.product : product))
          : [...current, result.product],
      );
      setSuccess(editingProduct ? "Product changes saved." : "Product created.");
      setDialogOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The product could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(product: Product) {
    setError("");
    setSuccess("");
    try {
      const body = new FormData();
      body.set(
        "product",
        JSON.stringify({
          name: product.name,
          category: product.category,
          description: product.description,
          alt: product.alt,
          published: !product.published,
          variants: product.variants,
        }),
      );
      const response = await fetch(`/api/admin/products/${encodeURIComponent(product.id)}`, {
        method: "PUT",
        body,
      });
      if (!response.ok) {
        throw new Error(await responseError(response));
      }
      const result: ProductResponse = await response.json();
      setProducts((current) =>
        current.map((item) => (item.id === result.product.id ? result.product : item)),
      );
      setSuccess(result.product.published ? "Product published." : "Product unpublished.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The product status could not be changed.");
    }
  }

  async function deleteProduct() {
    if (!deletingProduct) {
      return;
    }
    try {
      const response = await fetch(
        `/api/admin/products/${encodeURIComponent(deletingProduct.id)}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        throw new Error(await responseError(response));
      }
      setProducts((current) => current.filter((product) => product.id !== deletingProduct.id));
      setSuccess(`${deletingProduct.name} removed.`);
      setDeletingProduct(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The product could not be removed.");
    }
  }

  async function changeOrderStatus(order: CustomerOrder, status: CustomerOrder["status"]) {
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`/api/admin/orders/${encodeURIComponent(order.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error(await responseError(response));
      }
      const result: OrderResponse = await response.json();
      setOrders((current) =>
        current.map((item) => (item.id === result.order.id ? result.order : item)),
      );
      setSuccess(`Order ${order.id.slice(0, 8)} updated.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The order status could not be changed.");
    }
  }

  async function signOut() {
    try {
      const response = await fetch("/api/admin/session", { method: "DELETE" });
      if (!response.ok) {
        throw new Error(await responseError(response));
      }
      router.replace("/admin/login");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign out failed. Please try again.");
    }
  }

  async function retryLoading() {
    setLoading(true);
    setError("");
    try {
      await loadSectionData();
      setDataReady(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Store data could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setError("");
    setEditingProduct(null);
    setDialogOpen(true);
  }

  function openEditDialog(product: Product) {
    setError("");
    setEditingProduct(product);
    setDialogOpen(true);
  }

  return (
    <main className="admin-layout">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <Link className="admin-brand" href="/" aria-label="Reenz Organic home">
          <Image
            src={resolveStoreImage("/assets/images/logo.png")}
            alt="Reenz Organic"
            width={137}
            height={55}
            priority
          />
        </Link>
        <div className="admin-sidebar-navigation">
          <p className="admin-sidebar-label">Workspace</p>
          <nav className="admin-sidebar-links" aria-label="Dashboard sections">
            <Link
              className={`admin-sidebar-link ${section === "overview" ? "is-active" : ""}`}
              href="/admin"
              aria-current={section === "overview" ? "page" : undefined}
            >
              <LayoutDashboard aria-hidden="true" />
              Overview
            </Link>
            <Link
              className={`admin-sidebar-link ${section === "products" ? "is-active" : ""}`}
              href="/admin/products"
              aria-current={section === "products" ? "page" : undefined}
            >
              <Package aria-hidden="true" />
              Products
            </Link>
            <Link
              className={`admin-sidebar-link ${section === "orders" ? "is-active" : ""}`}
              href="/admin/orders"
              aria-current={section === "orders" ? "page" : undefined}
            >
              <ShoppingBag aria-hidden="true" />
              Orders
              <span className="admin-nav-count">{dataReady ? orders.length : "—"}</span>
            </Link>
          </nav>
        </div>
        <div className="admin-sidebar-footer">
          <span>REENZ ORGANIC</span>
          <Link href="/" target="_blank" rel="noreferrer">
            View storefront
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </aside>
      <div className="admin-workspace">
      <header className="admin-header">
        <p className="admin-breadcrumb">
          Store management <span>/</span> <strong>{section.charAt(0).toUpperCase() + section.slice(1)}</strong>
        </p>
        <div className="admin-header-actions">
          <Link className="admin-header-store-link" href="/" target="_blank" rel="noreferrer">
            View store <ArrowUpRight aria-hidden="true" />
          </Link>
          <Button variant="outline" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </header>

      <section className="admin-main" id={section}>
        <div className="admin-topline">
          <div>
            <p className="admin-eyebrow">Your organic storefront</p>
            <h1>
              {section === "overview"
                ? "Store overview"
                : section === "products"
                  ? "Products"
                  : "Orders"}
            </h1>
            <p className="admin-subtitle">
              {section === "overview"
                ? "A clear view of your catalog and cash-on-delivery orders."
                : section === "products"
                  ? "Manage product details, pricing, availability and storefront visibility."
                  : "Review customer details, track cash-on-delivery orders and update their status."}
            </p>
          </div>
          {(section === "overview" || section === "products") && (
            <Button className="admin-add-product" onClick={openCreateDialog}>
              <Package aria-hidden="true" />
              Add product
            </Button>
          )}
        </div>

        {error && (
          <div className="admin-alert mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => void retryLoading()} disabled={loading}>
              {loading ? "Retrying…" : "Try again"}
            </Button>
          </div>
        )}
        {orderRefreshError && (
          <div className="admin-alert mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            <span>{orderRefreshError}</span>
            <Button variant="outline" size="sm" onClick={() => void refreshOrders()}>
              Retry order refresh
            </Button>
          </div>
        )}
        {success && (
          <p className="admin-alert admin-success mb-5 rounded-xl border border-reenz-leaf/20 bg-reenz-sage px-4 py-3 text-sm text-reenz-green" role="status">
            {success}
          </p>
        )}

        {section === "overview" ? (
          <>
            <div className="admin-metrics admin-metrics--overview">
              <div className="admin-metric">
                <span className="admin-metric-icon admin-metric-icon--forest"><Package aria-hidden="true" /></span>
                <span className="admin-metric-copy"><strong>{dataReady ? products.length : "—"}</strong><span>Products</span></span>
                <span className="admin-metric-caption">CATALOG</span>
              </div>
              <div className="admin-metric">
                <span className="admin-metric-icon admin-metric-icon--leaf"><CheckCircle2 aria-hidden="true" /></span>
                <span className="admin-metric-copy"><strong>{dataReady ? publishedCount : "—"}</strong><span>Published</span></span>
                <span className="admin-metric-caption">LIVE</span>
              </div>
              <div className="admin-metric">
                <span className="admin-metric-icon admin-metric-icon--gold"><ShoppingBag aria-hidden="true" /></span>
                <span className="admin-metric-copy"><strong>{dataReady ? orders.length : "—"}</strong><span>Orders</span></span>
                <span className="admin-metric-caption">ALL TIME</span>
              </div>
              <div className="admin-metric">
                <span className="admin-metric-icon admin-metric-icon--forest"><Clock3 aria-hidden="true" /></span>
                <span className="admin-metric-copy"><strong>{dataReady ? pendingOrderCount : "—"}</strong><span>Pending orders</span></span>
                <span className="admin-metric-caption">FOLLOW UP</span>
              </div>
            </div>

            <div className="admin-overview-grid">
              <Card className="admin-overview-card">
                <CardContent className="p-0">
                  <div className="admin-overview-card-heading">
                    <div><p className="admin-eyebrow">Latest activity</p><h2>Recent orders</h2></div>
                    <Link href="/admin/orders">All orders <ArrowUpRight aria-hidden="true" /></Link>
                  </div>
                  {loading ? (
                    <p className="admin-overview-empty">Loading orders…</p>
                  ) : !dataReady ? (
                    <p className="admin-overview-empty">Order data is unavailable until the database connection is restored.</p>
                  ) : orders.length ? (
                    <ul className="admin-overview-list">
                      {orders.slice(0, 5).map((order) => (
                        <li key={order.id}>
                          <div className="admin-overview-order-copy">
                            <div>
                              <strong>#{order.id.slice(0, 8)}</strong>
                              <Badge variant={order.status === "completed" ? "default" : order.status === "cancelled" ? "destructive" : "secondary"}>
                                {order.status}
                              </Badge>
                            </div>
                            <span>{order.customerName} · {formatOrderDate(order.createdAt)}</span>
                          </div>
                          <strong className="admin-overview-order-total">{formatPrice(order.totalCents)}</strong>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="admin-overview-empty">No orders yet. New COD orders will appear here.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="admin-overview-card">
                <CardContent className="p-0">
                  <div className="admin-overview-card-heading">
                    <div><p className="admin-eyebrow">Catalog health</p><h2>Recent products</h2></div>
                    <Link href="/admin/products">Manage products <ArrowUpRight aria-hidden="true" /></Link>
                  </div>
                  {loading ? (
                    <p className="admin-overview-empty">Loading products…</p>
                  ) : !dataReady ? (
                    <p className="admin-overview-empty">Product data is unavailable until the database connection is restored.</p>
                  ) : products.length ? (
                    <ul className="admin-overview-list admin-overview-products">
                      {products.slice(0, 5).map((product) => (
                        <li key={product.id}>
                          <div className="admin-overview-product-copy">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt=""
                                width={44}
                                height={44}
                                sizes="44px"
                                unoptimized
                              />
                            ) : <span className="admin-overview-product-placeholder" aria-hidden="true" />}
                            <div>
                              <strong>{product.name}</strong>
                              <span>{productCategoryLabel(product.category)} · {product.variants.length} option{product.variants.length === 1 ? "" : "s"}</span>
                            </div>
                          </div>
                          <Badge variant={product.published ? "default" : "secondary"}>
                            {product.published ? "Live" : "Draft"}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="admin-overview-empty">Your catalog is empty. Add a product to get started.</p>
                  )}
                </CardContent>
              </Card>
            </div>
            <p className="admin-file-note mt-4">
              Checkout currently uses cash on delivery; order totals do not confirm payment collection.
            </p>
          </>
        ) : section === "products" ? (
          <>
            <div className="admin-metrics admin-metrics--three">
              <div className="admin-metric">
                <span className="admin-metric-icon admin-metric-icon--forest"><Package aria-hidden="true" /></span>
                <span className="admin-metric-copy"><strong>{dataReady ? products.length : "—"}</strong><span>All products</span></span>
                <span className="admin-metric-caption">CATALOG</span>
              </div>
              <div className="admin-metric">
                <span className="admin-metric-icon admin-metric-icon--leaf"><CheckCircle2 aria-hidden="true" /></span>
                <span className="admin-metric-copy"><strong>{dataReady ? publishedCount : "—"}</strong><span>Published</span></span>
                <span className="admin-metric-caption">LIVE</span>
              </div>
              <div className="admin-metric">
                <span className="admin-metric-icon admin-metric-icon--gold"><Archive aria-hidden="true" /></span>
                <span className="admin-metric-copy"><strong>{dataReady ? draftCount : "—"}</strong><span>Unpublished</span></span>
                <span className="admin-metric-caption">DRAFTS</span>
              </div>
            </div>

            <div className="admin-products">
              <div className="admin-toolbar">
                <div className="admin-toolbar-title">
                  <h2>Product catalog</h2>
                  <p>{dataReady ? `${visibleProducts.length} of ${products.length} products` : loading ? "Loading products…" : "Product data unavailable"}</p>
                </div>
                <div className="admin-toolbar-controls">
                  <div className="admin-search">
                    <Search aria-hidden="true" />
                    <Input
                      type="search"
                      placeholder="Search name or category"
                      aria-label="Search products"
                      value={productSearch}
                      onChange={(event) => setProductSearch(event.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="admin-status-filter" aria-label="Filter products by status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All products</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Unpublished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card className="admin-table-wrap admin-products-table">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price range</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow><TableCell colSpan={5} className="py-12 text-center text-muted-foreground">Loading products…</TableCell></TableRow>
                      ) : visibleProducts.length ? (
                        visibleProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {product.image ? (
                                  <Image
                                    className="admin-product-image"
                                    src={product.image}
                                    alt=""
                                    width={52}
                                    height={52}
                                    sizes="52px"
                                    unoptimized
                                  />
                                ) : <div className="admin-product-image" aria-hidden="true" />}
                                <div className="admin-product-name">
                                  <strong>{product.name}</strong>
                                  <span>{product.variants.length} option{product.variants.length === 1 ? "" : "s"}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{productCategoryLabel(product.category)}</TableCell>
                            <TableCell>{formatPriceRange(product)}</TableCell>
                            <TableCell><Badge variant={product.published ? "default" : "secondary"}>{product.published ? "Published" : "Unpublished"}</Badge></TableCell>
                            <TableCell>
                              <div className="admin-row-actions">
                                <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>Edit</Button>
                                <Button variant="outline" size="sm" onClick={() => void togglePublished(product)}>
                                  {product.published ? "Unpublish" : "Publish"}
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => setDeletingProduct(product)}>Remove</Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                            {!dataReady
                              ? "Product data could not be loaded. Check the database connection and try again."
                              : products.length
                                ? "No products match these filters."
                                : "No products yet. Add your first product to build the catalog."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
            <div className="admin-metrics admin-metrics--four">
              <div className="admin-metric">
                <span className="admin-metric-icon admin-metric-icon--forest"><ShoppingBag aria-hidden="true" /></span>
                <span className="admin-metric-copy"><strong>{dataReady ? orders.length : "—"}</strong><span>Total orders</span></span>
                <span className="admin-metric-caption">ALL TIME</span>
              </div>
              <div className="admin-metric">
                <span className="admin-metric-icon admin-metric-icon--gold"><Clock3 aria-hidden="true" /></span>
                <span className="admin-metric-copy"><strong>{dataReady ? pendingOrderCount : "—"}</strong><span>Pending</span></span>
                <span className="admin-metric-caption">FOLLOW UP</span>
              </div>
              <div className="admin-metric">
                <span className="admin-metric-icon admin-metric-icon--leaf"><CheckCircle2 aria-hidden="true" /></span>
                <span className="admin-metric-copy"><strong>{dataReady ? completedOrderCount : "—"}</strong><span>Completed</span></span>
                <span className="admin-metric-caption">FULFILLED</span>
              </div>
              <div className="admin-metric admin-metric--value">
                <span className="admin-metric-icon admin-metric-icon--forest"><DollarSign aria-hidden="true" /></span>
                <span className="admin-metric-copy"><strong>{dataReady ? formatPrice(placedOrderValue) : "—"}</strong><span>Placed COD value</span></span>
                <span className="admin-metric-caption">EXCL. CANCELLED</span>
              </div>
            </div>
            <p className="admin-data-note">Placed COD value excludes cancelled orders and does not indicate payments collected.</p>

            <div className="admin-products admin-orders-page">
              <div className="admin-toolbar">
                <div className="admin-toolbar-title">
                  <h2>All orders</h2>
                  <p>{dataReady ? `Showing ${visibleOrders.length} of ${orders.length} orders` : loading ? "Loading orders…" : "Order data unavailable"}</p>
                </div>
                <div className="admin-toolbar-controls">
                  <div className="admin-search">
                    <Search aria-hidden="true" />
                    <Input
                      type="search"
                      placeholder="Search order or customer"
                      aria-label="Search orders"
                      value={orderSearch}
                      onChange={(event) => setOrderSearch(event.target.value)}
                    />
                  </div>
                  <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                    <SelectTrigger className="admin-status-filter" aria-label="Filter orders by status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      {orderStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card className="admin-table-wrap admin-orders-table">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Placed</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items and delivery</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">Loading orders…</TableCell></TableRow>
                      ) : visibleOrders.length ? (
                        visibleOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono text-xs">#{order.id.slice(0, 8)}</TableCell>
                            <TableCell className="whitespace-nowrap">{formatOrderDate(order.createdAt)}</TableCell>
                            <TableCell>
                              <div className="admin-order-customer">
                                <strong>{order.customerName}</strong>
                                <span>{order.phone}</span>
                                {order.email && <span>{order.email}</span>}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="admin-order-details">
                                <ul>
                                  {order.items.map((item) => (
                                    <li key={`${order.id}-${item.variantId}`}>
                                      {item.name}{item.option ? ` · ${item.option}` : ""} × {item.quantity}
                                    </li>
                                  ))}
                                </ul>
                                <span>{order.address}</span>
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">{formatPrice(order.totalCents)}</TableCell>
                            <TableCell>
                              <Select
                                value={order.status}
                                onValueChange={(value) => {
                                  if (isOrderStatus(value)) void changeOrderStatus(order, value);
                                }}
                              >
                                <SelectTrigger className="w-36" aria-label={`Order ${order.id} status`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {orderStatuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                            {!dataReady
                              ? "Order data could not be loaded. Check the database connection and try again."
                              : orders.length
                                ? "No orders match these filters."
                                : "No orders yet. New cash-on-delivery orders will appear here."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </section>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!saving) {
            setDialogOpen(open);
          }
        }}
      >
        <DialogContent className="admin-dialog-content sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit product" : "Add a product"}</DialogTitle>
            <DialogDescription>
              Add accurate product details and pricing. Changes appear on the storefront when saved.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <p className="admin-alert" role="alert">
              {error}
            </p>
          )}
          <ProductEditor
            key={editingProduct?.id ?? "new-product"}
            product={editingProduct}
            saving={saving}
            onCancel={() => setDialogOpen(false)}
            onSave={saveProduct}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deletingProduct)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingProduct(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this product?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingProduct?.name} will be permanently removed from the product database and
              storefront.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={(event) => {
                event.preventDefault();
                void deleteProduct();
              }}
            >
              Remove product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </main>
  );
}
