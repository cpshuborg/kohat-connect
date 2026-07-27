import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

const BUCKET = "request-images";

export type ListingRequest =
  Database["public"]["Tables"]["listing_requests"]["Row"];

export type ListingRequestInput = {
  shopName: string;
  whatsapp: string;
  phone?: string;
  address: string;
  image?: { name: string; blob: Blob } | null;
};

async function fileToWebpBlob(file: File, quality = 0.85): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("webp encode failed"))),
      "image/webp",
      quality,
    );
  });
  return blob;
}

export async function prepareRequestImage(file: File) {
  const blob = await fileToWebpBlob(file);
  const dataUrl: string = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
  const baseName = file.name.replace(/\.[^.]+$/, "");
  return { name: `${baseName}.webp`, blob, dataUrl };
}

async function uploadRequestImage(image: { name: string; blob: Blob }) {
  const stamp = Date.now();
  const safe = image.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const path = `requests/${stamp}-${safe}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, image.blob, {
    contentType: "image/webp",
    upsert: false,
    cacheControl: "3600",
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function submitListingRequest(input: ListingRequestInput) {
  const shopName = input.shopName.trim();
  const whatsapp = input.whatsapp.trim();
  const phone = input.phone?.trim() ?? "";
  const address = input.address.trim();
  if (!shopName) throw new Error("Shop name is required");
  if (!whatsapp) throw new Error("WhatsApp number is required");
  if (!address) throw new Error("Full address is required");

  const imageUrl = input.image?.blob
    ? await uploadRequestImage(input.image)
    : "";

  const { data, error } = await supabase
    .from("listing_requests")
    .insert({
      shop_name: shopName,
      whatsapp,
      phone,
      address,
      image_url: imageUrl,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as ListingRequest;
}

export async function fetchListingRequests(): Promise<ListingRequest[]> {
  const { data, error } = await supabase
    .from("listing_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ListingRequest[];
}

export async function updateListingRequestStatus(
  id: string,
  status: "pending" | "reviewed" | "rejected",
) {
  const { error } = await supabase
    .from("listing_requests")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteListingRequest(id: string) {
  const { error } = await supabase.from("listing_requests").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
