var dl_i = 0;

export default
class DirectionalLight {
  constructor() {
    this.color = new Color(1, 1, 1);
    this.direction = [1, 1, 1];
    this.index = dl_i++;
  }
}