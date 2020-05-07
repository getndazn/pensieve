import { pensieveInstance } from "../pensieve"
import { NewRelicAPMService } from "./APMService"

// The service you can use to create your own custom metrics
const metricsService = new NewRelicAPMService(pensieveInstance)

export {
  metricsService
}
