[![NPM version](http://img.shields.io/npm/v/lithree.js.svg?style=flat)](https://www.npmjs.org/package/lithree.js) [![npm](https://img.shields.io/npm/l/lithree.js.svg?style=flat)](http://mohebifar.mit-license.org/)

# lithree.js
**lithree.js** is a lightweight 3D WebGL framework. It's just about 25kb. lithree.js is originally written in ES6 and is transcompiled to ES5.

# When to use lithree.js
LiThree is created for lightweight 3D projects. For example if you want to create a website to preview some simple product, It's not proper to load some heavy library like [three.js](https://github.com/mrdoob/three.js) which is about 450kb when minified.

# Usage

***You can check the demo [here](http://dev.mohebifar.com/chemistry/molcanvas.js/examples/).***

Make a world which will contain all your elements.

```js
var world = new LiThree.World();
```

Create an object using object factories.

```js
var sphere = LiThree.ObjectFactory.Sphere(1, 20, 20);
```

Add object to the world.

```js
world.add(sphere);
```

Create a renderer.

```js
var renderer = new LiThree.WebGLRenderer(640, 480, world);
renderer.initShapes();
```

Append canvas to body.

```js
document.body.appendChild(renderer.canvas);
```

Attempt to draw and redraw canvas as many times as you want.

```js
function redraw() {
    renderer.draw();
    requestAnimationFrame(redraw);
}

requestAnimationFrame(redraw);
```

# Contribution
Feel free to help us and making a new awesome 3D library with ES6.
