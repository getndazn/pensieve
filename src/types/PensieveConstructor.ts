import { ObjectOfStrings } from "./ObjectOfStrings"

type PensieveConstructor = ObjectOfStrings & {
  appName: string
  awsRegion: string
  env: string
  component: string
  awsAvailabilityZone?: string
  appVersion?: string
  host?: string
  ecsServiceName?: string
  serviceType?: string
  ecsTaskId?: string
  ecsContainerId?: string
  commitHash?: string
}

export {
  PensieveConstructor
}
