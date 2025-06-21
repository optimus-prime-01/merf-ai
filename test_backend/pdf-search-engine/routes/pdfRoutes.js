const express = require("express");
const PdfDocument = require("../models/pdfDocument");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // This folder must exist
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname);
//     cb(null, uuidv4() + ext); // adding unique identifier to handle dupes
//   },
// });


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    if (!req.folderName) {
      req.folderName = uuidv4();
    }
    const uploadPath = path.join("uploads", req.folderName);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and image files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

// Health check for GET /api/pdfs
router.get("/health/search", (req, res) => {
  res.json({ status: "ok", route: "GET /api/pdfs?search=" });
});

// Health check for POST /api/pdfs/upload
router.get("/health/upload", (req, res) => {
  res.json({ status: "ok", route: "POST /api/pdfs/upload" });
});

// Health check for GET /api/pdfs/all
router.get("/health/all", (req, res) => {
  res.json({ status: "ok", route: "GET /api/pdfs/all" });
});

// Health check for GET /api/pdfs/:id
router.get("/health/:id", (req, res) => {
  res.json({ status: "ok", route: `GET /api/pdfs/${req.params.id}` });
});

// GET /api/pdfs?search=...
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } }
        ],
      };
    }
    let documents = await PdfDocument.find(query);
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/pdfs (add PDF metadata, not file)
// router.post("/", async (req, res) => {
//   try {
//     const { title, content, pdfUrl, category, thumbnail } = req.body;
//     const newDocument = new PdfDocument({
//       title,
//       content,
//       pdfUrl,
//       category,
//       thumbnail,
//       viewCount: 0
//     });
//     const savedDocument = await newDocument.save();
//     res.status(201).json(savedDocument);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// POST /api/pdfs/upload 
router.post("/upload", upload.fields([
  { name: "pdf", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const pdfFile = req.files["pdf"] ? req.files["pdf"][0] : null;
    const thumbnailFile = req.files["thumbnail"] ? req.files["thumbnail"][0] : null;

    if (!pdfFile) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const pdfUrl = `/${pdfFile.path.replace(/\\/g, "/")}`;
const thumbnail = thumbnailFile ? `/${thumbnailFile.path.replace(/\\/g, "/")}` : undefined;
    // Converting the pdfUrl in the form /uploads/<subfolder>/<uuid>.pdf


    const newDoc = new PdfDocument({
      title,
      content,
      pdfUrl,
      category,
      thumbnail,
      viewCount: 0
    });

    await newDoc.save();

    res.status(201).json({ message: "PDF uploaded & saved", document: newDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});





// PUT /api/pdfs/:id  (edit PDF metadata and optionally replace PDF file)
router.put("/:id", upload.fields([
  { name: "pdf", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const pdfFile = req.files["pdf"] ? req.files["pdf"][0] : null;
    const thumbnailFile = req.files["thumbnail"] ? req.files["thumbnail"][0] : null;

    // Find the document
    const doc = await PdfDocument.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "PDF not found" });
    }

    // Update fields
    if (title) doc.title = title;
    if (content) doc.content = content;
    if (category) doc.category = category;

    // Replace PDF file if new one is uploaded
    if (pdfFile) {
      doc.pdfUrl = `/${pdfFile.path.replace(/\\/g, "/")}`;
    }

    // Replace thumbnail if new one is uploaded
    if (thumbnailFile) {
      doc.thumbnail = `/${thumbnailFile.path.replace(/\\/g, "/")}`;
    }

    await doc.save();

    res.json({ message: "PDF updated successfully", document: doc });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
});





router.delete("/:id", async (req, res) => {
  try {
    const deleted = await PdfDocument.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "PDF not found" });
    }
    res.json({ message: "PDF deleted successfully", document: deleted });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

// (get all PDFs sorted by viewCount descending)
router.get("/all", async (req, res) => {
  try {
    const documents = await PdfDocument.find({}).sort({ viewCount: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// (get single PDF and increment view count)
router.get("/:id", async (req, res) => {
  try {
    const pdf = await PdfDocument.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    if (!pdf) {
      return res.status(404).json({ error: "PDF not found" });
    }
    res.json(pdf);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
