export const log = async (s: string, wait = true) => {
  console.log(`${s}\n`)
  if (wait) await keypress()
}

const keypress = async () => {
  process.stdin.setRawMode(true)
  return new Promise<void>((resolve) =>
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false)
      resolve()
    })
  )
}
