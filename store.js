const request = require('request')
const base = 'http://duino-k.local/led/matrix'

class AlertStore {

  constructor() {
    this._alerts = {}
  }

  add(alert) {
    const key = this._key(alert)
    if (alert.status === 'firing') this._alerts[key] = alert
    else if (alert.status === 'resolved') delete this._alerts[key]
    return this
  }

  addAll(alerts) {
    alerts.forEach(alert => this.add(alert))
    return this
  }

  async send() {
    const alerts = Object.values(this._alerts)
    const size = alerts.length
    await this._sendRequest('/clear')
    if (size) {
      for (let i=0; i<size; i++) {
        const message = `${alerts[i].annotations.summary || alerts[i].labels.alertname} (${i+1}of${size})`
        await this._sendRequest('/message', {data: message, n: -1})
      }
    }
  }

  async _sendRequest(action, qs={}) {
    const options = {method: 'GET', url: base + action, qs}
    return new Promise((resolve, reject) => {
      request(options, (error, res, body) => {
        if (error) reject(error)
        else resolve(body)
      })
    })
  }

  _key(alert) {
    return Object.keys(alert.labels)
      .sort()
      .map(label => alert.labels[label])
      .join('|')
  }
}

module.exports = new AlertStore()
