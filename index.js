/* Import our Modules */
const Bandwidth  = require('node-bandwidth');
const express    = require('express');
const bodyParser = require('body-parser');
const path       = require('path');
const PROXY_NUMBER = process.env.BANDWIDTH_PROXY_NUMBER;
const DEFAULT_TIMEOUT = 20;

/* Express Setup */
let app  = express();
let http = require('http').Server(app);
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));

/* Setup our Bandwidth information */
const myCreds = {
    userId    : process.env.BANDWIDTH_USER_ID,
    apiToken  : process.env.BANDWIDTH_API_TOKEN,
    apiSecret : process.env.BANDWIDTH_API_SECRET,
};

const bandwidthAPI = new Bandwidth(myCreds);

/*
* {
*   "outboundNumber": "+18288364030",
*   "callTimeout": 5,
*   "transferTo": "+17379273364",
*   "proxyNumber": "+12826643367"
* }
*/
app.post('/create-call', await (req, res) => {
  const callbackUrl = `http://${req.hostname}/answer-event`;
  const from = req.body.proxyNumber ? req.body.proxyNumber : PROXY_NUMBER;
  const callTimeout = req.body.callTimeout ? req.body.callTimeout : DEFAULT_TIMEOUT
  const callPayload = {
    to                 : req.body.outboundNumber,
    callbackHttpMethod : 'GET',
    callbackUrl        : callTimeout,
    from               : from,
    callTimeout        : callTimeout,
    tag                : req.body.transferTo,
  };
  try {
    const call = await bandwidthAPI.Call.create(callPayload);
    res.send(call);
  }
  catch (e) {
    console.log(`Error when creating the call: ${e}`);
    res.status(500).send('Something went wrong when creating the call');
  }
});

app.get('/answer-event', (req, res) => {
  const event = req.query;
  if (event.eventType !== 'answer'){
    console.log('Call Timed out, no answer');
    res.sendStatus(200);
    return;
  }
  const bxml = new Bandwidth.BXMLResponse();
  bxml.gather({
    requestUrl: '/gather-event',
    maxDigits: 1,
    tag: event.tag,
  }, function() {
    this.speakSentence('This is a test for voicemail, please press any key to answer the call');
  });
  res.send(bxml.toString());
});

app.get('/gather-event', (req, res) => {
  const event = req.query;
  const bxml = new Bandwidth.BXMLResponse();
  if (event.reason != 'max-digits') {
    console.log('Voicemail detected, ending call');
    bxml.hangup();
    res.send(bxml.toString());
    return;
  }
  console.log('Voicemail not detected, transfering call');
  bxml.transfer({
    transferTo: req.query.tag
  });
});

http.listen(app.get('port'), function(){
    console.log('listening on *:' + app.get('port'));
});