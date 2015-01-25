import Attribute from 'attribute.js';
import Uniform from 'uniform.js';

var tmpId = 0;

export default
class ShaderProgram {
  constructor(type, programmer) {
    this._variables = {};
    this._programmer = programmer;
    this._parameters = {};
    this._code = '';
    this.type = type;
  }

  init() {
    for (var i in this._variables) {
      if(typeof this._variables[i].create !== 'undefined') {
        this._variables[i].create();
      }
    }
  }

  uniform(type, callback = null, name = 'tmp_' + tmpId++) {
    var uniform = new Uniform(type, name, this._programmer);
    uniform.onchange = callback;
    this._variables[name] = uniform;
    return uniform;
  }

  attribute(type, callback = null, name = 'tmp_' + tmpId++) {
    var attribute = new Attribute(type, name, this._programmer);
    attribute.onchange = callback;
    this._variables[name] = attribute;
    return attribute;
  }

  varying(type, name = 'tmp_' + tmpId++) {
    this._variables[name] = {name: name, type: type, prefix: 'varying'};

    return this._variables[name];
  }

  precision(rule, type) {
    var name = 'tmp_' + tmpId++;
    this._variables[name] = {name: type, type: rule, prefix: 'precision'};

    return this._variables[name];
  }

  bind(name, value) {
    if(typeof value === 'string') {
      value = this.getVariable(value);
    }

    this._parameters[name] = value;

    return this;
  }

  code(code, params) {
    this._code += code;

    if (typeof params !== 'undefined') {
      for (var i in params) {
        this.bind(i, params[i]);
      }
    }

    return this;
  }

  getVariable(name) {
    if(typeof this._variables[name] !== 'undefined') {
      return this._variables[name];
    } else {
      throw `The variable ${name} is not set.`;
    }
  }

  toString() {
    var i, code = '';

    for (i in this._variables) {
      var variable = this._variables[i];

      if (variable instanceof Uniform) {
        code += `uniform ${variable.type} ${variable.name};`;
      } else if (variable instanceof Attribute) {
        code += `attribute ${variable.type} ${variable.name};`;
      } else if (typeof variable === 'object') {
        code += `${variable.prefix} ${variable.type} ${variable.name};`;
      }
    }

    var mainCode = this._code;

    for (i in this._parameters) {
      var variable = this._parameters[i];

      mainCode = mainCode.replace(new RegExp(`\%${i}`, 'gm'), variable.name);
    }

    code += `void main() { ${mainCode} }`;

    return code;
  }
}