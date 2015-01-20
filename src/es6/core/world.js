export default
class World {

  constructor() {
    this.children = [];
  }

  add(object) {
    this.children.push(object);
  }

  remove(object) {
    this.children.remove(object);
  }

}