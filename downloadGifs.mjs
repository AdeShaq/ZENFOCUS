import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const exercises = [
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crossover.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/06/Chest-Dip.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Rear-Delt-Fly.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Arnold-Press.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Dumbbell-Curl.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Concentration-Curl.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Preacher-Curl.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/BARBELL-SQUAT.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Press.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Split-Squat.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/LEG-EXTENSION.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Romanian-Deadlift.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Curl.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Standing-Calf-Raise.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Calf-Raise.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hanging-Leg-Raise.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bicycle-Crunch.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Front-Plank.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crunch.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/06/Ab-Wheel-Rollout.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Row.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Cable-Row.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/T-Bar-Row.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Tricep-Extension.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Tricep-Kickback.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Skull-Crusher.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Bench-Press.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pushdown.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Diamond-Push-Up.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Bench-Dip.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Curl.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Spider-Curl.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Curl.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Wrist-Curl.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Wrist-Curl.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/06/Farmers-Walk.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dead-Hang.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Fly.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Decline-Push-Up.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pec-Deck-Fly.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Chin-Up.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Shrug.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shrug.gif',
  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Upright-Row.gif'
];

const unique = [...new Set(exercises)];
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dest = path.join(__dirname, 'public', 'gifs');

if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

async function download(url) {
  const filename = url.split('/').pop().toLowerCase();
  const filePath = path.join(dest, filename);
  
  if (fs.existsSync(filePath)) {
    console.log(`Exists: ${filename}`);
    return;
  }
  
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        if (res.statusCode === 301 || res.statusCode === 302) {
          return download(res.headers.location).then(resolve).catch(reject);
        }
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        return;
      }
      
      const file = fs.createWriteStream(filePath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', reject);
  });
}

(async () => {
  for (const url of unique) {
    try {
      await download(url);
    } catch (e) {
      console.error(e.message);
    }
  }
  console.log('Done downloading gifs!');
})();
