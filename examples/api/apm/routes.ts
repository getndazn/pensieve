import { Request, Response } from "express"
const axios = require("axios").default
import { metricsService } from "./metrics"
import { AxiosResponse } from "axios"

const axiosInstance = axios.create({
  // Custom HTTP agent settings
})

const outboundRequestRoute = async (req: Request, res: Response): Promise<void | undefined> => {

  let statusCode
  const startAt = process.hrtime()
  try {
    const response: AxiosResponse = await axiosInstance.get( "https://www.google.nl" )
    statusCode = response.status
  } catch (err) {
    // Error handling code here (logging, ...)
  } finally {
    metricsService.submitOutboundRequestMetric({
      httpResponseCode: statusCode,
      target: "target-service",
      httpMethod: "GET",
      routePath: "get_index",
      startAt
    })
  }

  res.json({ foo: "bar" })

}

export { outboundRequestRoute }
