import { StatsD } from "hot-shots"
import { Pensieve } from "../Pensieve"
import {
  GaugeMetric,
  HistogramMetric,
  TimingMetric,
  HTTPRequestMetric,
  IncrementMetric,
  CustomAttributes,
  InboundRequestData,
  OutboundRequestData,
  InputMetric
} from "../types"
import { MetricsServiceInterface } from "."
import { LoggerInterface } from "../services/LoggerInterface"

export class StatsDService implements MetricsServiceInterface {

  protected pensieve: Pensieve
  protected statsDClient: StatsD
  protected logger: LoggerInterface

  public constructor(pensieve: Pensieve, statsDClient: StatsD, logger: LoggerInterface) {
    this.pensieve = pensieve
    this.statsDClient = statsDClient
    this.logger = logger
  }

  public submit(metric: InputMetric): void {
    metric.attributes = {
      ...this.pensieve.getApplicationData(),
      ...metric.attributes as CustomAttributes
    }

    switch (metric.kind) {
      case "histogram": {
        this.submitHistogram(metric)
        break
      }
      case "increment": {
        this.submitIncrement(metric)
        break
      }
      case "gauge": {
        this.submitGauge(metric)
        break
      }
      case "timing": {
        this.submitTiming(metric)
        break
      }
    }

    this.logger.debug({
      message: `Submitted StatsD metric`,
      private: { metric }
    })

  }

  public submitOutboundRequestMetric(outboundRequestData: OutboundRequestData, customAttributes: CustomAttributes = {}): void {
    const outboundRequestMetric: HTTPRequestMetric = {
      kind: "timing",
      key: "latency",
      value: Pensieve.getLatencyInMs(outboundRequestData.startAt).toString(),
      attributes: {
        ...this.pensieve.getApplicationData(),
        ...this.pensieve.getOutboundHttpRequestContext(outboundRequestData),
        ...customAttributes
      }
    }

    this.submit(outboundRequestMetric)
  };

  public submitInboundRequestMetric(inboundRequestData: InboundRequestData, customAttributes: CustomAttributes = {}): void {
    const inboundRequestMetric: HTTPRequestMetric = {
      kind: "timing",
      key: "latency",
      value: Pensieve.getLatencyInMs(inboundRequestData.startAt).toString(),
      attributes: {
        ...this.pensieve.getApplicationData(),
        ...this.pensieve.getInboundHttpRequestContext(inboundRequestData),
        ...customAttributes
      }
    }

    this.submit(inboundRequestMetric)
  }

  protected submitTiming(metric: TimingMetric): void {
    return this.statsDClient.timing(
      Pensieve.normalizeResourceNameToPascalCase(metric.key),
      Number(metric.value),
      metric.attributes
    )
  }

  protected submitHistogram(metric: HistogramMetric): void {
    return this.statsDClient.histogram(
      Pensieve.normalizeResourceNameToPascalCase(metric.key),
      Number(metric.value),
      metric.attributes
    )
  }

  protected submitIncrement(metric: IncrementMetric): void {
    return this.statsDClient.increment(
      Pensieve.normalizeResourceNameToPascalCase(metric.key),
      metric.attributes
    )
  }

  protected submitGauge(metric: GaugeMetric): void {
    return this.statsDClient.gauge(
      Pensieve.normalizeResourceNameToPascalCase(metric.key),
      Number(metric.value),
      metric.attributes
    )
  }

}
