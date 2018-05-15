# switchy
Pattern matching for JavaScript (and TypeScript)

## Usage

Match whatever you need, `undefined` is your wildcard.

With one condition

```js
const branch1 = _ => 'no'
const branch2 = _ => 'yes'
const defaultBranch = _ => 'maybe'

const condition = switchy([
  ['a', branch1],
  ['b', branch2],
  [undefined, defaultBranch]
])

condition('a') // no
condition('b') // yes
condition('c') // maybe
condition('e') // maybe
```

With multiple conditions

```js
const branch1 = (values) => values[0] + values[1]
const branch2 = (values) => values[0] * values[1]
const branch3 = (values) => values[0] / values[1]
const defaultBranch = value => value

const condition = switchy([
  [[1, 2], branch1],
  [[2, 3], branch2],
  [[12, undefined], branch3],
  [undefined, defaultBranch]
])

condition([1, 2])) // 3 (branch1)
condition([2, 3])) // 6 (branch2)
condition([12, 6])) // 2 (branch3)
condition([12, 2])) // 6 (branch3)
condition([1337, 42])) // [1337, 42] (defaultBranch)
```
