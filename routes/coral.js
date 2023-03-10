"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
// const { BadRequestError } = require("../expressError");
// const { ensureAdmin } = require("../middleware/auth");
const Coral = require("../models/coral");
const createcoral = require("../schemas/createcoral.json");
const router = express.Router({ mergeParams: true });


router.get("/", async function (req, res, next) {
  const q = req.query;
  const corals = await Coral.findAll(q);
  return res.json({ corals });

});

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, createcoral);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    let corals = await Coral.create(
      req.body.handle,
      req.body.name,
      req.body.image,
      req.body.description,
      req.body.type);
    return res.status(201).json(corals);

  } catch (err) {
    return next(err);
  }
});

router.get("/:handle", async function (req, res, next) {
  try {
    const coral = await Coral.get(req.params.handle);
    return res.json({ coral });
  } catch (err) {
    return next(err);
  }
});

router.get("/type/:type", async function (req, res, next) {
  try {
    const coral = await Coral.gettype(req.params.type);
    return res.json({ coral });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:handle", async function (req, res, next) {
  try {
    await Coral.remove(req.params.handle);
    return res.json({ deleted: req.params.handle });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
