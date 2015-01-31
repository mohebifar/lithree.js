export default
class Ray {

  constructor(origin = new Vector3(), direction = new Vector3()) {
    this.set(origin, direction);
  }

  set(origin, direction) {
    this.origin = origin;
    this.direction = direction;
  }

  copy(ray) {
    this.origin.copy(ray.origin);
    this.direction.copy(ray.direction);

    return this;
  }

  at(t) {
    var result = new Vector3();

    return result.copy(this.direction).multiply(t).add(this.origin);
  }

  applyMatrix4(matrix) {
    this.direction.add(this.origin).applyMatrix4(matrix)
  }

  intersectTriangle(a, b, c, backfaceCulling, optionalTarget) {
    // from http://www.geometrictools.com/LibMathematics/Intersection/Wm5IntrRay3Triangle3.cpp

    var diff = new Vector3();
    var edge1 = new Vector3();
    var edge2 = new Vector3();
    var normal = new Vector3();

    edge1.copy(b).sub(a);
    edge2.copy(c).sub(a);

    normal.copy(edge1).cross(edge2);

    // Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
    // E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
    //   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
    //   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
    //   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
    var DdN = this.direction.dot(normal);
    var sign;

    if (DdN > 0) {

      if (backfaceCulling) return null;
      sign = 1;

    } else if (DdN < 0) {

      sign = -1;
      DdN = -DdN;

    } else {

      return null;

    }

    diff.copy(this.origin).sub(a);

    var DdQxE2 = sign * this.direction.dot(edge2.copy(diff).cross(edge2));

    // b1 < 0, no intersection
    if (DdQxE2 < 0) {

      return null;

    }

    var DdE1xQ = sign * this.direction.dot(edge1.cross(diff));

    // b2 < 0, no intersection
    if (DdE1xQ < 0) {

      return null;

    }

    // b1+b2 > 1, no intersection
    if (DdQxE2 + DdE1xQ > DdN) {

      return null;

    }

    // Line intersects triangle, check if ray does.
    var QdN = -sign * diff.dot(normal);

    // t < 0, no intersection
    if (QdN < 0) {

      return null;

    }

    // Ray intersects triangle.
    return this.at(QdN / DdN, optionalTarget);
  }

  clone() {
    var ray = new Ray();
    ray.copy(this);

    return ray;
  }

}