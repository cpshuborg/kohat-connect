import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Matches the dark frosted panel used in the hero “Browse by category” block */
export const HERO_GLASS_PANEL =
  "rounded-sm border border-white/20 bg-[oklch(0.22_0.03_45_/_0.42)] text-primary-foreground shadow-[0_24px_80px_-30px_oklch(0_0_0_/_0.6)] backdrop-blur-xl";

export function ListBusinessPromo({
  variant = "light",
  className,
}: {
  /** `hero` = dark glass on home hero only; `light` = white card everywhere else */
  variant?: "light" | "hero";
  className?: string;
}) {
  const isHero = variant === "hero";

  return (
    <div
      className={cn(
        isHero
          ? cn(HERO_GLASS_PANEL, "p-4 sm:p-6")
          : "rounded-sm border border-border bg-card p-4 text-foreground",
        className,
      )}
    >
      <p
        className={cn(
          "text-sm leading-snug",
          isHero ? "text-primary-foreground/80" : "text-muted-foreground",
        )}
      >
        Own a shop in Kohat? List it free — buyers reach you directly via WhatsApp
        or call.
      </p>
      <div className="mt-3 flex items-center justify-between gap-3 sm:mt-4">
        <Link
          to="/list-business"
          className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          List your business
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p
          className={cn(
            "font-urdu shrink-0 text-right text-base leading-none sm:text-lg",
            isHero ? "text-primary-foreground" : "text-foreground",
          )}
          dir="rtl"
        >
          اپنا کاروبار شامل کریں
        </p>
      </div>
    </div>
  );
}
