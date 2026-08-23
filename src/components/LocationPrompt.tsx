import { MapPin, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUserLocation } from "@/hooks/use-user-location";

export function LocationPrompt() {
  const { showPrompt, loading, requestLocation, dismissPrompt } = useUserLocation();

  if (!showPrompt) return null;

  async function handleAllow() {
    try {
      await requestLocation();
      toast.success("Location saved — you can now find shops near you.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not get location.";
      toast.error(msg);
    }
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-sm border border-border bg-background p-4 shadow-lg sm:left-auto sm:right-6 sm:max-w-md">
      <button
        type="button"
        onClick={dismissPrompt}
        className="absolute right-3 top-3 rounded-sm p-1 text-muted-foreground hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
          <MapPin className="h-5 w-5" />
        </span>
        <div>
          <p className="font-medium text-foreground">Find shops near you</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Allow location so we can show businesses closest to you in Kohat.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={handleAllow} disabled={loading}>
              {loading ? "Getting location…" : "Allow location"}
            </Button>
            <Button size="sm" variant="outline" onClick={dismissPrompt}>
              Not now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
