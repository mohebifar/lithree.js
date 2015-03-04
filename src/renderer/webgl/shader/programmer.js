import Shader from 'shader.js';
import Matrix4 from '../../../math/matrix4.js';

/**
 * This class is used to create and compile a glsl program.
 *
 * @author Mohamad Mohebifar
 */
export default
class ShaderProgrammer {

  /**
   * Shader Programmer Constructor
   *
   * @param renderer
   * @param object
   */
    constructor(renderer) {

    this.renderer = renderer;

    this.vertexProgram = new Shader('vertex', this);
    this.fragmentProgram = new Shader('fragment', this);

    this.program = false;
    this.gl = renderer.gl;

    this.initPositionCamera();
    this.initLighting();
    this._isCreated = false;

  }

  /**
   * Update program values
   *
   * @method assignValues
   */
    assignValues(object) {
    var i,
      vertexProgram = this.vertexProgram,
      fragmentProgram = this.fragmentProgram;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.buffers.vertices);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(object.vertices), this.gl.STATIC_DRAW);

    object.buffers.vertices.itemSize = 3;
    object.buffers.vertices.numItems = object.vertices.length / 3;

    if (object.vertexColor) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.buffers.vertexColor);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(object.vertexColor), this.gl.STATIC_DRAW);

      object.buffers.vertexColor.itemSize = 4;
      object.buffers.vertexColor.numItems = object.vertexColor.length;
    }

    if (object.vertexNormals) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.buffers.normals);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(object.vertexNormals), this.gl.STATIC_DRAW);

      object.buffers.normals.itemSize = 3;
      object.buffers.normals.numItems = object.vertexNormals.length;
    }

    if (object.vertexIndex) {
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, object.buffers.vertexIndex);
      this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.vertexIndex), this.gl.STATIC_DRAW);

      object.buffers.vertexIndex.itemSize = 1;
      object.buffers.vertexIndex.numItems = object.vertexIndex.length;
    }

    for (i in vertexProgram._variables) {
      if (vertexProgram._variables[i].update) {
        vertexProgram._variables[i].update(object);
      }
    }

    for (i in fragmentProgram._variables) {
      if (fragmentProgram._variables[i].update) {
        fragmentProgram._variables[i].update(object);
      }
    }
  }

  /**
   * Initiate position and camera shader
   *
   * @method initPositionCamera
   */
    initPositionCamera() {

    var vertexProgram = this.vertexProgram,
      renderer = this.renderer;

    var position = vertexProgram.attribute('vec3', function (obj) {
      this.value(obj.buffers.vertices);
    }, 'vPosition');

    var pMatrix = vertexProgram.uniform('mat4', function () {
      this.value(renderer.camera.projectionMatrix);
    }, 'pMatrix');

    var vMatrix = vertexProgram.uniform('mat4', function () {
      this.value(renderer.camera.viewMatrix);
    }, 'vMatrix');

    var mMatrix = vertexProgram.uniform('mat4', function (obj) {
      this.value(obj.matrix);
    }, 'mMatrix');

    vertexProgram.code('mat4 mvMatrix = %vm * %mm; gl_Position = %p * %vm * %mm  * vec4(%vp, 1.0);', {
      p: pMatrix,
      vm: vMatrix,
      mm: mMatrix,
      vp: position
    });

  }

  /**
   * Initiate lighting program
   *
   * @method initLighting
   */
    initLighting() {

    var vertexProgram = this.vertexProgram,
      fragmentProgram = this.fragmentProgram,
      renderer = this.renderer,
      world = renderer.world;

    fragmentProgram.precision('mediump', 'float');

    vertexProgram.code(`mat3 nMatrix = mat3(mvMatrix);`);

    var color = fragmentProgram.uniform('vec3', function (obj) {
      this.value(obj.material.color.toArray());
    }, 'vColor');

    vertexProgram.attribute('vec3', function (obj) {
      this.value(obj.buffers.normals);
    }, 'vNormal');

    vertexProgram.uniform('float', function (obj) {
      this.value(obj.material.shininess);
    }, 'fShininess');

    vertexProgram.uniform('bool', function (obj) {
      this.value(obj.material.specular);
    }, 'bSpecular');

    vertexProgram.uniform('bool', function (obj) {
      this.value(obj.material.diffuse);
    }, 'bDiffuse');

    vertexProgram.code('vec3 transformedNormal = nMatrix * vNormal;');
    vertexProgram.code('vec3 normal = normalize(transformedNormal);');
    vertexProgram.code('%lw = vec3(0.0, 0.0, 0.0);', {
      lw: vertexProgram.varying('vec3', 'lightWeight')
    });

    for (var i in world.lights) {
      world.lights[i].program(vertexProgram, fragmentProgram);
    }

    fragmentProgram.code('vec4 outColor = vec4(%lw + %c, 1.0);\ngl_FragColor = outColor;', {
      c: color,
      lw: fragmentProgram.varying('vec3', 'lightWeight')
    });


    /*
     if (world.lights.length > 0) {

     } else {

     fragmentProgram.code('gl_FragColor = vec4(%c, 1.0);', {
     c: color
     });

     }
     */

  }

  /**
   * Use this program.
   *
   * @method use
   */
    use() {

    this.gl.useProgram(this.program);

  }

  /**
   * Creates and compiles a shader.
   *
   * @method compile
   * @param {string} source The GLSL source code for the shader.
   * @param {number} shaderType The type of shader, VERTEX_SHADER or FRAGMENT_SHADER.
   * @return {WebGLShader} The shader.
   */
    compile(source, shaderType) {

    var gl = this.gl;
    // Create the shader object
    var shader = gl.createShader(shaderType);

    // Set the shader source code.
    gl.shaderSource(shader, source);

    // Compile the shader
    gl.compileShader(shader);

    // Check if it compiled
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (!success) {
      // Something went wrong during compilation; get the error
      throw 'Could not compile shader:\n' + gl.getShaderInfoLog(shader) + '\n' + source;
    }

    return shader;

  }

  /**
   * Create an instance of WebGLProgram
   *
   * @returns {WebGLProgram}
   */
    create() {
    var gl = this.gl;
    var program = gl.createProgram();

    gl.attachShader(program, this.compile(this.vertexProgram.toString(), gl.VERTEX_SHADER));
    gl.attachShader(program, this.compile(this.fragmentProgram.toString(), gl.FRAGMENT_SHADER));

    gl.linkProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!success) {
      // something went wrong with the link
      throw ("Program failed to link:" + gl.getProgramInfoLog(program));
    }

    this.program = program;

    this.vertexProgram.init();
    this.fragmentProgram.init();

    this._isCreated = true;

    return program;

  }

}