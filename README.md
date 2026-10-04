GLJS
======

No-deps library for manipulating vectors and matrices with GLSL-like syntax and excellent TypeScript support


## Features

- 👥 GLSL clone for JavaScript with 95% similarity
- 🪄 Magical TypeScript and developer experience from another planet 🪐
- 🔬 tiny size (11KB), no dependencies
- 🎨 Contains exactly those utilities that you need to effectively implement 2D/3D animations in JS. Create any `vecN` or `matNxM` (`2 <= N, M <= 4`) and manipulate them with GLSL operators like `smoothstep`, `mix`, `reflect` etc.
- 📜 Comes with informative error messages easing your debug x10 times (nice DX is our principal)
-  👌 Compatible with both NodeJS `require()` syntax and ESM `import`

## Installation

Prerequisites: This package requires Node.js version 14 or higher. TypeScript users need TypeScript 5.4 or higher.

```bash
npm install glsl-js
```

## Quick start guide

Import the utilities you need from the packages.

```javascript
// for ES Modules
import { vec2, pow } from 'glsl-js'

// for CommonJS
const { vec2, pow } = require('glsl-js')
```

Use them and enjoy declarativity and TypeScript support.

```javascript
const left = vec2(-1, 0)
const up = vec2(0, 1)

const someMove = left('*', 2)('+', up('*', 3))
console.log(String(someMove)) // vec2(-2, 3)

const squared = pow(someMove, 2)
console.log(String(squared)) // vec2(4, 9)
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

Matrices follow GLSL conventions:

- `matCxR` has **C columns and R rows**: `mat2x3` has 2 columns and 3 rows, `mat4x2` has 4 columns and 2 rows
- Matrices are **column-major**: constructor components fill the first column, then the second one, etc.
- `m[i]` returns **column** `i`, and `m.rows[i]` returns row `i`

Use `mat2()`, `mat3()`, `mat4()` for square matrices, or `mat2x3()`, `mat3x2()`, `mat2x4()`, `mat4x2()`, `mat3x4()`, `mat4x3()` for non-square matrices.

In the examples below, matrices are shown in constructor form, i.e. as a list of components column by column.

**From a single scalar** (creates diagonal matrix):

```javascript
const m2 = mat2(5)        // mat2(5, 0,  0, 5)
const m3 = mat3(2)        // mat3(2, 0, 0,  0, 2, 0,  0, 0, 2)
const m4 = mat4(1)        // identity matrix

const m2x3 = mat2x3(3)    // mat2x3(3, 0, 0,  0, 3, 0)
const m4x2 = mat4x2(2)    // mat4x2(2, 0,  0, 2,  0, 0,  0, 0)
```

**From a diagonal vector**:

```javascript
const m2 = mat2(vec2(4, 6))      // mat2(4, 0,  0, 6)
const m3 = mat3(vec3(1, 2, 3))   // mat3(1, 0, 0,  0, 2, 0,  0, 0, 3)

// For non-square matrices, vector length must match min(columns, rows)
const m2x3 = mat2x3(vec2(1, 2))  // mat2x3(1, 0, 0,  0, 2, 0)
const m4x2 = mat4x2(vec2(5, 6))  // mat4x2(5, 0,  0, 6,  0, 0,  0, 0)
```

**From another matrix** (copies the top-left window, the rest is taken from the identity matrix):

```javascript
const a = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)
mat2(a)                          // mat2(1, 2,  4, 5)
mat2x3(a)                        // mat2x3(1, 2, 3,  4, 5, 6) (first 2 columns)

const b = mat4(16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1)
mat3(b)                          // mat3(16, 15, 14,  12, 11, 10,  8, 7, 6)
mat2x4(b)                        // mat2x4(16, 15, 14, 13,  12, 11, 10, 9)

// When creating larger matrix from smaller, the rest of the diagonal becomes 1
mat3(mat2(7))                    // mat3(7, 0, 0,  0, 7, 0,  0, 0, 1)
```

**Component-by-component** (column by column, numbers and vectors can be mixed):

```javascript
// mat2: 2 columns x 2 rows = 4 components
const m2 = mat2(1, 2, 3, 4)      // columns: (1, 2), (3, 4)

