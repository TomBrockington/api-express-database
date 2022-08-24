const express = require("express");
const router = express.Router();
const db = require("../../db");

// Get all pets
const validTypes = ['dog', 'cat', 'horse']

router.get("/", async (req, res) => {
  console.log("get all pets");
  const params = [];

  let sqlQuery = "SELECT * FROM pets";

  if (req.query.type) {
    if (!validTypes.includes(req.query.type)) {
        return res.status(400).json({
            error: `Invalid type specified: ${req.query.type}`
        })
    }
    sqlQuery += " WHERE type = $1 ";
    params.push(req.query.type);
    console.log("rqt", req.query.type);
  }

  const qResult = await db.query(sqlQuery, params);

  res.status(201).json({
    pets: qResult.rows,
  });
});

router.get("/:id", async (req, res) => {
  console.log("looking for id");
  const params = [];

  let sqlQuery = `SELECT * FROM pets`;

  sqlQuery += ` id = $1`;
  params.push(req.params.id);
  console.log("params.id", req.params.id);

  const qResult = await db.query(sqlQuery, params);

  res.status(200).json({
    pet: qResult.rows[0],
  });
});

module.exports = router;
