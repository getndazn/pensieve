import { ObjectOfStrings } from "./ObjectOfStrings"

type EcsMetadataConfig = ObjectOfStrings & {
  Cluster: string
  TaskARN: string
  ContainerName: string
  ContainerInstanceARN: string
  MetadataFileStatus: string
  TaskDefinitionFamily?: string
  ContainerID?: string
  DockerContainerName?: string
  ImageID?: string
  AvailabilityZone?: string
}

export {
  EcsMetadataConfig
}