// mat3: 3 columns x 3 rows = 9 components
const m3 = mat3(vec3(1, 2, 3), vec3(4, 5, 6), vec3(7, 8, 9))  // columns: (1, 2, 3), (4, 5, 6), (7, 8, 9)

// Non-square matrices
const m2x3 = mat2x3(1, 2, 3, 4, 5, 6)        // 2 columns: (1, 2, 3), (4, 5, 6)
const m3x2 = mat3x2(1, 2, 3, 4, 5, 6)        // 3 columns: (1, 2), (3, 4), (5, 6)
const m2x4 = mat2x4(1, 2, 3, 4, 5, 6, 7, 8)  // 2 columns: (1, 2, 3, 4), (5, 6, 7, 8)
```

### Manipulating matrices

Matrices support arithmetic operations, multiplication, and column/row access:

**Element-wise operations** (return new matrices):

```javascript
const m1 = mat2(1, 2, 3, 4)
const m2 = mat2(5, 6, 7, 8)

m1('+', m2)                       // mat2(6, 8, 10, 12)
m2('-', m1)                       // mat2(4, 4, 4, 4)
m1('*', 2)                        // mat2(2, 4, 6, 8)
m1('/', 2)                        // mat2(0.5, 1, 1.5, 2)

// Element-wise operations require same-size matrices
mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)('+', 5)  // mat3(6, 7, 8, 9, 10, 11, 12, 13, 14)
```

**Matrix-vector multiplication** (`m * v`, the vector is a column vector):

```javascript
const m = mat2(1, 2, 3, 4)        // columns: (1, 2), (3, 4)
m('*', vec2(5, 6))                // vec2(23, 34)
// Calculation: 5 * (1, 2) + 6 * (3, 4) = (23, 34)

// mat3x2 has 3 columns, so it is multiplied by vec3 and returns vec2
mat3x2(1, 2, 3, 4, 5, 6)('*', vec3(10, 20, 30))  // vec2(220, 280)
```

**Vector-matrix multiplication** (`v * m`, the vector is a row vector):

```javascript
vec2(5, 6)('*', mat2(1, 2, 3, 4)) // vec2(17, 39)
// Calculation: (dot((5, 6), (1, 2)), dot((5, 6), (3, 4))) = (17, 39)

// In-place version works with square matrices
const v = vec2(5, 6)
v('*=', mat2(1, 2, 3, 4))         // v is now vec2(17, 39)
```

**Matrix-matrix multiplication**:

```javascript
mat2(1, 2, 3, 4)('*', mat2(5, 6, 7, 8))  // mat2(23, 34, 31, 46)

// Non-square matrices: the number of columns of the left matrix
// must match the number of rows of the right matrix
const m3x2 = mat3x2(7, 8, 9, 10, 11, 12)  // 3 columns, 2 rows
const m2x3 = mat2x3(1, 2, 3, 4, 5, 6)     // 2 columns, 3 rows
m3x2('*', m2x3)                           // mat2(58, 64, 139, 154)
```

**Column and row access**:

```javascript
const m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)

// Access columns
m[0]                              // vec3(1, 2, 3)
m[1]                              // vec3(4, 5, 6)
m[2]                              // vec3(7, 8, 9)

// Access rows
m.rows[0]                         // vec3(1, 4, 7)
m.rows[1]                         // vec3(2, 5, 8)
m.rows[2]                         // vec3(3, 6, 9)

// Modify columns
m[0] = vec3(10, 20, 30)           // m is now mat3(10, 20, 30,  4, 5, 6,  7, 8, 9)

// Modify rows
m.rows[1] = vec3(100, 200, 300)   // m is now mat3(10, 100, 30,  4, 200, 6,  7, 300, 9)

