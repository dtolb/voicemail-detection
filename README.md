# voicemail-detection
Simple API that creates and bridges a call if the original phone call is not an answering machine.

## Assumptions
* You have signed up for the [Bandwidth voice & messaging APIs](https://app.bandwidth.com)
* You are familiar with [BXML](http://dev.bandwidth.com/ap-docs/bxml/bxml.html)

## Setup

This application requires:

* A phone number ordered and set to the Environment Variable: `BANDWIDTH_PROXY_NUMBER`
* That your server is able to receive HTTP callbacks (IE Publically addressable server.)
* At least NodeJS v8.* +

## Env Vars

This app uses [environment variables](https://www.schrodinger.com/kb/1842) to keep secrets and other app-level configuration.

| Variable Name            | Description                                                                               | Example                |
|:-------------------------|:------------------------------------------------------------------------------------------|:-----------------------|
| `BANDWIDTH_USER_ID`      | Your [`userid`](http://dev.bandwidth.com/security.html)                                   | `u-abc123`             |
| `BANDWIDTH_API_TOKEN`    | Your [`apiToken`](http://dev.bandwidth.com/security.html)                                 | `t-abc123`             |
| `BANDWIDTH_API_SECRET`   | Your [`apiSecret`](http://dev.bandwidth.com/security.html)                                | `asdklf356890asdgnm35` |
| `BANDWIDTH_PROXY_NUMBER` | The default number to initiate **all** calls. This will be the caller-id to both parties. | `+18281231234`         |

## API

### `/create-call`

| Parameter        | Required | Description                                                                                                                                                                                   |
|:-----------------|:---------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `outboundNumber` | ✅        | The first phone number to call. The app will ring this number first to test for voicemail.                                                                                                    |
| `callTimeout`    | ❌        | How long should the call to the `outboundNumber` ring in seconds before ending the call flow. <br> <br> **Default: 20**                                                                       |
| `transferTo`     | ✅        | After the call to `outbound` number has been verified **not** a voicemail, the app will connect the two phone numbers.  <br><br> **Note** The app **does not** detect voicemail on this call. |
| `proxyNumber`    | ❌        | Which Bandwidth number to use to initiate the call flow.  If nothing is specified the app will use whatever number is stored in the `BANDWIDTH_PROXY_NUMBER` environment variable.            |

```json
{
  "outboundNumber": "+18288364030",
  "callTimeout": 5,
  "transferTo": "+17379273364",
  "proxyNumber": "+12826643367"
}
```

