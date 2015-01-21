export default
class World {

  constructor() {
    this.children = [];
    this.lights = [];
  }

  add(object) {
    if(object instanceof DirectionalLight) {
      this.lights.push(object);
    } else {
      this.children.push(object);
    }
  }

  remove(object) {
    if(object instanceof DirectionalLight) {
      this.lights.remove(object);
    } else {
      this.children.remove(object);
    }
  }

}