"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");


class Saltwaterfish {

  static async getAll() {
    const result = await db.query(
      "SELECT handle, name, taxonomy, image, reefsafe, description, maxsize, type FROM saltwaterfish");
    return result.rows;
  }

  static async findAll(searchFilters = {}) {
    let query = `SELECT handle, name, taxonomy, image, reefsafe, description, maxsize, type FROM saltwaterfish`;
    let whereExpressions = [];
    let queryValues = [];

    const { type } = searchFilters;

    if (type) {
      queryValues.push(`%${type}%`);
      whereExpressions.push(`type ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    query += " ORDER BY name";
    const fishRes = await db.query(query, queryValues);
    return fishRes.rows;
  }

  static async get(handle) {
    const fishRes = await db.query(
      `SELECT handle, name, taxonomy, image, reefsafe, description, maxsize, type FROM saltwaterfish
           WHERE handle ILIKE $1`,
      [handle]);
    const fish = fishRes.rows[0];
    return fish;
  }

  static async gettype(type) {
    const fishRes = await db.query(
      `SELECT handle, name, taxonomy, image, reefsafe, description, maxsize, type FROM saltwaterfish
      WHERE type ILIKE $1`, [type]);
    return fishRes.rows;
  }

  static async create(handle, name, taxonomy, image, reefsafe, description, maxsize, type) {
    const duplicateHandle = await db.query(
      `SELECT handle
       FROM saltwaterfish
       WHERE handle = $1`,
      [handle],
    );

    const duplicateTaxonomy = await db.query(
      `SELECT taxonomy
   FROM saltwaterfish
   WHERE taxonomy = $1`,
      [taxonomy],
    );

    const duplicateImage = await db.query(
      `SELECT image
   FROM saltwaterfish
   WHERE image = $1`,
      [image],
    );
  
    if (duplicateHandle.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${handle}`);

    } else if (duplicateTaxonomy.rows[0]) {
      throw new BadRequestError(`Duplicate image: ${taxonomy}`);

    } else if (duplicateImage.rows[0])
      throw new BadRequestError(`Duplicate image: ${image}`);

    const result = await db.query(
      `INSERT INTO saltwaterfish (handle, name, taxonomy, image, reefsafe, description, maxsize, type)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING handle, name, taxonomy, image, reefsafe, description, maxsize, type`,
      [handle, name, taxonomy, image, reefsafe, description, maxsize, type]);
    
    return result.rows[0];
  }

  static async remove(handle) {
    const result = await db.query(
      `DELETE FROM saltwaterfish WHERE handle = $1 RETURNING handle`,
      [handle]);
    const fish = result.rows[0];

    if (!fish) throw new NotFoundError(`No fish: ${handle}`);
  }
}

module.exports = Saltwaterfish;
