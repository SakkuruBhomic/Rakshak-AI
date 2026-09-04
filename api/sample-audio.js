// Vercel Serverless Function: Stream Sample MP3 Audio
const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const audioPaths = [
    path.join(process.cwd(), "frontend", "translated_output.mp3"),
    path.join(process.cwd(), "translated_output.mp3"),
    path.resolve("./translated_output.mp3"),
  ];

  let resolvedPath = null;
  for (const p of audioPaths) {
    if (fs.existsSync(p)) {
      resolvedPath = p;
      break;
    }
  }

  if (!resolvedPath) {
    return res.redirect(302, "/frontend/translated_output.mp3");
  }

  try {
    const stat = fs.statSync(resolvedPath);
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(resolvedPath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "audio/mpeg",
      });
      return file.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": stat.size,
        "Content-Type": "audio/mpeg",
        "Accept-Ranges": "bytes",
      });
      return fs.createReadStream(resolvedPath).pipe(res);
    }
  } catch (err) {
    return res.redirect(302, "/frontend/translated_output.mp3");
  }
};
