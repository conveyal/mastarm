const fetch = require('isomorphic-fetch')
const nodeEmoji = require('node-emoji')

const logToConsole = text => Promise.resolve(console.log(emojify(text)))
const logToErrorConsole = text => Promise.resolve(console.error(emojify(text)))

module.exports.log = logToConsole
module.exports.error = logToErrorConsole

module.exports.logToSlack = ({ channel, webhook }) => {
  module.exports.log = text => {
    logToConsole(text)
    return notifySlack({ channel, text, webhook })
  }

  module.exports.error = text => {
    logToErrorConsole(text)
    return notifySlack({ channel, text, webhook })
  }
}

/**
 * Emojify text outside of html
 */
function emojify (text) {
  if (typeof text !== 'string') return text
  const strippedLinks = text.replace(/<[^|>]+\|([^>]+)>/g, '$1')
  return nodeEmoji.emojify(strippedLinks)
}

/**
 * Send a message to slack by making a request to a webhook.
 */
function notifySlack ({ channel, text, webhook }) {
  return fetch(webhook, {
    body: JSON.stringify({
      channel,
      text
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
    .then(response => response.text())
    .catch(err => {
      logToErrorConsole('Error posting to Slack webhook')
      logToErrorConsole(err)
      return err
    })
}
