import { switchy } from '.'

test('throws error if gets invalid pattern match', done => {
  const condition = switchy([[[1, 2], () => {}]])

  try {
    condition('blargh' as any)
    done.fail("Should've thrown a type error")
  } catch (e) {
    if (e instanceof TypeError) {
      done()
      return
    }

    done.fail(`Expected error to be TypeError but was ${typeof e}`)
  }
})

test('switches correctly over array', () => {
  const branch1 = (values: [number, number]) => values[0] + values[1]
  const branch2 = (values: [number, number]) => values[0] * values[1]
  const branch3 = (values: [number, number]) => values[0] / values[1]
  const defaultBranch = value => value

  const condition = switchy([
    [[1, 2], branch1],
    [[2, 3], branch2],
    [[12, undefined], branch3],
    [undefined, defaultBranch]
  ])

  expect(condition([1, 2])).toBe(3)
  expect(condition([2, 3])).toBe(6)
  expect(condition([12, 6])).toBe(2)
  expect(condition([12, 2])).toBe(6)
  expect(condition([1337, 42])).toEqual([1337, 42])
})

test('returns undefined with no default branch and no matched value', () => {
  expect(switchy([[1, () => 'blargh']])(2)).toBe(undefined)
})

test("throws error if match length doesn't match pattern length", done => {
  const condition = switchy([[[1, 2], () => {}]])

  try {
    condition([1, 2, 3, 4])
    done.fail("Should've thrown a type error")
  } catch (e) {
    if (e instanceof TypeError) {
      done()
      return
    }

    done.fail(`Expected error to be TypeError but was ${typeof e}`)
  }
})

test('switches correctly over non-arrays', () => {
  const branch1 = (value: string) => 'no'
  const branch2 = (value: string) => 'yes'
  const defaultBranch = _ => 'maybe'

  const condition = switchy([
    ['a', branch1],
    ['b', branch2],
    [undefined, defaultBranch]
  ])

  expect(condition('a')).toBe('no')
  expect(condition('b')).toBe('yes')
  expect(condition('c')).toBe('maybe')
})
