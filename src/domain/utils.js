function buildWhereClause(sql, columns, constraint = 'AND') {
    if (columns.length) {
        sql += ' WHERE '
    }

    const mappedCols = columns.map((col, i) => `${col} = $${i + 1}`)

    return sql + mappedCols.join(` ${constraint} `)
}

module.exports = {
    buildWhereClause
}