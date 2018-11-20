var https = require('https')
var HttpsProxyAgent = require('https-proxy-agent')
var querystring = require('querystring')
const parametres = require('./parametres.json')

var agent = new HttpsProxyAgent(parametres.proxy)
var cookie = ''

var executerGET = (resource) => {
  return new Promise((resolve) => {
    const options = {
      hostname: parametres.hostname,
      path: parametres.path + resource,
      method: 'GET',
      agent: agent,
      headers: {
        'cache-control': 'no-cache',
        'Host': 'ha110-1.overkiz.com',
        'Connection': 'Keep-Alive',
        'Cookie': cookie
      }
    }

    const req = https.request(options, (res) => {
      console.log(`${options.path} - STATUS: ${res.statusCode}`)
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      var reponse = ''
      res.on('data', (chunk) => {
        reponse += chunk
      })
      res.on('end', () => {
        resolve(JSON.parse(reponse))
      })
    })

    req.on('error', (e) => {
      console.error(e)
    })

    req.end()
  })
}

var executerAuthentification = () => {
  const postData = querystring.stringify({
    'userId': parametres.userId,
    'userPassword': parametres.userPassword
  })

  const options = {
    hostname: parametres.hostname,
    path: parametres.path + 'login',
    method: 'POST',
    agent: agent,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    }
  }

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      console.log(`${options.path} - STATUS: ${res.statusCode}`)
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      cookie = res.headers['set-cookie'].find(item => item.startsWith('JSESSIONID='))
      //      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        //          console.log(`BODY: ${chunk}`);
      })
      res.on('end', () => {
        resolve(cookie)
      })
    })

    req.on('error', (e) => {
      console.error(e)
    })

    req.write(postData)
    req.end()
  })
}

module.exports = {
  setCookie: (newCookie) => {
    cookie = newCookie
  },
  getSetup: () => {
    return executerGET('getSetup')
  },
  authentifier: () => {
    return executerAuthentification()
  }
}
