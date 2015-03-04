import Vector3 from '../math/vector3.js';
import Common from 'common.js';

export default
class RayCaster {

  /**
   * @constructor
   * @param {Ray} ray
   */
    constructor(ray) {
    this.ray = ray;
  }

  intersectTriangle(a, b, c) {
    var
      ray = this.ray,
      orig = ray.origin,
      dir = ray.direction,
      t,
      u,
      v;

    // find vectors for edges
    var edge1 = b.subtract(a, true);
    var edge2 = c.subtract(a, true);

    // calculate determinant
    var pvec = dir.cross(edge2);
    var det = edge1.dot(pvec);

    // calculations - CULLING ENABLED
    var tvec = orig.subtract(a, true);

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

  intersectObject(object) {
    if (object.drawingMode === Common.drawingMode.TRIANGLES) {

    }
  }

}