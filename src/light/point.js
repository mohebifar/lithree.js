import Color from '../core/color.js';
import Vector3 from '../math/vector3.js';
import BaseLight from 'baselight.js';

export default
class PointLight extends BaseLight {

  constructor() {
    super();
    this.specularColor = new Color(1, 1, 1);
    this.diffuseColor = new Color(1, 1, 1);
    this.position = new Vector3(-10, 4, -20);
  }

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

    vertexProgram.code(`
vec3 lightDirection = normalize(%lp - %vp.xyz);
float %sw = 0.0;

if (bSpecular) {
  %sw = pow(max(dot(reflect(-lightDirection, normal), normalize(-%vp.xyz)), 0.0), fShininess);
}

float %dw = max(dot(normal, lightDirection), 0.0);
%lw += %sc * %sw + %dc * %dw;
            `, {
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