// Modify individual elements: m[column][row]
m[0][1] = 2                       // m[0] is now vec3(10, 2, 30)
m.rows[1].set('xy', vec2(5, 7))   // modifies row 1 in place
```

> **Note:** Column and row vectors returned by `m[i]` and `m.rows[i]` are references to the matrix data. Modifying these vectors directly affects the original matrix. If you want to manipulate a column or row without affecting the matrix, use `.copy()` first: `m[1].copy()` or `m.rows[0].copy()`.

**Copying matrices**:

```javascript
const original = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9)
const copy = original.copy()      // Independent copy
```

### Operators

GLJS provides GLSL-like operators organized by category:

**Exponential and Logarithmic**:

```javascript
import { exp, log, exp2, log2, sqrt, inversesqrt, pow } from 'glsl-js'

exp(2)                    // e^2
exp(vec2(0, 1))           // vec2(1, e)

log(10)                   // ln(10)
log(vec3(1, 10, 100))     // vec3(0, ln(10), ln(100))

exp2(3)                   // 2^3 = 8
log2(8)                   // 3

sqrt(16)                  // 4
sqrt(vec2(4, 9))          // vec2(2, 3)

inversesqrt(4)            // 1/√4 = 0.5

pow(2, 3)                 // 2^3 = 8
pow(vec2(2, 3), 2)        // vec2(4, 9)
```

**Common Math**:

```javascript
import { abs, sign, floor, ceil, round, fract, trunc, min, max, mod, clamp } from 'glsl-js'

abs(-5)                   // 5
abs(vec2(-1, 2))          // vec2(1, 2)

sign(-10)                 // -1
sign(vec3(-5, 0, 5))      // vec3(-1, 0, 1)

floor(3.7)                // 3
ceil(3.2)                 // 4
round(3.5)                // 4
trunc(3.7)                // 3
fract(3.7)                // 0.7

min(5, 3)                 // 3
min(vec2(1, 5), vec2(3, 2))  // vec2(1, 2)
min(vec3(1, 2, 3), 2)     // vec3(1, 2, 2)

max(5, 3)                 // 5
mod(10, 3)                // 1
mod(-1, 3)                // 2 (GLSL semantics, unlike JS -1 % 3 === -1)

clamp(15, 0, 10)          // 10
clamp(vec2(-5, 15), 0, 10)  // vec2(0, 10)
clamp(vec3(1, 2, 3), vec3(0, 1, 2), vec3(2, 3, 4))  // vec3(1, 2, 3)
```

**Trigonometry**:

```javascript
import { sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, asinh, acosh, atanh } from 'glsl-js'

sin(Math.PI / 2)          // 1
cos(0)                    // 1
tan(Math.PI / 4)          // ~1

asin(1)                   // π/2
acos(0)                   // π/2
atan(1)                   // π/4

sinh(0)                   // 0
cosh(0)                   // 1
tanh(0)                   // 0

// All trigonometric functions work with vectors component-wise
sin(vec2(Math.PI / 2, 0)) // vec2(1, 0)
```

**Angle Conversion**:

```javascript
import { degrees, radians } from 'glsl-js'

degrees(Math.PI)          // 180
radians(180)              // π

degrees(vec2(Math.PI / 2, Math.PI))  // vec2(90, 180)
```

**Interpolation**:

```javascript
import { mix, smoothstep, step } from 'glsl-js'

// Linear interpolation: x * (1 - a) + y * a
mix(0, 10, 0.5)           // 5
mix(vec2(0, 0), vec2(10, 20), 0.5)  // vec2(5, 10)
mix(vec2(0, 0), vec2(10, 20), vec2(0, 1))  // vec2(0, 20)

// Step function: returns 0 if x < edge, else 1
step(5, 3)                // 0
step(5, 7)                // 1
step(vec2(5, 5), vec2(3, 7))  // vec2(0, 1)

// Smooth step: smooth interpolation between edge0 and edge1
smoothstep(0, 10, 5)      // ~0.5
smoothstep(0, 10, 15)     // 1.0 (clamped)
smoothstep(vec2(0, 5), vec2(10, 15), vec2(5, 10))  // vec2(~0.5, ~0.5)
```

**Geometric**:

```javascript
import { length, distance, dot, cross, normalize, faceforward, reflect, refract } from 'glsl-js'

