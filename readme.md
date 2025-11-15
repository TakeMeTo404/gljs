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

TODO

### Manipulating vectors

TODO

### Creating matrices

TODO

### Manipulating matrices

TODO

### Operators

TODO

## FAQ

TODO by myself, not agent

## Licence

TODO by agent
