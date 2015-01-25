import ShaderChunks from 'shader-chunk.js';
import ShaderProgram from 'program.js';

/**
 * This class is used to create and compile a glsl program.
 *
 * @author Mohamad Mohebifar
 */
export default
class ShaderProgrammer {

  constructor(renderer, object) {
    this.object = object;
    this.renderer = renderer;
    this.uniforms = {};
    this.attributes = {};

    this.vertexProgram = new ShaderProgram('vertex', this);
    this.fragmentProgram = new ShaderProgram('fragment', this);

    this.program = false;
    this.gl = renderer.gl;

    this.initLighting();
    this.initPositionCamera();
    this.create();
  }

  vertex() {

  }

  assignValues() {
    var obj = this.object,
      buffers = obj.buffers,
      vertexProgram = this.vertexProgram,
      fragmentProgram = this.fragmentProgram;

    for (var i in vertexProgram._variables) {
      if (vertexProgram._variables[i].change) {

        vertexProgram._variables[i].change();
      }
    }

    for (var i in fragmentProgram._variables) {
      if (fragmentProgram._variables[i].change) {

        fragmentProgram._variables[i].change();
      }
    }
  }

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

  initLighting() {
    var obj = this.object,
      vertexProgram = this.vertexProgram,
      fragmentProgram = this.fragmentProgram,
      world = this.renderer.world;

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
   * Get a uniform location
   *
   * @method uniformLocation
   * @param name
   */
  uniformLocation(name) {
    this.uniforms[name] = this.gl.getUniformLocation(this.program, name);
  }

  /**
   * Get an attribute location
   *
   * @method attributeLocation
   * @param name
   */
  attributeLocation(name) {
    this.attributes[name] = this.gl.getAttribLocation(this.program, name);

    if (this.attributes[name] === -1) {
      throw `Attribute ${name} cannot be located`;
    }

  }

  /**
   * Set a uniform value
   *
   * @param name
   * @param value
   */
  uniformValue(name, value) {
    var gl = this.gl;

    if (typeof this.uniforms[name] === 'undefined') {
      this.uniformLocation(name);
    }

    if (value.length === 4) {
      gl.uniform4fv(this.uniforms[name], value);
    } else if (value.length === 3) {
      gl.uniform3fv(this.uniforms[name], value);
    } else if (value.length === 9) {
      gl.uniformMatrix3fv(this.uniforms[name], false, value);
    } else if (value.length === 16) {
      gl.uniformMatrix4fv(this.uniforms[name], false, value);
    }
  }

  /**
   * Set an attribute value
   *
   * @param name
   * @param value
   */
  attributeValue(name, value) {
    var gl = this.gl;

    if (typeof this.attributes[name] === 'undefined') {
      this.attributeLocation(name);
    }

    if (this.attributes[name] === -1) {
      return;
    }

    this.gl.vertexAttribPointer(this.attributes[name], value.itemSize, this.gl.FLOAT, false, 0, 0);
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