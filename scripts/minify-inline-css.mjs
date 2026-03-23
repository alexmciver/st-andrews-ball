import fs from 'node:fs';
import path from 'node:path';
import CleanCSS from 'clean-css';

const filePath = path.resolve(process.cwd(), 'index.html');
const html = fs.readFileSync(filePath, 'utf8');

const minifier = new CleanCSS({
  level: 2
});

let styleBlocksFound = 0;
const updatedHtml = html.replace(/<style>([\s\S]*?)<\/style>/g, (match, cssContent) => {
  styleBlocksFound += 1;
  const result = minifier.minify(cssContent);

  if (result.errors.length > 0) {
    throw new Error(`CSS minification failed: ${result.errors.join('; ')}`);
  }

  return `<style>${result.styles}</style>`;
});

if (styleBlocksFound === 0) {
  throw new Error('No inline <style> blocks found in index.html');
}

if (updatedHtml !== html) {
  fs.writeFileSync(filePath, updatedHtml);
  console.log(`Minified ${styleBlocksFound} inline style block(s) in index.html`);
} else {
  console.log('No changes made');
}