// Vector length (magnitude)
length(vec2(3, 4))        // 5
length(vec3(1, 2, 2))     // 3

// Distance between two points
distance(vec2(0, 0), vec2(3, 4))  // 5
distance(vec3(0, 0, 0), vec3(1, 2, 2))  // 3

// Dot product
dot(vec2(1, 2), vec2(3, 4))  // 1*3 + 2*4 = 11

// Cross product (3D only)
cross(vec3(1, 0, 0), vec3(0, 1, 0))  // vec3(0, 0, 1)

// Normalize to unit vector
normalize(vec2(3, 4))     // vec2(0.6, 0.8)

// Reflect vector I off normal N: I - 2 * dot(I, N) * N
reflect(vec2(1, -1), vec2(0, 1))  // vec2(1, 1)

// Refract vector I through surface with normal N and ratio eta
refract(vec3(0, -1, 0), vec3(0, 1, 0), 1.5)  // Refracted vector

// Faceforward: returns N if dot(I, Nref) < 0, else -N
faceforward(vec3(1, 0, 0), vec3(-1, 0, 0), vec3(1, 0, 0))  // vec3(1, 0, 0)
```

**Matrix Operations**:

```javascript
import { outerProduct, transpose, matrixCompMult, determinant, inverse } from 'glsl-js'

// Outer product: c is a column vector, r is a row vector,
// result has r.length columns and c.length rows
outerProduct(vec2(1, 2), vec3(3, 4, 5))  // mat3x2(3, 6,  4, 8,  5, 10)

// Transpose matrix
transpose(mat2x3(1, 2, 3, 4, 5, 6))      // mat3x2(1, 4,  2, 5,  3, 6)

// Component-wise matrix multiplication
matrixCompMult(mat2(1, 2, 3, 4), mat2(5, 6, 7, 8))  // mat2(5, 12, 21, 32)

// Determinant (square matrices only)
determinant(mat3(1, 2, 3, 4, 5, 6, 7, 8, 9))  // 0 (singular matrix)

// Matrix inverse (square matrices only)
inverse(mat2(1, 2, 3, 4))                     // mat2(-2, 1, 1.5, -0.5)
```

## FAQ

#### Where can I find more code examples?

We have plans to implement a website with informative documentation, numerous examples and sandboxes. Currently the best way to undestand the API is checking unit tests in the repository of our library.

#### What is the advantage of GLSL-like syntax?

GLSL-like syntax provides several benefits:

- **Familiar to graphics developers**: If you work with WebGL, Three.js, or other graphics libraries, the syntax feels natural and requires minimal learning
- **Chained operations**: Operations can be chained naturally: `vec2(1, 2)('*', 3)('+', vec2(4, 5))` reads left-to-right like mathematical expressions
- **Component-wise operations**: Vector and matrix operations apply component-wise automatically, eliminating the need for loops
- **Swizzling support**: Access and rearrange components with `v.get('zyx')` or `v.set('xy', vec2(5, 6))`, making geometric transformations intuitive
- **Type safety**: Full TypeScript support catches errors at compile time, preventing runtime mistakes in vector dimensions and operations

#### Is GLJS compatible with Node.js and browsers?

Yes! GLJS works in both Node.js (version 14+) and modern browsers. It's compatible with both CommonJS (`require()`) and ES Modules (`import`), so you can use it in any JavaScript environment.

#### Can I use GLJS with TypeScript?

Absolutely! GLJS is written in TypeScript and provides excellent type safety. It includes comprehensive type definitions that catch dimension mismatches, invalid operations, and type errors at compile time.

The type definitions require TypeScript 5.4 or higher (they rely on the `NoInfer` utility type).

#### How does GLJS compare to other vector math libraries?

GLJS focuses on GLSL-like syntax and developer experience while staying lightweight (11KB). Unlike heavier libraries, it has zero dependencies and provides exactly what you need for 2D/3D graphics work. If you're coming from GLSL/shader development, the API will feel immediately familiar.

## License

ISC License. See [LICENSE](LICENSE) for details.
