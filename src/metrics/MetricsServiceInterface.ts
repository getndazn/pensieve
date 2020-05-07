import { CustomAttributes, InboundRequestData, OutboundRequestData } from "../types"

interface MetricsServiceInterface {

  submitInboundRequestMetric(inboundRequestData: InboundRequestData, customAttributes?: CustomAttributes): void
  submitOutboundRequestMetric(outboundRequestData: OutboundRequestData, customAttributes?: CustomAttributes): void

}

export {
  MetricsServiceInterface
}
