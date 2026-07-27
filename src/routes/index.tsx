import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Phone,
  MessageCircle,
  Facebook,
  Instagram,
  Mail,
  ArrowRight,
  MapPin,
  UtensilsCrossed,
  ShoppingBag,
  Car,
  HeartPulse,
  GraduationCap,
  Landmark,
  Plane,
  Scissors,
  Wrench,
  ShoppingBasket,
  Building2,
  Building,
  Ticket,
  Sparkles,
  Compass,
  MousePointerClick,
  PhoneCall,
} from "lucide-react";
import {
  heroImages,
  tagline,
  featuredShops,
  about,
  socials,
} from "@/data/home";
import { mainCategories } from "@/data/categories";
import { FeaturedShops } from "@/components/FeaturedShops";
import { ListBusinessPromo } from "@/components/ListBusinessPromo";
import { KohatLogo } from "@/components/KohatLogo";
import { useShops } from "@/hooks/use-shops";

const HOME_TITLE = "Kohat Business Directory — Local Shops, Restaurants & Services";
const HOME_DESC =
  "Discover every business in Kohat — restaurants, cafés, biryani spots, bike shops, salons, tailors, workshops and more. Contact owners directly on WhatsApp or phone.";
const HOME_URL = "https://kohat-connect.lovable.app/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESC },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: HOME_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: HOME_TITLE },
      { name: "twitter:description", content: HOME_DESC },
    ],
    links: [{ rel: "canonical", href: HOME_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Kohat Business Directory",
          url: HOME_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: `${HOME_URL}shops?q={query}`,
            "query-input": "required name=query",
          },
        }),
      },
    ],
  }),
  component: Home,
});


const categoryIcons: Record<string, typeof UtensilsCrossed> = {
  "food-drinks": UtensilsCrossed,
  shopping: ShoppingBag,
  vehicles: Car,
  health: HeartPulse,
  education: GraduationCap,
  financial: Landmark,
  travel: Plane,
  beauty: Scissors,
  "home-services": Wrench,
  "daily-needs": ShoppingBasket,
  religious: Building2,
  government: Building,
  entertainment: Ticket,
};

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <Featured />
      <RecentlyAdded />
      <HowItWorks />
      <AboutStrip />
      <Footer />
    </div>
  );
}

