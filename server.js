// Load our Environment Variables
const dotenv = require('dotenv');
dotenv.config();
const newrelic = require('newrelic');

// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    // We need to add meta-data to the request, otherwise everything will show up as /*
    sendToNewRelic(req, pathname, query);

    handle(req, res, parsedUrl)

  }).listen(process.env.PORT ?? 3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:' + process.env.PORT ?? 3000)
  })
})

function sendToNewRelic(req, path, query) {  

  // Get the Request IP
  const ipAddr = req?.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (ipAddr) {
    newrelic.addCustomAttribute('ipAddr', ipAddr);
  }

  // Get Cookie Data for Session ID
  const cookies = getCookies(req);
  if (cookies) {
    const jSessionId = cookies['JSESSIONID'] ?? null;
    if (jSessionId) {
      newrelic.addCustomAttribute('JSESSIONID', jSessionId);
    }
  }

  // Set the controller name
  if (path) {
      const lowerPath = path.toLowerCase();

      // Check to see if it was request to /_next
      if ( /^\/_next\/(.*)/i.test(lowerPath)) {
        if ( /^\/_next\/webpack-hmr(.*)/i.test(lowerPath)) {
          // Local Dev HMR        
          //console.log('nextHmr', lowerPath)
          newrelic.setTransactionName('nextHMR');            
        } else if ( /^\/_next\/image(.*)/i.test(lowerPath)) {
          // Next Images
          //console.log('nextImage', lowerPath)
          newrelic.setTransactionName('nextImage');            
        } else if (/\/_next\/data\/(.*)/i.test(lowerPath)) {
          // Data Urls
          //console.log('nextData', lowerPath)
          newrelic.setTransactionName('nextData');            
        } else if (/\/_next\/static\/(.*)/i.test(lowerPath)) {
          // Static Files
          //console.log('nextStatic', lowerPath)
          newrelic.setTransactionName('nextStatic');            
        } else {
          // Other Next Request
          //console.log('nextOther', lowerPath)
          newrelic.setTransactionName('nextOther');
        }
      } else {
        // It wasn't a request to /_next/*

        if (/.*(\.js|\.ico|\.gif|\.png|\.jpg)/i.test(lowerPath)) {
          // Other Assets (such as favicon, service workers etc)
          //console.log('nextAssets', lowerPath)
          newrelic.setTransactionName('nextAssets');            
        } else if (/\/api\/.*/i.test(lowerPath)) {
          // API Requests
          //console.log('nextApi', lowerPath)
          newrelic.setTransactionName('nextApi');
        } else {
          // Page Requests
          //console.log('nextRequest', lowerPath)
          newrelic.setTransactionName('Request' + lowerPath);
        }
      }
  }
}

function getCookies(req) {
  const { headers: { cookie } } = req;
  if (cookie) {
    const values = cookie.split(';').reduce((res, item) => {  
      const data = item.trim().split('=');
      return { ...res, [data[0]]: data[1] };
    }, {});      
    return values;
  } else {
    return null;
  }
}