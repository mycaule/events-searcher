const express = require('express')
const helmet = require('helmet')
const icalToolkit = require('ical-toolkit')
const dateFns = require('date-fns')

const rtl = require('./services/rtl')

const app = express()

const port = process.env.PORT || 5050

app.use(helmet())

app.get('/ical/rtl/grand-studio', async (req, res) => {
  const events = await rtl.grandStudio()

  const builder = icalToolkit.createIcsFileBuilder()

  builder.spacers = true
  builder.NEWLINE_CHAR = '\r\n'
  builder.throwError = false
  builder.ignoreTZIDMismatch = true

  builder.calname = 'Le Grand Studio RTL'
  builder.timezone = 'europe/paris'
  builder.tzid = 'europe/paris'
  builder.method = 'REQUEST'

  events.forEach(_ => {
    console.log(_)
    const startDate = dateFns.parse(_.date)
    builder.events.push({
      start: startDate,
      end: dateFns.addHours(startDate, 3),
      transp: 'OPAQUE',
      summary: _.name,
      uid: null,
      sequence: null,
      stamp: new Date(),
      floating: false,
      location: '22 rue Bayard, 75008 Paris',
      description: _.name,
      attendees: [],
      method: 'PUBLISH',
      status: 'CONFIRMED',
      url: 'http://www.rtl.fr/emission/le-grand-studio-rtl'
    })
  })

  const icsFileContent = builder.toString()

  if (icsFileContent instanceof Error) {
    res.status(200).end('Returned Error, you can also configure to throw errors!')
  }

  res.end(icsFileContent)
})

app.listen(port)
