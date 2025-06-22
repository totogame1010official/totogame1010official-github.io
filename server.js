const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + ".png")
});
const upload = multer({ storage });

app.use(express.static(__dirname));
app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.single("image"), (req, res) => {
  const sharp = require("sharp");
  const filePath = req.file.path;
  const outputPath = filePath.replace(".png", "-bgremoved.png");

  sharp(filePath)
    .removeAlpha()
    .png()
    .toFile(outputPath)
    .then(() => {
      fs.unlinkSync(filePath);
      res.send("OK");
    });
});

app.get("/images", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    res.json(files);
  });
});

app.delete("/delete/:name", (req, res) => {
  fs.unlink(path.join("uploads", req.params.name), () => res.send("Deleted"));
});

app.delete("/delete-all", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    files.forEach(f => fs.unlinkSync(path.join("uploads", f)));
    res.send("All deleted");
  });
});

app.get("/latest", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (!files.length) return res.json({ url: "" });
    const latest = files.sort((a, b) =>
      fs.statSync(`uploads/${b}`).mtime - fs.statSync(`uploads/${a}`).mtime
    )[0];
    res.json({ url: `/uploads/${latest}` });
  });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
