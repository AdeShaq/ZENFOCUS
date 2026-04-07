import fs from 'fs';
import path from 'path';
import https from 'https';

const REQUIRED = [
  "Rear Delt DB Flyes",
  "Rear Delt Flyes",
  "Seated Bicep Curls",
  "Preacher Curl",
  "Chest Dips",
  "Leg Press",
  "Bulgarian Split Squats",
  "Standing Calf Raises",
  "Seated Calf Raise",
  "Hanging Leg Raises",
  "Plank",
  "T-Bar Row",
  "DB T-Bar Rows",
  "Overhead DB Extensions",
  "DB Kickbacks",
  "Skull Crushers",
  "Dips",
  "Overhead Cable Extension",
  "Diamond Push Ups",
  "Bench Dips",
  "Incline DB Curls",
  "Spider Curls",
  "Cable Curl",
  "Wrist Curls",
  "Farmers Walk",
  "Dead Hangs",
  "Incline DB Flyes",
  "Decline Push Ups",
  "Close Grip Chest Press"
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(resolve); });
    }).on('error', (err) => { fs.unlink(dest, () => reject(err)); });
  });
}

function stringSimilarity(s1, s2) {
  const norm1 = s1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const norm2 = s2.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 0.8;
  return 0; // naive
}

async function run() {
  console.log("Fetching exercises database...");
  const dbUrl = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
  
  const data = await new Promise((resolve, reject) => {
    let raw = "";
    https.get(dbUrl, res => {
      res.on('data', d => raw += d);
      res.on('end', () => resolve(JSON.parse(raw)));
    }).on('error', reject);
  });

  const gifsDir = path.join(process.cwd(), 'public', 'gifs');
  if (!fs.existsSync(gifsDir)) fs.mkdirSync(gifsDir, { recursive: true });

  const mapping = {};

  for (const target of REQUIRED) {
    const targetNorm = target.toLowerCase().replace(/db/g, 'dumbbell').replace(/-/g, ' ');

    let bestMatch = null;
    for (const ex of data) {
      const exName = ex.name.toLowerCase();
      
      // Heuristic matching
      if (exName === targetNorm) { bestMatch = ex; break; }
      const keywords = targetNorm.split(' ');
      if (keywords.every(k => exName.includes(k))) {
        bestMatch = ex;
      }
    }

    if (bestMatch) {
      console.log(`Matched [${target}] -> Database: [${bestMatch.name}]`);
      const gifUrl = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${bestMatch.id}/images/0.gif`;
      const filename = target.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.gif';
      const destPath = path.join(gifsDir, filename);

      try {
        await download(gifUrl, destPath);
        console.log(`   Downloaded ${filename}`);
        mapping[target] = `/gifs/${filename}`;
      } catch (err) {
        console.log(`   Failed downloading ${filename}: ${err.message}`);
      }
    } else {
      console.log(`NO MATCH FOUND FOR: ${target}`);
      // Fallback aliases if we can map them to an existing file
    }
  }

  fs.writeFileSync('gif-mapping-updates.json', JSON.stringify(mapping, null, 2));
  console.log("Done mapped gifs.");
}

run().catch(console.error);
