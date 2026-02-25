import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ROOT_PACKAGE_PATH = resolve(__dirname, "package.json");
const DIST_DIR = resolve(__dirname, "dist");
const DIST_PACKAGE_PATH = resolve(DIST_DIR, "package.json");

function createMinimalPackageJson(pkg) {
  const minimal = {
    name: "Vortex",
    version: "1.0.0",
    main: "main.js",
    type: pkg.type,
  };

  if (pkg.dependencies && Object.keys(pkg.dependencies).length > 0) {
    minimal.dependencies = pkg.dependencies;
  }

  return minimal;
}

async function main() {
  const raw = await readFile(ROOT_PACKAGE_PATH, "utf8");
  const rootPkg = JSON.parse(raw);

  const minimalPkg = createMinimalPackageJson(rootPkg);

  await mkdir(DIST_DIR, { recursive: true });

  await writeFile(
    DIST_PACKAGE_PATH,
    JSON.stringify(minimalPkg, null, 2) + "\n",
    "utf8",
  );

  console.log("✔  Created dist/package.json");
}

main().catch((err) => {
  console.error("✖  Failed to generate dist/package.json");
  console.error(err);
  process.exit(1);
});
