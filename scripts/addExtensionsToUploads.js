const fs = require('fs');
const path = require('path');

// Scans backend/uploads/talkcart and renames files that lack an extension by guessing their mime type
(async () => {
  try {
    const uploadsDir = path.join(__dirname, '..', 'backend', 'uploads', 'talkcart');
    if (!fs.existsSync(uploadsDir)) {
      console.error('Uploads directory does not exist:', uploadsDir);
      process.exit(1);
    }

    const files = fs.readdirSync(uploadsDir);
    for (const file of files) {
      const fullPath = path.join(uploadsDir, file);
      const stat = fs.statSync(fullPath);
      if (!stat.isFile()) continue;

      const ext = path.extname(file);
      if (ext) {
        console.log('Skipping (already has extension):', file);
        continue;
      }

      // Try to guess from file signature by reading first bytes
      const fd = fs.openSync(fullPath, 'r');
      const header = Buffer.alloc(4100);
      const bytesRead = fs.readSync(fd, header, 0, header.length, 0);
      fs.closeSync(fd);

      // Basic checks for common file types
      let guessedExt = '';
      const h = header.slice(0, bytesRead);
      if (h.slice(0, 4).toString('hex').startsWith('ffd8')) guessedExt = '.jpg';
      else if (h.slice(0, 8).toString('utf8').includes('PNG')) guessedExt = '.png';
      else if (h.slice(0, 4).toString('utf8').includes('RIFF') && h.slice(8, 12).toString('utf8').includes('WAVE')) guessedExt = '.wav';
      else if (h.slice(0, 4).toString('utf8').includes('RIFF') && h.slice(8, 12).toString('utf8').includes('AVI ')) guessedExt = '.avi';
      else if (h.slice(0, 12).toString('utf8').includes('ftyp')) guessedExt = '.mp4';
      else if (h.slice(0, 4).toString('hex').includes('1a45dfa3')) guessedExt = '.mkv';
      else if (h.slice(0, 4).toString('utf8').includes('OggS')) guessedExt = '.ogg';
      else if (h.slice(0, 4).toString('utf8').includes('fLaC')) guessedExt = '.flac';

      if (!guessedExt) {
        console.warn('Could not reliably detect type for', file, '- skipping');
        continue;
      }

      const newName = `${file}${guessedExt}`;
      const newPath = path.join(uploadsDir, newName);
      fs.renameSync(fullPath, newPath);
      console.log(`Renamed ${file} -> ${newName}`);
    }
    console.log('Done');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
