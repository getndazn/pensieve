import { ApplicationData, HttpRequestContext } from "../src/types"
import { NOT_AVAILABLE } from "../src/defaults"
import { hrtime } from "process"
import { InboundRequestData, OutboundRequestData } from "../src/types"
import { PensieveConstructor } from "../src/types"

const mockApplicationData: PensieveConstructor = {
  appName: "pensieve",
  awsAvailabilityZone: "eu-central-1a",
  component: "api",
  env: "local",
  appVersion: "0.0.1",
  host: "hostname",
  awsRegion: "eu-central-1",
  ecsServiceName: "pensieve-dev",
  serviceType: "ECS",
  ecsTaskId: "current-task-id",
  ecsContainerId: "yadda",
  commitHash: "xxxxxx"
}

const mockPartialApplicationData: PensieveConstructor = {
  appName: "pensieve",
  env: "local",
  awsRegion: "eu-central-1",
  component: "api",
}

const now = hrtime()

const mockInboundRequestData: InboundRequestData = {
  httpMethod: "GET",
  routePath: "route-path",
  startAt: now,
  httpResponseCode: 500,
  source: "user-management",
}

const mockPartialInboundRequestData: InboundRequestData = {
  httpMethod: "GET",
  routePath: "route-path",
  startAt: now,
  httpResponseCode: 500
}

const mockOutboundRequestData: OutboundRequestData = {
  httpMethod: "200",
  routePath: "route-path",
  startAt: now,
  httpResponseCode: 500,
  target: "subscriptions"
}

const mockPartialOutboundRequestData: OutboundRequestData = {
  httpMethod: "200",
  routePath: "route-path",
  startAt: now,
  target: "subscriptions"
}

const mockDefaultAttributes: ApplicationData = {
  appName: "pensieve",
  awsAvailabilityZone: "eu-central-1a",
  component: "api",
  env: "local",
  appVersion: "0.0.1",
  host: "hostname",
  awsRegion: "eu-central-1",
  ecsServiceName: "pensieve-dev",
  serviceType: "ECS",
  ecsTaskId: "current-task-id",
  ecsContainerId: "yadda",
  commitHash: "xxxxxx"
}

const mockInboundRequestAttributes: HttpRequestContext = {
  httpRequestDirection: "IN",
  httpMethod: "GET",
  source: "user-management",
  target: NOT_AVAILABLE,
  httpResponseCode: "500",
  routePath: "route-path",
  apiVersion: NOT_AVAILABLE
}

const mockOutboundRequestAttributes: HttpRequestContext = {
  httpRequestDirection: "OUT",
  httpMethod: "GET",
  source: NOT_AVAILABLE,
  target: "subscriptions",
  httpResponseCode: "500",
  routePath: "route-path",
  apiVersion: NOT_AVAILABLE
}

export {
  mockApplicationData,
  mockPartialApplicationData,
  mockInboundRequestData,
  mockPartialInboundRequestData,
  mockOutboundRequestData,
  mockPartialOutboundRequestData,
  mockDefaultAttributes,
  mockInboundRequestAttributes,
  mockOutboundRequestAttributes
}
