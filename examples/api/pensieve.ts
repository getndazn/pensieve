import { Pensieve } from "../../src"
import { loggerInstance } from "./logger"

// Information & context related to your application
// Will be used in the attributes of custom metrics
// Dummy values used here
import * as os from "os"

const applicationData = {
  appName: "content-portability", // your microservice's name
  component: "api", // examples: api, poller, consumer
  env: "local", // local, dev, test, or prod
  awsRegion: "eu-central-1", // AWS region
  appVersion: "v0.0.1", // Semantic version
  host: os.hostname(),
  serviceType: "ECS",
  commitHash: "abcd1234"
}

const pensieveInstance = new Pensieve(
  applicationData, // Context you already have about your own application
  true // Enable ECS metadata context if applicable, see: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/container-metadata.html
)

// ECS metadata for free!
loggerInstance.info({
  message: "ECS metadata available to get from Pensieve",
  private: { ECSMetadataContext: pensieveInstance.getECSMetadataContext() }
})

export {
  pensieveInstance
}
