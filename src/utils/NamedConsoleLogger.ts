import { ConsoleLogger, LogLevel, Logger } from "@aries-framework/core"

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
} as const

export class NamedConsoleLogger implements Logger {
  private name: string
  public logLevel: LogLevel
  private color: string
  private clog: ConsoleLogger

  public constructor(
    logLevel: LogLevel,
    name: string,
    color: keyof typeof colors
  ) {
    this.name = name
    this.logLevel = logLevel
    this.clog = new ConsoleLogger(logLevel)
    this.color = colors[color]
  }

  public test(message: string, data?: Record<string, any> | undefined): void {
    this.clog.test(
      `[${this.color}${this.name}${colors.reset}]: ${message}`,
      data
    )
  }
  public trace(message: string, data?: Record<string, any> | undefined): void {
    this.clog.trace(
      `[${this.color}${this.name}${colors.reset}]: ${message}`,
      data
    )
  }
  public debug(message: string, data?: Record<string, any> | undefined): void {
    this.clog.debug(
      `[${this.color}${this.name}${colors.reset}]: ${message}`,
      data
    )
  }
  public info(message: string, data?: Record<string, any> | undefined): void {
    this.clog.info(
      `[${this.color}${this.name}${colors.reset}]: ${message}`,
      data
    )
  }
  public warn(message: string, data?: Record<string, any> | undefined): void {
    this.clog.warn(
      `[${this.color}${this.name}${colors.reset}]: ${message}`,
      data
    )
  }
  public error(message: string, data?: Record<string, any> | undefined): void {
    this.clog.error(
      `[${this.color}${this.name}${colors.reset}]: ${message}`,
      data
    )
  }
  public fatal(message: string, data?: Record<string, any> | undefined): void {
    this.clog.fatal(
      `[${this.color}${this.name}${colors.reset}]: ${message}`,
      data
    )
  }
}
