const express = require("express");
const Abbreviation = require("../models/achro");
const router = express.Router();

// Health check for POST
router.get("/health/post", (req, res) => {
  res.json({ status: "ok", route: "POST /api/abbreviations" });
});

// Health check for GET all
router.get("/health/all", (req, res) => {
  res.json({ status: "ok", route: "GET /api/abbreviations/all" });
});

// Health check for GET by abbreviation
router.get("/health/:abbr", (req, res) => {
  res.json({ status: "ok", route: `GET /api/abbreviations/${req.params.abbr}` });
});

// POST /api/abbreviations 
router.post("/", async (req, res) => {
  try {
    const { abbreviation, fullForm } = req.body;
    const newAbbreviation = new Abbreviation({ abbreviation, fullForm });
    const savedAbbreviation = await newAbbreviation.save();
    res.status(201).json(savedAbbreviation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//GET /api/abbreviations/all
router.get("/all", async (req, res) => {
  try {
    const abbreviations = await Abbreviation.find({});
    res.json(abbreviations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/abbreviations/:abbr 
router.get("/:abbr", async (req, res) => {
  try {
    const abbr = req.params.abbr;
    const result = await Abbreviation.findOne({ abbreviation: new RegExp(`^${abbr}$`, "i") });
    if (!result) {
      return res.status(404).json({ error: "Abbreviation not found" });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;