import Vector3 from '../math/vector3.js';
import BaseLight from 'baselight.js';

/**
 * Directional light class
 *
 * @class DirectionalLight
 */
export default
class DirectionalLight extends BaseLight {

  /**
   * Constructor of DirectionalLight
   *
   * @method constructor
   */
  constructor() {
    super();
    this.color = new Color(1, 1, 1);
    this.direction = new Vector3(1, 1, 1);
  }

  /**
   * Inject codes to shader to affect light
   *
   * @method program
   * @param vertexProgram
   * @param fragmentProgram
   */
  program(vertexProgram, fragmentProgram) {

    var _this = this;

    var lightDirection = vertexProgram.uniform('vec3', function () {
      this.value(_this.direction);
    });

    var color = vertexProgram.uniform('vec3', function () {
      this.value(_this.color.toArray());
    });

    vertexProgram.code(`%lw += %c * max(dot(transformedNormal, %ld), 0.0);`, {
      lw: 'lightWeight',
      ld: lightDirection,
      c: color
    });
  }

}