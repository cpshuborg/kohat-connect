import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Check, MapPin, MessageCircle, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AdminNav } from "@/components/admin/AdminNav";
import { useListingRequests } from "@/hooks/use-listing-requests";
import {
  deleteListingRequest,
  updateListingRequestStatus,
  type ListingRequest,
} from "@/lib/listing-requests-api";

export const Route = createFileRoute("/admin/requests/")({
  head: () => ({
    meta: [
      { title: "Listing requests - Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminRequestsPage,
});

function AdminRequestsPage() {
  const { requests, isLoading, isError, error } = useListingRequests();
  const qc = useQueryClient();

  async function setStatus(id: string, status: "reviewed" | "rejected" | "pending") {
    try {
      await updateListingRequestStatus(id, status);
      await qc.invalidateQueries({ queryKey: ["listing-requests"] });
      toast.success(`Marked as ${status}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function remove(id: string, name: string) {
    try {
      toast.loading(`Deleting ${name}…`, { id: `del-${id}` });
      await deleteListingRequest(id);
      await qc.invalidateQueries({ queryKey: ["listing-requests"] });
      toast.success("Request deleted", { id: `del-${id}` });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed", { id: `del-${id}` });
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Admin</p>
            <h1 className="text-xl font-semibold">Listing requests</h1>
          </div>
          <Link to="/shops" search={{}} className="text-sm text-muted-foreground hover:text-foreground">
            View site
          </Link>
        </div>
        <div className="mx-auto max-w-6xl px-4">
          <AdminNav active="requests" />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading requests…</p>
        )}
        {isError && (
          <div className="rounded-sm border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {(error as Error)?.message ??
              "Could not load requests. Make sure the listing_requests table exists."}
          </div>
        )}
        {!isLoading && !isError && requests.length === 0 && (
          <div className="rounded-sm border border-dashed border-border bg-background px-6 py-16 text-center">
            <p className="font-display text-xl font-semibold">No requests yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              When someone submits &quot;List your business&quot;, it will show up here.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              onStatus={setStatus}
              onDelete={remove}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RequestCard({
  request: r,
  onStatus,
  onDelete,
}: {
  request: ListingRequest;
  onStatus: (id: string, status: "reviewed" | "rejected" | "pending") => void;
  onDelete: (id: string, name: string) => void;
}) {
  const when = new Date(r.created_at).toLocaleString();

  return (
    <article className="flex flex-col overflow-hidden rounded-sm border border-border bg-background shadow-sm">
      <div className="relative aspect-[16/10] bg-muted">
        {r.image_url ? (
          <img
            src={r.image_url}
            alt={r.shop_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
        <span
          className={`absolute left-2 top-2 rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
            r.status === "pending"
              ? "bg-accent text-accent-foreground"
              : r.status === "reviewed"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {r.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h2 className="font-display text-lg font-semibold leading-snug">{r.shop_name}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{when}</p>
        </div>

        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{r.address || "-"}</span>
        </p>

        <div className="flex flex-wrap gap-2">
          <a
            href={`https://wa.me/${r.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1.5 text-xs font-medium transition hover:border-primary/40 hover:text-primary"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {r.whatsapp || "WhatsApp"}
          </a>
          <a
            href={`tel:${r.phone}`}
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1.5 text-xs font-medium transition hover:border-primary/40 hover:text-primary"
          >
            <Phone className="h-3.5 w-3.5" />
            {r.phone || "Call"}
          </a>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-3">
          {r.status !== "reviewed" && (
            <Button size="sm" variant="default" onClick={() => onStatus(r.id, "reviewed")}>
              <Check className="mr-1 h-3.5 w-3.5" />
              Reviewed
            </Button>
          )}
          {r.status !== "rejected" && (
            <Button size="sm" variant="outline" onClick={() => onStatus(r.id, "rejected")}>
              Reject
            </Button>
          )}
          {r.status !== "pending" && (
            <Button size="sm" variant="ghost" onClick={() => onStatus(r.id, "pending")}>
              Pending
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost" className="ml-auto text-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this request?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove the listing request for {r.shop_name}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(r.id, r.shop_name)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </article>
  );
}
