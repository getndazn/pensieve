import { hrtime } from "process"
import { Request, Response, NextFunction } from "express"
import { MetricsServiceInterface } from "../metrics"
import { CustomAttributes } from "../types"
import { Route } from "../types"

export const inboundRequest = (metricsService: MetricsServiceInterface, route: Route, getCustomMetricTagsFn?: (req: Request, res?: Response) => CustomAttributes) => (req: Request, res: Response, next: NextFunction): void => {

  const startAt = hrtime()
  let customAttributes: CustomAttributes = {}

  const submitMetric = (contextualAttributes: CustomAttributes = {}): void => {
    if (getCustomMetricTagsFn) {
      customAttributes = getCustomMetricTagsFn(req, res)
    }
    metricsService.submitInboundRequestMetric({
      httpMethod: req.method,
      source: req.header("user-agent"),
      httpResponseCode: res.statusCode,
      routePath: route.path,
      apiVersion: route.version,
      startAt
    }, { ...customAttributes, ...contextualAttributes })
  }

  res.on("finish", submitMetric)

  next()
}

