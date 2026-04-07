import https from 'https';
import fs from 'fs';
import path from 'path';

const GIFS_DIR = path.resolve('public/gifs');
const BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

const EXERCISES = [
  // Corrected folder names for the failed ones
  ['rear-delt-fly.gif', 'Seated_Bent-Over_Rear_Delt_Raise'],
  ['barbell-preacher-curl.gif', 'Preacher_Curl'],
  ['chest-dip.gif', 'Dips_-_Chest_Version'],
  ['dumbbell-split-squat.gif', 'Dumbbell_Lunges'],
  ['front-plank.gif', 'Plank'],
  ['t-bar-row.gif', 'Seated_Cable_Rows'],
  ['dumbbell-tricep-extension.gif', 'Standing_Dumbbell_Triceps_Extension'],
  ['tricep-kickback.gif', 'Tricep_Dumbbell_Kickback'],
  ['cable-curl.gif', 'Standing_Cable_Curl'],
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function main() {
  for (const [filename, folder] of EXERCISES) {
    const dest = path.join(GIFS_DIR, filename);
    let success = false;
    for (const idx of ['0.jpg', '1.jpg']) {
      const url = `${BASE}/${folder}/${idx}`;
      try {
        await download(url, dest);
        const size = fs.statSync(dest).size;
        if (size > 3000) {
          console.log(`OK (${(size/1024).toFixed(0)}KB): ${filename} <- ${folder}/${idx}`);
          success = true;
          break;
        }
      } catch (e) { /* try next */ }
    }
    if (!success) console.log(`FAILED: ${filename} (${folder})`);
    await new Promise(r => setTimeout(r, 300));
  }
  console.log('Done retry!');
}

main();
