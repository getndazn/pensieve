import { Pensieve, TimingMetric } from "../../../src"
import { StatsD } from "hot-shots"
import { StatsDService } from "../../../src/metrics"
import { TestUtil } from "../../TestUtil"
import {
  mockApplicationData,
  mockDefaultAttributes,
  mockInboundRequestAttributes,
  mockInboundRequestData,
  mockOutboundRequestAttributes,
  mockOutboundRequestData
} from "../../acme"
import { HistogramMetric, HTTPRequestMetric, IncrementMetric, GaugeMetric } from "../../../src/types"
import { Times, It } from "typemoq"
import {
  DEFAULT,
  HTTP_DIRECTION_INBOUND,
  HTTP_DIRECTION_OUTBOUND,
  NOT_AVAILABLE
} from "../../../src/defaults"
import { LoggerInterface } from "../../../src/services/LoggerInterface"

describe("StatsdService", () => {

  // Prepare

  const statsDClientInstanceMock = TestUtil.mockOfInstance<StatsD>(new StatsD(), false)
  statsDClientInstanceMock.setup(x => x.histogram(It.isAny(), It.isAny(), It.isAny())).returns(() => {})
  statsDClientInstanceMock.setup(x => x.gauge(It.isAny(), It.isAny(), It.isAny())).returns(() => {})
  statsDClientInstanceMock.setup(x => x.increment(It.isAny(), It.isAny())).returns(() => {})
  statsDClientInstanceMock.setup(x => x.timing(It.isAny(), It.isAny())).returns(() => {})

  const pensieveInstanceMock = TestUtil.mockOfInstance<Pensieve>(new Pensieve(mockApplicationData), false)
  pensieveInstanceMock.setup(x => x.getApplicationDataValue(mockApplicationData, It.isAny())).returns(() => DEFAULT)
  pensieveInstanceMock.setup(x => x.getApplicationData()).returns(() => mockDefaultAttributes)
  pensieveInstanceMock.setup(x => x.getOutboundHttpRequestContext(It.isAny())).returns(() => mockOutboundRequestAttributes)
  pensieveInstanceMock.setup(x => x.getInboundHttpRequestContext(It.isAny())).returns(() => mockInboundRequestAttributes)

  const loggerMock = TestUtil.mock<LoggerInterface>(false)
  loggerMock.setup(x => x.debug(It.isAny())).returns(() => {})

  const getStatsdServiceInstance = (): StatsDService => new StatsDService(
    pensieveInstanceMock.object,
    statsDClientInstanceMock.object,
    loggerMock.object
  )

  const submitAndGetHTTPMetric = (): HTTPRequestMetric => {
    const metric: HTTPRequestMetric = {
      attributes: { foo: "bar", appName: "pensieve", awsRegion: "eu-central-1" },
      key: "latency",
      kind: "timing",
      value: "123"
    }

    const statsdService = getStatsdServiceInstance()
    statsdService.submit(metric)

    return metric
  }

  const submitAndGetIncrementMetric = (): IncrementMetric => {
    const metric: IncrementMetric = {
      attributes: { biz: "baz", appName: "pensieve", awsRegion: "eu-central-1" },
      key: "event",
      kind: "increment"
    }

    const statsdService = getStatsdServiceInstance()
    statsdService.submit(metric)

    return metric
  }

  const submitAndGetHistogramMetric = (): HistogramMetric => {
    const metric: HistogramMetric = {
      attributes: { hello: "world", appName: "pensieve", awsRegion: "eu-central-1" },
      key: "dummy",
      value: "234",
      kind: "histogram"
    }

    const statsdService = getStatsdServiceInstance()
    statsdService.submit(metric)

    return metric
  }

  const submitAndGetGaugeMetric = (): GaugeMetric => {
    const metric: GaugeMetric = {
      attributes: { hello: "world", appName: "pensieve", awsRegion: "eu-central-1" },
      key: "dummy",
      value: "234",
      kind: "gauge"
    }

    const statsdService = getStatsdServiceInstance()
    statsdService.submit(metric)

    return metric
  }

  const submitAndGetTimingMetric = (): TimingMetric => {
    const metric: TimingMetric = {
      attributes: { hello: "world", appName: "pensieve", awsRegion: "eu-central-1" },
      key: "dummy",
      value: "234",
      kind: "timing"
    }

    const statsdService = getStatsdServiceInstance()
    statsdService.submit(metric)

    return metric
  }

  beforeEach(() => {
    pensieveInstanceMock.reset()
    statsDClientInstanceMock.reset()
  })

  describe("submit", () => {

    describe("when a metric of type HTTPRequestMetric is submitted", () => {
      test("the statsD client submits a timing metric correctly", () => {
        // Act
        const metric = submitAndGetHTTPMetric()
        // Assert
        const expectedStatsDTags = {
          "appName":"pensieve",
          "awsAvailabilityZone": "eu-central-1a",
          "component":"api",
          "env":"local",
          "appVersion":"0.0.1",
          "host":"hostname",
          "awsRegion":"eu-central-1",
          "ecsServiceName":"pensieve-dev",
          "serviceType":"ECS",
          "ecsTaskId":"current-task-id",
          "ecsContainerId":"yadda",
          "commitHash":"xxxxxx",
          "foo":"bar"
        }

        const expectedStatsDValue = Number(metric.value)
        statsDClientInstanceMock.verify(x => x.timing(metric.key, expectedStatsDValue, expectedStatsDTags), Times.once())
      })
    })

    describe("when a metric of type IncrementMetric is submitted", () => {
      test("the statsD client submits a metric correctly", () => {
        // Act
        const metric = submitAndGetIncrementMetric()
        // Assert
        const expectedStatsDTags = {
          "appName":"pensieve",
          "awsAvailabilityZone": "eu-central-1a",
          "component":"api",
          "env":"local",
          "appVersion":"0.0.1",
          "host":"hostname",
          "awsRegion":"eu-central-1",
          "ecsServiceName":"pensieve-dev",
          "serviceType":"ECS",
          "ecsTaskId":"current-task-id",
          "ecsContainerId":"yadda",
          "commitHash":"xxxxxx",
          "biz":"baz"
        }

        statsDClientInstanceMock.verify(x => x.increment(metric.key, expectedStatsDTags), Times.once())
      })
    })

    describe("when a metric of type HistogramMetric is submitted", () => {
      test("the statsD client submits a the metric correctly", () => {
        // Act
        const metric = submitAndGetHistogramMetric()
        // Assert
        const expectedStatsDTags = {
          "appName":"pensieve",
          "awsAvailabilityZone": "eu-central-1a",
          "component":"api",
          "env":"local",
          "appVersion":"0.0.1",
          "host":"hostname",
          "awsRegion":"eu-central-1",
          "ecsServiceName":"pensieve-dev",
          "serviceType":"ECS",
          "ecsTaskId":"current-task-id",
          "ecsContainerId":"yadda",
          "commitHash":"xxxxxx",
          "hello":"world"
        }

        const expectedStatsDValue = Number(metric.value)
        statsDClientInstanceMock.verify(x => x.histogram(metric.key, expectedStatsDValue, expectedStatsDTags), Times.once())
      })
    })

    describe("when a metric of type GaugeMetric is submitted", () => {
      test("the statsD client submits a metric correctly", () => {
        // Act
        const metric = submitAndGetGaugeMetric()
        // Assert
        const expectedStatsDTags = {
          "appName":"pensieve",
          "awsAvailabilityZone": "eu-central-1a",
          "component":"api",
          "env":"local",
          "appVersion":"0.0.1",
          "host":"hostname",
          "awsRegion":"eu-central-1",
          "ecsServiceName":"pensieve-dev",
          "serviceType":"ECS",
          "ecsTaskId":"current-task-id",
          "ecsContainerId":"yadda",
          "commitHash":"xxxxxx",
          "hello":"world"
        }

        const expectedStatsDValue = Number(metric.value)
        statsDClientInstanceMock.verify(x => x.gauge(metric.key, expectedStatsDValue, expectedStatsDTags), Times.once())
      })
    })

    describe("when a metric of type TimingMetric is submitted", () => {
      test("the statsD client submits a metric correctly", () => {
        // Act
        const metric = submitAndGetTimingMetric()
        // Assert
        const expectedStatsDTags = {
          "appName":"pensieve",
          "awsAvailabilityZone": "eu-central-1a",
          "component":"api",
          "env":"local",
          "appVersion":"0.0.1",
          "host":"hostname",
          "awsRegion":"eu-central-1",
          "ecsServiceName":"pensieve-dev",
          "serviceType":"ECS",
          "ecsTaskId":"current-task-id",
          "ecsContainerId":"yadda",
          "commitHash":"xxxxxx",
          "hello":"world"
        }

        const expectedStatsDValue = Number(metric.value)
        statsDClientInstanceMock.verify(x => x.timing(metric.key, expectedStatsDValue, expectedStatsDTags), Times.once())
      })
    })
  })

  describe("submitOutboundRequestMetric method", () => {
    describe("when custom attributes are provided", () => {

      // Prepare
      const statsDService = getStatsdServiceInstance()
      const submitSpy = jest.spyOn(statsDService, "submit")
      // Act
      statsDService.submitOutboundRequestMetric(mockOutboundRequestData, { custom: "attribute" })

      afterAll(() => {
        submitSpy.mockRestore()
      })

      // Assert
      test("the statsD client is invoked", () => {
        expect(submitSpy).toHaveBeenCalledTimes(1)
      })
      test("the statsD client is invoked with the correct parameters", () => {
        statsDService.submitOutboundRequestMetric(mockOutboundRequestData, { custom: "attribute" })

        const expectedSubmittedMetric = {
          attributes: {
            ecsContainerId: "yadda",
            ecsServiceName: "pensieve-dev",
            ecsTaskId: "current-task-id",
            appName: "pensieve",
            awsAvailabilityZone: "eu-central-1a",
            component: "api",
            env: "local",
            commitHash: "xxxxxx",
            appVersion: "0.0.1",
            host: "hostname",
            awsRegion: "eu-central-1",
            serviceType: "ECS",
            custom: "attribute",
            httpRequestDirection: HTTP_DIRECTION_OUTBOUND,
            httpMethod: "GET",
            source: NOT_AVAILABLE,
            target: "subscriptions",
            httpResponseCode: "500",
            routePath: "route-path",
            apiVersion: NOT_AVAILABLE
          },
          key: "latency",
          kind: "timing",
          value: expect.any(String)
        }
        expect(submitSpy.mock.calls[0][0]).toEqual(expectedSubmittedMetric)
      })
    })

    describe("when no custom attributes are provided", () => {

      // Prepare
      const statsDService = getStatsdServiceInstance()
      const submitSpy = jest.spyOn(statsDService, "submit")

      afterAll(() => {
        submitSpy.mockRestore()
      })

      // Act
      statsDService.submitOutboundRequestMetric(mockOutboundRequestData)

      // Assert
      test("the statsD client is invoked", () => {
        expect(submitSpy).toHaveBeenCalledTimes(1)
      })
      test("the statsD client is invoked with the correct parameters", () => {
        const expectedSubmittedMetric = {
          attributes: {
            ecsContainerId: "yadda",
            ecsServiceName: "pensieve-dev",
            ecsTaskId: "current-task-id",
            appName: "pensieve",
            awsAvailabilityZone: "eu-central-1a",
            component: "api",
            env: "local",
            commitHash: "xxxxxx",
            appVersion: "0.0.1",
            host: "hostname",
            httpRequestDirection: HTTP_DIRECTION_OUTBOUND,
            httpMethod: "GET",
            source: NOT_AVAILABLE,
            target: "subscriptions",
            httpResponseCode: "500",
            awsRegion: "eu-central-1",
            routePath: "route-path",
            apiVersion: NOT_AVAILABLE,
            serviceType: "ECS"
          },
          key: "latency",
          kind: "timing",
          value: expect.any(String)
        }
        expect(submitSpy.mock.calls[0][0]).toEqual(expectedSubmittedMetric)
      })
    })
  })

  describe("submitInboundRequestMetric method", () => {
    describe("when custom attributes are provided", () => {

      // Prepare
      const statsDService = getStatsdServiceInstance()
      const submitSpy = jest.spyOn(statsDService, "submit")
      // Act
      statsDService.submitInboundRequestMetric(mockInboundRequestData, { custom: "attribute" })

      afterAll(() => {
        submitSpy.mockRestore()
      })

      // Assert
      test("the statsD client is invoked", () => {
        expect(submitSpy).toHaveBeenCalledTimes(1)
      })
      test("the statsD client is invoked with the correct parameters", () => {
        const expectedSubmittedMetric = {
          attributes: {
            ecsContainerId: "yadda",
            ecsServiceName: "pensieve-dev",
            ecsTaskId: "current-task-id",
            appName: "pensieve",
            awsAvailabilityZone: "eu-central-1a",
            component: "api",
            env: "local",
            commitHash: "xxxxxx",
            appVersion: "0.0.1",
            host: "hostname",
            awsRegion: "eu-central-1",
            serviceType: "ECS",
            custom: "attribute",
            httpRequestDirection: HTTP_DIRECTION_INBOUND,
            httpMethod: "GET",
            source: "user-management",
            target: NOT_AVAILABLE,
            httpResponseCode: "500",
            routePath: "route-path",
            apiVersion: NOT_AVAILABLE
          },
          key: "latency",
          kind: "timing",
          value: expect.any(String)
        }
        expect(submitSpy.mock.calls[0][0]).toEqual(expectedSubmittedMetric)
      })
    })

    describe("when no custom attributes are provided", () => {

      // Prepare
      const statsDService = getStatsdServiceInstance()
      const submitSpy = jest.spyOn(statsDService, "submit")

      afterAll(() => {
        submitSpy.mockRestore()
      })

      // Act
      statsDService.submitInboundRequestMetric(mockInboundRequestData)

      // Assert
      test("the statsD client is invoked", () => {
        expect(submitSpy).toHaveBeenCalledTimes(1)
      })
      test("the statsD client is invoked with the correct parameters", () => {
        const expectedSubmittedMetric = {
          attributes: {
            ecsContainerId: "yadda",
            ecsServiceName: "pensieve-dev",
            ecsTaskId: "current-task-id",
            appName: "pensieve",
            awsAvailabilityZone: "eu-central-1a",
            component: "api",
            env: "local",
            commitHash: "xxxxxx",
            appVersion: "0.0.1",
            host: "hostname",
            awsRegion: "eu-central-1",
            serviceType: "ECS",
            httpRequestDirection: HTTP_DIRECTION_INBOUND,
            httpMethod: "GET",
            source: "user-management",
            target: NOT_AVAILABLE,
            httpResponseCode: "500",
            routePath: "route-path",
            apiVersion: NOT_AVAILABLE
          },
          key: "latency",
          kind: "timing",
          value: expect.any(String)
        }
        expect(submitSpy.mock.calls[0][0]).toEqual(expectedSubmittedMetric)
      })
    })
  })
})
