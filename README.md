# lithree.js
**Lithree.js** is a lightweight 3D WebGL framework. It's just about 30kb.

Usage
=====

Make a world

    var world = new MoGl.World();

Create an object using object factories

    var sphere = MoGl.ObjectFactory.Sphere(1, 20, 20);

Add object to world

    world.add(sphere);

Create a renderer

    var renderer = new MoGl.WebGLRenderer(640, 480, world);
    renderer.initShapes();

Append canvas to body

    document.body.appendChild(renderer.canvas);
