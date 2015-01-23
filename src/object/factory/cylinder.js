export default
  function CylinderFactory(height = 2, radiusTop = 1, radiusBottom = 1, steps = 20) {
    var cylinder = new Object3D();

    cylinder.vertexIndex = [];
    cylinder.vertexNormals = [];

    var step = Math.PI / (steps - 1);

    steps *= 2;

    var heightTop = height / 2, heightBottom = height / -2;

    for (var a = 0, i = 1; i <= steps; a += step, i++) {
      var positionTop = new Vector3(Math.cos(a) * radiusTop, Math.sin(a) * radiusTop, heightTop);
      var positionBottom = new Vector3(Math.cos(a) * radiusBottom, Math.sin(a) * radiusBottom, heightBottom);

      var crossed = positionTop.cross(positionBottom);

      cylinder.vertexNormals.push(crossed.x, crossed.y, crossed.z);
      cylinder.vertexNormals.push(crossed.x, crossed.y, crossed.z);

      cylinder.vertices.push(positionTop.x, positionTop.y, positionTop.z);
      cylinder.vertices.push(positionBottom.x, positionBottom.y, positionBottom.z);
    }

    for (var i = 0; i < cylinder.vertices.length / 3; i++) {
      cylinder.vertexIndex.push(i);
    }

    cylinder.darwingFunction = Common.drawingFunctions.ELEMENTS;
    cylinder.drawingMode = Common.drawingMode.TRIANGLE_STRIP;

    return cylinder;
  }