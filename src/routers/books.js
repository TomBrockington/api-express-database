const express = require("express");
const router = express.Router();
const db = require("../../db");

// Get all books and books by type
router.get("/", async (req, res) => {
  console.log("loading all books");
  const params = [];

  let sqlQuery = "SELECT * FROM books";

  if (req.query.type) {
    sqlQuery += ` WHERE type = $1`;
    params.push(req.query.type);
    console.log("params", params);
  }

  if (req.query.topic) {
    sqlQuery += ` WHERE topic = $1`;
    params.push(req.query.topic);
    console.log("params", params);
  }

  const qResult = await db.query(sqlQuery, params);

  res.status(200).json({
    books: qResult.rows,
  });
});

// Get book by ID
router.get("/:id", async (req, res) => {
  console.log("loading all books");

  const params = [];
  let sqlQuery = " SELECT * FROM books WHERE ";

  if (!req.params.id) {
    return res.status(404).json({
      error: "Not Found",
    });
  } else {
    sqlQuery += ` id = $1`;
    params.push(req.params.id);
    console.log("params.id", req.params.id);
  }

  const qResult = await db.query(sqlQuery, params);

  res.status(200).json({
    book: qResult.rows[0],
  });
});

// Create a book
router.post("/", async (req, res) => {
  console.log("adding a book");
  const params = [];

  let sqlQuery = `
        INSERT INTO books
        (title, type, author, topic, publicationdate, pages)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING * 
    `;

  const newBook = req.body;

  params.push(
    newBook.title,
    newBook.type,
    newBook.author,
    newBook.topic,
    newBook.publicationdate,
    newBook.pages
  );

  const qResult = await db.query(sqlQuery, params);

  res.status(201).json({
    book: qResult.rows[0],
  });
});

// Update a book by ID
router.put("/:id", async (req, res) => {
  console.log("updating book");

  const params = [];

  let sqlQuery = `
        UPDATE books
        SET  title = $1, type = $2 , author=$3, topic=$4, publicationdate=$5, pages=$6
        WHERE id = $7
        RETURNING *
    `
    console.log('sql', sqlQuery);

    const updateToMake = req.body
    params.push(
        updateToMake.title,
        updateToMake.type,
        updateToMake.author,
        updateToMake.topic,
        updateToMake.publicationdate,
        updateToMake.pages,
        req.params.id
    );


    // if (req.params.id) {
    //     sqlQuery += ` id = $7`;
    //     params.push(req.params.id);
    //     console.log("params.id", req.params.id);

    //     if (req.body) {
    //         console.log('req.body', req.body);
    //         console.log('url', sqlQuery);
    //         sqlQuery += req.body
    //         params.push(sqlQuery)
    //     }
    // }

    const qResult = await db.query(sqlQuery, params);

    
    if (qResult.rows.length) {
        res.status(201).json({
            book: qResult.rows[0]
        });
    } else {
        res.sendStatus(404);
    }
    
});

module.exports = router;
