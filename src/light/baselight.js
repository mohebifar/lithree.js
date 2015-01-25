var lightId = 0;

export default
class BaseLight {

  constructor() {
    this.index = lightId++;
    this.type = 'light';
  }

}