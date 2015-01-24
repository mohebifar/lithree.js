import BaseLight from '../light/baselight.js';
import Object3D from '../object/object3d.js';

export default
class World {

  constructor() {
    this.children = [];
    this.lights = [];
  }

  add(object) {
    if(object.type === 'light') {
      this.lights.push(object);
    } else if(object.type === 'object') {
      this.children.push(object);
    }
  }

  remove(object) {
    if(object.type === 'light') {
      this.lights.splice(this.lights.indexOf(object), 1);
    } else if(object.type === 'object') {
      this.children.splice(this.children.indexOf(object), 1);
    }
  }

}