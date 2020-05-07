import { StatsDService } from "../../../src"
import { pensieveInstance } from "../pensieve"
import { loggerInstance } from "../logger"
import { StatsD } from "hot-shots"

// The client used to communication with the in-host StatsD agent (Datadog, New Relic)
const statsDClient = new StatsD({
  host: process.env.STATSD_HOST || 'localhost',
  port: Number(process.env.STATSD_PORT) || 8125,
  maxBufferSize: 8192,
  bufferFlushInterval: 1000
})

// The service you can use to create your own custom metrics
const metricsService = new StatsDService(pensieveInstance, statsDClient, loggerInstance)

export {
  metricsService
}
