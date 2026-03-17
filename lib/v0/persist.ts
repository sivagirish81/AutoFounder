import fs from "fs";
import path from "path";

const GENERATED_ROOT = path.join(process.cwd(), "generated-app");
const PAGE_PATH = path.join(GENERATED_ROOT, "app", "page.tsx");

function extractCodeBlock(content: string): string | null {
  const match = content.match(/```(?:tsx|ts|jsx|js)?\s*([\s\S]*?)```/i);
  if (!match?.[1]) return null;
  return match[1].trim();
}

export function persistGeneratedSite(rawContent: string) {
  if (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") {
    return;
  }
  const extracted = extractCodeBlock(rawContent) ?? rawContent.trim();
  const finalContent = extracted.length
    ? extracted
    : `export default function GeneratedPage() {\n  return (\n    <main style={{ padding: "48px" }}>\n      <h1>AutoFounder Generated Site</h1>\n      <p>No content returned from v0.</p>\n    </main>\n  );\n}\n`;

  try {
    fs.writeFileSync(PAGE_PATH, finalContent);
  } catch {
    // Ignore write errors (e.g., read-only deployments).
  }
}
