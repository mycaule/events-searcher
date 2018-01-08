const express = require('express')
const helmet = require('helmet')
const icalToolkit = require('ical-toolkit')

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
  builder.timezone = 'america/new_york'
  builder.tzid = 'america/new_york'
  builder.method = 'REQUEST'

  events.forEach(_ => {
    builder.events.push({
      start: new Date(),
      end: new Date(),
      transp: 'OPAQUE',
      summary: 'Test Event',
      alarms: [15, 10, 5],
      uid: null,
      sequence: null,
      allDay: true,
      stamp: new Date(),
      floating: false,
      location: 'Home',
      description: _.name,
      organizer: {
        name: 'RTL',
        email: 'test1@mail',
        sentBy: 'test2@mail'
      },
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
