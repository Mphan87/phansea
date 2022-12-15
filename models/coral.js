"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
// const { sqlForPartialUpdate } = require("../helpers/sql");

class Coral {

  static async getAll() {
    const result = await db.query(
      "SELECT handle, name, image, description, type FROM coral");
    return result.rows;
  }

  static async findAll(searchFilters = {}) {
    let query = `SELECT handle, name, image, description, type FROM coral`;
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
      `SELECT handle, name, image, description, type FROM coral
           WHERE handle ILIKE $1`,
      [handle]);

    const fish = fishRes.rows[0];

    return fish;
  }

  static async gettype(type) {
    const coralRes = await db.query(
      `SELECT handle, name, image, description, type FROM coral
      WHERE type ILIKE $1`, [type]);

      return coralRes.rows;
    }

  static async create(handle, name, image, description, type) {
    const result = await db.query(
      `INSERT INTO coral (handle, name, image, description, type)
        VALUES ($1, $2, $3, $4, $5) RETURNING handle, name, image, description, type`,
      [handle, name, image, description, type]);

    return result.rows[0];
  }

  static async remove(handle) {
    const result = await db.query(
      `DELETE FROM coral WHERE handle = $1 RETURNING handle`,
      [handle]);
    const fish = result.rows[0];

    if (!fish) throw new NotFoundError(`No fish: ${handle}`);
  }
}
module.exports = Coral;
