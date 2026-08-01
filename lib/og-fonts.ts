// lib/og-fonts.ts
// Fonts are bundled locally in assets/fonts and read from disk — avoids a
// runtime fetch to Google Fonts, which times out during Vercel's build-time
// prerendering of these routes.
import { readFile } from 'node:fs/promises';
import path from 'node:path';

let bold: Buffer | undefined;
let mono: Buffer | undefined;

export async function getBricolageBold() {
  if (!bold) {
    bold = await readFile(path.join(process.cwd(), 'assets/fonts/BricolageGrotesque-Bold.ttf'));
  }
  return bold;
}

export async function getDMMonoMedium() {
  if (!mono) {
    mono = await readFile(path.join(process.cwd(), 'assets/fonts/DMMono-Medium.ttf'));
  }
  return mono;
}
