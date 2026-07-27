import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/admin/shops" as const, label: "Businesses", key: "shops" as const },
  { to: "/admin/requests" as const, label: "Listing requests", key: "requests" as const },
];

export function AdminNav({ active }: { active: "shops" | "requests" }) {
  return (
    <nav className="flex items-center gap-1 border-b border-border">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={cn(
              "px-3 py-2 text-sm font-medium transition",
              isActive
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
