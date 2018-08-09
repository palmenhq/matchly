import { match } from './match'

test('throws error if gets invalid pattern match', done => {
  const condition = match([[[1, 2], () => {}]])

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
  const defaultBranch = (value: [number, number]) => value[0]

  const condition = match([
    [[1, 2], branch1],
    [[2, 3], branch2],
    [[12, match.anySingle()], branch3],
    [match.any(), defaultBranch]
  ])

  expect(condition([1, 2])).toBe(3)
  expect(condition([2, 3])).toBe(6)
  expect(condition([12, 6])).toBe(2)
  expect(condition([12, 2])).toBe(6)
  expect(condition([1337, 42])).toEqual(1337)
})

test('switches correctly over rest', () => {
  const branch = (values: string[]) => values

  const condition = match([
    [['a', 'b', match.rest()], branch]
  ])

  expect(condition(['a', 'b', 'c', 'd'])).toEqual(['a', 'b', 'c', 'd'])
  expect(condition(['a', 'b'])).toEqual(['a', 'b'])
  expect(condition(['b', 'c'])).toEqual(undefined)
})

test('throws error when rest is not last', done => {
  const condition = match([
    [['a', match.rest(), 'b'], () => {}],
  ])

  try {
    condition([0, 0, 0])
    done.fail('Should have thrown TypeError but didn\'t')
  } catch (e) {
    if (!(e instanceof TypeError)) {
      done.fail(e)
    }
    done()
  }
})

test('returns undefined with no default branch and no matched value', () => {
  expect(match([[1, () => 'blargh']])(2)).toBe(undefined)
})

test("throws error if match length doesn't match pattern length", done => {
  const condition = match([[[1, 2], () => {}]])

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
  const branch1 = () => 'no'
  const branch2 = () => 'yes'
  const defaultBranch = () => 'maybe'

  const condition = match([
    ['a', branch1],
    ['b', branch2],
    [match.any(), defaultBranch]
  ])

  expect(condition('a')).toBe('no')
  expect(condition('b')).toBe('yes')
  expect(condition('c')).toBe('maybe')
})
