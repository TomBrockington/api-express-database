const express = require("express");
const router = express.Router();
const db = require("../../db");
const { getAllBooks } = require("../domain/booksRepository");

// Get all Books 

router.get('/', async (req, res) => {
    const allBooks = await getAllBooks(req.query)

    res.json({
        books: allBooks
    })
})

// Get book by ID
router.get("/:id", async (req, res) => {
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
    const qResult = await db.query(sqlQuery, params);

    if (qResult.rows.length) {
        res.status(201).json({
            book: qResult.rows[0]
        });
    } else {
        res.sendStatus(404);
    }
});

// Delete book by ID
router.delete("/:id", async (req, res) => {
    // foundFilm = films.find((f) => f.id === Number(req.params.id))
    console.log("deleting book")

    const params = [];

    let sqlQuery = `
        DELETE FROM books
        WHERE
    `
    sqlQuery += ` id = $1 RETURNING *`;
    params.push(req.params.id);
    console.log("params.id", req.params.id);

    const qResult = await db.query(sqlQuery, params);

    if (qResult.rows.length) {
        res.status(201).json({
            book: qResult.rows[0]
        });
    } else {
        res.sendStatus(404);
    }
})

module.exports = router;
