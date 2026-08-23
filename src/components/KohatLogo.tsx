import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/my-city-center-logo.png";

export function KohatLogo({
  className,
  imgClassName,
  linkToHome = false,
}: {
  className?: string;
  imgClassName?: string;
  linkToHome?: boolean;
}) {
  const img = (
    <span className={cn("inline-flex items-center", className)}>
      <img
        src={LOGO_SRC}
        alt="My City Center"
        width={220}
        height={64}
        className={cn("h-12 w-auto object-contain sm:h-14", imgClassName)}
      />
    </span>
  );

  if (linkToHome) {
    return (
      <Link to="/" className="inline-flex shrink-0">
        {img}
      </Link>
    );
  }

  return img;
}
