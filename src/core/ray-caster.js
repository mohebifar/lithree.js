export default
class RayCaster {

  constructor(origin, direction, near = 0, far = Infinity) {
    this.ray = new Ray(origin, direction);

    this.near = near;

    this.far = far;

    this.params = {
      Sprite: {},
      Mesh: {},
      PointCloud: {threshold: 1},
      LOD: {},
      Line: {}
    };

    this.precision = 0.0001;
    this.linePrecision = 1;
  }

  descSort(a, b) {
    return a.distance - b.distance;
  }

  intersectObject(object, rayCaster, intersects, recursive) {
    object.raycast(rayCaster, intersects);

  }

  set(origin, direction) {
    this.ray.set(origin, direction);
  }

  static createFromCamera(coords, camera) {

    if (camera instanceof PerspectiveCamera) {
      var origin = new Vector3();
      origin.copy(camera.position);

      var direction = new Vector3();
      direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(camera.position).normalize();

      return new RayCaster(origin, direction);
    } else {
      throw 'Given camera cannot be ray casted.';
    }

  }

  intersectObject(object, recursive) {

  }

}