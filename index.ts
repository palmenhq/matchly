import { anySingle, any, Matcher, rest } from './matchers'
import { last } from './utils'

export type PatternAndBranch<T, R = T> = [
  T | Matcher | undefined,
  (matched: T) => R
]

const NOOP = {}

export const switchyBase = <T, R>(
  patternsAndBranches: PatternAndBranch<T, R>[]
) => {
  return (match: T): R | undefined =>
    patternsAndBranches
      .map(patternAndBranch => {
        const pattern = patternAndBranch[0]
        const branch = patternAndBranch[1]

        if (pattern !== any && typeof pattern !== typeof match) {
          throw new TypeError(
            `Invalid match of type "${typeof match}" provided, expected "${typeof pattern}"`
          )
        }

        if (pattern instanceof Array && match instanceof Array) {
          if (pattern.length !== match.length && last(pattern) !== rest) {
            throw new TypeError(
              `Expected a match of length ${
                pattern.length
              } but got match with length ${match.length}`
            )
          }

          if (pattern.indexOf(rest) !== pattern.length - 1 && pattern.indexOf(rest) !== -1) {
            throw new TypeError('rest operator can only be placed last in pattern')
          }

          const result = pattern.filter(
            (value, index) => {
              return value === rest || value === anySingle || value === match[index]
            }
          )

          if (last(pattern) === rest && result.length - 1 === pattern.indexOf(rest)) {
            return branch(match)
          }

          if (result.length === match.length) {
            return branch(match)
          }

          return NOOP
        }

        if (pattern === match) {
          return branch(match)
        }

        if (pattern === any) {
          return branch(match)
        }

        return NOOP
      })
      .filter(result => result !== NOOP)[0] as R | undefined
}

export interface ReturnsMatcher {
  () : any | Matcher
}

export const switchy = Object.assign(switchyBase, {
  anySingle: (() => anySingle) as ReturnsMatcher,
  any: (() => any) as ReturnsMatcher,
  rest: (() => rest) as ReturnsMatcher,
})
