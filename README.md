# MERN ~ Pets Listing App

## Basic Server Setup

```js
// server.js
const express = require('express')
const app = express()

app.get('/', (req, res) => {
	res.send('Welcome to home page.')
})

app.get('/admin', (req, res) => {
	res.send('Secret admin page.')
})

app.listen(3000)
```
