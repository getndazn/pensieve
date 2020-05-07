import { ObjectOfStrings } from "./ObjectOfStrings"

type StandardAttributes = {
  env?: string
  appName: string
  awsRegion: string
  awsAvailabilityZone?: string
  component?: string
  source?: string
  target?: string
  host?: string
  ecsTaskId?: string
  ecsServiceName?: string
  commitHash?: string
  appVersion?: string
}

type HTTPMetricAttributes = StandardAttributes & {
  routePath: string
  httpRequestDirection: string
  httpResponseCode?: string
  apiVersion?: string
}

type CustomAttributes = ObjectOfStrings

type MetricAttributes = (StandardAttributes | HTTPMetricAttributes) & CustomAttributes

type VALUE_NOT_AVAILABLE = "not_available"

export {
  StandardAttributes,
  HTTPMetricAttributes,
  MetricAttributes,
  CustomAttributes,
  VALUE_NOT_AVAILABLE
}
