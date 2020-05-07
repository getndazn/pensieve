import { Pensieve } from "../../src"
import * as os from "os"
import {
  mockApplicationData,
  mockInboundRequestData, mockOutboundRequestData,
  mockPartialApplicationData,
  mockPartialInboundRequestData, mockPartialOutboundRequestData
} from "../acme"
import { HTTP_DIRECTION_INBOUND, HTTP_DIRECTION_OUTBOUND, NOT_AVAILABLE } from "../../src/defaults"

jest.useFakeTimers()

describe("Pensieve", () => {

  describe("getApplicationData", () => {

    describe("when Pensieve is instantiated with complete application data", () => {
      test("returns the correct default values", () => {
        const pensieve = new Pensieve(mockApplicationData)
        expect(pensieve.getApplicationData()).toEqual(mockApplicationData)
      })
    })

    describe("when Pensieve is instantiated with partial application data", () => {
      test("returns the correct default values", () => {
        const pensieve = new Pensieve(mockPartialApplicationData)
        expect(pensieve.getApplicationData()).toEqual({
          "appName": mockPartialApplicationData.appName,
          "awsAvailabilityZone": NOT_AVAILABLE,
          "component": mockPartialApplicationData.component,
          "ecsContainerId": NOT_AVAILABLE,
          "ecsServiceName": NOT_AVAILABLE,
          "ecsTaskId": NOT_AVAILABLE,
          "env": "local",
          "commitHash": NOT_AVAILABLE,
          "appVersion": NOT_AVAILABLE,
          "host": os.hostname(),
          "awsRegion": "eu-central-1",
          "serviceType": NOT_AVAILABLE
        })
      })
    })

  })

  describe("getApplicationDataValue", () => {

    describe("when Pensieve is instantiated with complete application data", () => {
      test("returns the correct application data values", () => {
        const pensieve = new Pensieve(mockApplicationData)

        expect(pensieve.getApplicationDataValue(mockApplicationData,"component")).toBe(mockApplicationData.component)
        expect(pensieve.getApplicationDataValue(mockApplicationData,"appName")).toBe(mockApplicationData.appName)
        expect(pensieve.getApplicationDataValue(mockApplicationData, "awsRegion")).toBe(mockApplicationData.awsRegion)
        expect(pensieve.getApplicationDataValue(mockApplicationData, "awsAvailabilityZone")).toBe(mockApplicationData.awsAvailabilityZone)
        expect(pensieve.getApplicationDataValue(mockApplicationData, "host")).toBe(mockApplicationData.host)
        expect(pensieve.getApplicationDataValue(mockApplicationData, "appVersion")).toBe(mockApplicationData.appVersion)
        expect(pensieve.getApplicationDataValue(mockApplicationData, "commitHash")).toBe(mockApplicationData.commitHash)
        expect(pensieve.getApplicationDataValue(mockApplicationData, "serviceType")).toBe(mockApplicationData.serviceType)
        expect(pensieve.getApplicationDataValue(mockApplicationData, "ecsServiceName")).toBe(mockApplicationData.ecsServiceName)
        expect(pensieve.getApplicationDataValue(mockApplicationData, "ecsTaskId")).toBe(mockApplicationData.ecsTaskId)
      })
    })

    describe("when Pensieve is instantiated with partial application data", () => {
      test("returns the given default value for missing data", () => {
        const pensieve = new Pensieve(mockPartialApplicationData)
        const defaultValue = "default-value"
        expect(pensieve.getApplicationDataValue(mockPartialApplicationData, "host", defaultValue)).toBe(defaultValue)
      })
      test("returns the fallback default value for missing data", () => {
        const pensieve = new Pensieve(mockPartialApplicationData)
        expect(pensieve.getApplicationDataValue(mockPartialApplicationData, "host")).toBe(NOT_AVAILABLE)
      })
    })
  })

  describe("getInboundHttpRequestContext", () => {
    describe("when an upstream dependency is provided", () => {
      test("returns the correct attributes for an inbound request", () => {
        const pensieve = new Pensieve(mockApplicationData)
        expect(pensieve.getInboundHttpRequestContext(mockInboundRequestData)).toEqual({
          "httpRequestDirection": HTTP_DIRECTION_INBOUND,
          "httpMethod": mockInboundRequestData.httpMethod,
          "source": mockInboundRequestData.source,
          "target": NOT_AVAILABLE,
          "httpResponseCode": "500",
          "routePath": mockInboundRequestData.routePath,
          "apiVersion": NOT_AVAILABLE
        })
      })
    })

    describe("when an upstream dependency is not provided", () => {
      test("returns the correct attributes for an inbound request", () => {
        const pensieve = new Pensieve(mockApplicationData)
        expect(pensieve.getInboundHttpRequestContext(mockPartialInboundRequestData)).toEqual({
          "httpRequestDirection": HTTP_DIRECTION_INBOUND,
          "httpMethod": mockPartialInboundRequestData.httpMethod,
          "source": NOT_AVAILABLE,
          "target": NOT_AVAILABLE,
          "httpResponseCode": "500",
          "routePath": mockPartialInboundRequestData.routePath,
          "apiVersion": NOT_AVAILABLE
        })
      })
    })
  })

  describe("getOutboundHttpRequestContext", () => {

    describe("when a response status code is provided", () => {
      test("returns the correct attributes for an outbound request", () => {
        const pensieve = new Pensieve(mockApplicationData)
        expect(pensieve.getOutboundHttpRequestContext(mockOutboundRequestData)).toEqual({
          "httpRequestDirection": HTTP_DIRECTION_OUTBOUND,
          "httpMethod": mockOutboundRequestData.httpMethod,
          "source": NOT_AVAILABLE,
          "target": mockOutboundRequestData.target,
          "httpResponseCode": "500",
          "routePath": mockOutboundRequestData.routePath,
          "apiVersion": NOT_AVAILABLE
        })
      })
    })

    describe("when a response status code is not provided", () => {
      test("returns the correct attributes for an outbound request", () => {
        const pensieve = new Pensieve(mockApplicationData)
        expect(pensieve.getOutboundHttpRequestContext(mockPartialOutboundRequestData)).toEqual({
          "httpRequestDirection": HTTP_DIRECTION_OUTBOUND,
          "httpMethod": mockPartialOutboundRequestData.httpMethod,
          "source": NOT_AVAILABLE,
          "target": mockPartialOutboundRequestData.target,
          "httpResponseCode": NOT_AVAILABLE,
          "routePath": mockPartialOutboundRequestData.routePath,
          "apiVersion": NOT_AVAILABLE
        })
      })
    })
  })

  describe("getECSMetadataContext", () => {
    beforeEach(() => {
      process.env = {}
    })

    test("returns empty object if metadata file path was not set", () => {
      const pensieve = new Pensieve(mockApplicationData, true)
      expect(pensieve.getECSMetadataContext()).toEqual({})
    })

    test("returns empty object if no metadata file was found", () => {
      process.env.ECS_CONTAINER_METADATA_FILE = "some/random/path.json"
      const pensieve = new Pensieve(mockApplicationData)
      expect(pensieve.getECSMetadataContext()).toEqual({})
    })

    test("returns all metadata attributes if flag is set to true and the file exists", () => {
      process.env.ECS_CONTAINER_METADATA_FILE = __dirname + "/../resources/ECS_metadata.json"
      const pensieve = new Pensieve(mockApplicationData, true)
      expect(pensieve.getECSMetadataContext()).toEqual({
        cluster: "test-cluster",
        ecsTaskId: "2b88376d-aba3-4950-9ddf-bcb0f388a40c",
        containerName: "test-container-name",
        containerInstanceArn: "arn:aws:ecs:region:acc:container-instance/test-cluster/1f73d099-b914-411c-a9ff-81633b7741dd",
        ecsServiceName: "simple-app-service-name",
        containerId: "aec2557997f4eed9b280c2efd7afccdced",
        dockerContainerName: "/ecs-console-example-app-1-e4e8e495e8baa5de1a00",
        imageId: "sha256:2ae34abc2ed0a22e280d17e13f",
        availabilityZone: "us-east-1b"
      })
    })

    test("returns all metadata attributes if flag is set to false and the file exists", () => {
      process.env.ECS_CONTAINER_METADATA_FILE = "some/random/path.json"
      const pensieve = new Pensieve(mockApplicationData, false)
      expect(pensieve.getECSMetadataContext()).toEqual({})
    })
  })

  describe("getLatencyInMs", () => {
    test("returns the correct latency after 1 second", () => {
      const now = process.hrtime()
      setTimeout(() => {
        const latency = Pensieve.getLatencyInMs(now)
        expect(latency).toBe(1000)
      }, 1000)
    })

    test("returns the correct latency after less than second", () => {
      const now = process.hrtime()
      setTimeout(() => {
        const latency = Pensieve.getLatencyInMs(now)
        expect(latency).toBe(834)
      }, 834)
    })
  })

  describe("normalizeResourceNameToPascalCase", () => {
    describe("when a string is passed", () => {
      test("returns a string in the correct format, if the string contains trailing spaces", () => {
        expect(Pensieve.normalizeResourceNameToPascalCase(" string to normalize   ")).toEqual("stringToNormalize")
      })
      test("returns a string in the correct format, if the string contains weird characters", () => {
        expect(Pensieve.normalizeResourceNameToPascalCase("/string+/.to=_normalize ")).toEqual("stringToNormalize")
      })
      test("returns an empty string, if the string is invalid", () => {
        expect(Pensieve.normalizeResourceNameToPascalCase("  ")).toEqual("")
      })
    })

    describe("when an array of strings is passed", () => {
      test("returns a string in the correct format, if the strings contains weird characters", () => {
        expect(Pensieve.normalizeResourceNameToPascalCase([ " string to normalize   ", "another/string+/.to=_normalize " ])).toEqual("stringToNormalize.anotherStringToNormalize")
      })
    })
  })
})
