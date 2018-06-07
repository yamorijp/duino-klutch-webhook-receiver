const createError = require('http-errors')
const express = require('express')
const logger = require('morgan')
const http = require('http')
const store = require('./store')

const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => { res.send('ok') })
app.post('/alerts', handleAlerts)

app.use((req, res, next) => { next(createError(404)) })
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.set('Content-Type', 'text/plain')
  res.send(req.app.get('env') === 'development' ? err.stack : 'oops')
})

const port = normalizePort(process.env.PORT || '3001')
app.set('port', port)

const server = http.createServer(app)
server.listen(port, () => console.log(`Listening on ${port}`))


function normalizePort(v) {
  const port = parseInt(v, 10)
  if (isNaN(port)) return v
  if (port >= 0) return port
  return false;
}

function handleAlerts(req, res) {
  res.send('ok')
  req.body.alerts && store.addAll(req.body.alerts).send()
}
