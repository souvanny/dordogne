import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, '_docs', 'illustrations');
const outDir = path.join(root, 'frontend', 'public', 'illustrations');

const CATEGORY_MAP = {
  'chateau.svg': 'chateau.svg',
  'fresque-mammouth-chasseurs.svg': 'grotte.svg',
  'sites-troglodytiques.svg': 'troglodyte.svg',
  'natures-loisirs.svg': 'nature.svg',
};

const TREE_GREEN = '#4c8f63';

function parseBBox(d) {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[+-]?\d+)?/g) || [];
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let i = 0;

  const num = () => parseFloat(tokens[i++]);
  const track = (x, y) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  };
  const isCmd = () => (i < tokens.length ? /[a-zA-Z]/.test(tokens[i]) : true);

  while (i < tokens.length) {
    const c = tokens[i++];
    switch (c) {
      case 'M': {
        sx = num(); sy = num(); cx = sx; cy = sy; track(cx, cy);
        while (!isCmd()) { cx = num(); cy = num(); track(cx, cy); }
        break;
      }
      case 'm': {
        cx += num(); cy += num(); sx = cx; sy = cy; track(cx, cy);
        while (!isCmd()) { cx += num(); cy += num(); track(cx, cy); }
        break;
      }
      case 'C': {
        do {
          num(); num(); num(); num();
          cx = num(); cy = num(); track(cx, cy);
        } while (!isCmd());
        break;
      }
      case 'c': {
        do {
          num(); num(); num(); num();
          cx += num(); cy += num(); track(cx, cy);
        } while (!isCmd());
        break;
      }
      case 'L': {
        do { cx = num(); cy = num(); track(cx, cy); } while (!isCmd());
        break;
      }
      case 'l': {
        do { cx += num(); cy += num(); track(cx, cy); } while (!isCmd());
        break;
      }
      case 'H': {
        do { cx = num(); track(cx, cy); } while (!isCmd());
        break;
      }
      case 'h': {
        do { cx += num(); track(cx, cy); } while (!isCmd());
        break;
      }
      case 'V': {
        do { cy = num(); track(cx, cy); } while (!isCmd());
        break;
      }
      case 'v': {
        do { cy += num(); track(cx, cy); } while (!isCmd());
        break;
      }
      case 'Z':
      case 'z': {
        cx = sx; cy = sy;
        break;
      }
      default:
        break;
    }
  }

  return { minX, minY, maxX, maxY };
}

function processArbre(svg) {
  let out = svg.replace(/fill:#000000/g, `fill:${TREE_GREEN}`);
  const m = out.match(/\bd="([^"]+)"/s);
  if (m) {
    const bbox = parseBBox(m[1]);
    const pad = 2;
    const x = bbox.minX - pad;
    const y = bbox.minY - pad;
    const w = bbox.maxX - bbox.minX + 2 * pad;
    const h = bbox.maxY - bbox.minY + 2 * pad;
    out = out
      .replace(/width="[^"]*"/, '')
      .replace(/height="[^"]*"/, '')
      .replace(/viewBox="[^"]*"/, `viewBox="${x} ${y} ${w} ${h}"`);
  }
  return out;
}

function build() {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  for (const src of readdirSync(srcDir)) {
    if (!src.endsWith('.svg')) continue;
    const svg = readFileSync(path.join(srcDir, src), 'utf8');
    if (src === 'arbre.svg') {
      writeFileSync(path.join(outDir, 'arbre.svg'), processArbre(svg));
    } else if (CATEGORY_MAP[src]) {
      writeFileSync(path.join(outDir, CATEGORY_MAP[src]), svg);
    }
  }
  console.log('Illustrations copiées -> frontend/public/illustrations/');
}

build();
