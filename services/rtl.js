/* eslint new-cap: "off" */

const v = require('voca')

const axios = require('axios')

const rtl = axios.create({
  baseURL: 'http://www.rtl.fr/assister',
  timeout: 3000
})

const dates = (showId, pattern) =>
  rtl.get('/dates', {
    params: {showId}
  }).then(res => {
    const results = v.stripTags(res.data)
      .split('\n')
      .map(_ => _.trim())
      .filter(_ => _.length !== 0)
      .slice(1)

    console.log(results)

    return results.map(_ => {
      const match = pattern.exec(_)

      return {
        name: v.chain(match[1]).replace(/Le Grand Studio RTL d./, '').replace('.', '').trim().titleCase().value(),
        date: `20${match[4]}-${match[3]}-${match[2]}T${match[5]}:${match[6]}:00+01:00`,
        status: match[7].replace('-', '').trim()
      }
    })
  })

const grandStudio = () => dates(19423, /(.*) le (\d{2})\/(\d{2})\/(\d{2}) à (\d{2})h(\d{2}) -(.*)/u)

const grandStudioHumour = () => dates(7772743411, /avec (.*) le (\d{2})\/(\d{2})\/(\d{2}) à (\d{2})h(\d{2}) -(.*)/u)

module.exports = {grandStudio, grandStudioHumour}
