import { inboundRequest } from "../../../src/middleware"
import {
  mockApplicationData,
  mockDefaultAttributes, mockInboundRequestAttributes,
  mockOutboundRequestAttributes,
} from "../../acme"
import { DEFAULT } from "../../../src/defaults"
import { TestUtil } from "../../TestUtil"
import { Pensieve } from "../../../src"
import { StatsD } from "hot-shots"
import { StatsDService } from "../../../src/metrics"
import { It } from "typemoq"
import { Request, Response, NextFunction } from "express"
import { CustomAttributes } from "../../../src/types"
import { LoggerInterface } from "../../../src/services/LoggerInterface"

describe("inboundRequest", () => {

  // Prepare

  const statsDClientInstanceMock = TestUtil.mockOfInstance<StatsD>(new StatsD(), false)
  statsDClientInstanceMock.setup(x => x.histogram(It.isAny(), It.isAny(), It.isAny())).returns(() => {})
  statsDClientInstanceMock.setup(x => x.increment(It.isAny(), It.isAny())).returns(() => {})

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

  test("calls the next() function once", () => {
    const requestMock = {}
    const responseMock = {
      on: (): void => {}
    }

    const nextFunctionMock: NextFunction = jest.fn()
    const statsDServiceInstance = getStatsdServiceInstance()
    const middleware = inboundRequest(statsDServiceInstance, { path: "dummy-route" })

    middleware(requestMock as Request , responseMock as unknown as Response, nextFunctionMock)
    expect(nextFunctionMock).toHaveBeenCalledTimes(1)
  })

  describe("when no custom attributes are provided", () => {

    test("submits the correct metric when the response has finished", () => {
      // Prepare
      const requestMock = {
        header: (): string => "foo",
        method: "GET"
      }
      const responseMock = {
        on: jest.fn(),
        statusCode: 200
      }

      const nextFunctionMock: NextFunction = jest.fn()
      const statsDServiceInstance = getStatsdServiceInstance()
      const statsDServiceSpy = jest.spyOn(statsDServiceInstance, "submitInboundRequestMetric")
      const middleware = inboundRequest(statsDServiceInstance, { path: "dummy-route" })
      middleware(requestMock as unknown as Request , responseMock as unknown as Response, nextFunctionMock)
      const callback = responseMock.on.mock.calls[0][1]

      // Act
      callback()

      // Assert
      expect(responseMock.on).toHaveBeenCalledTimes(1)
      expect(responseMock.on.mock.calls[0][0]).toBe("finish")

      expect(statsDServiceSpy).toHaveBeenCalledTimes(1)
      expect(statsDServiceSpy.mock.calls[0][0]).toEqual({
        httpMethod: "GET",
        source: "foo",
        httpResponseCode: 200,
        routePath: "dummy-route",
        startAt: expect.anything()
      })

      expect(statsDServiceSpy.mock.calls[0][1]).toEqual({})

      statsDServiceSpy.mockClear()
    })
  })

  describe("when custom attributes are provided", () => {

    const attributesFn = (): CustomAttributes => ({ foo: "bar" })

    test("submits the correct metric when the response has finished", () => {
      // Prepare
      const requestMock = {
        header: (): string => "foo",
        method: "GET"
      }
      const responseMock = {
        on: jest.fn(),
        statusCode: 200
      }

      const nextFunctionMock: NextFunction = jest.fn()
      const statsDServiceInstance = getStatsdServiceInstance()
      const statsDServiceSpy = jest.spyOn(statsDServiceInstance, "submitInboundRequestMetric")

      const middleware = inboundRequest(statsDServiceInstance, { path: "dummy-route" }, attributesFn)
      middleware(requestMock as unknown as Request , responseMock as unknown as Response, nextFunctionMock)
      const callback = responseMock.on.mock.calls[0][1]

      // Act
      callback()

      // Assert
      expect(responseMock.on).toHaveBeenCalledTimes(1)
      expect(responseMock.on.mock.calls[0][0]).toBe("finish")

      expect(statsDServiceSpy).toHaveBeenCalledTimes(1)
      expect(statsDServiceSpy.mock.calls[0][0]).toEqual({
        httpMethod: "GET",
        source: "foo",
        httpResponseCode: 200,
        routePath: "dummy-route",
        startAt: expect.anything()
      })

      expect(statsDServiceSpy.mock.calls[0][1]).toEqual({ foo: "bar" })

      statsDServiceSpy.mockClear()
    })

  })

})
