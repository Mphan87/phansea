"use strict";



const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const { ensureLoggedIn } = require("../middleware/auth");
const Fish = require("../models/freshwaterfish");
const createfwfish = require("../schemas/createfwfish.json");

const router = express.Router({ mergeParams: true });


router.get("/", async function (req, res, next) {
  const q = req.query;
  const fishes = await Fish.findAll(q);
  return res.json({ fishes });

});

router.post("/" , async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, createfwfish);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

  let fwfish = await Fish.create(
    req.body.handle,
    req.body.name,
    req.body.taxonomy, 
    req.body.image,
    req.body.description,
    req.body.maxsize,
    req.body.type);
    return res.status(201).json(fwfish);

  } catch (err) {
    return next(err);
  }
});


router.get("/:handle", async function (req, res, next) {
  try {
    const fish = await Fish.get(req.params.handle);
    return res.json({ fish });
  } catch (err) {
    return next(err);
  }
});

router.get("/type/:type", async function (req, res, next) {
  try {
    const fish = await Fish.gettype(req.params.type);
    return res.json({ fish });
  } catch (err) {
    return next(err);
  }
});


router.delete("/:handle", async function (req, res, next) {
  try {
    await Fish.remove(req.params.handle);
    return res.json({ deleted: req.params.handle });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
