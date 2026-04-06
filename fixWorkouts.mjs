import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'data', 'workouts.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/https:\/\/fitnessprogramer\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/([^'"]+)\.gif/g, (match, filename) => {
  return '/gifs/' + filename.toLowerCase() + '.gif';
});

fs.writeFileSync(file, content);
console.log('Fixed workouts.ts to use local gifs');
