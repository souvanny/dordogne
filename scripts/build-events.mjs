import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const docsDir = path.join(root, '_docs', 'evenements_json');
const outDir = path.join(root, 'frontend', 'public', 'data');
const outFile = path.join(outDir, 'evenements.json');

const MONTHS = {
  janvier: 1, fevrier: 2, 'février': 2, mars: 3, avril: 4, mai: 5, juin: 6,
  juillet: 7, aout: 8, 'août': 8, septembre: 9, octobre: 10, novembre: 11,
  decembre: 12, 'décembre': 12,
};
const MONTH_ALT = Object.keys(MONTHS).join('|');

function slugify(str) {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function toISO(y, m, d) {
  if (!y || !m || !d) return null;
  return `${y}-${pad(m)}-${pad(d)}`;
}

function parsePeriode(str) {
  if (!str) return { debut: null, fin: null };
  const s = String(str).toLowerCase().trim();

  // "03/10/2026" ou "16/10/2026 au 01/11/2026"
  const dmy = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s*au\s*(\d{1,2})\/(\d{1,2})\/(\d{4}))?/);
  if (dmy) {
    const debut = toISO(+dmy[3], +dmy[2], +dmy[1]);
    const fin = dmy[4] ? toISO(+dmy[6], +dmy[5], +dmy[4]) : null;
    return { debut, fin };
  }

  // "24-25 octobre 2026" ou "24-26 juillet 2026" ou "1er au 14 août"
  let m = s.match(new RegExp(`(\\d{1,2})(?:er)?\\s*(?:-|au)\\s*(\\d{1,2})(?:er)?\\s+(${MONTH_ALT})\\s*(20\\d{2})?`));
  if (m && m[4]) {
    const month = MONTHS[m[3]];
    return { debut: toISO(+m[4], month, +m[1]), fin: toISO(+m[4], month, +m[2]) };
  }

  // "18 octobre 2026"
  m = s.match(new RegExp(`(\\d{1,2})(?:er)?\\s+(${MONTH_ALT})\\s+(20\\d{2})`));
  if (m) {
    const month = MONTHS[m[2]];
    const d = +m[1];
    return { debut: toISO(+m[3], month, d), fin: toISO(+m[3], month, d) };
  }

  return { debut: null, fin: null };
}

function normalize(item, categorie) {
  const raw = categorie === 'agenda' ? item.date : item.periode;
  const { debut, fin } = parsePeriode(raw);
  return {
    id: slugify(item.nom || ''),
    nom: (item.nom || '').trim(),
    date: (raw || '').trim(),
    dateDebut: debut,
    dateFin: fin,
    lieu: (item.lieu || '').trim(),
    ville: (item.ville || '').trim(),
    description: (item.description || '').replace(/\s*\[citation:[^\]]*\]/g, '').trim(),
    categorie,
  };
}

function merge(existing, incoming) {
  if (!existing.dateDebut && incoming.dateDebut) existing.dateDebut = incoming.dateDebut;
  if (!existing.dateFin && incoming.dateFin) existing.dateFin = incoming.dateFin;
  if (!existing.description && incoming.description) existing.description = incoming.description;
  if (!existing.lieu && incoming.lieu) existing.lieu = incoming.lieu;
  if (!existing.ville && incoming.ville) existing.ville = incoming.ville;
  return existing;
}

function buildEvenements() {
  const files = readdirSync(docsDir).filter((f) => f.endsWith('.json'));
  const map = new Map();

  for (const file of files) {
    let data;
    try {
      data = JSON.parse(readFileSync(path.join(docsDir, file), 'utf8'));
    } catch {
      continue;
    }

    for (const [key, value] of Object.entries(data)) {
      if (/evenement/i.test(key) && Array.isArray(value)) {
        for (const item of value) {
          if (!item?.nom) continue;
          const ev = normalize(item, 'agenda');
          const k = ev.id || slugify(ev.nom);
          map.set(k, map.has(k) ? merge(map.get(k), ev) : ev);
        }
      }
    }

    const rdv = data.grands_rendez_vous_annuels;
    if (Array.isArray(rdv)) {
      for (const item of rdv) {
        if (!item?.nom) continue;
        const ev = normalize(item, 'rendez-vous');
        const k = ev.id || slugify(ev.nom);
        map.set(k, map.has(k) ? merge(map.get(k), ev) : ev);
      }
    }
  }

  const events = [...map.values()];
  events.sort((a, b) => {
    const da = a.dateDebut ?? '9999-99-99';
    const db = b.dateDebut ?? '9999-99-99';
    return da.localeCompare(db) || a.nom.localeCompare(b.nom, 'fr');
  });

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, `${JSON.stringify(events, null, 2)}\n`);
  console.log(`Généré ${events.length} événements -> frontend/public/data/evenements.json`);
}

buildEvenements();
