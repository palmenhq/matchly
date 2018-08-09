import { filter, find, findIndex, includes, indexOf, map, reduce } from './array'

test('map', () => {
  expect(map<number>(num => num + 1)([0, 1, 2])).toEqual([1, 2, 3])
})

test('filter', () => {
  expect(filter<number>(num => num === 1)([0, 1, 2])).toEqual([1])
})

test('reduce', () => {
  expect(reduce<number>((acc, curr) => acc + curr, 0)([0, 1, 2])).toEqual(3)
})

test('find', () => {
  expect(find<number>((num) => num === 2)([0, 1, 2])).toEqual(2)
})

test('findIndex', () => {
  expect(findIndex<number>((num) => num === 1)([1, 2, 3])).toEqual(0)
})

test('indexOf', () => {
  expect(indexOf<number>(1)([1, 2, 3])).toEqual(0)
})

test('includes', () => {
  expect(includes<number>(1)([1, 2, 3])).toEqual(true)
})

