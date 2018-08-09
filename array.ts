export const map = <T, R = T>(mapper: { (thing: T): R }) => (arr: T[]): R[] => arr.map(mapper)
export const filter = <T>(filterer: { (thing: T): boolean }) => (arr: T[]): T[] => arr.filter(filterer)
export const find = <T>(finder: { (thing: T) : boolean}) => (array: T[]): T | undefined => array.find(finder)
export const findIndex = <T>(finder: { (thing: T) : boolean}) => (array: T[]): number => array.findIndex(finder)
export const includes = <T>(thing: T) => (array: T[]): boolean => array.includes(thing)
export const indexOf = <T>(thing: T) => (array: T[]): number => array.indexOf(thing)

export interface Reducer<T, R> {
  (accumulator: R, currentValue: T, index: number, original: T[]): R
}
export interface Reduce {
  <T, R = T>(reducer: Reducer<T, R>): (arr: T[]) => R
  <T, R = T>(reducer: Reducer<T, R>, initialValue: R): (arr: T[]) => R
}
export const reduce: Reduce = <T, R = T>(reducer: Reducer<T, R>, initialValue?: R) =>
  (arr: T[])=> arr.reduce(reducer, initialValue as R)
