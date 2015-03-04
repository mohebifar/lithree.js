import Attribute from 'attribute.js';
import Uniform from 'uniform.js';

var tmpId = 0;

/**
 * This class represents a shader program (vertex shader, fragment shader)
 *
 * @class Shader
 */
export default
class Shader {

  /**
   * Constructor of Shader
   *
   * @constructor
   * @param type
   * @param programmer
   */
  constructor(type, programmer) {
    this._variables = {};
    this._programmer = programmer;
    this._code = '';
    this.type = type;
  }

  /**
   * Initiate variable by allocating location in shader program
   *
   * @method init
   */
  init() {
    for (var i in this._variables) {
      if (typeof this._variables[i].create !== 'undefined') {
        this._variables[i].create();
      }
    }
  }

  /**
   * Create a uniform in program
   *
   * @method uniform
   * @param type
   * @param callback
   * @param name
   * @returns {Uniform}
   */
  uniform(type, callback = null, name = 'tmp_' + tmpId++) {
    var uniform = new Uniform(type, name, this);
    uniform.onupdate = callback;
    this._variables[name] = uniform;
    return uniform;
  }

  /**
   * Create an attribute in program
   *
   * @method attribute
   * @param type
   * @param callback
   * @param name
   * @returns {Attribute}
   */
  attribute(type, callback = null, name = 'tmp_' + tmpId++) {
    var attribute = new Attribute(type, name, this);
    attribute.onupdate = callback;
    this._variables[name] = attribute;
    return attribute;
  }

  /**
   * Create a varying in shader program
   *
   * @method varying
   * @param type
   * @param name
   * @returns {Object}
   */
  varying(type, name = 'tmp_' + tmpId++) {
    this._variables[name] = {name: name, type: type, prefix: 'varying'};

    return this._variables[name];
  }

  /**
   * Set a precision in shader program
   *
   * @method precision
   * @param {String} rule
   * @param {String} type
   * @returns {Object}
   */
  precision(rule, type) {
    var name = 'tmp_' + tmpId++;
    this._variables[name] = {name: type, type: rule, prefix: 'precision'};

    return this._variables[name];
  }

  /**
   * Inject some code into main context
   *
   * @param code
   * @param params
   * @returns {Shader}
   */
  code(code, params, line = 'append') {

    if (typeof params !== 'undefined') {
      for (var i in params) {
        let variable = typeof params[i] === 'object' ? params[i].name : params[i];
        code = code.replace(new RegExp(`\%${i}`, 'gm'), variable);
      }
    }

    if(line === 'append') {
      this._code += code + '\n';
    } else if(line === 'prepend') {
      this._code = code + '\n' + this._code;
    }

    return this;
  }

  /**
   * Get a variable by given name
   *
   * @method getVariable
   * @throws Error if given variable is not set
   * @param name
   * @returns {Object}
   */
  getVariable(name) {
    if (typeof this._variables[name] !== 'undefined') {
      return this._variables[name];
    } else {
      throw `The variable ${name} is not set.`;
    }
  }

  clear() {
    this._code = '';
  }

  /**
   * Generates and returns code of shader
   *
   * @returns {String}
   */
  toString() {
    var i, code = '';

    for (i in this._variables) {
      let variable = this._variables[i];

      if (variable instanceof Uniform) {
        code += `uniform ${variable.type} ${variable.name};\n`;
      } else if (variable instanceof Attribute) {
        code += `attribute ${variable.type} ${variable.name};\n`;
      } else if (typeof variable === 'object') {
        code += `${variable.prefix} ${variable.type} ${variable.name};\n`;
      }
    }

    code += `void main() {\n${this._code}\n}`;

    return code;
  }
}