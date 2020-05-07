import { ApplicationData, PensieveConstructor, HttpRequestContext, EcsMetadataContext } from "./types"
import { NOT_AVAILABLE, DEFAULT, HTTP_DIRECTION_INBOUND, HTTP_DIRECTION_OUTBOUND } from "./defaults"
import * as os from "os"
import { hrtime } from "process"
import { InboundRequestData, OutboundRequestData, RequestData } from "./types"
import { ECSMetadataService, Configuration } from "./services"

export class Pensieve {

  private readonly applicationData: ApplicationData
  private ECSMetadataService: ECSMetadataService
  private readonly ECSMetadataEnabled: boolean
  private readonly ECSEcsMetadataContext: EcsMetadataContext

  public constructor(applicationData: PensieveConstructor, ECSMetadataEnabled: boolean = false) {
    this.ECSMetadataService = new ECSMetadataService(
      Configuration.get("ECS_CONTAINER_METADATA_FILE")
    )
    this.ECSMetadataEnabled = ECSMetadataEnabled

    this.ECSEcsMetadataContext = this.getECSMetadataContextValue()
    this.applicationData = {
      component: this.getApplicationDataValue(applicationData, "component", DEFAULT),
      appName: this.getApplicationDataValue(applicationData, "appName"),
      env: this.getApplicationDataValue(applicationData, "env"),
      awsRegion: this.getApplicationDataValue(applicationData, "awsRegion"),
      awsAvailabilityZone: this.getApplicationDataValue(applicationData, "awsAvailabilityZone", this.ECSEcsMetadataContext.availabilityZone),
      host: this.getApplicationDataValue(applicationData, "host", os.hostname()),
      appVersion: this.getApplicationDataValue(applicationData, "appVersion"),
      commitHash: this.getApplicationDataValue(applicationData, "commitHash"),
      serviceType: this.getApplicationDataValue(applicationData, "serviceType"),
      ecsServiceName: this.getApplicationDataValue(applicationData, "ecsServiceName", this.ECSEcsMetadataContext.ecsServiceName),
      ecsTaskId: this.getApplicationDataValue(applicationData, "ecsTaskId", this.ECSEcsMetadataContext.ecsTaskId),
      ecsContainerId: this.getApplicationDataValue(applicationData, "ecsContainerId", this.ECSEcsMetadataContext.containerId),
    }
  }

  public getApplicationData(): ApplicationData {
    return this.applicationData
  }

  public getECSMetadataContext(): EcsMetadataContext {
    return this.ECSEcsMetadataContext
  }

  public getApplicationDataValue(applicationData: PensieveConstructor, key: string, defaultValue?: string): string {
    if (applicationData.hasOwnProperty(key) && typeof applicationData[key] !== "undefined") {
      return applicationData[key]
    }

    return defaultValue || NOT_AVAILABLE
  }

  public getInboundHttpRequestContext(inboundRequestData: InboundRequestData): HttpRequestContext {
    return {
      routePath: inboundRequestData.routePath,
      apiVersion: inboundRequestData.apiVersion || NOT_AVAILABLE,
      httpResponseCode: this.getHttpStatusValue(inboundRequestData),
      source: inboundRequestData.source || NOT_AVAILABLE,
      target: NOT_AVAILABLE,
      httpMethod: inboundRequestData.httpMethod,
      httpRequestDirection: HTTP_DIRECTION_INBOUND
    }
  }

  public getOutboundHttpRequestContext(outboundRequestData: OutboundRequestData): HttpRequestContext {
    return {
      routePath: outboundRequestData.routePath,
      apiVersion: outboundRequestData.apiVersion || NOT_AVAILABLE,
      httpResponseCode: this.getHttpStatusValue(outboundRequestData),
      source: NOT_AVAILABLE,
      target: outboundRequestData.target,
      httpMethod: outboundRequestData.httpMethod,
      httpRequestDirection: HTTP_DIRECTION_OUTBOUND
    }
  }

  protected getECSMetadataContextValue(): EcsMetadataContext {
    if (!this.ECSMetadataEnabled) {
      return {}
    }

    const metadata = this.ECSMetadataService.getECSMetadata()
    if (!metadata || metadata.MetadataFileStatus == NOT_AVAILABLE) {
      return {}
    }

    const taskARNElements = metadata.TaskARN.split("/")

    return {
      cluster: metadata.Cluster,
      ecsTaskId: taskARNElements[taskARNElements.length - 1],
      containerName: metadata.ContainerName,
      containerInstanceArn: metadata.ContainerInstanceARN,
      ecsServiceName: metadata.TaskDefinitionFamily,
      containerId: metadata.ContainerID,
      dockerContainerName: metadata.DockerContainerName,
      imageId: metadata.ImageID,
      availabilityZone: metadata.AvailabilityZone
    }
  }

  protected getHttpStatusValue(requestData: RequestData): string {
    if (requestData.httpResponseCode) {
      return requestData.httpResponseCode.toString()
    }

    return NOT_AVAILABLE
  }

  public static getLatencyInMs(startAt: [number, number]): number {
    const diff = hrtime(startAt)

    return Math.floor((diff[0] * 1e9 + diff[1]) / 1e6)
  }

  public static normalizeStringToPascalCase(str: string): string {
    const s = str &&
      (str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || [])
        .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
        .join("")

    return s.slice(0, 1).toLowerCase() + s.slice(1)
  }

  public static normalizeResourceNameToPascalCase(resource: string | Array<string>): string {
    if (typeof resource == "string") {
      return Pensieve.normalizeStringToPascalCase(resource)
    }

    return resource.map(Pensieve.normalizeStringToPascalCase).join(".")
  }
}
