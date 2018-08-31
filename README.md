# switchy
Pattern matching for JavaScript (and TypeScript)

## Usage

Match whatever you need, with wildcards.

With one condition

```js
import { match } from 'switchy'

const branch1 = _ => 'no'
const branch2 = _ => 'yes'
const defaultBranch = _ => 'maybe'

const condition = match([
  ['a',         branch1],
  ['b',         branch2],
  [match.any(), defaultBranch]
])

condition('a') // no
condition('b') // yes
condition('c') // maybe
condition('e') // maybe
```

With multiple conditions

```js
import { match } from 'switchy'

const branch1 = (values) => values[0] + values[1]
const branch2 = (values) => values[0] * values[1]
const branch3 = (values) => values[0] / values[1]
const defaultBranch = value => value

const condition = match([
  [[1,  2],                 branch1],
  [[2,  3],                 branch2],
  [[12, match.anySingle()], branch3],
  [match.any(),             defaultBranch]
])

condition([1, 2]) // 3 (branch1)
condition([2, 3]) // 6 (branch2)
condition([12, 6]) // 2 (branch3)
condition([12, 2]) // 6 (branch3)
condition([1337, 42]) // [1337, 42] (defaultBranch)
```

Collecting `rest`

```js
import { match } from 'switchy'

const branch1 = (values) => 'branch1: ' + values
const branch2 = (values) => 'branch2: ' + values

const condition = match([
    [['a', 'b', 'c'],     branch1],
    [['a', match.rest()], branch2],
])

condition(['a', 'b', 'c']) // branch1: a,b,c
condition(['a', 'd', 'e']) // branch2: a,d,e
```
