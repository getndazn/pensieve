// To test this logic & its metrics, run in your terminal:
// cd projects/pensieve
// $ npm install
// $ npm run start-api-statsd
// $ curl localhost:3000/items
// $ curl localhost:3000/v1/items
// $ curl localhost:3000/v2/items

// To simulate an API consumer closing the HTTP connection before you return a response (for example when our consumers have a max timeout policy)
// Force cURL to close the connection after 10 milliseconds:
// $ curl localhost:3000/v2/items -m 0.01

import { outboundRequestRoute } from "./routes"
import { metricsService } from "./metrics"
import { inboundRequest } from "../../../src/middlewares"
import express from "express"

const app = express()
const port = 3000

console.log("Application starting...")

// Versioned API's
app.get("/v1/items", inboundRequest(metricsService, { path: "get_items", version: "v1" }), outboundRequestRoute)
app.get("/v2/items", inboundRequest(metricsService, { path: "get_items", version: "v2" }), outboundRequestRoute)

// Unversioned API's
app.get("/items", inboundRequest(metricsService, { path: "get_items" }), outboundRequestRoute)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
