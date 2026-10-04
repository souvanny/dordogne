import { readdir, readFile, mkdir, copyFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const docsDir = path.join(root, '_docs', 'documents_01');
const outDir = path.join(root, 'frontend', 'public', 'data');
const imagesOutDir = path.join(outDir, 'images');

function slugify(filename) {
  return filename
    .normalize('NFKD')
    .replace(/\u00A9/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

async function main() {
  const entries = await readdir(docsDir, { withFileTypes: true });
  const folders = entries.filter((d) => d.isDirectory());

  await rm(imagesOutDir, { recursive: true, force: true });
  await mkdir(imagesOutDir, { recursive: true });

  const sites = [];

  for (const folder of folders) {
    const siteJsonPath = path.join(docsDir, folder.name, 'site.json');
    if (!existsSync(siteJsonPath)) continue;

    const site = JSON.parse(await readFile(siteJsonPath, 'utf8'));
    const siteImagesDir = path.join(imagesOutDir, site.id);
    const resolvedImages = [];

    for (const rel of site.images ?? []) {
      const src = path.join(docsDir, folder.name, rel);
      if (!existsSync(src)) continue;

      await mkdir(siteImagesDir, { recursive: true });
      const basename = slugify(path.basename(rel));
      await copyFile(src, path.join(siteImagesDir, basename));
      resolvedImages.push(`/data/images/${site.id}/${basename}`);
    }

    site.images = resolvedImages;
    sites.push(site);
  }

  sites.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  await writeFile(path.join(outDir, 'sites.json'), `${JSON.stringify(sites, null, 2)}\n`);
  console.log(`Généré ${sites.length} sites -> frontend/public/data/sites.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
