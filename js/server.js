const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Serve static assets (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public.')));
// app.use('/css', express.static(path.join(__dirname, '..', 'css')));
// app.use('/js', express.static(path.join(__dirname, '..', 'js')));

const upload = multer({ dest: 'uploads/' });

// 🧬 Upload or Edit Entry
app.post('/upload-endpoint', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'bio', maxCount: 1 }
]), (req, res) => {
  try {
    const image = req.files.image?.[0];
    const bio = req.files.bio?.[0];
    const { name, description, editIndex } = req.body;

    const imageTarget = image ? path.join(process.cwd(), 'photoimages', image.originalname) : '';
    const bioTxtTarget = bio ? path.join(process.cwd(), 'biograph', bio.originalname) : '';
    const htmlFileName = bio ? bio.originalname.replace(/\.[^/.]+$/, '.html') : '';
    const htmlTarget = bio ? path.join(process.cwd(), 'biograph', htmlFileName) : '';

    const newEntry = {
      image: image ? `photoimages/${image.originalname}` : '',
      alt: `${name || 'Family Member'}'s Photo`,
      name: name || 'Unknown Name',
      description: description || '',
      bioLink: bio ? `biograph/${htmlFileName}` : ''
    };

    const completeEntryUpdate = () => {
      const galleryJSONPath = path.join(process.cwd(), 'flip-card-data.json');
      fs.readFile(galleryJSONPath, 'utf8', (err, data) => {
        let gallery = [];
        if (!err && data) {
          try { gallery = JSON.parse(data); } catch {}
        }

        const i = parseInt(editIndex, 10);
        if (typeof editIndex !== 'undefined' && editIndex !== '' && !isNaN(i) && gallery[i]) {
          const existing = gallery[i];
          newEntry.image = image ? newEntry.image : existing.image;
          newEntry.bioLink = bio ? newEntry.bioLink : existing.bioLink;
          gallery[i] = newEntry;
          console.log(`✏️ Edited entry at index ${i}`);
        } else {
          gallery.push(newEntry);
          console.log('➕ Added new entry');
        }

        fs.writeFile(galleryJSONPath, JSON.stringify(gallery, null, 2), 'utf8', (err) => {
          if (err) return res.status(500).json({ error: 'Failed to update JSON' });
          res.json({ success: true, message: '✅ Entry saved successfully!' });
        });

        if (image) fs.unlink(image.path, () => {});
        if (bio) fs.unlink(bio.path, () => {});
      });
    };

    const processBioFile = (callback) => {
      fs.copyFile(bio.path, bioTxtTarget, (err) => {
        if (err) throw new Error('Bio file copy failed');
        fs.readFile(bio.path, 'utf8', (err, bioContent) => {
          if (err) throw new Error('Bio file read failed');

          const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Bio for ${name || 'Unknown Name'}</title>
  <link rel="stylesheet" href="../css/photos.css" />
</head>
<body>
  <!-- Insert the common header -->
  <div id="header"></div>
  <script src="../js/loadHeader.js"></script>

  <main>
    <h1>Bio for ${name || 'Unknown Name'}</h1>
    <p>${bioContent.replace(/\n/g, '<br>')}</p>
  </main>

  <!-- Insert the common footer -->
  <div id="footer"></div>
  <script src="../js/loadFooter.js"></script>
</body>
</html>`.trim();

          fs.writeFile(htmlTarget, htmlContent, 'utf8', (err) => {
            if (err) throw new Error('Failed to write HTML bio');
            callback();
          });
        });
      });
    };

    if (image) {
      fs.copyFile(image.path, imageTarget, (err) => {
        if (err) throw new Error('Image file copy failed');
        if (bio) {
          processBioFile(completeEntryUpdate);
        } else {
          completeEntryUpdate();
        }
      });
    } else if (bio) {
      processBioFile(completeEntryUpdate);
    } else {
      completeEntryUpdate();
    }

  } catch (err) {
    console.error('❌ Server error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ Delete Entry
app.post('/delete-entry', (req, res) => {
  const { index, password } = req.body;
  const correctPassword = 'password';

  if (password !== correctPassword) {
    return res.status(403).json({ message: '🚫 Incorrect password. Deletion denied.' });
  }

  const galleryPath = path.join(process.cwd(), 'flip-card-data.json');
  fs.readFile(galleryPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: '❌ Failed to read flip-card-data.json' });

    let gallery = JSON.parse(data);
    const i = parseInt(index, 10);

    if (isNaN(i) || i < 0 || i >= gallery.length) {
      return res.status(400).json({ message: '❓ Invalid index provided.' });
    }

    const removed = gallery.splice(i, 1)[0];
    fs.writeFile(galleryPath, JSON.stringify(gallery, null, 2), 'utf8', (err) => {
      if (err) return res.status(500).json({ message: '❌ Failed to write updated data' });
      res.json({ message: `✅ Deleted entry "${removed.name}" at index ${i}.` });
    });
  });
});

// 📁 Create necessary folders
['uploads', 'photoimages', 'biograph'].forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath);
});

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});