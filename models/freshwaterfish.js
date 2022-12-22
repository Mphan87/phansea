"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

class Freshwaterfish {

  static async getAll() {
    const result = await db.query(
      "SELECT handle, name, taxonomy, image, description, maxsize, type FROM freshwaterfish");
    return result.rows;
  }

  static async findAll(searchFilters = {}) {
    let query = `SELECT handle, name, taxonomy, image, description, maxsize, type FROM freshwaterfish`;
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
      `SELECT handle, name, taxonomy, image, description, maxsize, type FROM freshwaterfish
           WHERE handle ILIKE $1`,
      [handle]);

    const fish = fishRes.rows[0];

    return fish;
  }

  static async gettype(type) {
    const fishRes = await db.query(
      `SELECT handle, name, taxonomy, image, description, maxsize, type FROM freshwaterfish
      WHERE type ILIKE $1`, [type]);

      return fishRes.rows;
    }

  static async create(handle, name, taxonomy, image, reefsafe, description, maxsize, type) {
    const result = await db.query(
      `INSERT INTO freshwaterfish (handle, name, taxonomy,image, description, maxsize, type)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING handle, name, image, taxonomy, description, maxsize, type`,
      [handle, name, taxonomy, image, description, maxsize, type]);

    return result.rows[0];
  }

  static async remove(handle) {
    const result = await db.query(
      `DELETE FROM freshwaterfish WHERE handle = $1 RETURNING handle`,
      [handle]);
    const fish = result.rows[0];

    if (!fish) throw new NotFoundError(`No fish: ${handle}`);
  }
}

module.exports = Freshwaterfish;
