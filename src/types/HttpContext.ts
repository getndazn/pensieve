type HttpRequestContextKey = "httpResponseCode" | "httpMethod" | "source" | "target" | "httpRequestDirection" | "routePath" | "apiVersion"

type HttpRequestContext = {
  [key in HttpRequestContextKey]: string;
}

export {
  HttpRequestContextKey,
  HttpRequestContext
}
