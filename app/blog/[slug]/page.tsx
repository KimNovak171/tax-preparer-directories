import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

const siteUrl = "https://taxpreparerdirectories.com";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: "Article | Tax Preparer Directories" };
  }
  const title = `${post.title} | Tax Preparer Directories`;
  const canonicalPath = `/blog/${post.slug}`;
  return {
    title,
    description: post.description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description: post.description,
      url: canonicalPath,
      siteName: "TaxPreparerDirectories.com",
      type: "article",
      publishedTime: post.date,
      images: [
        {
          url: "/og-image.svg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

function formatPostDate(dateStr: string): string {
  const t = Date.parse(dateStr);
  if (Number.isNaN(t)) return dateStr;
  return new Date(t).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "TaxPreparerDirectories.com",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteUrl}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <div className="bg-surface-muted text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <header className="rounded-2xl border-2 border-teal/30 bg-navy px-6 py-8 text-white shadow-sm sm:px-8 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
              Article
            </p>
            <h1 className="mt-3 text-balance text-3xl font-semibold leading-tight sm:text-4xl">
              {post.title}
            </h1>
            <time
              dateTime={post.date}
              className="mt-4 block text-sm font-medium text-white/80"
            >
              {formatPostDate(post.date)}
            </time>
          </header>

          <div
            className="prose-blog mx-auto mt-10 max-w-3xl text-base leading-relaxed text-slate-700 [&_a]:font-medium [&_a]:text-teal [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-teal-soft [&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:text-slate-600 [&_h1]:mt-10 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:text-navy [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-navy [&_li]:my-1 [&_ol]:my-4 [&_p]:my-4 [&_strong]:text-navy [&_ul]:my-4"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          <nav className="mx-auto mt-12 max-w-3xl border-t border-surface-muted pt-6 text-sm text-slate-600">
            <Link
              href="/blog"
              className="font-medium text-teal hover:text-teal-soft hover:underline"
            >
              ← All articles
            </Link>
          </nav>
        </div>
      </article>
    </div>
  );
}
