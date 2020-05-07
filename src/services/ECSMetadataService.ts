import { NOT_AVAILABLE } from "../defaults"
import * as fs from "fs"
import { EcsMetadataConfig } from "../types"

export class ECSMetadataService {
  private readonly metadataPath: string
  private ECSMetadata?: EcsMetadataConfig

  public constructor(metadataPath: string) {
    this.metadataPath = metadataPath
    this.setECSMetadata()
  }

  public getECSMetadata(): EcsMetadataConfig | undefined {
    return this.ECSMetadata
  }

  private static getNullableObject(): EcsMetadataConfig {
    return {
      Cluster: NOT_AVAILABLE,
      TaskARN: NOT_AVAILABLE,
      ContainerInstanceARN: NOT_AVAILABLE,
      ContainerName: NOT_AVAILABLE,
      MetadataFileStatus: NOT_AVAILABLE
    }
  }

  private readMetadataFile(): Buffer {
    return fs.readFileSync(this.metadataPath)
  }

  private static parseMetadata(file: Buffer): EcsMetadataConfig {
    return JSON.parse(file.toString())
  }

  private setECSMetadata(): void {
    if (!this.metadataPath || !fs.existsSync(this.metadataPath)) {
      this.ECSMetadata = ECSMetadataService.getNullableObject()

      return
    }

    const contentFile = this.readMetadataFile()
    this.ECSMetadata = ECSMetadataService.parseMetadata(contentFile)

  }
}
