#!/usr/bin/env node
const connectDB = require('../config/database');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Post = require('../models/Post');

const argv = require('yargs/yargs')(process.argv.slice(2)).argv;
const doApply = !!argv.apply;
const autoYes = !!argv.yes || !!argv.y;

const uploadsDir = path.join(__dirname, '..', 'uploads');
const uploadsToken = '/uploads/';
const allowedExts = ['.mp4', '.mp4v', '.webm', '.ogg', '.mov', '.mkv', '.avi', '.flv', '.mp3', '.wav', '.jpg', '.jpeg', '.png', '.gif', '.webp'];

function resolveLocal(relPath) {
  const candidatePath = path.normalize(path.join(uploadsDir, relPath));
  if (fs.existsSync(candidatePath)) return relPath.replace(/\\/g, '/');

  const dir = path.dirname(candidatePath);
  const base = path.basename(candidatePath).toLowerCase();
  if (!fs.existsSync(dir)) return null;

  const candidates = fs.readdirSync(dir);
  const match = candidates.find(f => {
    const lower = f.toLowerCase();
    if (lower === base) return true;
    const ext = path.extname(lower);
    if (!ext) return false;
    return lower === `${base}${ext}` && allowedExts.includes(ext);
  });

  if (match) return path.join(path.relative(uploadsDir, dir), match).replace(/\\/g, '/');

  // fallback to placeholder if exists (check uploads root and talkcart/)
  // Prefer the specific fallback filename if available
  const fallback = 'file_1760472876401_eul3ctkpyr8.mp4';
  const placeholders = [path.join(fallback), path.join('talkcart', fallback), path.join('placeholder.mp4'), path.join('talkcart', 'placeholder.mp4')];
  for (const ph of placeholders) {
    const full = path.join(uploadsDir, ph);
    try {
      if (!fs.existsSync(full)) continue;
      const stat = fs.statSync(full);
      if (!stat.isFile() || stat.size <= 100) continue; // skip empty placeholders
      return ph.replace(/\\/g, '/');
    } catch (e) {
      continue;
    }
  }
  // If placeholder files exist but are empty, warn the user
  for (const ph of placeholders) {
    const full = path.join(uploadsDir, ph);
    try {
      if (fs.existsSync(full)) {
        const stat = fs.statSync(full);
        if (stat.size === 0) console.warn('Warning: placeholder exists but is empty:', full);
      }
    } catch (e) {}
  }

  return null;
}

async function main() {
  console.log('Connecting to DB...');
  await connectDB();

  try {
    // Find posts with media arrays
    const cursor = Post.find({ media: { $exists: true, $ne: [] } }).cursor();
    let total = 0;
    let issues = 0;
    const updates = [];

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      total++;
      let changed = false;
      const originalMedia = doc.media.map(m => ({ ...m }));

      for (let i = 0; i < doc.media.length; i++) {
        const item = doc.media[i];
        const originalUrl = item.secure_url || item.url || '';
        if (!originalUrl.includes(uploadsToken)) continue; // skip non-local

        const rel = originalUrl.split(uploadsToken).pop();
        const resolved = resolveLocal(rel);
        if (!resolved) continue; // nothing we can do

        // If resolved path differs from original, propose update
        const newUrl = (originalUrl.startsWith('http') ? originalUrl.split(uploadsToken)[0] + uploadsToken + resolved : uploadsToken + resolved);
        if (newUrl !== originalUrl) {
          issues++;
          console.log(`Post ${doc._id} media[${i}]:`);
          console.log(`  original: ${originalUrl}`);
          console.log(`  resolved : ${newUrl}`);
          // Save update in memory
          doc.media[i].secure_url = newUrl;
          doc.media[i].url = newUrl;
          changed = true;
        }
      }

      if (changed) {
        updates.push({ id: doc._id, doc });
      }
    }

    console.log(`Scanned ${total} posts. Found ${issues} media issues across ${updates.length} posts.`);

    if (doApply && updates.length > 0) {
      console.log('--apply specified. About to update documents in DB.');
      if (!autoYes) {
        const ans = await prompt('Type APPLY to confirm updating these posts: ');
        if (ans !== 'APPLY') {
          console.log('Aborted by user. No updates applied.');
          process.exit(0);
        }
      }

      for (const u of updates) {
        try {
          await Post.updateOne({ _id: u.id }, { $set: { media: u.doc.media } });
          console.log(`Updated post ${u.id}`);
        } catch (e) {
          console.error(`Failed to update post ${u.id}:`, e.message);
        }
      }
    } else if (doApply) {
      console.log('No updates to apply.');
    } else {
      console.log('Dry-run complete. No DB updates were made. To apply changes run with --apply --yes');
    }

  } catch (err) {
    console.error('Error during scan:', err);
  } finally {
    try { await mongoose.connection.close(); } catch (e) {}
    process.exit();
  }
}

function prompt(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', (data) => {
      resolve(String(data).trim());
    });
  });
}

main();
