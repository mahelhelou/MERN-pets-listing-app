const express = require('express')
const dotenv = require('dotenv').config()
const multer = require('multer')
const upload = multer()
const sanitizeHTML = require('sanitize-html')

const port = process.env.POrt || 8000

const { MongoClient, ObjectId } = require('mongodb')
let db

const app = express()
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const passwordProtected = (req, res, next) => {
	res.set('WWW-Authenticate', "Basic realm='MERN Pets Listing App'")
	if (req.headers.authorization === 'Basic YWRtaW46YWRtaW4=') {
		next()
	} else {
		res.status(401).send('Invalid credentials! Try again.')
	}
}

app.get('/', async (req, res) => {
	const animals = await db.collection('animals').find().toArray()
	res.render('home', { animals })
})

// Any route (Except home page) will be protected
app.use(passwordProtected)

app.get('/admin', (req, res) => {
	res.render('admin')
})

app.get('/api/animals', async (req, res) => {
	const animals = await db.collection('animals').find().toArray()
	res.json(animals)
})

app.post('/create-animal', upload.single('photo'), ourCleanup, async (req, res) => {
	console.log(req.body)
	const info = await db.collection('animals').insertOne(req.cleanData)
	const newAnimal = await db.collection('animals').findOne({ _id: new ObjectId(info.insertedId) })
	res.json(newAnimal)
})

function ourCleanup(req, res, next) {
	if (typeof req.body.name !== 'string') req.body.name = ''
	if (typeof req.body.species !== 'string') req.body.species = ''
	if (typeof req.body._id !== 'string') req.body._id = ''

	req.cleanData = {
		name: sanitizeHTML(req.body.name, { allowedTags: [], allowedAttributes: {} }),
		species: sanitizeHTML(req.body.species, { allowedTags: [], allowedAttributes: {} })
	}

	next()
}

const start = async () => {
	const client = new MongoClient(process.env.CONNECTION_STRING)
	client.connect()
	db = await client.db()

	app.listen(port)
}

start()
