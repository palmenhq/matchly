import { anySingle, any, Matcher, rest } from './matchers'
import { last } from './utils'

export interface BranchFunction<T, R = T> {
  (matched: T): R
}

export type PatternAndBranch<T, R = T> = [
  T | Matcher | undefined,
  R | BranchFunction<T, R>
]

const NOOP = {}

export const matchlyBase = <T, R>(
  patternsAndBranches: PatternAndBranch<T, R>[]
) => (match: T): R | undefined =>
  patternsAndBranches
    .map(([pattern, originalBranch]) => {
      const branch: BranchFunction<T, R> =
        typeof originalBranch === 'function'
          ? (originalBranch as BranchFunction<T, R>)
          : (_: T) => originalBranch

      if (pattern instanceof Array && match instanceof Array) {
        if (pattern.length !== match.length && last(pattern) !== rest) {
          throw new TypeError(
            `Expected a match of length ${pattern.length} but got match with length ${match.length}`
          )
        }

        if (
          pattern.indexOf(rest) !== pattern.length - 1 &&
          pattern.indexOf(rest) !== -1
        ) {
          throw new TypeError(
            'rest operator can only be placed last in pattern'
          )
        }

        const result = pattern.filter((value, index) => {
          return value === rest || value === anySingle || value === match[index]
        })

        if (
          last(pattern) === rest &&
          result.length - 1 === pattern.indexOf(rest)
        ) {
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

export interface ReturnsMatcher {
  (): Matcher | any
}

export const match = Object.assign(matchlyBase, {
  anySingle: (() => anySingle) as ReturnsMatcher,
  any: (() => any) as ReturnsMatcher,
  rest: (() => rest) as ReturnsMatcher
})
