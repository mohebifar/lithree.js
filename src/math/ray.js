export default
class Ray {

  constructor(origin = new Vector3(), direction = new Vector3()) {
    this.set(origin, direction);
  }

  static fromPoints(point1, point2) {
    return new Ray(point1, point2.subtract(point1).normalize());
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

  intersectTriangle(vert0, vert1, vert2) {
    var orig = this.origin,
      dir = this.direction,
      t,
      u,
      v;

    // find vectors for edges
    var edge1 = vert1.subtract(vert0, true);
    var edge2 = vert2.subtract(vert0, true);

    // calculate determinant
    var pvec = dir.cross(edge2);
    var det = edge1.dot(pvec);

    // calculations - CULLING ENABLED
    var tvec = orig.subtract(vert0, true);

    u = tvec.dot(pvec);
    if (u < 0 || u > det) {
      return null;
    }

    var qvec = tvec.cross(edge1);

    v = dir.dot(qvec);
    if (v < 0 || (u + v) > det) {
      return null;
    }

    t = edge2.dot(qvec);

    var inv_det = 1 / det;
    t = t * inv_det;
    u = u * inv_det;
    v = v * inv_det;

    return new Vector3(t, u, v);
  }

  clone() {
    var ray = new Ray();
    ray.copy(this);

    return ray;
  }

}