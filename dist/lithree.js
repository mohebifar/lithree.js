(function(root) {"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var PerspectiveCamera = (function () {
  function PerspectiveCamera() {
    var fovy = arguments[0] === undefined ? 0.785398 : arguments[0];
    var aspect = arguments[1] === undefined ? 1 : arguments[1];
    var near = arguments[2] === undefined ? 0.1 : arguments[2];
    var far = arguments[3] === undefined ? 100 : arguments[3];
    this.fovy = fovy;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.matrix = new Matrix4();
    this.lookAt = new Vector3();
    this.position = new Vector3();
    this.up = new Vector3();
    this._zoom = 1;
  }

  _prototypeProperties(PerspectiveCamera, null, {
    zoom: {
      set: function (zoom) {
        if (zoom < 0) {
          throw "Zoom should be equal or greater than 0";
        }

        this._zoom = zoom;
      },
      get: function () {
        return this._zoom;
      },
      enumerable: true,
      configurable: true
    },
    updatePerspective: {
      value: function updatePerspective() {
        var fovy = 2 * Math.atan(Math.tan(this.fovy * 0.5) / this._zoom);
        this.matrix.perspective(fovy, this.aspect, this.near, this.far);
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return PerspectiveCamera;
})();"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var Color = (function () {
  function Color() {
    var r = arguments[0] === undefined ? 1 : arguments[0];
    var g = arguments[1] === undefined ? 1 : arguments[1];
    var b = arguments[2] === undefined ? 1 : arguments[2];
    var alpha = arguments[3] === undefined ? 1 : arguments[3];
    this.array = [r, g, b, alpha];
  }

  _prototypeProperties(Color, null, {
    hex: {
      set: function (hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
          return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        this.array[0] = parseInt(result[1], 16) / 255;
        this.array[1] = parseInt(result[2], 16) / 255;
        this.array[2] = parseInt(result[3], 16) / 255;
      },
      get: function () {
        var componentToHex = function (c) {
          var hex = c.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        };

        return "#" + componentToHex(this.array[0]) + componentToHex(this.array[1]) + componentToHex(this.array[2]);
      },
      enumerable: true,
      configurable: true
    },
    rgb: {
      value: function rgb(r, g, b) {
        this.array[0] = r;
        this.array[1] = g;
        this.array[2] = b;
        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    alpha: {
      value: function alpha(alpha) {
        this.array[3] = alpha;
        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    rgba: {
      value: function rgba(r, g, b, alpha) {
        this.rgb(r, g, b);
        this.alpha(alpha);
        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    toArray: {
      value: function toArray() {
        var size = arguments[0] === undefined ? 3 : arguments[0];
        return this.array.slice(0, size);
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Color;
})();"use strict";

var Common = {};

if (!WebGLRenderingContext) {
  Common.support = false;
} else {
  var GL = WebGLRenderingContext;

  Common = {
    support: true,
    drawingMode: {
      POINTS: GL.POINTS,
      LINES: GL.LINES,
      LINE_LOOP: GL.LINE_LOOP,
      LINE_STRIP: GL.LINE_STRIP,
      TRIANGLES: GL.TRIANGLES,
      TRIANGLE_FAN: GL.TRIANGLE_FAN,
      TRIANGLE_STRIP: GL.TRIANGLE_STRIP
    },
    drawingFunctions: {
      ARRAYS: 1,
      ELEMENTS: 0
    }
  };
}"use strict";

function computeNormal() {}"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var World = (function () {
  function World() {
    this.children = [];
    this.lights = [];
  }

  _prototypeProperties(World, null, {
    add: {
      value: function add(object) {
        if (object.type === "light") {
          this.lights.push(object);
        } else if (object.type === "object") {
          this.children.push(object);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    remove: {
      value: function remove(object) {
        if (object.type === "light") {
          this.lights.splice(this.lights.indexOf(object), 1);
        } else if (object.type === "object") {
          this.children.splice(this.children.indexOf(object), 1);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return World;
})();"use strict";

var lightId = 0;

var BaseLight = function BaseLight() {
  this.index = lightId++;
  this.type = "light";
};"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _get = function get(object, property, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === undefined) {
      return undefined;
    }
    return getter.call(receiver);
  }
};

var _inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

/**
 * Directional light class
 *
 * @class DirectionalLight
 */
var DirectionalLight = (function (BaseLight) {
  /**
   * Constructor of DirectionalLight
   *
   * @method constructor
   */
  function DirectionalLight() {
    _get(Object.getPrototypeOf(DirectionalLight.prototype), "constructor", this).call(this);
    this.color = new Color(1, 1, 1);
    this.direction = new Vector3(1, 1, 1);
  }

  _inherits(DirectionalLight, BaseLight);

  _prototypeProperties(DirectionalLight, null, {
    program: {

      /**
       * Inject codes to shader to affect light
       *
       * @method program
       * @param vertexProgram
       * @param fragmentProgram
       */
      value: function program(vertexProgram, fragmentProgram) {
        var _this = this;

        var lightDirection = vertexProgram.uniform("vec3", function () {
          this.value(_this.direction);
        });

        var color = vertexProgram.uniform("vec3", function () {
          this.value(_this.color.toArray());
        });

        vertexProgram.code("%lw += %c * max(dot(transformedNormal, %ld), 0.0);", {
          lw: "lightWeight",
          ld: lightDirection,
          c: color
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return DirectionalLight;
})(BaseLight);"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _get = function get(object, property, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === undefined) {
      return undefined;
    }
    return getter.call(receiver);
  }
};

var _inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

var PointLight = (function (BaseLight) {
  function PointLight() {
    _get(Object.getPrototypeOf(PointLight.prototype), "constructor", this).call(this);
    this.specularColor = new Color(1, 1, 1);
    this.diffuseColor = new Color(1, 1, 1);
    this.position = new Vector3(-10, 4, -20);
  }

  _inherits(PointLight, BaseLight);

  _prototypeProperties(PointLight, null, {
    program: {
      value: function program(vertexProgram, fragmentProgram) {
        var _this = this;

        var specularColor = vertexProgram.uniform("vec3", function () {
          this.value(_this.specularColor.toArray());
        });

        var diffuseColor = vertexProgram.uniform("vec3", function () {
          this.value(_this.diffuseColor.toArray());
        });

        var lightPosition = vertexProgram.uniform("vec3", function () {
          this.value(_this.position);
        });

        vertexProgram.code("\nvec3 lightDirection = normalize(%lp - %vp.xyz);\nfloat %sw = 0.0;\n\nif (bSpecular) {\n  %sw = pow(max(dot(reflect(-lightDirection, normal), normalize(-%vp.xyz)), 0.0), fShininess);\n}\n\nfloat %dw = max(dot(normal, lightDirection), 0.0);\n%lw += %sc * %sw + %dc * %dw;\n            ", {
          sc: specularColor,
          dc: diffuseColor,
          lp: lightPosition,
          ld: "lightDirection" + this.index,
          vp: "vPosition",
          sw: "specularLightWeighting" + this.index,
          dw: "diffuseLightWeighting" + this.index,
          lw: "lightWeight",
          fs: "fShininess"
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return PointLight;
})(BaseLight);"use strict";

var Material = function Material() {
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
};"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

var Matrix3 = (function (Array) {
  function Matrix3() {
    for (var i = 9; i--;) {
      this.push(0);
    }
  }

  _inherits(Matrix3, Array);

  _prototypeProperties(Matrix3, null, {
    transpose: {
      value: function transpose() {
        var a01 = this[1],
            a02 = this[2];
        var a12 = this[5];

        this[1] = this[3];
        this[2] = this[6];
        this[3] = a01;
        this[5] = this[7];
        this[6] = a02;
        this[7] = a12;
        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    toArray: {
      value: function toArray() {
        var result = [];

        for (var i = 9; i--;) {
          result[i] = this[i];
        }

        return result;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Matrix3;
})(Array);"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

var EPSILON = 0.00001;

var Matrix4 = (function (Array) {
  /**
   * Matrix4 Constructor
   *
   * @method constructor
   */
  function Matrix4() {
    for (var i = 16; i--;) {
      this.push(0);
    }
  }

  _inherits(Matrix4, Array);

  _prototypeProperties(Matrix4, null, {
    identity: {

      /**
       * Makes this matrix an identity matrix
       *
       * @method identity
       * @returns {Matrix4}
       */
      value: function identity() {
        for (var i = 16; i--;) {
          this[i] = i % 5 === 0 ? 1 : 0;
        }

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    determinant: {

      /**
       * Calculates and return determinant of this matrix
       *
       * @method determinant
       * @returns {number}
       */
      value: function determinant() {
        var a00 = this[0],
            a01 = this[1],
            a02 = this[2],
            a03 = this[3],
            a10 = this[4],
            a11 = this[5],
            a12 = this[6],
            a13 = this[7],
            a20 = this[8],
            a21 = this[9],
            a22 = this[10],
            a23 = this[11],
            a30 = this[12],
            a31 = this[13],
            a32 = this[14],
            a33 = this[15],
            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32;

        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    perspective: {
      value: function perspective(fovy, aspect, near, far) {
        var f = 1 / Math.tan(fovy / 2),
            nf = 1 / (near - far);

        this[0] = f / aspect;
        this[1] = 0;
        this[2] = 0;
        this[3] = 0;
        this[4] = 0;
        this[5] = f;
        this[6] = 0;
        this[7] = 0;
        this[8] = 0;
        this[9] = 0;
        this[10] = (far + near) * nf;
        this[11] = -1;
        this[12] = 0;
        this[13] = 0;
        this[14] = 2 * far * near * nf;
        this[15] = 0;

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    lookAt: {

      /**
       *
       * @method lookAt
       * @param {Vector3} eye
       * @param {Vector3} center
       * @param {Vector3} up
       * @returns {Matrix4} The camera matrix
       */
      value: function lookAt(eye, center, up) {
        var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;

        if (Math.abs(eye.x - center.x) < EPSILON && Math.abs(eye.y - center.y) < EPSILON && Math.abs(eye.z - center.z) < EPSILON) {
          return this.identity();
        }

        z0 = eye.x - center.x;
        z1 = eye.y - center.y;
        z2 = eye.z - center.z;

        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        x0 = up.y * z2 - up.z * z1;
        x1 = up.z * z0 - up.x * z2;
        x2 = up.x * z1 - up.y * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
          x0 = 0;
          x1 = 0;
          x2 = 0;
        } else {
          len = 1 / len;
          x0 *= len;
          x1 *= len;
          x2 *= len;
        }

        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
          y0 = 0;
          y1 = 0;
          y2 = 0;
        } else {
          len = 1 / len;
          y0 *= len;
          y1 *= len;
          y2 *= len;
        }

        this[0] = x0;
        this[1] = y0;
        this[2] = z0;
        this[3] = 0;
        this[4] = x1;
        this[5] = y1;
        this[6] = z1;
        this[7] = 0;
        this[8] = x2;
        this[9] = y2;
        this[10] = z2;
        this[11] = 0;
        this[12] = -(x0 * eye.x + x1 * eye.y + x2 * eye.z);
        this[13] = -(y0 * eye.x + y1 * eye.y + y2 * eye.z);
        this[14] = -(z0 * eye.x + z1 * eye.y + z2 * eye.z);
        this[15] = 1;

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    translate: {

      /**
       * Translate this matrix by given vector
       *
       * @method translate
       * @param {Vector3} vector
       * @returns {Matrix4}
       */
      value: function translate(vector) {
        this[12] = this[0] * vector.x + this[4] * vector.y + this[8] * vector.z + this[12];
        this[13] = this[1] * vector.x + this[5] * vector.y + this[9] * vector.z + this[13];
        this[14] = this[2] * vector.x + this[6] * vector.y + this[10] * vector.z + this[14];
        this[15] = this[3] * vector.x + this[7] * vector.y + this[11] * vector.z + this[15];

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    rotate: {

      /**
       * Rotate this matrix by given angle and axis
       *
       * @param {Number} rad
       * @param {Vector3} axis
       * @returns {Matrix4}
       */
      value: function rotate(rad, axis) {
        var _axis = axis.clone(),
            s,
            c,
            t,
            a00,
            a01,
            a02,
            a03,
            a10,
            a11,
            a12,
            a13,
            a20,
            a21,
            a22,
            a23,
            b00,
            b01,
            b02,
            b10,
            b11,
            b12,
            b20,
            b21,
            b22;

        _axis.normalize();

        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;

        a00 = this[0];
        a01 = this[1];
        a02 = this[2];
        a03 = this[3];
        a10 = this[4];
        a11 = this[5];
        a12 = this[6];
        a13 = this[7];
        a20 = this[8];
        a21 = this[9];
        a22 = this[10];
        a23 = this[11];

        // Construct the elements of the rotation matrix
        b00 = _axis.x * _axis.x * t + c;
        b01 = _axis.y * _axis.x * t + _axis.z * s;
        b02 = _axis.z * _axis.x * t - _axis.y * s;
        b10 = _axis.x * _axis.y * t - _axis.z * s;
        b11 = _axis.y * _axis.y * t + c;
        b12 = _axis.z * _axis.y * t + _axis.x * s;
        b20 = _axis.x * _axis.z * t + _axis.y * s;
        b21 = _axis.y * _axis.z * t - _axis.x * s;
        b22 = _axis.z * _axis.z * t + c;

        // Perform rotation-specific matrix multiplication
        this[0] = a00 * b00 + a10 * b01 + a20 * b02;
        this[1] = a01 * b00 + a11 * b01 + a21 * b02;
        this[2] = a02 * b00 + a12 * b01 + a22 * b02;
        this[3] = a03 * b00 + a13 * b01 + a23 * b02;
        this[4] = a00 * b10 + a10 * b11 + a20 * b12;
        this[5] = a01 * b10 + a11 * b11 + a21 * b12;
        this[6] = a02 * b10 + a12 * b11 + a22 * b12;
        this[7] = a03 * b10 + a13 * b11 + a23 * b12;
        this[8] = a00 * b20 + a10 * b21 + a20 * b22;
        this[9] = a01 * b20 + a11 * b21 + a21 * b22;
        this[10] = a02 * b20 + a12 * b21 + a22 * b22;
        this[11] = a03 * b20 + a13 * b21 + a23 * b22;

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    toInverseMat3: {

      /**
       * Returns inverse matrix3
       *
       * @returns {Matrix3}
       */
      value: function toInverseMat3() {
        var a00 = this[0],
            a01 = this[1],
            a02 = this[2];
        var a10 = this[4],
            a11 = this[5],
            a12 = this[6];
        var a20 = this[8],
            a21 = this[9],
            a22 = this[10];

        var b01 = a22 * a11 - a12 * a21;
        var b11 = -a22 * a10 + a12 * a20;
        var b21 = a21 * a10 - a11 * a20;

        var d = a00 * b01 + a01 * b11 + a02 * b21;

        if (!d) {
          return null;
        }

        var id = 1 / d;

        var result = new Matrix3();

        result[0] = b01 * id;
        result[1] = (-a22 * a01 + a02 * a21) * id;
        result[2] = (a12 * a01 - a02 * a11) * id;
        result[3] = b11 * id;
        result[4] = (a22 * a00 - a02 * a20) * id;
        result[5] = (-a12 * a00 + a02 * a10) * id;
        result[6] = b21 * id;
        result[7] = (-a21 * a00 + a01 * a20) * id;
        result[8] = (a11 * a00 - a01 * a10) * id;

        return result;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    rotateX: {

      /**
       * Rotates by given angle and giving X axis
       *
       * @param {Number} rad The angle by radian
       */
      value: function rotateX(rad) {
        this.rotate(rad, new Vector3(1, 0, 0));
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    rotateY: {

      /**
       * Rotates by given angle and giving Y axis
       *
       * @param {Number} rad The angle by radian
       */
      value: function rotateY(rad) {
        this.rotate(rad, new Vector3(0, 1, 0));
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    rotateZ: {

      /**
       * Rotates by given angle and giving Z axis
       *
       * @param {Number} rad The angle by radian
       */
      value: function rotateZ(rad) {
        this.rotate(rad, new Vector3(0, 0, 1));
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    toArray: {

      /**
       * Returns an array of this matrix
       *
       * @returns {Array}
       */
      value: function toArray() {
        var result = [];

        for (var i = 16; i--;) {
          result[i] = this[i];
        }

        return result;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Matrix4;
})(Array);"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var Vector3 = (function () {
  function Vector3() {
    var x = arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments[1] === undefined ? 0 : arguments[1];
    var z = arguments[2] === undefined ? 0 : arguments[2];
    this.x = x;
    this.y = y;
    this.z = z;
  }

  _prototypeProperties(Vector3, null, {
    clone: {
      value: function clone() {
        return new Vector3(this.x, this.y, this.z);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    set: {
      value: function set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    add: {
      value: function add(value) {
        if (typeof value === "object") {
          this.x += value.x;
          this.y += value.y;
          this.z += value.z;
        } else {
          this.x += value;
          this.y += value;
          this.z += value;
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    subtract: {
      value: function subtract(value) {
        if (typeof value === "object") {
          this.x -= value.x;
          this.y -= value.y;
          this.z -= value.z;
        } else {
          this.add(-value);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    multiply: {
      value: function multiply(value) {
        if (typeof value === "object") {
          this.x *= value.x;
          this.y *= value.y;
          this.z *= value.z;
        } else {
          this.x *= value;
          this.y *= value;
          this.z *= value;
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    divide: {
      value: function divide(value) {
        if (typeof value === "object") {
          this.x /= value.x;
          this.y /= value.y;
          this.z /= value.z;
        } else {
          this.multiply(1 / value);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    distance: {
      value: function distance(vector) {
        var x = vector.x - this.x,
            y = vector.y - this.y,
            z = vector.z - this.z;

        return Math.sqrt(x * x + y * y + z * z);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    getLength: {
      value: function getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    normalize: {
      value: function normalize() {
        this.divide(this.getLength());
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    dot: {
      value: function dot(vector) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    cross: {
      value: function cross(vector) {
        return new Vector3(this.y * vector.z - this.z * vector.y, this.z * vector.x - this.x * vector.z, this.x * vector.y - this.y * vector.x);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    toArray: {
      value: function toArray() {
        return [this.x, this.y, this.z];
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Vector3;
})();"use strict";

/**
 * Circle factory
 *
 * @function CircleFactory
 * @param {Number} [radius=1]
 * @param {Number} [steps=2]
 * @returns {Object3D}
 * @constructor
 */
function CircleFactory() {
  var radius = arguments[0] === undefined ? 1 : arguments[0];
  var steps = arguments[1] === undefined ? 20 : arguments[1];
  var i, a;

  var circle = new Object3D();

  circle.vertices.push(0, 0, 0);

  circle.vertexIndex = [];
  circle.vertexNormals = [];

  var step = Math.PI / (steps - 1);
  steps *= 2;

  for (a = 0, i = 1; i < steps; a += step, i++) {
    circle.vertices.push(Math.cos(a) * radius, Math.sin(a) * radius, 0);
  }

  for (i = 0; i < circle.vertices.length; i++) {
    circle.vertexNormals.push(0, 0, 1);
  }

  for (i = 0; i < circle.vertices.length / 3; i++) {
    circle.vertexIndex.push(i);
  }

  circle.darwingFunction = Common.drawingFunctions.ELEMENTS;
  circle.drawingMode = Common.drawingMode.TRIANGLE_FAN;

  return circle;
}"use strict";

/**
 * Cube factory
 *
 * @function CubeFactory
 * @param {Number} [size=1]
 * @returns {Object3D}
 * @constructor
 */
function CubeFactory() {
  var size = arguments[0] === undefined ? 1 : arguments[0];
  var cube = new Object3D();

  cube.vertices = [
  // Front face
  -size, -size, size, size, -size, size, size, size, size, -size, size, size,

  // Back face
  -size, -size, -size, -size, size, -size, size, size, -size, size, -size, -size,

  // Top face
  -size, size, -size, -size, size, size, size, size, size, size, size, -size,

  // Bottom face
  -size, -size, -size, size, -size, -size, size, -size, size, -size, -size, size,

  // Right face
  size, -size, -size, size, size, -size, size, size, size, size, -size, size,

  // Left face
  -size, -size, -size, -size, -size, size, -size, size, size, -size, size, -size];

  cube.vertexIndex = [0, 1, 2, 0, 2, 3, // Front face
  4, 5, 6, 4, 6, 7, // Back face
  8, 9, 10, 8, 10, 11, // Top face
  12, 13, 14, 12, 14, 15, // Bottom face
  16, 17, 18, 16, 18, 19, // Right face
  20, 21, 22, 20, 22, 23 // Left face
  ];

  cube.vertexNormals = [
  // Front face
  0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

  // Back face
  0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

  // Top face
  0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,

  // Bottom face
  0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,

  // Right face
  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

  // Left face
  -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0];

  cube.darwingFunction = Common.drawingFunctions.ELEMENTS;
  cube.drawingMode = Common.drawingMode.TRIANGLES;

  return cube;
}"use strict";

/**
 * Cylinder factory
 *
 * @function CylinderFactory
 * @param {Number} [height=2]
 * @param {Number} [radiusTop=1]
 * @param {Number} [radiusBottom=1]
 * @param {Number} [steps=20]
 * @returns {Object3D}
 * @constructor
 */
function CylinderFactory() {
  var height = arguments[0] === undefined ? 2 : arguments[0];
  var radiusTop = arguments[1] === undefined ? 1 : arguments[1];
  var radiusBottom = arguments[2] === undefined ? 1 : arguments[2];
  var steps = arguments[3] === undefined ? 20 : arguments[3];
  var i, a;

  var cylinder = new Object3D();

  cylinder.vertexIndex = [];
  cylinder.vertexNormals = [];

  var step = Math.PI / (steps - 1);

  steps *= 2;

  var heightTop = height / 2,
      heightBottom = height / -2;

  for (a = 0, i = 1; i <= steps; a += step, i++) {
    var positionTop = new Vector3(Math.cos(a) * radiusTop, Math.sin(a) * radiusTop, heightTop);
    var positionBottom = new Vector3(Math.cos(a) * radiusBottom, Math.sin(a) * radiusBottom, heightBottom);

    var crossed = positionTop.cross(positionBottom);

    cylinder.vertexNormals.push(crossed.x, crossed.y, crossed.z);
    cylinder.vertexNormals.push(crossed.x, crossed.y, crossed.z);

    cylinder.vertices.push(positionTop.x, positionTop.y, positionTop.z);
    cylinder.vertices.push(positionBottom.x, positionBottom.y, positionBottom.z);
  }

  for (i = 0; i < cylinder.vertices.length / 3; i++) {
    cylinder.vertexIndex.push(i);
  }

  cylinder.darwingFunction = Common.drawingFunctions.ELEMENTS;
  cylinder.drawingMode = Common.drawingMode.TRIANGLE_STRIP;

  return cylinder;
}"use strict";

/**
 * Sphere factory
 *
 * @function SphereFactory
 * @param {Number} [radius=1]
 * @param {Number} [latitudeBands=30]
 * @param {Number} [longitudeBands=30]
 * @returns {Object3D}
 * @constructor
 */
function SphereFactory() {
  var radius = arguments[0] === undefined ? 1 : arguments[0];
  var latitudeBands = arguments[1] === undefined ? 30 : arguments[1];
  var longitudeBands = arguments[2] === undefined ? 30 : arguments[2];
  var latNumber, longNumber;

  var sphere = new Object3D();

  var vertexPositionData = [];
  var normalData = [];
  var textureCoordData = [];

  for (latNumber = 0; latNumber <= latitudeBands; latNumber++) {
    var theta = latNumber * Math.PI / latitudeBands;
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);

    for (longNumber = 0; longNumber <= longitudeBands; longNumber++) {
      var phi = longNumber * 2 * Math.PI / longitudeBands;
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);

      var x = cosPhi * sinTheta;
      var y = cosTheta;
      var z = sinPhi * sinTheta;
      var u = 1 - longNumber / longitudeBands;
      var v = 1 - latNumber / latitudeBands;

      normalData.push(x);
      normalData.push(y);
      normalData.push(z);
      textureCoordData.push(u);
      textureCoordData.push(v);
      vertexPositionData.push(radius * x);
      vertexPositionData.push(radius * y);
      vertexPositionData.push(radius * z);
    }
  }

  var indexData = [];
  for (latNumber = 0; latNumber < latitudeBands; latNumber++) {
    for (longNumber = 0; longNumber < longitudeBands; longNumber++) {
      var first = latNumber * (longitudeBands + 1) + longNumber;
      var second = first + longitudeBands + 1;
      indexData.push(first);
      indexData.push(second);
      indexData.push(first + 1);

      indexData.push(second);
      indexData.push(second + 1);
      indexData.push(first + 1);
    }
  }

  sphere.vertexIndex = indexData;
  sphere.vertexNormals = normalData;
  sphere.vertices = vertexPositionData;

  sphere.darwingFunction = Common.drawingFunctions.ELEMENTS;
  sphere.drawingMode = Common.drawingMode.TRIANGLES;

  return sphere;
}"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var objId = 0;

var Object3D = (function () {
  /**
   * Constructor of Object3D
   *
   * @method constructor
   */
  function Object3D() {
    this.color = new Color();

    this.type = "object";

    this.scale = new Vector3();
    this.position = new Vector3();
    this.rotation = new Vector3();

    this.vertices = [];
    this.vertexNormals = false;
    this.vertexIndex = false;
    this.vertexColor = false;
    this.textureCoords = false;

    this.index = objId++;

    this.buffers = {};

    this.material = new Material();

    this.drawingMode = Common.drawingMode.LINE_STRIP;
    this.darwingFunction = Common.drawingFunctions.ARRAYS;
  }

  _prototypeProperties(Object3D, null, {
    getMatrix: {

      /**
       * Get model view of this object by given camera
       *
       * @param camera
       * @returns {Matrix4}
       */
      value: function getMatrix(camera) {
        var mvMatrix = new Matrix4();

        mvMatrix.lookAt(camera.position, camera.lookAt, camera.up);

        mvMatrix.translate(this.position);

        mvMatrix.rotateX(this.rotation.x);
        mvMatrix.rotateY(this.rotation.y);
        mvMatrix.rotateZ(this.rotation.z);

        return mvMatrix;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Object3D;
})();"use strict";

/**
 * Renderer base class
 *
 * @class Renderer
 */
var Renderer = function Renderer() {
  var width = arguments[0] === undefined ? 640 : arguments[0];
  var height = arguments[1] === undefined ? 480 : arguments[1];
  this.width = width;
  this.height = height;
};"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var _get = function get(object, property, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === undefined) {
      return undefined;
    }
    return getter.call(receiver);
  }
};

var _inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) subClass.__proto__ = superClass;
};

/**
 * Renderer for WebGL canvaas
 *
 * @class WebGLRenderer
 */
var WebGLRenderer = (function (Renderer) {
  /**
   * Constructs a new WebGl Renderer
   *
   * @param {Number} width
   * @param {Number} height
   * @param {World} world
   */
  function WebGLRenderer(width, height, world) {
    var color = arguments[3] === undefined ? null : arguments[3];
    _get(Object.getPrototypeOf(WebGLRenderer.prototype), "constructor", this).call(this, width, height);

    this.world = world;
    this.camera = new PerspectiveCamera();

    this.camera.aspect = this.width / this.height;
    this.camera.updatePerspective();

    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("width", this.width);
    this.canvas.setAttribute("height", this.height);
    this.color = color;

    this.initGl();
  }

  _inherits(WebGLRenderer, Renderer);

  _prototypeProperties(WebGLRenderer, null, {
    initGl: {

      /**
       * Initiate the WebGl context
       *
       * @method initGl
       */
      value: function initGl() {
        /**
         * The WebGl Rendering context
         *
         * @type {WebGLRenderingContext}
         */
        this.gl = this.canvas.getContext("experimental-webgl");

        this.gl.viewportWidth = this.canvas.width;
        this.gl.viewportHeight = this.canvas.height;

        if (this.color !== null) {
          this.gl.clearColor(this.color[0], this.color[1], this.color[2], this.color[3]);
        }

        this.gl.enable(this.gl.DEPTH_TEST);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    initShapes: {

      /**
       * Initiate shapes with buffers and shader
       *
       * @method initShapes
       */
      value: function initShapes() {
        for (var i = this.world.children.length; i--;) {
          var object = this.world.children[i];

          object.shader = new ShaderProgrammer(this, object);

          object.buffers.vertices = this.gl.createBuffer();

          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.buffers.vertices);
          this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(object.vertices), this.gl.STATIC_DRAW);

          object.buffers.vertices.itemSize = 3;
          object.buffers.vertices.numItems = object.vertices.length / 3;

          if (object.vertexColor) {
            object.buffers.vertexColor = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.buffers.vertexColor);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(object.vertexColor), this.gl.STATIC_DRAW);

            object.buffers.vertexColor.itemSize = 4;
            object.buffers.vertexColor.numItems = object.vertexColor.length;
          }

          if (object.vertexNormals) {
            object.buffers.normals = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, object.buffers.normals);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(object.vertexNormals), this.gl.STATIC_DRAW);

            object.buffers.normals.itemSize = 3;
            object.buffers.normals.numItems = object.vertexNormals.length;
          }

          if (object.vertexIndex) {
            object.buffers.vertexIndex = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, object.buffers.vertexIndex);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(object.vertexIndex), this.gl.STATIC_DRAW);

            object.buffers.vertexIndex.itemSize = 1;
            object.buffers.vertexIndex.numItems = object.vertexIndex.length;
          }
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    draw: {

      /**
       * Draw the scene.
       *
       * @method draw
       */
      value: function draw() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        for (var i = this.world.children.length; i--;) {
          var object = this.world.children[i];
          var buffers = object.buffers;

          object.shader.use();
          object.shader.assignValues();

          if (object.darwingFunction === Common.drawingFunctions.ELEMENTS) {
            this.gl.drawElements(object.drawingMode, buffers.vertexIndex.numItems, this.gl.UNSIGNED_SHORT, 0);
          } else if (object.darwingFunction === Common.drawingFunctions.ARRAYS) {
            this.gl.drawArrays(object.drawingMode, 0, buffers.vertices.numItems);
          }
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return WebGLRenderer;
})(Renderer);"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

/**
 * Class Attribute for vertex program
 *
 * @class Attribute
 */
var Attribute = (function () {
  /**
   * Constructor of Attribute
   *
   * @method constructor
   * @param {String} type
   * @param {String} name
   * @param {ShaderProgrammer} programmer
   */
  function Attribute(type, name, programmer) {
    this.type = type;
    this.name = name;

    this.onupdate = null;

    this._porgrammer = programmer;
  }

  _prototypeProperties(Attribute, null, {
    create: {

      /**
       * Allocate location for this attribute
       *
       * @method create
       */
      value: function create() {
        var gl = this._porgrammer.renderer.gl;
        this.location = gl.getAttribLocation(this._porgrammer.program, this.name);
        gl.enableVertexAttribArray(this.location);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    update: {

      /**
       * Call update function for this variable
       *
       * @method update
       */
      value: function update() {
        if (typeof this.onupdate === "function") {
          this.onupdate.apply(this);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    value: {

      /**
       * Set value for this attribute
       *
       * @param value
       */
      value: function value(value) {
        var gl = this._porgrammer.gl;

        if (value instanceof WebGLBuffer) {
          gl.bindBuffer(gl.ARRAY_BUFFER, value);
          gl.vertexAttribPointer(this.location, value.itemSize, gl.FLOAT, false, 0, 0);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Attribute;
})();"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

/**
 * This class is used to create and compile a glsl program.
 *
 * @author Mohamad Mohebifar
 */
var ShaderProgrammer = (function () {
  /**
   * Shader Programmer Constructor
   *
   * @param renderer
   * @param object
   */
  function ShaderProgrammer(renderer, object) {
    this.object = object;
    this.renderer = renderer;

    this.vertexProgram = new Shader("vertex", this);
    this.fragmentProgram = new Shader("fragment", this);

    this.program = false;
    this.gl = renderer.gl;

    this.initLighting();
    this.initPositionCamera();
    this.create();
  }

  _prototypeProperties(ShaderProgrammer, null, {
    assignValues: {

      /**
       * Update program values
       *
       * @method assignValues
       */
      value: function assignValues() {
        var i,
            vertexProgram = this.vertexProgram,
            fragmentProgram = this.fragmentProgram;

        for (i in vertexProgram._variables) {
          if (vertexProgram._variables[i].update) {
            vertexProgram._variables[i].update();
          }
        }

        for (i in fragmentProgram._variables) {
          if (fragmentProgram._variables[i].update) {
            fragmentProgram._variables[i].update();
          }
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    initPositionCamera: {

      /**
       * Initiate position and camera shader
       *
       * @method initPositionCamera
       */
      value: function initPositionCamera() {
        var obj = this.object,
            buffers = obj.buffers,
            vertexProgram = this.vertexProgram,
            renderer = this.renderer;

        var position = vertexProgram.attribute("vec3", function () {
          this.value(buffers.vertices);
        }, "vPosition");

        var pMatrix = vertexProgram.uniform("mat4", function () {
          this.value(renderer.camera.matrix);
        }, "pMatrix");

        var mvMatrix = vertexProgram.uniform("mat4", function () {
          this.value(obj.getMatrix(renderer.camera));
        }, "mvMatrix");

        vertexProgram.code("gl_Position = %p * %m * vec4(%v, 1.0);", {
          p: pMatrix,
          m: mvMatrix,
          v: position
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    initLighting: {

      /**
       * Initiate lighting program
       *
       * @method initLighting
       */
      value: function initLighting() {
        var obj = this.object,
            vertexProgram = this.vertexProgram,
            fragmentProgram = this.fragmentProgram,
            renderer = this.renderer,
            world = renderer.world;

        fragmentProgram.precision("mediump", "float");

        var color = fragmentProgram.uniform("vec3", function () {
          this.value(obj.color.toArray());
        }, "vColor");

        if (world.lights.length > 0) {
          vertexProgram.attribute("vec3", function () {
            this.value(obj.buffers.normals);
          }, "vNormal");

          vertexProgram.uniform("mat3", function () {
            var mvMatrix = obj.getMatrix(renderer.camera);
            var nMatrix = mvMatrix.toInverseMat3().transpose();
            this.value(nMatrix);
          }, "nMatrix");

          vertexProgram.uniform("float", function () {
            this.value(obj.material.shininess);
          }, "fShininess");

          vertexProgram.uniform("bool", function () {
            this.value(obj.material.specular);
          }, "bSpecular");

          vertexProgram.code("vec3 transformedNormal = nMatrix * vNormal;");
          vertexProgram.code("vec3 normal = normalize(transformedNormal);");
          vertexProgram.code("%lw = vec3(0.0, 0.0, 0.0);", {
            lw: vertexProgram.varying("vec3", "lightWeight")
          });

          for (var i in world.lights) {
            world.lights[i].program(vertexProgram, fragmentProgram);
          }

          fragmentProgram.code("gl_FragColor = vec4(%lw + %c, 1.0);", {
            c: color,
            lw: fragmentProgram.varying("vec3", "lightWeight")
          });
        } else {
          fragmentProgram.code("gl_FragColor = vec4(%c, 1.0);", {
            c: color
          });
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    use: {

      /**
       * Use this program.
       *
       * @method use
       */
      value: function use() {
        this.gl.useProgram(this.program);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    compile: {

      /**
       * Creates and compiles a shader.
       *
       * @method compile
       * @param {string} source The GLSL source code for the shader.
       * @param {number} shaderType The type of shader, VERTEX_SHADER or FRAGMENT_SHADER.
       * @return {WebGLShader} The shader.
       */
      value: function compile(source, shaderType) {
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
          throw "Could not compile shader:\n" + gl.getShaderInfoLog(shader) + "\n" + source;
        }

        return shader;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    create: {

      /**
       * Create an instance of WebGLProgram
       *
       * @returns {WebGLProgram}
       */
      value: function create() {
        var gl = this.gl;
        var program = gl.createProgram();

        gl.attachShader(program, this.compile(this.vertexProgram.toString(), gl.VERTEX_SHADER));
        gl.attachShader(program, this.compile(this.fragmentProgram.toString(), gl.FRAGMENT_SHADER));

        gl.linkProgram(program);

        var success = gl.getProgramParameter(program, gl.LINK_STATUS);

        if (!success) {
          // something went wrong with the link
          throw "Program failed to link:" + gl.getProgramInfoLog(program);
        }

        this.program = program;

        this.vertexProgram.init();
        this.fragmentProgram.init();
        return program;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return ShaderProgrammer;
})();"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var tmpId = 0;

/**
 * This class represents a shader program (vertex shader, fragment shader)
 *
 * @class Shader
 */
var Shader = (function () {
  /**
   * Constructor of Shader
   *
   * @method constructor
   * @param type
   * @param programmer
   */
  function Shader(type, programmer) {
    this._variables = {};
    this._programmer = programmer;
    this._code = "";
    this.type = type;
  }

  _prototypeProperties(Shader, null, {
    init: {

      /**
       * Initiate variable by allocating location in shader program
       *
       * @method init
       */
      value: function init() {
        for (var i in this._variables) {
          if (typeof this._variables[i].create !== "undefined") {
            this._variables[i].create();
          }
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    uniform: {

      /**
       * Create a uniform in program
       *
       * @method uniform
       * @param type
       * @param callback
       * @param name
       * @returns {Uniform}
       */
      value: function uniform(type) {
        var _this = this;
        var callback = arguments[1] === undefined ? null : arguments[1];
        var name = arguments[2] === undefined ? "tmp_" + tmpId++ : arguments[2];
        return (function () {
          var uniform = new Uniform(type, name, _this._programmer);
          uniform.onupdate = callback;
          _this._variables[name] = uniform;
          return uniform;
        })();
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    attribute: {

      /**
       * Create an attribute in program
       *
       * @method attribute
       * @param type
       * @param callback
       * @param name
       * @returns {Attribute}
       */
      value: function attribute(type) {
        var _this2 = this;
        var callback = arguments[1] === undefined ? null : arguments[1];
        var name = arguments[2] === undefined ? "tmp_" + tmpId++ : arguments[2];
        return (function () {
          var attribute = new Attribute(type, name, _this2._programmer);
          attribute.onupdate = callback;
          _this2._variables[name] = attribute;
          return attribute;
        })();
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    varying: {

      /**
       * Create a varying in shader program
       *
       * @method varying
       * @param type
       * @param name
       * @returns {Object}
       */
      value: function varying(type) {
        var _this3 = this;
        var name = arguments[1] === undefined ? "tmp_" + tmpId++ : arguments[1];
        return (function () {
          _this3._variables[name] = { name: name, type: type, prefix: "varying" };

          return _this3._variables[name];
        })();
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    precision: {

      /**
       * Set a precision in shader program
       *
       * @method precision
       * @param {String} rule
       * @param {String} type
       * @returns {Object}
       */
      value: function precision(rule, type) {
        var name = "tmp_" + tmpId++;
        this._variables[name] = { name: type, type: rule, prefix: "precision" };

        return this._variables[name];
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    code: {

      /**
       * Inject some code into main context
       *
       * @param code
       * @param params
       * @returns {Shader}
       */
      value: function code(code, params) {
        var variable;

        if (typeof params !== "undefined") {
          for (var i in params) {
            variable = typeof params[i] === "object" ? params[i].name : params[i];
            code = code.replace(new RegExp("%" + i, "gm"), variable);
          }
        }

        this._code += code + "\n";

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    getVariable: {

      /**
       * Get a variable by given name
       *
       * @method getVariable
       * @throws Error if given variable is not set
       * @param name
       * @returns {Object}
       */
      value: function getVariable(name) {
        if (typeof this._variables[name] !== "undefined") {
          return this._variables[name];
        } else {
          throw "The variable " + name + " is not set.";
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    toString: {

      /**
       * Generates and returns code of shader
       *
       * @returns {String}
       */
      value: function toString() {
        var i,
            variable,
            code = "";

        for (i in this._variables) {
          variable = this._variables[i];

          if (variable instanceof Uniform) {
            code += "uniform " + variable.type + " " + variable.name + ";\n";
          } else if (variable instanceof Attribute) {
            code += "attribute " + variable.type + " " + variable.name + ";\n";
          } else if (typeof variable === "object") {
            code += "" + variable.prefix + " " + variable.type + " " + variable.name + ";\n";
          }
        }

        code += "void main() {\n" + this._code + "\n}";

        return code;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Shader;
})();"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var Uniform = (function () {
  /**
   * Constructor of Unifrom
   *
   * @method constructor
   * @param type
   * @param name
   * @param programmer
   */
  function Uniform(type, name, programmer) {
    this.type = type;
    this.name = name;

    this.onupdate = null;

    this._porgrammer = programmer;
  }

  _prototypeProperties(Uniform, null, {
    create: {

      /**
       * Allocate this uniform's location in shader program
       *
       * @method create
       */
      value: function create() {
        this.location = this._porgrammer.renderer.gl.getUniformLocation(this._porgrammer.program, this.name);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    update: {

      /**
       * Call update function for this variable
       *
       * @method update
       */
      value: function update() {
        if (typeof this.onupdate === "function") {
          this.onupdate.apply(this);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    value: {

      /**
       * Set value of this variable
       *
       * @todo Set value according to uniform type and value type
       * @method {*} value The value to set
       * @param value
       */
      value: function value(value) {
        var gl = this._porgrammer.gl;

        if (value instanceof Vector3) {
          gl.uniform3fv(this.location, value.toArray());
        } else if (value instanceof Matrix4) {
          gl.uniformMatrix4fv(this.location, false, value.toArray());
        } else if (value instanceof Matrix3) {
          gl.uniformMatrix3fv(this.location, false, value.toArray());
        } else if (typeof value === "object") {
          if (value.length === 4) {
            gl.uniform4fv(this.location, value);
          } else if (value.length === 3) {
            gl.uniform3fv(this.location, value);
          } else if (value.length === 9) {
            gl.uniformMatrix3fv(this.location, false, value);
          } else if (value.length === 16) {
            gl.uniformMatrix4fv(this.location, false, value);
          }
        } else if (typeof value === "boolean") {
          gl.uniform1i(this.location, value);
        } else {
          gl.uniform1f(this.location, value);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Uniform;
})();root.LiThree = {
  Renderer: Renderer,
  WebGLRenderer: WebGLRenderer,
  World: World,
  Object3D: Object3D,
  Camera: {
    Perspective: PerspectiveCamera
  },
  Color: Color,
  Math: {
    Vector3: Vector3,
    Matrix4: Matrix4
  },
  Light: {
    Directional: DirectionalLight,
    Point: PointLight
  },
  ObjectFactory: {
    Circle: CircleFactory,
    Cylinder: CylinderFactory,
    Cube: CubeFactory,
    Sphere: SphereFactory
  }
};
})
(this);
//# sourceMappingURL=lithree.js.map