import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('data/weekly-materials.json', 'utf8'));
const entries = Object.values(manifest).flat();
if (Object.keys(manifest).length !== 41) throw new Error(`Expected 41 courses, got ${Object.keys(manifest).length}`);
if (entries.length !== 384) throw new Error(`Expected 384 lessons, got ${entries.length}`);
for (const entry of entries) {
  if (!entry.pdfPath || !entry.reading?.url || !entry.video?.url) throw new Error(`Incomplete lesson ${entry.title}`);
}
console.log('manifest courses=41 lessons=384 resources=complete');
