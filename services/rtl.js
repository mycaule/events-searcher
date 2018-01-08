/* eslint new-cap: "off" */

const stripTags = require('voca/strip_tags')

const axios = require('axios')

const rtl = axios.create({
  baseURL: 'http://www.rtl.fr/assister',
  timeout: 3000
})

const grandStudio = () =>
  rtl.get('/dates?showId=19423').then(res => {
    const results = stripTags(res.data)
      .split('\n')
      .map(_ => _.trim())
      .filter(_ => _.length !== 0)
      .slice(1)

    console.log(results)

    const pattern = /([A-Z]+[A-Z|\s]*) le (\d{2})\/(\d{2})\/(\d{2}) à (\d{2})h(\d{2})/u

    return results.map(_ => {
      const match = pattern.exec(_)

      return {
        name: match[1],
        date: `20${match[4]}-${match[3]}-${match[2]}T${match[5]}:${match[6]}:00`
      }
    })
  })

module.exports = {grandStudio}
