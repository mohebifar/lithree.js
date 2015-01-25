
export default
class PointLight extends BaseLight {

  constructor() {
    super();
    this.specularColor = new Color(.8, .8, .8);
    this.diffuseColor = new Color(.8, .8, .8);
    this.position = new Vector3(-10, 4, -20);
  }

  program(vertexProgram, fragmentProgram) {
    var _this = this;

    var specularColor = vertexProgram.uniform('vec3', function() {
      this.value(_this.specularColor);
    });

    var diffuseColor = vertexProgram.uniform('vec3', function() {
      this.value(_this.diffuseColor);
    });

    var lightPosition = vertexProgram.uniform('vec3', function() {
      this.value(_this.position);
    });

    vertexProgram.code(`vec3 lightDirection = normalize(%lp - %vp.xyz);
            float %sw = 0.0;

            if (true) {
                %sw = pow(max(dot(reflect(-lightDirection, normal), normalize(-%vp.xyz)), 0.0), 30.0);
            }

            float %dw = max(dot(normal, lightDirection), 0.0);
            %lw += vec3(1, 1, 1) * %sw + vec3(1, 1, 1) * %dw;`, {
      sc: specularColor,
      dc: diffuseColor,
      lp: lightPosition,
      ld: `lightDirection${this.index}`,
      vp: 'vPosition',
      sw: `specularLightWeighting${this.index}`,
      dw: `diffuseLightWeighting${this.index}`,
      lw: 'lightWeight'
    });
  }
}