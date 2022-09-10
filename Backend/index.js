const connectToMongo = require('./db');
var cors = require('cors')
connectToMongo();
const express = require('express')
const app = express()
const port = 5000


app.use(cors())

// app.get('/', (req, res) => {
//   res.send('Hello DK!')
// })
app.use(express.json());
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(`Example app listening at http://localhost:${port}`)
})