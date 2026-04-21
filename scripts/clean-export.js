const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(process.cwd(), "out");

if (!fs.existsSync(OUT_DIR)) {
  process.exit(0);
}

/**
 * Recursively delete .txt files (case-insensitive extension), except any file
 * whose basename is exactly "robots.txt" (case-insensitive).
 */
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(full);
    } else if (ent.isFile()) {
      const lower = ent.name.toLowerCase();
      if (!lower.endsWith(".txt")) continue;
      if (lower === "robots.txt") continue;
      fs.unlinkSync(full);
    }
  }
}

walk(OUT_DIR);
