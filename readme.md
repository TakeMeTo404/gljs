GLJS
======

No-deps library for manipulating vectors and matrices with GLSL-alike syntax and excellent TypeScript support


## Features

- 👥 GLSL clone for JavaScript with 95% similarity
- 🪄 Magical TypeScript and developer experience from another planet 🪐
- 🔬 tiny size (11KB), no dependencides
- 🏎️ Extremely fast (and not furious)
- 🎨 Containes exactly those utilities that you need to effectively implement 2D/3D animations in JS. Create any `vecN` or `matNxM` (`2 <= N, M <= 4`) and manipulate them with GLSL operators like `smoothstep`, `mix`, `reflect` etc.
- 📜 Comes with informative error messages easing your debug x10 times (nice DX is our principal)
-  👌 Compatible with both NodeJS `require()` syntax and ESM `import`


## API overview

#### 1. Creating and manipulating 2D, 3D and 4D vectors
```javascript
const v2 = vec2(5) // v2 is vec2(5, 5)
v2[0] = -2 // v2 is vec2(-2, 5)
v2.set('y', 3) // v2 is vec2(-2, 3)

const v3 = v2.get('yyx') // v3 is vec3(3, 3, -2) 
const arr = [...v3] // arr is [3, 3, -2]

v3.set('z', 5) // v3 is vec3(3, 3, 5)
v3.set('xyz', v3.get('zyx')) // v3 is vec3(5, 3, 3)

const v4 = vec4(vec3(0), 0.5) // v4 is vec4(0, 0, 0, 0.5)
v4.set('rgb', v3) // v4 is vec4(5, 3, 3, .5)
```

#### 2. Math `+`, `-`, `*`, `/` operations with vectors
Imagine you have `const right = vec2(1, 0)` and `const up = vec2(0, 1)`. How can you get `jump = 2*right + 3*up ` ?

```javascript
// correct, but too long and irreadable
const jump1 = vec2(2*right[0] + 3*up[0], 2*right[1] + 3*up[1])

// CORRECT!! You start catching the idea
const jump2 = right('*', 2)('+', up('*', 3))
```




```javascript
import { vec2, vec3, type Vec3, sin, cos, mix } from 'gljs'

const up = vec2(0, 1)
const left = vec2(-1, 0)

const move = up('*', 2)('+', left)) // move is vec2(-1, 2)


requestAnimationFrame(function rotateColor(time) {
	const seconds = time / 1000
	
	let one = vec3(time, time, 0)
	one = sin(one) // take sinus of each coordinate
	
	let two = vec3(0, -time, time * 2)
	two = cos(two) // take cosinus of each coordinate
	
	const t = (sin(time) + 1) / 2 // make t between 0 and 1
	const color = mix(one, two, t) // mix rotated colors

	setSomeDivBgColor(color)
})

function setSomeDivBgColor(color: Vec3){
	const cssRgba = `rgba(${color[0]}, ${color[1]}, ${color[2]})`
	someExampleDiv.style.backgroundColor = cssRgba
}
```


## FAQ

#### What is the anvantage of GLSL-alike syntax?

Since I had learned GLSL I have been lacking its utilities in JS and TS. I wanted to apply my knowledge 




