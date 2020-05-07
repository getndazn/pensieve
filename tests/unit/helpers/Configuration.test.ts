import { Configuration, EnvironmentVariableNotFound } from "../../../src/services/Configuration"

describe("Configuration", () => {
  beforeEach(() => {
    process.env = {}
  })

  it("will return the environment variable value", () => {
    process.env.ENV = "testEnvironment"
    expect(Configuration.get("ENV")).toEqual("testEnvironment")
  })

  it("will throw an EnvironmentVariableNotFound when a required variable is not set", () => {
    expect(() => {
      Configuration.get("non-existent", true)
    }).toThrowError(EnvironmentVariableNotFound)
  })

  it("will return undefined when a required variable is not set", () => {
    expect(Configuration.get("non-existent", false)).toEqual(undefined)
  })

  it("will return environment variable's value when it is set", () => {
    process.env.test = "testConfigurationValue"
    expect(Configuration.get("test")).toEqual("testConfigurationValue")
  })
})
