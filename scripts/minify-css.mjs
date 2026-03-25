import fs from 'node:fs';
import path from 'node:path';
import CleanCSS from 'clean-css';

const filePath = path.resolve(process.cwd(), 'css/styles.css');
const css = fs.readFileSync(filePath, 'utf8');

const minifier = new CleanCSS({
  level: 2
});

const result = minifier.minify(css);

if (result.errors.length > 0) {
  throw new Error(`CSS minification failed: ${result.errors.join('; ')}`);
}

fs.writeFileSync(filePath, result.styles);
console.log('Minified css/styles.css');
