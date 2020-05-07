type RequestData = {
  httpMethod: string
  startAt: [number, number]
  routePath: string
  apiVersion?: string
  httpResponseCode?: number
  source?: string
  target?: string
}

type InboundRequestData = RequestData & {
  httpResponseCode: number
}

type OutboundRequestData = RequestData & {
  target: string
}

export {
  RequestData,
  InboundRequestData,
  OutboundRequestData
}
