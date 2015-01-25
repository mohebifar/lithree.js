# lithree.js
**lithree.js** is a lightweight 3D WebGL framework. It's just about 30kb. lithree.js is originally written in ES6 and is transcompiled to ES5.

Usage
=====

Make a world

```js
var world = new MoGl.World();
```

Create an object using object factories

```js
var sphere = MoGl.ObjectFactory.Sphere(1, 20, 20);
```

Add object to the world

```js
world.add(sphere);
```

Create a renderer

```js
var renderer = new MoGl.WebGLRenderer(640, 480, world);
renderer.initShapes();
```

Append canvas to body

```js
document.body.appendChild(renderer.canvas);
```
