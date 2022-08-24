const db = require("../../db")
const { buildWhereClause } = require("./utils")

async function getAllBooks(queryParams) {
    const query = buildWhereClause('select * from books', Object.keys(queryParams))

    return (await db.query(query, Object.values(queryParams))).rows
}

module.exports = {
    getAllBooks
}