export default
  function CircleFactory(radius = 1, steps = 20) {
    var circle = new Object3D();

    circle.vertices.push(0, 0, 0);

    circle.vertexIndex = [];
    circle.vertexNormals = [];

    var step = Math.PI / (steps - 1);
    steps *= 2;

    for (var a = 0, i = 1; i < steps; a += step, i++) {
      circle.vertices.push(Math.cos(a) * radius, Math.sin(a) * radius, 0);
    }

    for (var i = 0; i < circle.vertices.length; i++) {
      circle.vertexNormals.push(0, 0, 1);
    }

    for (var i = 0; i < circle.vertices.length / 3; i++) {
      circle.vertexIndex.push(i);
    }

    circle.darwingFunction = Common.drawingFunctions.ELEMENTS;
    circle.drawingMode = Common.drawingMode.TRIANGLE_FAN;

    return circle;
  }