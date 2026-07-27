import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  prepareRequestImage,
  submitListingRequest,
} from "@/lib/listing-requests-api";
import { KohatLogo } from "@/components/KohatLogo";
import { pageHead, webPageJsonLd } from "@/lib/site-seo";

export const Route = createFileRoute("/list-business")({
  head: () => {
    const title = "List Your Business - Kohat Business Directory";
    const description =
      "Submit your Kohat shop details - name, WhatsApp and address. Photo optional. We'll review and add you to the directory.";
    return {
      ...pageHead({ title, description, path: "/list-business" }),
      scripts: [webPageJsonLd({ title, description, path: "/list-business" })],
    };
  },
  component: ListBusinessPage,
});

function ListBusinessPage() {
  const [shopName, setShopName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [image, setImage] = useState<{ name: string; blob: Blob } | null>(null);
  const [converting, setConverting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleImage(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    try {
      setConverting(true);
      const prepared = await prepareRequestImage(file);
      setImage({ name: prepared.name, blob: prepared.blob });
      setPreview(prepared.dataUrl);
    } catch (e) {
      console.error(e);
      toast.error("Failed to process image");
    } finally {
      setConverting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      toast.loading("Submitting your request…", { id: "list-biz" });
      await submitListingRequest({
        shopName,
        whatsapp,
        phone,
        address,
        image,
      });
      toast.success("Request submitted - we'll review it soon", { id: "list-biz" });
      setDone(true);
      setShopName("");
      setWhatsapp("");
      setPhone("");
      setAddress("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      toast.error(msg, { id: "list-biz" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
          <KohatLogo linkToHome imgClassName="h-10 sm:h-12" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Get listed
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          List your business
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Tell us about your shop. Add a photo and contact details - our team will
          review and publish it on the directory.
        </p>

        {done ? (
          <div className="mt-10 rounded-sm border border-border bg-card p-8 text-center">
            <p className="font-display text-2xl font-semibold">Thank you</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your listing request was received. We&apos;ll get back to you after review.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button type="button" onClick={() => setDone(false)}>
                Submit another
              </Button>
              <Button asChild variant="outline">
                <Link to="/shops" search={{}}>
                  Browse directory
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-6 rounded-sm border border-border bg-card p-6 sm:p-8">
            <div className="space-y-2">
              <Label htmlFor="shopName">Shop name</Label>
              <Input
                id="shopName"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. Shahi Biryani House"
                required
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp number</Label>
                <Input
                  id="whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="03XXXXXXXXX"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Contact number <span className="font-normal text-muted-foreground">(optional)</span></Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03XXXXXXXXX"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Full address</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, area, landmark - Kohat"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Shop photo <span className="font-normal text-muted-foreground">(optional)</span></Label>
              {preview ? (
                <div className="relative overflow-hidden rounded-sm border border-border">
                  <img
                    src={preview}
                    alt="Shop preview"
                    className="aspect-[16/10] w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setImage(null);
                    }}
                    className="absolute right-2 top-2 rounded-sm bg-background/90 p-1.5 text-foreground shadow"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition hover:border-primary/40">
                  {converting ? (
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  ) : (
                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">
                    {converting ? "Processing…" : "Upload a photo"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    JPG, PNG or WEBP - converted automatically
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={converting || submitting}
                    onChange={(e) => void handleImage(e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
            </div>

            <Button
              type="submit"
              disabled={submitting || converting}
              className="w-full sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit request
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
