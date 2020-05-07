import { MetricsServiceInterface } from "../../../src/metrics/MetricsServiceInterface"
import { Pensieve } from "../../../src/Pensieve"
import { CustomAttributes, InboundRequestData, OutboundRequestData } from "../../../src/types"
import { addCustomAttributes, recordCustomEvent, setTransactionName } from "newrelic"

class NewRelicAPMService implements MetricsServiceInterface {

  protected pensieve: Pensieve

  public constructor(pensieve: Pensieve) {
    this.pensieve = pensieve
  }

  public submitInboundRequestMetric(inboundRequestData: InboundRequestData, customAttributes: CustomAttributes = {}): void {
    const latency = Pensieve.getLatencyInMs(inboundRequestData.startAt).toString()

    const applicationData = this.pensieve.getApplicationData()
    setTransactionName(Pensieve.normalizeResourceNameToPascalCase([
      applicationData.component,
      inboundRequestData.routePath
    ]))

    addCustomAttributes({
      latency,
      ...applicationData,
      ...this.pensieve.getInboundHttpRequestContext(inboundRequestData),
      ...customAttributes,
    })
  }

  public submitOutboundRequestMetric(outboundRequestData: OutboundRequestData, customAttributes: CustomAttributes = {}): void {
    const applicationData = this.pensieve.getApplicationData()
    const transactionAttributes: CustomAttributes = {
      name: Pensieve.normalizeResourceNameToPascalCase([
        applicationData.component,
        outboundRequestData.routePath
      ]),
      latency: Pensieve.getLatencyInMs(outboundRequestData.startAt).toString(),
      ...applicationData,
      ...this.pensieve.getOutboundHttpRequestContext(outboundRequestData),
      ...customAttributes
    }

    recordCustomEvent("OutboundTransaction", transactionAttributes)
  }

}

export {
  NewRelicAPMService
}
