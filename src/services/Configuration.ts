export class EnvironmentVariableNotFound extends Error {
  public constructor(varName: string) {
    super(`Environment variable '${varName}' not found.`)
  }
}

export class Configuration {

  /** @throws {EnvironmentVariableNotFound} */
  public static get(name: string, required: boolean = false): string {
    const value = process.env[name]

    if (!value && required) {
      throw new EnvironmentVariableNotFound(name)
    }

    // @ts-ignore
    return value
  }
}
