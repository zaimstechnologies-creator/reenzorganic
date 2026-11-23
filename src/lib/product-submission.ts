import type { ProductImageChange, ProductInput } from "@/lib/products";
import { validateProductInput } from "@/lib/product-validation";

const maxImageBytes = 4 * 1024 * 1024;
const imageTypes = {
  "image/jpeg": { signature: [0xff, 0xd8, 0xff] },
  "image/png": { signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  "image/webp": { signature: [0x52, 0x49, 0x46, 0x46] },
} as const;

type SubmissionResult =
  | { success: true; product: ProductInput; imageChange: ProductImageChange }
  | { success: false; message: string; status: number };

export async function parseProductSubmission(request: Request): Promise<SubmissionResult> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxImageBytes + 256 * 1024) {
    return { success: false, message: "Choose an image smaller than 4 MB.", status: 413 };
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return { success: false, message: "Enter valid product details.", status: 400 };
  }

  const rawProduct = formData.get("product");
  if (typeof rawProduct !== "string") {
    return { success: false, message: "Enter valid product details.", status: 400 };
  }

  let body: unknown;
  try {
    body = JSON.parse(rawProduct);
  } catch {
    return { success: false, message: "Enter valid product details.", status: 400 };
  }

  const validation = validateProductInput(body);
  if (!validation.success) {
    return { success: false, message: validation.message, status: 400 };
  }

  const rawFile = formData.get("image");
  const removeImage = formData.get("removeImage");
  if (removeImage !== null && removeImage !== "true") {
    return { success: false, message: "Choose a valid image action.", status: 400 };
  }
  if (removeImage === "true" && rawFile !== null) {
    return { success: false, message: "Choose an image or remove the current image, not both.", status: 400 };
  }
  if (rawFile === null) {
    return {
      success: true,
      product: validation.product,
      imageChange: removeImage === "true" ? { type: "remove" } : { type: "keep" },
    };
  }
  if (!(rawFile instanceof File) || rawFile.size < 1 || rawFile.size > maxImageBytes) {
    return { success: false, message: "Choose an image smaller than 4 MB.", status: 400 };
  }

  const contentType = rawFile.type as keyof typeof imageTypes;
  const imageType = imageTypes[contentType];
  if (!imageType) {
    return { success: false, message: "Use a JPEG, PNG or WebP image.", status: 400 };
  }

  const bytes = new Uint8Array(await rawFile.arrayBuffer());
  const signatureMatches = imageType.signature.every((byte, index) => bytes[index] === byte);
  const webpMatches =
    contentType !== "image/webp" ||
    (String.fromCharCode(...bytes.slice(8, 12)) === "WEBP" &&
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF");
  if (!signatureMatches || !webpMatches) {
    return { success: false, message: "The selected file is not a valid image.", status: 400 };
  }

  return {
    success: true,
    product: validation.product,
    imageChange: { type: "replace", bytes, contentType },
  };
}
