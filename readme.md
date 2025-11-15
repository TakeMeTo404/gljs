GLJS
======

No-deps library for manipulating vectors and matrices with GLSL-alike syntax and excellent TypeScript support


## Features

- 👥 GLSL clone for JavaScript with 95% similarity
- 🪄 Magical TypeScript and developer experience from another planet 🪐
- 🔬 tiny size (11KB), no dependencies
- 🏎️ Extremely fast (and not furious)
- 🎨 Contains exactly those utilities that you need to effectively implement 2D/3D animations in JS. Create any `vecN` or `matNxM` (`2 <= N, M <= 4`) and manipulate them with GLSL operators like `smoothstep`, `mix`, `reflect` etc.
- 📜 Comes with informative error messages easing your debug x10 times (nice DX is our principal)
-  👌 Compatible with both NodeJS `require()` syntax and ESM `import`

## Installation

Prerequisites: This package requires Node.js version 14 or higher.

```bash
npm install gljs
```

## Quick start guide

Import the utilities you need from the packages.

```javascript
// for ES Modules
import { vec2, pow } from 'gljs'

// for CommonJS
const { vec2, pow } = require('gljs')
```

Use them and enjoy declarativity and TypeScript support.

```javascript
const left = vec2(-1, 0)
const up = vec2(0, 1)

const someMove = left('*', 2)('+', up('*', 3))
console.log(someMove) // vec2(-2, 3)

const squared = pow(someMove, 2)
console.log(squared) // vec2(4, 9)
```

## API documentation

### Creating vectors

Use `vec2()`, `vec3()`, or `vec4()` to create vectors. You can create them in several ways:

**From a single scalar** (fills all components):

```javascript
const v2 = vec2(5)        // vec2(5, 5)
const v3 = vec3(2)        // vec3(2, 2, 2)
const v4 = vec4(1)        // vec4(1, 1, 1, 1)
```

**From multiple numbers** (component-by-component):

```javascript
const v2 = vec2(1, 2)           // vec2(1, 2)
const v3 = vec3(1, 2, 3)        // vec3(1, 2, 3)
const v4 = vec4(1, 2, 3, 4)     // vec4(1, 2, 3, 4)
```

**From mixed numbers and vectors**:

```javascript
const v3a = vec3(vec2(1, 2), 3)        // vec3(1, 2, 3)
const v3b = vec3(1, vec2(2, 3))        // vec3(1, 2, 3)

const v4a = vec4(vec3(1, 2, 3), 4)           // vec4(1, 2, 3, 4)
const v4b = vec4(1, vec3(2, 3, 4))           // vec4(1, 2, 3, 4)
const v4c = vec4(vec2(1, 2), 3, 4)           // vec4(1, 2, 3, 4)
const v4d = vec4(1, vec2(2, 3), 4)           // vec4(1, 2, 3, 4)
const v4e = vec4(vec2(1, 2), vec2(3, 4))     // vec4(1, 2, 3, 4)
```

**From another vector** (copying):

```javascript
const original = vec3(1, 2, 3)
const copy = vec3(original)     // vec3(1, 2, 3)
const copy2 = original.copy()     // vec3(1, 2, 3)
```

**From component swizzling** (extracting/reordering components):

```javascript
const v = vec3(1, 2, 3)
const swizzled = v.get('zzxx')      // vec4(3, 3, 1, 1)
const xy = v.get('xy')              // vec2(1, 2)
const reversed = v.get('zyx')       // vec3(3, 2, 1)

// You can use xyzw or rgba notation
const color = vec4(0.1, 0.5, 0.8, 1.0)
const rgb = color.get('rgb')        // vec3(0.1, 0.5, 0.8)
const alpha = color.get('a')        // 1.0 (returns number for single component)
```

### Manipulating vectors

Vectors support arithmetic operations and component manipulation:

**Arithmetic operations** (return new vectors):

