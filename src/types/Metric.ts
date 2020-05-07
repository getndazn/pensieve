import { MetricAttributes } from "./MetricAttributes"

type IncrementMetricKind = "increment"
type IncrementMetric = {
  kind: IncrementMetricKind
  key: string
  attributes: MetricAttributes
}

type GaugeMetricKind = "gauge"
type GaugeMetric = {
  key: string
  kind: GaugeMetricKind
  value: string
  attributes: MetricAttributes
}

type HistogramMetricKind = "histogram"
type HistogramMetric = {
  key: string
  kind: HistogramMetricKind
  value: string
  attributes: MetricAttributes
}

type TimingMetricKind = "timing"
type TimingMetric = {
  key: string
  kind: TimingMetricKind
  value: string
  attributes: MetricAttributes
}

type HTTPRequestMetricKey = "latency"
type HTTPRequestMetric = HistogramMetric | TimingMetric & {
  key: HTTPRequestMetricKey
}

type StandardMetric = HistogramMetric | IncrementMetric | GaugeMetric | TimingMetric

type InputMetric = StandardMetric | HTTPRequestMetric

export {
  TimingMetric,
  HistogramMetricKind,
  GaugeMetricKind,
  IncrementMetricKind,
  InputMetric,
  IncrementMetric,
  HistogramMetric,
  GaugeMetric,
  HTTPRequestMetric
}
