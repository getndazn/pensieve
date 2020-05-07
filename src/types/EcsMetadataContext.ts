type EcsMetadataContext = {
  cluster?: string
  ecsTaskId?: string
  containerName?: string
  containerInstanceArn?: string
  ecsServiceName?: string
  containerId?: string
  dockerContainerName?: string
  imageId?: string
  availabilityZone?: string
}

export {
  EcsMetadataContext
}