function TopBar() {
  return (
    <header className="relative z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <KohatLogo linkToHome />
        <nav className="flex items-center gap-2">
          <Link
            to="/about"
            className="hidden rounded-sm px-3 py-2 text-sm text-primary-foreground transition hover:text-accent sm:inline-flex"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hidden rounded-sm px-3 py-2 text-sm text-primary-foreground transition hover:text-accent sm:inline-flex"
          >
            Contact
          </Link>
          <a
            href={socials.facebook}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="rounded-sm border border-white/25 bg-white/10 p-2 text-primary-foreground backdrop-blur transition hover:bg-white/20"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            href={`mailto:${socials.contactEmail}`}
            aria-label="Contact"
            className="hidden rounded-sm border border-white/25 bg-white/10 p-2 text-primary-foreground backdrop-blur transition hover:bg-white/20 sm:inline-flex"
          >
            <Mail className="h-4 w-4" />
          </a>
          <Link
            to="/shops"
            search={{}}
            className="ml-1 inline-flex items-center gap-2 rounded-sm bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:ml-2 sm:px-4"
          >
            Enter Directory
            <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      {/* Full-bleed image plane */}
      <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12">
        <div className="relative col-span-1 lg:col-span-8">
          <img
            src={heroImages.main}
            alt="Kohat bazaar at golden hour"
            width={1600}
            height={1104}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="hidden lg:col-span-4 lg:grid lg:grid-rows-2">
          <div className="relative overflow-hidden border-l border-b border-white/10">
            <img
              src={heroImages.side1}
              alt="Biryani stall"
              width={900}
              height={1100}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative overflow-hidden border-l border-white/10">
            <img
              src={heroImages.side2}
              alt="Bike shop"
              width={900}
              height={700}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.18_0.03_45_/_0.55)] via-[oklch(0.18_0.03_45_/_0.45)] to-[oklch(0.18_0.03_45_/_0.78)]" />

      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <TopBar />

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end gap-6 px-6 pb-8 pt-8 sm:gap-8 sm:pb-12 lg:px-10">
          {/* 1. Headline */}
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-3 duration-700">
            <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-white/25 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-primary-foreground backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              A city directory · Kohat, KPK
            </div>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] text-primary-foreground sm:text-6xl lg:text-7xl">
              {tagline.english}
            </h1>
            <p className="font-urdu mt-4 text-2xl text-primary-foreground/90 sm:text-3xl" dir="rtl">
              {tagline.urdu}
            </p>
            <p className="mt-5 max-w-xl text-base text-primary-foreground/85 sm:text-lg">
              {tagline.sub}
            </p>
          </div>

          {/* 2. Search + list CTA in parallel */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-5 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100 fill-mode-both">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void navigate({
                  to: "/shops",
                  search: q.trim() ? { q: q.trim() } : {},
                });
              }}
              className="flex w-full max-w-4xl items-center gap-2 rounded-sm border border-white/25 bg-white/15 p-2 shadow-[0_20px_60px_-24px_oklch(0_0_0_/_0.55)] backdrop-blur-xl"
            >
              <div className="flex flex-1 items-center gap-3 px-3">
                <Search className="h-5 w-5 shrink-0 text-primary-foreground/70" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  type="search"
                  placeholder="Search shops, restaurants, areas…"
                  className="w-full bg-transparent py-3 text-base text-primary-foreground placeholder:text-primary-foreground/55 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-sm bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 sm:px-5"
              >
                Search
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <ListBusinessPromo variant="hero" className="w-full shrink-0 lg:w-auto lg:max-w-sm" />
          </div>

          {/* 3. Browse categories — glass panel */}
          <div className="rounded-sm border border-white/20 bg-white/10 p-4 shadow-[0_24px_80px_-30px_oklch(0_0_0_/_0.6)] backdrop-blur-xl sm:p-6 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200 fill-mode-both">
            <div className="mb-4 flex items-end justify-between gap-4 sm:mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/65">
                  Browse by category
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-primary-foreground sm:text-2xl">
                  What are you looking for today?
                </h2>
              </div>
              <Link
                to="/shops"
                search={{}}
                className="shrink-0 text-sm font-medium text-accent underline-offset-4 transition hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
              {mainCategories.map((c) => {
                const Icon = categoryIcons[c.key] ?? ShoppingBasket;
                return (
                  <Link
                    key={c.key}
                    to="/shops"
                    search={{ category: c.key }}
                    className="group flex w-[9.5rem] shrink-0 flex-col items-start gap-2.5 rounded-sm border border-white/15 bg-white/10 p-3 transition hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/20 sm:w-auto sm:gap-3 sm:p-4"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-white/15 text-accent transition group-hover:bg-primary group-hover:text-primary-foreground sm:h-10 sm:w-10">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="font-display text-sm font-medium text-primary-foreground sm:text-base">
                        {c.label}
                      </p>
                      <p className="font-urdu text-xs text-primary-foreground/65 sm:text-sm" dir="rtl">
                        {c.urdu}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Featured() {
  const { shops, usingFallback } = useShops();
  const dbFeatured = shops.filter((s) => s.featured);
  const fallbackItems = featuredShops.map((s) => ({
    slug: s.slug,
    name: s.name,
    categoryLabel: s.category,
    area: s.area,
    image: s.image,
    whatsapp: s.whatsapp,
    phone: s.phone,
    featured: true,
  }));
  const items = usingFallback || dbFeatured.length === 0 ? fallbackItems : dbFeatured;

  return (
    <FeaturedShops
      className="bg-secondary/40"
      eyebrow="Handpicked this week"
      title="Featured Businesses in Kohat"
      description=""
      items={items}
      showLink
      linkLabel="See all businesses →"
    />
  );
}

function RecentlyAdded() {
  const { shops, usingFallback } = useShops();
  const recent = usingFallback
    ? [...featuredShops].reverse().slice(0, 4).map((s) => ({
        slug: s.slug,
        name: s.name,
        category: s.category,
        area: s.area,
        image: s.image,
      }))
    : shops.slice(0, 4).map((s) => ({
        slug: s.slug,
        name: s.name,
        category: s.categoryLabel,
        area: s.area,
        image: s.image,
      }));
  return (
    <section className="border-t border-border px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Fresh on the directory
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
              Recently added businesses
            </h2>
          </div>
          <Link
            to="/shops"
            search={{ sort: "newest" }}
            className="hidden text-sm font-medium text-primary underline-offset-4 hover:underline sm:inline"
          >
            Browse newest →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {recent.map((s) => (
            <Link
              key={s.slug}
              to="/shops/$slug"
              params={{ slug: s.slug }}
              className="group flex flex-col overflow-hidden rounded-sm border border-border bg-card transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_-20px_oklch(0.22_0.03_45_/_0.35)]"
            >
              <div className="relative overflow-hidden">
                <img
                  src={s.image}
                  alt={s.name}
                  width={600}
                  height={450}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute left-2 top-2 rounded-sm bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                  New
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {s.category}
                </p>
                <p className="font-display text-base font-semibold leading-snug text-foreground group-hover:text-primary">
                  {s.name}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {s.area}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Search or browse",
      urdu: "تلاش کریں",
      body: "Find a shop by name, category or area — from biryani stalls on Bannu Road to bike mechanics in KDA.",
    },
    {
      icon: MousePointerClick,
      title: "Open the shop page",
      urdu: "دکان کھولیں",
      body: "See photos, address, timings, gallery and a map location — everything you need before you head out.",
    },
    {
      icon: PhoneCall,
      title: "Call or WhatsApp",
      urdu: "رابطہ کریں",
      body: "Contact the shop directly on WhatsApp or phone. No middleman, no signup — just tap and talk.",
    },
  ];
  return (
    <section className="border-t border-border bg-secondary/40 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Compass className="h-3.5 w-3.5 text-accent" />
            How it works
          </p>
          <h2 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">
            Three steps to reach any shop in Kohat
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            No apps to install, no accounts to create. Just browse, find and contact — the way the bazaar has always worked.
          </p>
        </div>
        <ol className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="relative flex flex-col gap-4 rounded-sm border border-border bg-card p-6 transition hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className="font-display text-4xl font-semibold text-muted-foreground/25">
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="font-urdu text-sm text-muted-foreground" dir="rtl">
                    {step.urdu}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}



function AboutStrip() {
  return (
    <section className="border-t border-border px-6 py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            About Kohat Shops
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl lg:text-5xl">
            {about.headline}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {about.body}
          </p>
        </div>
        <div className="lg:col-span-5">
          <ListBusinessPromo />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-[oklch(0.22_0.03_45)] text-primary-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-14 sm:grid-cols-3">
        <div>
          <KohatLogo imgClassName="h-12 sm:h-14" />
          <p className="mt-3 max-w-xs text-sm text-primary-foreground/70">
            A community directory for every shop, café, stall and business
            across Kohat.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-accent">
            Explore
          </p>
          <ul className="space-y-2 text-primary-foreground/80">
            <li>
              <Link to="/shops" search={{}} className="hover:text-accent">
                All Businesses
              </Link>
            </li>
            <li>
              <Link
                to="/shops"
                search={{ category: "food-drinks" }}
                className="hover:text-accent"
              >
                Food &amp; Drinks
              </Link>
            </li>
            <li><Link to="/about" className="hover:text-accent">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-accent">Contact Us</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-accent">
            Follow
          </p>
          <div className="flex items-center gap-2">
            <a href={socials.facebook} aria-label="Facebook" className="rounded-sm border border-white/15 p-2 hover:border-accent hover:text-accent"><Facebook className="h-4 w-4" /></a>
            <a href={socials.instagram} aria-label="Instagram" className="rounded-sm border border-white/15 p-2 hover:border-accent hover:text-accent"><Instagram className="h-4 w-4" /></a>
            <a href={socials.whatsapp} aria-label="WhatsApp" className="rounded-sm border border-white/15 p-2 hover:border-accent hover:text-accent"><MessageCircle className="h-4 w-4" /></a>
            <a href={`mailto:${socials.contactEmail}`} aria-label="Email" className="rounded-sm border border-white/15 p-2 hover:border-accent hover:text-accent"><Mail className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 py-5 text-xs text-primary-foreground/60 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Kohat Shops. Built for the city.</p>
          <p className="font-urdu text-sm text-primary-foreground/70" dir="rtl">
            کوہاٹ سے، کوہاٹ کے لیے
          </p>
        </div>
      </div>
    </footer>
  );
}