```javascript
const a = vec2(1, 2)
const b = vec2(3, 4)

const sum = a('+', b)           // vec2(4, 6)
const diff = a('-', b)          // vec2(-2, -2)
const scaled = a('*', 2)        // vec2(2, 4)
const divided = b('/', 2)       // vec2(1.5, 2)

// Operations can be chained
const result = a('*', 2)('+', b)  // vec2(5, 8)
```

**Assignment operations** (modify vector in place):

```javascript
const v = vec3(1, 2, 3)
v('+=', 5)        // v is now vec3(6, 7, 8)
v('-=', vec3(1, 1, 1))  // v is now vec3(5, 6, 7)
v('*=', 2)        // v is now vec3(10, 12, 14)
v('/=', 2)        // v is now vec3(5, 6, 7)
```

**Component access via indices**:

```javascript
const v = vec3(1, 2, 3)
console.log(v[0])        // 1
console.log(v[1])        // 2
console.log(v[2])        // 3

v[0] = 10                // v is now vec3(10, 2, 3)
```

**Setting components via swizzling**:

```javascript
const v = vec3(1, 2, 3)

// Set single component
v.set('x', 10)           // v is now vec3(10, 2, 3)
v.set('y', 20)           // v is now vec3(10, 20, 3)

// Set multiple components from another vector
const source = vec2(100, 200)
v.set('xy', source)      // v is now vec3(100, 200, 3)
v.set('yz', vec2(50, 60))  // v is now vec3(100, 50, 60)

// Using rgba notation
const color = vec4(0.1, 0.2, 0.3, 0.4)
color.set('r', 1.0)      // color is now vec4(1.0, 0.2, 0.3, 0.4)
color.set('gb', vec2(0.8, 0.9))  // color is now vec4(1.0, 0.8, 0.9, 0.4)
```

**Copying vectors**:

```javascript
const original = vec3(1, 2, 3)
const copy = original.copy()  // vec3(1, 2, 3) - independent copy
```

### Creating matrices

Use `mat2()`, `mat3()`, `mat4()` for square matrices, or `mat2x3()`, `mat3x2()`, `mat2x4()`, `mat4x2()`, `mat3x4()`, `mat4x3()` for non-square matrices.

**From a single scalar** (creates diagonal matrix):

```javascript
const m2 = mat2(5)        // [[5, 0], [0, 5]]
const m3 = mat3(2)        // [[2, 0, 0], [0, 2, 0], [0, 0, 2]]
const m4 = mat4(1)        // Identity matrix scaled by 1

const m2x3 = mat2x3(3)    // [[3, 0, 0], [0, 3, 0]]
const m4x2 = mat4x2(2)    // [[2, 0], [2, 0], [0, 0], [0, 0]]
```

**From a diagonal vector**:

```javascript
const m2 = mat2(vec2(4, 6))      // [[4, 0], [0, 6]]
const m3 = mat3(vec3(1, 2, 3))   // [[1, 0, 0], [0, 2, 0], [0, 0, 3]]

// For non-square matrices, vector length must match min(rows, columns)
const m2x3 = mat2x3(vec2(1, 2))  // [[1, 0, 0], [0, 2, 0]]
const m4x2 = mat4x2(vec2(5, 6))  // [[5, 0], [6, 0], [0, 0], [0, 0]]
```

**From another matrix** (copies window/portion):

```javascript
const m3 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)
const m2 = mat2(m3)              // [[1, 2], [4, 5]] (top-left 2x2)
const m2x3 = mat2x3(m3)          // [[1, 2, 3], [4, 5, 6]] (first 2 rows)

const m4 = mat4(16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1)
const m3 = mat3(m4)              // [[16, 15, 14], [12, 11, 10], [8, 7, 6]]
const m2x4 = mat2x4(m4)          // [[16, 15, 14, 13], [12, 11, 10, 9]]

// When creating larger matrix from smaller, diagonal becomes 1
const m2 = mat2(7)
const m3 = mat3(m2)              // [[7, 0, 0], [0, 7, 0], [0, 0, 1]]
```

**Component-by-component** (row-major order):

