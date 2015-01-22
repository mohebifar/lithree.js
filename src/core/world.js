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
      this.lights.splice(this.lights.indexOf(object), 1);
    } else {
      this.children.splice(this.children.indexOf(object), 1);
    }
  }

}