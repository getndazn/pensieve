// To test this logic & its metrics, run in your terminal:
// cd projects/pensieve
// $ npm install
// $ cp node_modules/newrelic/newrelic.js newrelic.js
// Fill newrelic.js with your API_KEY
// $ npm run start-api-apm
// $ curl localhost:3000/items
// $ curl localhost:3000/v1/items
// $ curl localhost:3000/v2/items

// To simulate an API consumer closing the HTTP connection before you return a response (for example when our consumers have a max timeout policy)
// Force cURL to close the connection after 10 milliseconds:
// $ curl localhost:3000/v2/items -m 0.01

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import newRelic from "newrelic"
require("@newrelic/aws-sdk")
import { outboundRequestRoute } from "./routes"
import { metricsService } from "./metrics"
import { inboundRequest } from "../../../src/middleware"
import express from "express"

const app = express()
const port = 3000

// Versioned API's
app.get("/v1/items", inboundRequest(metricsService, { path: "get_items", version: "v1" }), outboundRequestRoute)
app.get("/v2/items", inboundRequest(metricsService, { path: "get_items", version: "v2" }), outboundRequestRoute)

// Unversioned API's
app.get("/items", inboundRequest(metricsService, { path: "get_items" }), outboundRequestRoute)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
