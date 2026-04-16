/**
 * Turn raw Google-style category labels into short phrases for directory prose.
 * Keeps tax preparation, accounting, and related services; drops unrelated map noise.
 */

/** Display brand matching production domain taxpreparerdirectories.com */
export const DIRECTORY_BRAND_NAME = "TaxPreparerDirectories.com";

/** Support email for listings, advertising, and privacy requests (replaces legacy network addresses). */
export const DIRECTORY_SUPPORT_EMAIL = "hello@directoriesnetwork.com";

const EXACT_PHRASE: Record<string, string> = {
  "tax preparation service": "tax preparation services",
  "tax preparation": "tax preparation services",
  "tax consultant": "tax consultants",
  accountant: "accountants",
  cpa: "CPAs",
  "certified public accountant": "certified public accountants",
  "bookkeeping service": "bookkeeping services",
  "payroll service": "payroll services",
  "income tax service": "income tax services",
  "tax service": "tax services",
  "financial consultant": "financial consultants",
  "enrolled agent": "enrolled agents",
};

const TAX_PREPARER_LIKE =
  /tax|irs|prepar|return|bookkeep|account|cpa|1040|w-2|w2|e-?file|efile|audit\s+represent|payroll|financial\s+plan|notary/i;

/** Map categories that are clearly not tax or accounting businesses. */
const NON_TAX =
  /tattoo|piercing|body\s*art|salon|barber|plumber|restaurant|gas\s+station|auto\s+repair|church|hotel|gym|dentist|veterinar|nail\s+salon|funeral|coffee|pizza|liquor/i;

function normalizeKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

function humanizeFallback(raw: string): string {
  const s = raw.trim().toLowerCase();
  if (!s) return "";
  if (s.endsWith(" service")) {
    return `${s.slice(0, -" service".length)} services`;
  }
  if (s.endsWith(" clinic")) {
    return s.replace(/ clinic$/, " clinics");
  }
  if (s.endsWith(" center")) {
    return s.replace(/ center$/, " centers");
  }
  if (s.endsWith("ist") && !/taxonomist$/.test(s)) {
    return `${s}s`;
  }
  if (!s.endsWith("s")) {
    return `${s}s`;
  }
  return s;
}

function phraseForLabel(raw: string): string | null {
  const key = normalizeKey(raw);
  if (!key) return null;
  if (NON_TAX.test(key)) return null;
  if (EXACT_PHRASE[key]) return EXACT_PHRASE[key];
  if (!TAX_PREPARER_LIKE.test(raw)) return null;
  return humanizeFallback(raw);
}

function oxfordJoin(items: string[]): string {
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/**
 * @param careTypes Raw labels from listings (dedupe before calling if needed).
 * @param maxItems Cap how many categories appear in the sentence (default 5).
 * @returns Clause starting with "including …" or a neutral fallback.
 */
export function formatCareTypesClause(
  careTypes: string[],
  maxItems = 5,
): string {
  const seen = new Set<string>();
  const phrases: string[] = [];
  for (const raw of careTypes) {
    const p = phraseForLabel(raw);
    if (!p || seen.has(p)) continue;
    seen.add(p);
    phrases.push(p);
    if (phrases.length >= maxItems) break;
  }
  if (phrases.length === 0) {
    return "including tax preparation services, tax consultants, CPAs, accountants, bookkeeping services, and payroll services";
  }
  return `including ${oxfordJoin(phrases)}`;
}

/** Schema.org `Thing` entries for primary tax and accounting categories on this directory. */
export function taxPreparerCategorySchemaThings(): {
  "@type": "Thing";
  name: string;
}[] {
  return [
    { "@type": "Thing", name: "Tax Preparation Service" },
    { "@type": "Thing", name: "Tax Consultant" },
    { "@type": "Thing", name: "Certified Public Accountant" },
    { "@type": "Thing", name: "Accountant" },
    { "@type": "Thing", name: "Bookkeeping Service" },
    { "@type": "Thing", name: "Payroll Service" },
  ];
}

/** Default sentence when no care-type stats exist (FAQ answers, etc.). */
export const DEFAULT_TAX_PREPARER_CARE_TYPES_SENTENCE =
  "Tax Preparation Service, Tax Consultant, Certified Public Accountant, Accountant, Bookkeeping Service, Payroll Service";
