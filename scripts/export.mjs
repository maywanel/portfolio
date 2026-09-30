import { cp, copyFile, writeFile } from 'node:fs/promises';

// Keep the original entry point available to simple static preview servers.
// Deploy out/ as a whole; it is the canonical, self-contained export.
await copyFile('out/index.html', 'index.html');
await cp('out/_next', '_next', { recursive: true });
for (const file of ['icon.svg', 'social-card.png', 'robots.txt', 'sitemap.xml', '404.html']) {
  await copyFile(`out/${file}`, file);
}
await writeFile('out/.nojekyll', '');
console.log('Static site exported to out/. Root index.html refreshed.');
