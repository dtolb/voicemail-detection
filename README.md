# voicemail-detection
Simple API that creates and bridges a call if the original phone call is not an answering machine.



## API

### `/create-call`

| Parameter | Required | Description |
|--|--|--|
| `outboundNumber` | Yes | The first phone number to call. The app will ring this number first to test for voicemail. |
| `callTimeout` | No | How long should the call to the `outboundNumber` ring in seconds before ending the call flow. <br> <br> **Default: 20**|
| `transferTo` | Yes | After the call to `outbound` number has been verified **not** a voicemail, the app will connect the two phone numbers.  <br><br> **Note** The app **does not** detect voicemail on this call.
| `proxyNumber` | No | Which Bandwidth number to use to initiate the call flow.  If nothing is specified the app will use whatever number is stored in the `BANDWIDTH_PROXY_NUMBER` environment variable. |

```json
{
  "outboundNumber": "+18288364030",
  "callTimeout": 5,
  "transferTo": "+17379273364",
  "proxyNumber": "+12826643367"
}
```

The app will create the call to