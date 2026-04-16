import type { Metadata } from "next";
import { DIRECTORY_BRAND_NAME } from "@/lib/careTypesProse";

type RegionPageProps = {
  params: {
    region: string;
  };
};

export function generateMetadata({ params }: RegionPageProps): Metadata {
  const regionCode = params.region.toUpperCase();

  return {
    title: `Tax preparers in ${regionCode}`,
    description: `Explore tax preparation options in ${regionCode} with ${DIRECTORY_BRAND_NAME}.`,
    openGraph: {
      title: `Tax preparers in ${regionCode} | ${DIRECTORY_BRAND_NAME}`,
      description: `Browse tax preparers and tax professionals in ${regionCode}.`,
      url: `/locations/${params.region}`,
      type: "website",
    },
  };
}

export default function RegionPage({ params }: RegionPageProps) {
  const regionCode = params.region.toUpperCase();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal">
          Directory by region
        </p>
        <h1 className="text-3xl font-semibold text-navy">
          Tax preparers in {regionCode}
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          This is a placeholder view for{" "}
          <span className="font-semibold">{regionCode}</span>. Here you&apos;ll
          be able to browse tax preparers and tax preparation firms in this state or
          province.
        </p>
        <div className="mt-6 rounded-xl border border-surface-muted bg-surface px-4 py-6 text-sm text-slate-500">
          Listing data will be loaded from your data model. This template
          ships with an empty{" "}
          <code className="rounded bg-surface-muted px-1 py-0.5 text-xs">
            /data
          </code>{" "}
          directory.
        </div>
      </div>
    </main>
  );
}
