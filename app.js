const express = require('express')
const helmet = require('helmet')
const icalToolkit = require('ical-toolkit')
const dateFns = require('date-fns')

const rtl = require('./services/rtl')

const app = express()

const port = process.env.PORT || 5050

app.use(helmet())

const icsMaker = (calname, events, location, url) => {
  const builder = icalToolkit.createIcsFileBuilder()

  builder.spacers = true
  builder.NEWLINE_CHAR = '\r\n'
  builder.throwError = false
  builder.ignoreTZIDMismatch = true

  builder.calname = calname
  builder.timezone = 'europe/paris'
  builder.tzid = 'europe/paris'
  builder.method = 'REQUEST'

  events.forEach(_ => {
    const startDate = dateFns.parse(_.date)
    builder.events.push({
      start: startDate,
      end: dateFns.addHours(startDate, 2),
      transp: 'OPAQUE',
      summary: _.name,
      uid: null,
      sequence: null,
      stamp: new Date(),
      floating: false,
      location,
      description: `${_.name} - ${_.status}`,
      method: 'PUBLISH',
      status: 'CONFIRMED',
      url
    })
  })

  return builder.toString()
}

app.get('/ical/rtl/grand-studio', async (req, res) => {
  const events = await rtl.grandStudio()

  const icsFileContent = icsMaker('Le Grand Studio RTL', events, '22 rue Bayard, 75008 Paris', 'https://www.rtl.fr/emission/le-grand-studio-rtl')

  if (icsFileContent instanceof Error) {
    res.status(500).end('ICS error')
  }

  res.end(icsFileContent)
})

app.get('/ical/rtl/grand-studio-humour', async (req, res) => {
  const events = await rtl.grandStudioHumour()

  const icsFileContent = icsMaker('Le Grand Studio RTL Humour', events, '22 rue Bayard, 75008 Paris', 'https://www.rtl.fr/emission/le-grand-studio-rtl-humour')

  if (icsFileContent instanceof Error) {
    res.status(500).end('ICS error')
  }

  res.end(icsFileContent)
})

app.listen(port)
