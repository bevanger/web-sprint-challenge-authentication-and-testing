const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

describe('[POST] /api/auth/register', () => {
  test('adds new user to the db', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'baileyE', password: '1234' })
    const users = await db('users')
    expect(users).toHaveLength(1)
  })
  test('responds with a 401 if missing username', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: '', password: '1234' })
    expect(res.status).toBe(401)
  })
})

describe('[POST] /api/auth/login', () => {
  test('responds with a 400 if username does not match', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'jesse', password: '1234' })
    expect(res.status).toBe(400)
  })
  test('responds with a 400 if missing username', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'joey', password: '' })
    expect(res.status).toBe(400)
  })
})