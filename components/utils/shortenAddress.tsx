export function shortenAddress(string: string | undefined) {
    if (string === undefined) {
      return ""
    } else {
      return string.substring(0, 4) + "..." + string.substring(string.length - 4, string.length)
    }
  }