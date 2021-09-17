const db = require('../../data/dbConfig');

function find() {
    return db('users')
}

function findBy(filter, value) {
    return db('users').where(filter, value).orderBy('id')
}

function findById(id) {
    return db('dogs').where('id', id).first()
}

async function add(user) {
    const [id] = await db('users').insert(user)
    return findById(id)
}

module.exports = { 
    find, 
    findBy,
    findById,
    add
}