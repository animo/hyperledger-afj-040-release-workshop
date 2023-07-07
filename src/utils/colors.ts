export const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  underscore: "\x1b[4m",
} as const

export const green = (s: string) => `${colors.green}${s}${colors.reset}`
export const yellow = (s: string) => `${colors.yellow}${s}${colors.reset}`
export const cyan = (s: string) => `${colors.cyan}${s}${colors.reset}`
export const underscore = (s: string) =>
  `${colors.underscore}${s}${colors.reset}`
