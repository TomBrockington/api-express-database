const express = require("express");
const { as } = require("pg-promise");
const router = express.Router();
const db = require("../../db");
const petTypes = require("../vars/vars");

// Get all pets
const validTypes = ["dog", "cat", "horse"];

router.get("/", async (req, res) => {
  console.log("get all pets");
  const params = [];

  let sqlQuery = "SELECT * FROM pets";

  if (req.query.type) {
    if (!validTypes.includes(req.query.type)) {
      return res.status(400).json({
        error: `Invalid type specified: ${req.query.type}`,
      });
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

// Get pet by ID
router.get("/:id", async (req, res) => {
  console.log("looking for id");
  const params = [];

  let sqlQuery = `SELECT * FROM pets`;

  sqlQuery += ` WHERE id = $1`;
  params.push(req.params.id);
  console.log("params.id", req.params.id);

  const qResult = await db.query(sqlQuery, params);

  res.status(200).json({
    pet: qResult.rows[0],
  });
});

// Add a new pet
router.post("/", async (req, res) => {
  console.log("adding a pet");

  const params = [];

  const sqlQuery = `
    INSERT INTO pets 
    (name, age, type, breed, microchip)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `;

    const newPet = req.body

    params.push(
        newPet.name,
        newPet.age,
        newPet.type,
        newPet.breed,
        newPet.microchip
    )

    const qResult = await db.query(sqlQuery, params);

    res.status(201).json({
        pet: qResult.rows[0],
      });
});

// Update a pet by ID
router.put("/:id", async (req, res) => {
    console.log('updaing pet');

    const params = []

    let sqlQuery = `
        UPDATE pets
        SET name = $1, age = $2, type = $3, breed = $4, microchip = $5
        WHERE id = $6
        RETURNING *
    `

    const updateToMake = req.body

    params.push(
        updateToMake.name,
        updateToMake.age,
        updateToMake.type,
        updateToMake.breed,
        updateToMake.microchip,
        req.params.id
    )

    const qResult = await db.query(sqlQuery, params)

    if (qResult.rows.length) {
        res.status(201).json({
            pet: qResult.rows[0]
        })
    } else {
        res.sendStatus(404)
    }
})

// Delete pet by ID
router.delete("/:id", async (req, res) => {
    console.log('Deleting pet');
    const params = []

    let sqlQuery = `
        DELETE FROM pets
        WHERE
    `

    sqlQuery += ` id = $1 RETURNING *`
    params.push(req.params.id)

    const qResult = await db.query(sqlQuery, params)
    
    if (qResult.rows.length) {
        res.status(201).json({
            pet: qResult.rows[0]
        });
    } else {
        res.sendStatus(404);
    }
})



module.exports = router;
