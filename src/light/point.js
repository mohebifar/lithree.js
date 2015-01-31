import Color from '../core/color.js';
import Vector3 from '../math/vector3.js';
import BaseLight from 'baselight.js';

/**
 * Point light class
 *
 * @class PointLight
 */
export default
class PointLight extends BaseLight {

  /**
   * Constructor of point light
   *
   * @method constructor
   */
  constructor() {
    super();
    this.specularColor = new Color(0.5, 0.5, 0.5);
    this.diffuseColor = new Color(0.3, 0.3, 0.3);
    this.position = new Vector3(-10, 4, -20);
  }

  /**
   * Inject codes to shader to affect this light
   *
   * @param vertexProgram
   * @param fragmentProgram
   */
  program(vertexProgram, fragmentProgram) {
    var _this = this;

    var specularColor = vertexProgram.uniform('vec3', function() {
      this.value(_this.specularColor.toArray());
    });

    var diffuseColor = vertexProgram.uniform('vec3', function() {
      this.value(_this.diffuseColor.toArray());
    });

    var lightPosition = vertexProgram.uniform('vec3', function() {
      this.value(_this.position);
    });

    vertexProgram.code(`vec3 %ld = normalize(%lp - %vp.xyz); float %sw = 0.0, %dw = 0.0; if (bSpecular) { %sw = pow(max(dot(reflect(-%ld, normal), normalize(-%vp.xyz)), 0.0), fShininess); } if(bDiffuse) { %dw = max(dot(normal, -%ld), 0.0); } %lw += %sc * %sw + %dc * %dw;`, {
      sc: specularColor,
      dc: diffuseColor,
      lp: lightPosition,
      ld: `lightDirection${this.index}`,
      vp: 'vPosition',
      sw: `specularLightWeighting${this.index}`,
      dw: `diffuseLightWeighting${this.index}`,
      lw: 'lightWeight',
      fs: 'fShininess'
    });
  }

}