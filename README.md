<div align="center">

# voicemail-detection

<img src="https://s3.amazonaws.com/bwdemos/BW_Voice.png"/>

Simple API that creates and bridges a call if the original phone call is not an answering machine.

</div>

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)


## Assumptions
* You have signed up for the [Bandwidth voice & messaging APIs](https://app.bandwidth.com)
* You are familiar with [BXML](http://dev.bandwidth.com/ap-docs/bxml/bxml.html)

## Prerequisites
* Configured Machine with [ngrok](#setup-with-ngrok)/Port Forwarding
  * [Ngrok](https://ngrok.com/)
* [Bandwidth Account](https://app.bandwith.com)
* [Node v8.0+](https://nodejs.org/en/)
* [Bandwidth Phone Number](http://dev.bandwidth.com/howto/buytn.html)

## Env Vars

This app uses [environment variables](https://www.schrodinger.com/kb/1842) to keep secrets and other app-level configuration.

| Variable Name            | Description                                                                               | Example                |
|:-------------------------|:------------------------------------------------------------------------------------------|:-----------------------|
| `BANDWIDTH_USER_ID`      | Your [`userid`](http://dev.bandwidth.com/security.html)                                   | `u-abc123`             |
| `BANDWIDTH_API_TOKEN`    | Your [`apiToken`](http://dev.bandwidth.com/security.html)                                 | `t-abc123`             |
| `BANDWIDTH_API_SECRET`   | Your [`apiSecret`](http://dev.bandwidth.com/security.html)                                | `asdklf356890asdgnm35` |
| `BANDWIDTH_PROXY_NUMBER` | The default number to initiate **all** calls. This will be the caller-id to both parties. | `+18281231234`         |

## Running the app

This assumes you are setup with [ngrok](#setup-with-ngrok)

### Clone the app locally and navigate to the folder

```bash
$ git clone https://github.com/dtolb/voicemail-detection.git
$ cd voicemail-detection
```

### Install the dependencies

```bash
$ npm install
```

### Run the app

```bash
$ npm start
```

### Server is up and running

The server is now ready to accept a `POST` request to initiate a call flow with voicemail detection.

## API

### `/create-call`

| Parameter      | Required | Description                                                                                                                                                                                           |
|:---------------|:---------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `createCallTo` | ✅        | The first phone number to call. The app will ring this number first to test for voicemail.                                                                                                            |
| `callTimeout`  | ❌        | How long should the call to the `createCallTo` ring in seconds before ending the call flow. <br> <br> **Default: 20**                                                                                 |
| `transferTo`   | ✅        | After the call to the `createCallTo` number has been verified **not** a voicemail, the app will connect the two phone numbers.  <br><br> **Note** The app **does not** detect voicemail on this call. |
| `proxyNumber`  | ❌        | Which Bandwidth number to use to initiate the call flow.  If nothing is specified the app will use whatever number is stored in the `BANDWIDTH_PROXY_NUMBER` environment variable.                    |

#### Sample JSON

```json
{
  "createCallTo" : "+18288364030",
  "callTimeout"  : 5,
  "transferTo"   : "+17379273364",
  "proxyNumber"  : "+12826643367"
}
```

### Create a call

Create a `POST` request to `http://your_ngrok.ngrok.io/create-call`

```http
POST http://8a543f5f.ngrok.io/create-call
Content-Type: application/json

{
  "createCallTo" : "+18288364030",
  "transferTo"   : "+17379273364"
}
```

> Responds

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "to"                 : "+18288364030",
  "callbackHttpMethod" : "GET",
  "callbackUrl"        : "http://8a543f5f.ngrok.io/answer-event",
  "from"               : "{{BANDWIDTH_PROXY_NUMBER}}",
  "callTimeout"        : 20,
  "tag"                : "+17379273364",
  "id"                 : "c-abc123"
}
```

The app will call the `createCallTo` number and when that number answers, will validate that it is **not** a voicemail, then forward to the `transferTo` number.

### Demo Curl

```bash
curl -v -X POST http://8a543f5f.ngrok.io/create-call \
  -H "Content-type: application/json" \
  -d \
  '
  {
    "createCallTo" : "+18288364030",
    "transferTo"   : "+17379273364"
  }'
```

## Setup with ngrok

[Ngrok](https://ngrok.com) is an awesome tool that lets you open up local ports to the Internet.

Once you have ngrok installed, open a new terminal tab and navigate to it's location on the file system and run:

```bash
./ngrok http 3000
```

You'll see the terminal show you information

![ngrok terminal](https://s3.amazonaws.com/bw-demo/ngrok_terminal.png)
