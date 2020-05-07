type ApplicationDataKey = "appName" | "env" | "component" | "awsRegion" | "awsAvailabilityZone" | "host" | "ecsTaskId" | "appVersion" | "commitHash" | "ecsServiceName" | "serviceType" | "ecsContainerId"

type ApplicationData = {
  [key in ApplicationDataKey]: string;
}

export {
  ApplicationData,
  ApplicationDataKey
}
