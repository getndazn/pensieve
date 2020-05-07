import { LoggerInterface } from "../../src/services/LoggerInterface"

type Log = {
  message: string
  private?: {}
}

// Extremely simplified version of a logger.
// This is an example! :-)
class Logger implements LoggerInterface {

  public debug(log: Log): void {
    console.debug(log)
  }

  public error(log: Log): void {
    console.error(log)
  }

  public info(log: Log): void {
    console.info(log)
  }

  public trace(log: Log): void {
    console.trace(log)
  }

  public warn(log: Log): void {
    console.warn(log)
  }

}

const loggerInstance = new Logger()

export {
  loggerInstance
}
