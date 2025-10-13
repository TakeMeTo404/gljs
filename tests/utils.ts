export const matrixToArray = (m: any) => {
  let result: number[] = []

  let i = 0
  while (m[i]) {
    let j = 0
    while (typeof m[i][j] === 'number') {
      result.push(m[i][j])
      j++
    }

    i++
  }

  return result
}
