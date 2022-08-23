const express = require('express')
const router = express.Router()
const db = require("../../db");

router.get('/', async (req, res) => {
    console.log("loading all books");
    const params = []
    
    let sqlQuery = 'SELECT * FROM books'

    if (req.query.type) {
        sqlQuery += ` WHERE type = $1`
        params.push(req.query.type)
        console.log('params', params);

    }

    if (req.query.topic) {
        sqlQuery += ` WHERE topic = $1`
        params.push(req.query.topic)
        console.log('params', params);
    }

    const qResult = await db.query(sqlQuery, params)

    res.status(200).json({
        books: qResult.rows
    })
})

// Create a book
router.post("/", (req, res) => {
    console.log("adding a book")

    const newBook = req.body
    newBook.id = books.length + 1
    books.push(newBook)

    res.status(201).json({
        newBook
    })
})

// Get book by ID
router.get('/:id', async (req, res) => { 
    console.log("loading all books");
    const params = []

    let sqlQuery = ' SELECT * FROM books WHERE '

    console.log('sql', sqlQuery);
    console.log('params', params);
    console.log('req. params', req.params);

    if (req.params.id) {
        sqlQuery += ` id = $1`
        params.push(req.params.id)
        console.log('params.id', req.params.id);
    }

    const qResult = await db.query(sqlQuery, params)

    console.log('p2', params);
    console.log('sql2', sqlQuery);

    res.status(200).json({
        books: qResult
    }) 
})

module.exports = router
