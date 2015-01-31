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

    /**
     * Does this material has specular lighting ?
     *
     * @property specular
     * @type {boolean}
     */
    this.specular = true;

    /**
     * Does this material has diffuse lighting ?
     *
     * @property diffuse
     * @type {boolean}
     */
    this.diffuse = true;

    /**
     * Color of this material
     *
     * @property color
     * @type {Color}
     */
    this.color = new Color();
  }

}