export default
class Material {

  constructor() {
    /**
     * How shiny this material is
     *
     * @property shininess
     * @type {Number}
     */
    this.shininess = 30;

    /**
     * Does lighting affect this material ?
     *
     * @property lighting
     * @type {boolean}
     */
    this.lighting = true;
  }

}