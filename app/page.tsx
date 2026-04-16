import type { Metadata } from "next";
import Link from "next/link";
import { FacilityCard } from "@/components/FacilityCard";
import {
  getCanadaDirectoryIndex,
  getCanadaNationwideStats,
} from "@/lib/canadaFacilities";
import { getDirectoryIndex, getStateSummary, getGlobalStats } from "@/lib/stateFacilities";

export const metadata: Metadata = {
  title:
    "Tax Preparer Directory USA & Canada | Verified Tax Preparers & Tax filing Services",
  description:
    "Browse verified tax preparers across the US and Canada. Tax preparers, tax preparation services, tax filing providers and tax chapels — all rated 3 stars or higher on Google Maps.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Tax Preparer Directory USA & Canada | Verified Tax Preparers & Tax filing Services",
    description:
      "Browse verified tax preparers across the US and Canada. Tax preparers, tax preparation services, tax filing providers and tax chapels — all rated 3 stars or higher on Google Maps.",
    url: "/",
    siteName: "TaxPreparerDirectories.com",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "TaxPreparerDirectories.com homepage preview",
      },
    ],
  },
};

export default async function Home() {
  const [usDirectory, canadaDirectory] = await Promise.all([
    getDirectoryIndex(),
    getCanadaDirectoryIndex(),
  ]);
  const usStatesSorted = [...usDirectory].sort((a, b) =>
    a.stateName.localeCompare(b.stateName),
  );
  const stateSummaries = await Promise.all(
    usDirectory.map((s) => getStateSummary(s.stateSlug)),
  );
  const globalStats = getGlobalStats();
  const canadaNationwideStats = getCanadaNationwideStats();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "TaxPreparerDirectories.com",
        item: "https://taxpreparerdirectories.com/",
      },
    ],
  };

  return (
    <div className="bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="bg-gradient-to-b from-navy via-navy-soft to-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
          <div className="space-y-6 text-surface">
            <p className="inline-flex rounded-full bg-navy-soft/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-gold-soft ring-1 ring-gold-soft/40">
              Tax Preparer Directories
            </p>
            <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Find Trusted Tax Preparers — State by State
            </h1>
            <p className="max-w-2xl text-balance text-sm sm:text-base text-surface/80">
              Verified tax preparers, tax preparation services, and tax filing providers
              across the US and Canada. Every listing rated 3★ or higher
              on Google Maps.
            </p>
          </div>

          <section className="w-full border-y-2 border-teal/30 bg-teal/10">
            <div className="grid max-w-6xl gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border-2 border-teal/30 bg-surface p-4 text-center shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal">
                  Verified Tax Preparers
                </p>
                <p className="mt-2 text-2xl font-semibold text-navy">
                  {globalStats.totalFacilities.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border-2 border-teal/30 bg-surface p-4 text-center shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal">
                  Cities Covered
                </p>
                <p className="mt-2 text-2xl font-semibold text-navy">
                  {globalStats.totalCities.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border-2 border-teal/30 bg-surface p-4 text-center shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal">
                  Average Rating
                </p>
                <p className="mt-2 text-2xl font-semibold text-navy">
                  {globalStats.averageRating != null
                    ? `${globalStats.averageRating}★`
                    : "—"}
                </p>
              </div>
              <div className="rounded-xl border-2 border-teal/30 bg-surface p-4 text-center shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal">
                  Quality Standard
                </p>
                <p className="mt-2 text-2xl font-semibold text-navy">3★ Minimum</p>
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-slate-600">
              Canada adds{" "}
              <span className="font-semibold text-navy">
                {canadaNationwideStats.totalFacilities.toLocaleString()}
              </span>{" "}
              verified listings across{" "}
              {canadaNationwideStats.provinceCount.toLocaleString()}{" "}
              provinces and territories and{" "}
              {canadaNationwideStats.totalCities.toLocaleString()} cities
              {canadaNationwideStats.averageRating != null
                ? ` (avg ${canadaNationwideStats.averageRating}★)`
                : ""}
              .
            </p>
          </section>

          <div className="w-full rounded-2xl border-2 border-gold/40 bg-navy-soft/95 p-6 shadow-xl shadow-navy/20 ring-1 ring-gold/30">
            <h2 className="text-xl font-semibold text-white">
              Start with a state directory
            </h2>
            <p className="mt-2 text-sm text-white/90">
              Browse verified tax preparers by state, then drill down by
              city to compare options and contact details.
            </p>

            <p className="mt-2 text-sm font-medium text-white">
              {usStatesSorted.map((s) => s.stateName).join(" • ")}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {usStatesSorted.map((state) => (
                <Link
                  key={state.stateSlug}
                  href={`/${state.stateSlug}`}
                  className="rounded-xl border-2 border-gold bg-navy px-5 py-4 text-left text-white transition hover:bg-[#21456d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  <p className="text-lg font-semibold">{state.stateName}</p>
                  <p className="mt-1 text-sm text-gold-soft">
                    {state.stateName} — {state.totalFacilities.toLocaleString()} tax preparers
                  </p>
                </Link>
              ))}
            </div>

            <p className="mt-4 text-sm font-medium text-white">
              Each state has its own dedicated directory — specific tax preparation
              homes, specific cities, built for that state only.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-navy">
          Canadian Tax Preparer Directories
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Browse verified tax preparers by Canadian province. Same
          directory experience — province by province, then by city.{" "}
          <span className="font-medium text-navy">
            {canadaNationwideStats.totalFacilities.toLocaleString()} listings
          </span>{" "}
          across{" "}
          {canadaNationwideStats.provinceCount.toLocaleString()} jurisdictions
          and{" "}
          {canadaNationwideStats.totalCities.toLocaleString()} cities.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {canadaDirectory.map((item) => (
            <Link
              key={item.provinceSlug}
              href={`/canada/${item.provinceSlug}`}
              className="rounded-xl border-2 border-gold bg-navy px-5 py-4 text-left text-white transition hover:bg-[#21456d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <p className="text-lg font-semibold">{item.provinceName}</p>
              <p className="mt-1 text-sm text-gold-soft">
                {item.provinceName} — {item.totalFacilities.toLocaleString()} tax preparers
              </p>
            </Link>
          ))}
        </div>
      </section>

      {(() => {
        const allFeatured = stateSummaries
          .flatMap((s) => s.facilities)
          .filter((f) => f.featured === true || f.premium === true)
          .slice(0, 6);
        if (allFeatured.length === 0) return null;
        return (
          <section className="mx-auto max-w-6xl rounded-2xl border-2 border-teal/20 bg-teal/5 px-4 py-10 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-navy">
              Featured Tax Preparers
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Selected tax preparers across our directories — verified
              listings for families comparing local providers.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allFeatured.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          </section>
        );
      })()}

      <p className="mx-auto max-w-2xl rounded-lg border-2 border-teal/40 bg-teal/10 px-4 py-3 text-center text-sm text-slate-700">
        Tax preparer owners: Get featured at the top of your city listing.{" "}
        <Link
          href="/advertise"
          className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft"
        >
          Learn about premium placement
        </Link>{" "}
        or contact{" "}
        <a
          href="mailto:hello@directoriesnetwork.com"
          className="font-medium text-teal underline underline-offset-2 hover:text-teal-soft"
        >
          hello@directoriesnetwork.com
        </a>
        .
      </p>

      <section className="bg-navy/5">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-navy border-b-2 border-teal/50 pb-2 inline-block">
            How It Works
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border-l-4 border-teal border border-surface-muted bg-surface p-5 shadow-sm">
              <p className="text-2xl" aria-hidden="true">
                1️⃣
              </p>
              <h3 className="mt-3 text-lg font-semibold text-navy">
                Choose your state
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Start with any state to access the complete tax preparer
                directory for that area.
              </p>
            </div>
            <div className="rounded-xl border-l-4 border-teal border border-surface-muted bg-surface p-5 shadow-sm">
              <p className="text-2xl" aria-hidden="true">
                2️⃣
              </p>
              <h3 className="mt-3 text-lg font-semibold text-navy">
                Browse by city
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Compare local tax preparers by city with ratings, services,
                and contact details.
              </p>
            </div>
            <div className="rounded-xl border-l-4 border-teal border border-surface-muted bg-surface p-5 shadow-sm">
              <p className="text-2xl" aria-hidden="true">
                3️⃣
              </p>
              <h3 className="mt-3 text-lg font-semibold text-navy">
                Contact directly
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Use website and maps links to verify details and contact
                tax preparers directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy/5 border-y border-navy/10">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-navy border-b-2 border-teal/50 pb-2 inline-block">
            Why Trust Us
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border-l-4 border-navy border border-surface-muted bg-surface p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-navy">
                Google Verified Data
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                All tax preparers sourced from Google Maps with real
                ratings and reviews.
              </p>
            </article>
            <article className="rounded-xl border-l-4 border-navy border border-surface-muted bg-surface p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-navy">
                Quality Filtered
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Minimum 3-star rating and irrelevant businesses removed
                from every listing.
              </p>
            </article>
            <article className="rounded-xl border-l-4 border-navy border border-surface-muted bg-surface p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-navy">
                Always Free to Browse
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                No signup required, no spam, just helpful information for
                families.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-navy">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gold/50 bg-navy-soft/60 p-6 text-surface ring-1 ring-gold/30">
            <h2 className="text-2xl font-semibold text-gold-soft">
              Are You a Tax Preparer Owner?
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-surface/90">
              Get your tax preparer seen by families actively searching for
              services in your city. Featured and premium listings available.
            </p>
            <div className="mt-5">
              <Link
                href="/advertise"
                className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-navy shadow-sm transition hover:bg-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                Learn About Featured Listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
