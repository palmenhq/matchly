export type PatternAndBranch<T, R> = [T | undefined, (matched: T | undefined) => R]

const NOOP = {}

export const switchy = <T, R>(patternsAndBranches: PatternAndBranch<T, R>[]) => {
  return (match: T) : R | undefined => patternsAndBranches.map(patternAndBranch => {
    const pattern = patternAndBranch[0]
    const branch = patternAndBranch[1]

    if (pattern !== undefined && typeof pattern !== typeof match) {
      throw new TypeError(`Invalid match of type "${typeof match}" provided, expected "${typeof pattern}"`)
    }

    if (pattern instanceof Array && match instanceof Array) {
      if (pattern.length !== match.length) {
        throw new TypeError(`Expected a match of length ${pattern.length} but got match with length ${match.length}`)
      }

      const result = pattern.filter((value, index) => value === undefined || value === match[index])

      if (result.length === match.length) {
        return branch(match)
      }

      return NOOP
    }

    if (pattern === match) {
      return branch(match)
    }

    if (pattern === undefined) {
      return branch(match)
    }

    return NOOP
  })
  .filter(result => result !== NOOP)[0] as R | undefined
}
