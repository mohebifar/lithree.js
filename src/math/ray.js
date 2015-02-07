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

  clone() {
    var ray = new Ray();
    ray.copy(this);

    return ray;
  }

}