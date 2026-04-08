export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

const HEADING_RE = /<h([2-3])\s+id="([^"]*)"[^>]*>([\s\S]*?)<\/h\1>/gi;
const TAG_RE = /<[^>]+>/g;

/**
 * Extract h2 and h3 headings from rendered HTML for table of contents.
 */
export function extractHeadings(html: string): Heading[] {
  const headings: Heading[] = [];

  let match: RegExpExecArray | null;
  while ((match = HEADING_RE.exec(html)) !== null) {
    const depth = parseInt(match[1], 10);
    const slug = match[2];
    const text = match[3].replace(TAG_RE, "").trim();
    headings.push({ depth, slug, text });
  }

  return headings;
}