```javascript
// mat2: 2x2 = 4 components
const m2 = mat2(1, 2, 3, 4)      // [[1, 2], [3, 4]]

// mat3: 3x3 = 9 components
const m3 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)  // [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

// mat4: 4x4 = 16 components
const m4 = mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)
// [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]

// Non-square matrices
const m2x3 = mat2x3(1, 2, 3, 4, 5, 6)        // [[1, 2, 3], [4, 5, 6]]
const m3x2 = mat3x2(1, 2, 3, 4, 5, 6)        // [[1, 2], [3, 4], [5, 6]]
const m2x4 = mat2x4(1, 2, 3, 4, 5, 6, 7, 8)  // [[1, 2, 3, 4], [5, 6, 7, 8]]
```

### Manipulating matrices

Matrices support arithmetic operations, multiplication, and row/column access:

**Element-wise operations** (return new matrices):

```javascript
const m1 = mat2(1, 2, 3, 4)
const m2 = mat2(5, 6, 7, 8)

const sum = m1('+', m2)           // [[6, 8], [10, 12]]
const diff = m2('-', m1)          // [[4, 4], [4, 4]]
const scaled = m1('*', 2)         // [[2, 4], [6, 8]]
const divided = m1('/', 2)        // [[0.5, 1], [1.5, 2]]

// Element-wise operations require same-size matrices
const m3 = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)
const m3sum = m3('+', 5)          // [[6, 7, 8], [9, 10, 11], [12, 13, 14]]
```

**Matrix-vector multiplication**:

```javascript
const m = mat2(1, 2, 3, 4)
const v = vec2(5, 6)
const result = m('*', v)          // vec2(17, 39)
// Calculation: [1*5 + 2*6, 3*5 + 4*6] = [17, 39]

const m3x2 = mat3x2(1, 2, 3, 4, 5, 6)
const v2 = vec2(10, 20)
const result2 = m3x2('*', v2)     // vec3(50, 110, 170)
```

**Matrix-matrix multiplication**:

```javascript
const m1 = mat2(1, 2, 3, 4)
const m2 = mat2(5, 6, 7, 8)
const product = m1('*', m2)       // [[19, 22], [43, 50]]

// Non-square matrices
const m2x3 = mat2x3(1, 2, 3, 4, 5, 6)
const m3x2 = mat3x2(7, 8, 9, 10, 11, 12)
const result = m2x3('*', m3x2)    // mat2x2(58, 64, 139, 154)
```

**Row and column access**:

```javascript
const m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)

// Access rows
const row0 = m[0]                 // vec3(1, 2, 3)
const row1 = m[1]                 // vec3(4, 5, 6)
const row2 = m[2]                 // vec3(7, 8, 9)

// Access columns
const col0 = m.columns[0]         // vec3(1, 4, 7)
const col1 = m.columns[1]         // vec3(2, 5, 8)
const col2 = m.columns[2]         // vec3(3, 6, 9)

// Modify rows
m[0] = vec3(10, 20, 30)           // m is now [[10, 20, 30], [4, 5, 6], [7, 8, 9]]

// Modify columns
m.columns[1] = vec3(100, 200, 300)  // m is now [[10, 100, 30], [4, 200, 6], [7, 300, 9]]

// Modify individual elements via row/column vectors
m[0][1] = 2                        // m[0] is now vec3(10, 2, 30)
m.columns[1].set('xy', vec2(5, 7))  // Modifies column 1 in place
```

> **Note:** Row and column vectors returned by `m[i]` and `m.columns[i]` are references to the matrix data. Modifying these vectors directly affects the original matrix. If you want to manipulate a row or column without affecting the matrix, use `.copy()` first: `m[1].copy()` or `m.columns[0].copy()`.

**Copying matrices**:

```javascript
const original = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)
const copy = original.copy()      // Independent copy
```

### Operators

TODO

## FAQ

#### Where can I find more code examples?

We have plans to implement a website with informative documentation, numerous examples and sandboxes. Currently the best way to undestand the API is checking unit tests in the repository of our library.

#### What is the advantage of GLSL-alike syntax?

TODO by myself

## Licence

ISC License. See [LICENSE](LICENSE) for details.
