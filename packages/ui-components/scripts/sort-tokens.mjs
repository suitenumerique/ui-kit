import { readFileSync, writeFileSync } from 'fs';

const file = 'src/cunningham-tokens.ts';
const content = readFileSync(file, 'utf8');
const json = content.replace('export const tokens = ', '').replace(/;\s*$/, '');

function sortKeys(obj) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return obj;
  return Object.fromEntries(Object.keys(obj).sort().map((k) => [k, sortKeys(obj[k])]));
}

writeFileSync(file, `export const tokens = ${JSON.stringify(sortKeys(JSON.parse(json)))};`);
