import Shader from 'shader.js';

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
  constructor(renderer, object) {
    this.object = object;
    this.renderer = renderer;

    this.vertexProgram = new Shader('vertex', this);
    this.fragmentProgram = new Shader('fragment', this);

    this.program = false;
    this.gl = renderer.gl;

    this.initLighting();
    this.initPositionCamera();
    this.create();
  }

  /**
   * Update program values
   *
   * @method assignValues
   */
  assignValues() {
    var i,
      vertexProgram = this.vertexProgram,
      fragmentProgram = this.fragmentProgram;

    for (i in vertexProgram._variables) {
      if (vertexProgram._variables[i].change) {
        vertexProgram._variables[i].change();
      }
    }

    for (i in fragmentProgram._variables) {
      if (fragmentProgram._variables[i].change) {
        fragmentProgram._variables[i].change();
      }
    }
  }

  /**
   * Initiate position and camera shader
   *
   * @method initPositionCamera
   */
  initPositionCamera() {
    var obj = this.object,
      buffers = obj.buffers,
      vertexProgram = this.vertexProgram,
      renderer = this.renderer;

    var position = vertexProgram.attribute('vec3', function () {
      this.value(buffers.vertices);
    });

    var pMatrix = vertexProgram.uniform('mat4', function () {
      this.value(renderer.camera.matrix);
    });

    var mvMatrix = vertexProgram.uniform('mat4', function () {
      this.value(obj.getMatrix(renderer.camera));
    });

    vertexProgram.code('gl_Position = %p * %m * vec4(%v, 1.0);', {
      p: pMatrix,
      m: mvMatrix,
      v: position
    });
  }

  /**
   * Initiate lighting program
   *
   * @method initLighting
   */
  initLighting() {
    var obj = this.object,
      vertexProgram = this.vertexProgram,
      fragmentProgram = this.fragmentProgram,
      renderer = this.renderer,
      world = renderer.world;

    fragmentProgram.precision('mediump', 'float');

    var color = fragmentProgram.uniform('vec3', function () {
      this.value(obj.color.toArray());
    }, 'vColor');

    if (world.lights.length > 0) {
      vertexProgram.attribute('vec3', function () {
        this.value(obj.buffers.normals);
      }, 'vNormal');

      vertexProgram.uniform('mat3', function () {
        var mvMatrix = obj.getMatrix(renderer.camera);
        var nMatrix = mvMatrix.toInverseMat3().transpose();
        this.value(nMatrix);
      }, 'nMatrix');


      vertexProgram.code('vec3 transformedNormal = nMatrix * vNormal; %lw = vec3(0.0, 0.0, 0.0);', {
        lw: vertexProgram.varying('vec3', 'lightWeight')
      });

      for (var i in world.lights) {
        world.lights[i].program(vertexProgram, fragmentProgram);
      }

      fragmentProgram.code('gl_FragColor = vec4(%lw + %c, 1.0);', {
        c: color,
        lw: fragmentProgram.varying('vec3', 'lightWeight')
      });

    } else {

      fragmentProgram.code('gl_FragColor = vec4(%c, 1.0);', {
        c: color
      });
    }
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
      throw "Could not compile shader:" + gl.getShaderInfoLog(shader);
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
    return program;
  }

}