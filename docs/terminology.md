# Terminology
The following terms are used throughout this library.

## appName
The name of your service.  
For example `content-portability`.

## attributes
A set of key-value pairs that are assigned to each metric by Pensieve.  
Attributes are important because they provide context and they can be used to filter metrics and build different widgets in your dashboards.  
Examples: AWS region, response status code.

## target
In systems consisting of microservices (or distributed system in general), there is a chain of downstream and upstream services.  
A target is a service that consumes data from you (as event or HTTP transaction).    

For example:  
Service A calls service B which calls service C, via HTTP.  
``service A -> service B -> service C``  
Service C is the target of service B.  
Service B is the target of service A.  

## hot-shots
A Node.js client for StatsD.  
It's a NPM library used in Pensieve to send metrics to the StatsD agent.  
More information can be found [here](https://github.com/brightcove/hot-shots).

## inbound requests
An HTTP requests satisfied by your (Express.js) application.  
Metrics related to inbound requests have attributes that describe:
- the HTTP request itself (HTTP method, uri, source, and more);
- the HTTP response returned by your (Express.js) app (latency in milliseconds, the status code returned to the client, and more);  
See also [outbound requests](#outbound-requests).

## metric
A metric represents a property of your system at a certain time.    
A metrics typically has:
- a **key** - for example `latency`;
- a **value** - for example `320` milliseconds;
- a set of **attributes** - key-value pairs, useful and necessary to filter metrics and create dashboard widgets;

## outbound requests
The HTTP requests originated from your application.  
They are performed by your own Node.js code to external webservices, typically using libraries such as Needle, Axios, or Node.js HTTP client.  
Outbound requests are typically sent to other backend microservices, or external web services (`Salesforce API`).    
Metrics related to outbound requests have attributes that describe:
- the HTTP request itself (HTTP method, uri, target, and more);
- the HTTP response returned by the server (latency in milliseconds, the status code returned, and more);  
See also [inbound requests](#inbound-requests).

## statsD

A network daemon that constantly listens for statistics, like counters and timers, sent by Pensieve over UDP or TCP, and it aggregates them and sends them to one or more pluggable backend services (Datadog, New Relic).  
Most monitoring tools provide StatsD libraries you can install/enable in your hosts to send the collected aggregated metrics to their own API's
(e.g., [Datadog](https://docs.datadoghq.com/integrations/statsd/#host) or [New Relic](https://docs.newrelic.com/docs/integrations/host-integrations/host-integrations-list/statsd-monitoring-integration)).  
More information about statsD can be found [here](https://github.com/statsd/statsd).


## source
A source is represents the origin of an event or HTTP request consumed by your application.  
In systems consisting of microservices (or distributed systems in general), there is a chain of downstream and upstream services.     
For example:  
Service A calls service B which calls service C, via HTTP.  
``service A -> service B -> service C``  
Service A is the source of service B.  
Service B is the source of service C.  
