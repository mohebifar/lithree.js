(function(root) {
"use strict";

var _slicedToArray = function (arr, i) {
  if (Array.isArray(arr)) {
    return arr;
  } else {
    var _arr = [];

    for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
      _arr.push(_step.value);

      if (i && _arr.length === i) break;
    }

    return _arr;
  }
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

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var PerspectiveCamera = (function () {
  /**
   * Constructor of Perspective camera
   *
   * @param {Number} [fovy=0.785398]
   * @param {Number} [aspect=1]
   * @param {Number} [near=0.1]
   * @param {Number} [far=100]
   */
  function PerspectiveCamera() {
    var fovy = arguments[0] === undefined ? 0.785398 : arguments[0];
    var aspect = arguments[1] === undefined ? 1 : arguments[1];
    var near = arguments[2] === undefined ? 0.1 : arguments[2];
    var far = arguments[3] === undefined ? 100 : arguments[3];
    this.fovy = fovy;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.projectionMatrix = new Matrix4();
    this.viewMatrix = new Matrix4();
    this.lookAt = new Vector3();
    this.position = new Vector3();
    this.rotation = new Quaternion();
    this.up = new Vector3(0, 1, 0);
    this._zoom = 1;

    var _this = this;

    _this.position.on("update", function () {
      _this.getMatrix();
    });

    _this.rotation.on("update", function () {
      _this.getMatrix();
    });

    _this.getMatrix();
  }

  _prototypeProperties(PerspectiveCamera, null, {
    zoom: {

      /**
       * Declares zoom
       *
       * @property {Number} [zoom=1]
       */
      set: function (zoom) {
        this.getProjection();

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
    getProjection: {

      /**
       * @method getProjection
       */
      value: function getProjection() {
        var fovy = 2 * Math.atan(Math.tan(this.fovy * 0.5) / this._zoom);
        this.projectionMatrix.identity();
        this.projectionMatrix.perspective(fovy, this.aspect, this.near, this.far);

        return this.projectionMatrix;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    getMatrix: {
      value: function getMatrix() {
        this.viewMatrix = Matrix4.fromRotationTranslationScaleOrigin(this.rotation, this.position, new Vector3(1, 1, 1), new Vector3());

        return this.viewMatrix;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return PerspectiveCamera;
})();

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
        hex = Math.floor(hex);

        this.array[0] = (hex >> 16 & 255) / 255;
        this.array[1] = (hex >> 8 & 255) / 255;
        this.array[2] = (hex & 255) / 255;
      },
      get: function () {
        return this.array[0] * 255 << 16 ^ this.array[1] * 255 << 8 ^ this.array[2] * 255 << 0;
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
})();

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
}

/**
 * Creates a new instance of Emitter.
 * @class
 * @returns {Object} emitter - An instance of Emitter.
 * @example
 * var emitter = new Emitter();
 */
var Emitter = (function () {
  function Emitter() {
    this._events = {};
  }

  _prototypeProperties(Emitter, null, {
    on: {

      /**
       * Adds a listener to the collection for a specified event.
       * @public
       * @function
       * @name Emitter#on
       * @param {String} event - Event name.
       * @param {Function} listener - Listener function.
       * @returns {Object} emitter
       * @example
       * emitter.on('ready', listener);
       */
      value: function on(event, listener) {
        this._events[event] = this._events[event] || [];
        this._events[event].push(listener);
        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    hasEvent: {
      value: function hasEvent(event) {
        return typeof this._events[event] !== "undefined" && this._events[event].length !== 0;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    once: {

      /**
       * Adds a one time listener to the collection for a specified event. It will execute only once.
       * @public
       * @function
       * @name Emitter#once
       * @param {String} event - Event name.
       * @param {Function} listener - Listener function.
       * @returns {Object} emitter
       * @example
       * me.once('contentLoad', listener);
       */
      value: function once(event, listener) {
        var fn = function () {
          that.off(event, fn);
          listener.apply(this, arguments);
        };

        var that = this;

        fn.listener = listener;

        this.on(event, fn);

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    off: {

      /**
       * Removes a listener from the collection for a specified event.
       * @public
       * @function
       * @name Emitter#off
       * @param {String} event - Event name.
       * @param {Function} listener -  Listener function.
       * @returns {Object} emitter
       * @example
       * me.off('ready', listener);
       */
      value: function off(event, listener) {
        var listeners = this._events[event];

        if (listeners !== undefined) {
          for (var j = 0; j < listeners.length; j += 1) {
            if (listeners[j] === listener || listeners[j].listener === listener) {
              listeners.splice(j, 1);
              break;
            }
          }

          if (listeners.length === 0) {
            this.removeAllListeners(event);
          }
        }

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    removeAllListeners: {

      /**
       * Removes all listeners from the collection for a specified event.
       * @public
       * @function
       * @name Emitter#removeAllListeners
       * @param {String} event - Event name.
       * @returns {Object} emitter
       * @example
       * me.removeAllListeners('ready');
       */
      value: function removeAllListeners(event) {
        try {
          delete this._events[event];
        } catch (e) {}

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    listeners: {

      /**
       * Returns all listeners from the collection for a specified event.
       * @public
       * @function
       * @name Emitter#listeners
       * @param {String} event - Event name.
       * @returns {Array}
       * @example
       * me.listeners('ready');
       */
      value: function listeners(event) {
        try {
          return this._events[event];
        } catch (e) {}
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    emit: {

      /**
       * Execute each item in the listener collection in order with the specified data.
       * @name Emitter#emit
       * @public
       * @function
       * @param {String} event - The name of the event you want to emit.
       * @param {...args} [args] - Data to pass to the listeners.
       * @example
       * me.emit('ready', 'param1', {..}, [...]);
       */
      value: function emit() {
        var args = [].slice.call(arguments, 0); // converted to array
        var event = args.shift();
        var listeners = this._events[event];

        if (listeners !== undefined) {
          listeners = listeners.slice(0);
          var len = listeners.length;
          for (var i = 0; i < len; i += 1) {
            listeners[i].apply(this, args);
          }
        }

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Emitter;
})();

var Interactive = (function (Emitter) {
  function Interactive(renderer) {
    _get(Object.getPrototypeOf(Interactive.prototype), "constructor", this).call(this);
    this.isDragging = false;
    this.clickFlag = false;
    this.lastPosition = { x: 0, y: 0 };
    this.renderer = renderer;
    this.delta = { x: 0, y: 0 };
    this._attachListeners();
  }

  _inherits(Interactive, Emitter);

  _prototypeProperties(Interactive, null, {
    _getPosition: {
      value: function GetPosition(x, y) {
        return [x - this.renderer.canvas.offsetLeft, y - this.renderer.canvas.offsetTop];
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    updatePosition: {
      value: function updatePosition(x, y) {
        var _getPosition = this._getPosition(x, y);

        var _getPosition2 = _slicedToArray(_getPosition, 2);

        var x = _getPosition2[0];
        var y = _getPosition2[1];


        this.delta.x = this.lastPosition.x - x;
        this.delta.y = this.lastPosition.y - y;

        this.lastPosition.x = x;
        this.lastPosition.y = y;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    unproject: {
      value: function unproject(x, y, z) {
        var camera = this.renderer.camera;

        var vector = new LiThree.Math.Vector3(x / renderer.width * 2 - 1, -(y / renderer.height) * 2 + 1, z);

        vector.unproject(camera);

        var dir = vector.subtract(camera.position).normalize();
        var distance = -camera.position.z / dir.z;

        var position = camera.position.clone().add(dir.multiply(distance));
        position.x *= -1;
        position.y *= -1;
        return position;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _attachListeners: {
      value: function AttachListeners() {
        var dom = this.renderer.canvas;
        var _this = this;

        var unproject = function unproject(z) {
          return _this.unproject(_this.lastPosition.x, _this.lastPosition.y, z);
        };

        dom.addEventListener("mousedown", function (e) {
          e.preventDefault();
          _this.isDragging = true;
          _this.updatePosition(e.clientX, e.clientY);
          _this.clickFlag = true;

          if (_this.hasEvent("start")) {
            _this.emit("start", _this.lastPosition, unproject, e);
            return false;
          }
        });

        dom.addEventListener("contextmenu", function (e) {
          e.preventDefault();
        });

        dom.addEventListener("mousemove", function (e) {
          e.preventDefault();

          if (_this.isDragging) {
            _this.clickFlag = false;
            _this.updatePosition(e.clientX, e.clientY);

            if (_this.hasEvent("drag")) {
              _this.emit("drag", _this.lastPosition, _this.delta, unproject, e);
            }
          } else if (_this.hasEvent("move")) {
            _this.updatePosition(e.clientX, e.clientY);

            _this.emit("move", _this.lastPosition, _this.delta, unproject, e);
          }
        });

        dom.addEventListener("mouseup", function (e) {
          e.preventDefault();

          _this.isDragging = false;
          _this.updatePosition(e.clientX, e.clientY);

          if (_this.hasEvent("click") && _this.clickFlag === true) {
            _this.emit("click", _this.lastPosition, unproject, e);
          } else if (_this.hasEvent("end")) {
            _this.emit("end", _this.lastPosition, unproject, e);
          }
        });

        dom.addEventListener("mousewheel", function (e) {
          e.preventDefault();

          if (_this.hasEvent("wheel")) {
            _this.emit("wheel", e.wheelDelta, e);
          }
        });

        dom.addEventListener("DOMMouseScroll", function (e) {
          e.preventDefault();

          if (_this.hasEvent("wheel")) {
            _this.emit("wheel", e.detail * -40, e);
          }
        });

        dom.addEventListener("mouseleave", function () {
          _this.isDragging = false;
        });

        dom.addEventListener("touchstart", function (e) {
          _this.updatePosition(e.touches[0].clientX, e.touches[0].clientY);
          _this.clickFlag = true;

          _this.emit("touchstart");
        });

        dom.addEventListener("touchmove", function (e) {
          _this.updatePosition(e.touches[0].clientX, e.touches[0].clientY);
          _this.clickFlag = false;

          _this.emit("touchmove", _this.lastPosition, _this.delta, unproject, e);
        });

        dom.addEventListener("touchend", function (e) {
          if (_this.hasEvent("tap") && _this.clickFlag === true) {
            _this.emit("tap", _this.lastPosition, unproject, e);
          } else if (_this.hasEvent("end")) {
            _this.emit("touchend", _this.lastPosition, unproject, e);
          }
        });
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Interactive;
})(Emitter);

function computeNormal() {}
var RayCaster = (function () {
  /**
   * @constructor
   * @param {Ray} ray
   */
  function RayCaster(ray) {
    this.ray = ray;
  }

  _prototypeProperties(RayCaster, null, {
    intersectTriangle: {
      value: function intersectTriangle(a, b, c) {
        var ray = this.ray,
            orig = ray.origin,
            dir = ray.direction,
            t,
            u,
            v;

        // find vectors for edges
        var edge1 = b.subtract(a, true);
        var edge2 = c.subtract(a, true);

        // calculate determinant
        var pvec = dir.cross(edge2);
        var det = edge1.dot(pvec);

        // calculations - CULLING ENABLED
        var tvec = orig.subtract(a, true);

        u = tvec.dot(pvec);
        if (u < 0 || u > det) {
          return null;
        }

        var qvec = tvec.cross(edge1);

        v = dir.dot(qvec);
        if (v < 0 || u + v > det) {
          return null;
        }

        t = edge2.dot(qvec);

        var inv_det = 1 / det;
        t = t * inv_det;
        u = u * inv_det;
        v = v * inv_det;

        return new Vector3(t, u, v);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    intersectObject: {
      value: function intersectObject(object) {
        if (object.drawingMode === Common.drawingMode.TRIANGLES) {}
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return RayCaster;
})();

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
})();

var lightId = 0;

var BaseLight = function BaseLight() {
  this.index = lightId++;
  this.type = "light";
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
})(BaseLight);

/**
 * Point light class
 *
 * @class PointLight
 */
var PointLight = (function (BaseLight) {
  /**
   * Constructor of point light
   *
   * @method constructor
   */
  function PointLight() {
    _get(Object.getPrototypeOf(PointLight.prototype), "constructor", this).call(this);
    this.specularColor = new Color(0.5, 0.5, 0.5);
    this.diffuseColor = new Color(0.3, 0.3, 0.3);
    this.position = new Vector3(-10, 4, -20);
  }

  _inherits(PointLight, BaseLight);

  _prototypeProperties(PointLight, null, {
    program: {

      /**
       * Inject codes to shader to affect this light
       *
       * @param vertexProgram
       * @param fragmentProgram
       */
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

        vertexProgram.code("vec3 %ld = normalize(%lp - %vp.xyz); float %sw = 0.0, %dw = 0.0; if (bSpecular) { %sw = pow(max(dot(reflect(-%ld, normal), normalize(-%vp.xyz)), 0.0), fShininess); } if(bDiffuse) { %dw = max(dot(normal, -%ld), 0.0); } %lw += %sc * %sw + %dc * %dw;", {
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
})(BaseLight);

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

  /**
   * Does this material has diffuse lighting ?
   *
   * @property diffuse
   * @type {boolean}
   */
  this.diffuse = true;

  /**
   * Color of this material
   *
   * @property color
   * @type {Color}
   */
  this.color = new Color();
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
})(Array);

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

  _prototypeProperties(Matrix4, {
    multiplyVec4: {
      value: function multiplyVec4(mat, vec) {
        var result = new Vector4();

        result.x = mat[0] * vec.x + mat[4] * vec.y + mat[8] * vec.z + mat[12] * vec.w;
        result.y = mat[1] * vec.x + mat[5] * vec.y + mat[9] * vec.z + mat[13] * vec.w;
        result.z = mat[2] * vec.x + mat[6] * vec.y + mat[10] * vec.z + mat[14] * vec.w;
        result.w = mat[3] * vec.x + mat[7] * vec.y + mat[11] * vec.z + mat[15] * vec.w;

        return result;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    multiplyMatrices: {
      value: function multiplyMatrices(a, b) {
        var result = new Matrix4();

        var a11 = a[0],
            a12 = a[4],
            a13 = a[8],
            a14 = a[12];
        var a21 = a[1],
            a22 = a[5],
            a23 = a[9],
            a24 = a[13];
        var a31 = a[2],
            a32 = a[6],
            a33 = a[10],
            a34 = a[14];
        var a41 = a[3],
            a42 = a[7],
            a43 = a[11],
            a44 = a[15];

        var b11 = b[0],
            b12 = b[4],
            b13 = b[8],
            b14 = b[12];
        var b21 = b[1],
            b22 = b[5],
            b23 = b[9],
            b24 = b[13];
        var b31 = b[2],
            b32 = b[6],
            b33 = b[10],
            b34 = b[14];
        var b41 = b[3],
            b42 = b[7],
            b43 = b[11],
            b44 = b[15];

        result[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        result[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        result[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        result[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

        result[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        result[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        result[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        result[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

        result[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        result[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        result[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        result[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

        result[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        result[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        result[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        result[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

        return result;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    fromRotationTranslationScaleOrigin: {
      value: function fromRotationTranslationScaleOrigin(q, v, s, o) {
        var x = q.x,
            y = q.y,
            z = q.z,
            w = q.w,
            x2 = x + x,
            y2 = y + y,
            z2 = z + z,
            xx = x * x2,
            xy = x * y2,
            xz = x * z2,
            yy = y * y2,
            yz = y * z2,
            zz = z * z2,
            wx = w * x2,
            wy = w * y2,
            wz = w * z2,
            sx = s.x,
            sy = s.y,
            sz = s.z,
            ox = o.x,
            oy = o.y,
            oz = o.z;

        var out = new Matrix4();
        out[0] = (1 - (yy + zz)) * sx;
        out[1] = (xy + wz) * sx;
        out[2] = (xz - wy) * sx;
        out[3] = 0;
        out[4] = (xy - wz) * sy;
        out[5] = (1 - (xx + zz)) * sy;
        out[6] = (yz + wx) * sy;
        out[7] = 0;
        out[8] = (xz + wy) * sz;
        out[9] = (yz - wx) * sz;
        out[10] = (1 - (xx + yy)) * sz;
        out[11] = 0;
        out[12] = v.x + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
        out[13] = v.y + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
        out[14] = v.z + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
        out[15] = 1;

        return out;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  }, {
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
    invert: {
      value: function invert() {
        // Cache the matrix values (makes for huge speed increases!)
        var a00 = this[0],
            a01 = this[1],
            a02 = this[2],
            a03 = this[3];
        var a10 = this[4],
            a11 = this[5],
            a12 = this[6],
            a13 = this[7];
        var a20 = this[8],
            a21 = this[9],
            a22 = this[10],
            a23 = this[11];
        var a30 = this[12],
            a31 = this[13],
            a32 = this[14],
            a33 = this[15];

        var b00 = a00 * a11 - a01 * a10;
        var b01 = a00 * a12 - a02 * a10;
        var b02 = a00 * a13 - a03 * a10;
        var b03 = a01 * a12 - a02 * a11;
        var b04 = a01 * a13 - a03 * a11;
        var b05 = a02 * a13 - a03 * a12;
        var b06 = a20 * a31 - a21 * a30;
        var b07 = a20 * a32 - a22 * a30;
        var b08 = a20 * a33 - a23 * a30;
        var b09 = a21 * a32 - a22 * a31;
        var b10 = a21 * a33 - a23 * a31;
        var b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant (inlined to avoid double-caching)
        var invDet = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

        this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
        this[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
        this[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
        this[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;
        this[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
        this[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
        this[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
        this[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
        this[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
        this[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
        this[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
        this[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;
        this[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
        this[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
        this[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
        this[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

        return this;
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
    clone: {
      value: function clone() {
        var cloned = new Matrix4();

        for (var i = 16; i--;) {
          cloned[i] = this[i];
        }

        return cloned;
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
})(Array);

var Quaternion = (function (Emitter) {
  function Quaternion() {
    var x = arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments[1] === undefined ? 0 : arguments[1];
    var z = arguments[2] === undefined ? 0 : arguments[2];
    var w = arguments[3] === undefined ? 1 : arguments[3];
    _get(Object.getPrototypeOf(Quaternion.prototype), "constructor", this).call(this);
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }

  _inherits(Quaternion, Emitter);

  _prototypeProperties(Quaternion, null, {
    x: {
      set: function (x) {
        this._x = x;

        this.emit("update");
      },
      get: function () {
        return this._x;
      },
      enumerable: true,
      configurable: true
    },
    y: {
      set: function (y) {
        this._y = y;

        this.emit("update");
      },
      get: function () {
        return this._y;
      },
      enumerable: true,
      configurable: true
    },
    z: {
      set: function (z) {
        this._z = z;

        this.emit("update");
      },
      get: function () {
        return this._z;
      },
      enumerable: true,
      configurable: true
    },
    w: {
      set: function (w) {
        this._w = w;

        this.emit("update");
      },
      get: function () {
        return this._w;
      },
      enumerable: true,
      configurable: true
    },
    setAxisAngle: {
      value: function setAxisAngle(axis, rad) {
        rad *= 0.5;
        var s = Math.sin(rad);

        this._x = s * axis.x;
        this._y = s * axis.y;
        this._z = s * axis.z;
        this._w = Math.cos(rad);

        this.emit("update");

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    normalize: {
      value: function normalize() {
        var x = this._x,
            y = this._y,
            z = this._z,
            w = this._w;

        var len = x * x + y * y + z * z + w * w;

        if (len > 0) {
          len = 1 / Math.sqrt(len);
          this._x *= len;
          this._y *= len;
          this._z *= len;
          this._w *= len;
        }

        this.emit("update");

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    rotateX: {
      value: function rotateX(rad) {
        rad *= 0.5;

        var ax = this._x,
            ay = this._y,
            az = this._z,
            aw = this._w,
            bx = Math.sin(rad),
            bw = Math.cos(rad);

        this._x = ax * bw + aw * bx;
        this._y = ay * bw + az * bx;
        this._z = az * bw - ay * bx;
        this._w = aw * bw - ax * bx;

        this.emit("update");

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    rotateY: {
      value: function rotateY(rad) {
        rad *= 0.5;

        var ax = this._x,
            ay = this._y,
            az = this._z,
            aw = this._w,
            by = Math.sin(rad),
            bw = Math.cos(rad);

        this._x = ax * bw - az * by;
        this._y = ay * bw + aw * by;
        this._z = az * bw + ax * by;
        this._w = aw * bw - ay * by;

        this.emit("update");

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    rotateZ: {
      value: function rotateZ(rad) {
        rad *= 0.5;

        var ax = this._x,
            ay = this._y,
            az = this._z,
            aw = this._w,
            bz = Math.sin(rad),
            bw = Math.cos(rad);

        this._x = ax * bw + ay * bz;
        this._y = ay * bw - ax * bz;
        this._z = az * bw + aw * bz;
        this._w = aw * bw - az * bz;

        this.emit("update");

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    multiply: {
      value: function multiply(b) {
        var ax = this.x,
            ay = this.y,
            az = this.z,
            aw = this.w,
            bx = b.x,
            by = b.y,
            bz = b.z,
            bw = b.w;

        this._x = ax * bw + aw * bx + ay * bz - az * by;
        this._y = ay * bw + aw * by + az * bx - ax * bz;
        this._z = az * bw + aw * bz + ax * by - ay * bx;
        this._w = aw * bw - ax * bx - ay * by - az * bz;

        this.emit("update");

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Quaternion;
})(Emitter);

var Ray = (function () {
  function Ray() {
    var _this = this;
    var origin = arguments[0] === undefined ? new Vector3() : arguments[0];
    var direction = arguments[1] === undefined ? new Vector3() : arguments[1];
    return (function () {
      _this.set(origin, direction);
    })();
  }

  _prototypeProperties(Ray, {
    fromPoints: {
      value: function fromPoints(point1, point2) {
        return new Ray(point1, point2.subtract(point1).normalize());
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  }, {
    set: {
      value: function set(origin, direction) {
        this.origin = origin;
        this.direction = direction;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    copy: {
      value: function copy(ray) {
        this.origin.copy(ray.origin);
        this.direction.copy(ray.direction);

        return this;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    clone: {
      value: function clone() {
        var ray = new Ray();
        ray.copy(this);

        return ray;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Ray;
})();

var Vector3 = (function (Emitter) {
  function Vector3() {
    var x = arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments[1] === undefined ? 0 : arguments[1];
    var z = arguments[2] === undefined ? 0 : arguments[2];
    _get(Object.getPrototypeOf(Vector3.prototype), "constructor", this).call(this);

    this._x = x;
    this._y = y;
    this._z = z;
  }

  _inherits(Vector3, Emitter);

  _prototypeProperties(Vector3, null, {
    clone: {
      value: function clone() {
        return new Vector3(this.x, this.y, this.z);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    x: {
      get: function () {
        return this._x;
      },
      set: function (x) {
        this._x = x;
        this.emit("update");
      },
      enumerable: true,
      configurable: true
    },
    y: {
      get: function () {
        return this._y;
      },
      set: function (y) {
        this._y = y;
        this.emit("update");
      },
      enumerable: true,
      configurable: true
    },
    z: {
      get: function () {
        return this._z;
      },
      set: function (z) {
        this._z = z;
        this.emit("update");
      },
      enumerable: true,
      configurable: true
    },
    set: {
      value: function set(x, y, z) {
        this._x = x;
        this._y = y;
        this._z = z;

        this.emit("update");
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    add: {
      value: function add(value) {
        var create = arguments[1] === undefined ? false : arguments[1];
        var out;
        if (create) {
          out = this.clone();
        } else {
          out = this;
        }

        if (typeof value === "object") {
          out._x += value.x;
          out._y += value.y;
          out._z += value.z;
        } else {
          out._x += value;
          out._y += value;
          out._z += value;
        }

        this.emit("update");
        return out;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    subtract: {
      value: function subtract(value) {
        var create = arguments[1] === undefined ? false : arguments[1];
        var out;
        if (create) {
          out = this.clone();
        } else {
          out = this;
        }

        if (typeof value === "object") {
          out._x -= value.x;
          out._y -= value.y;
          out._z -= value.z;

          this.emit("update");
        } else {
          out.add(-value);
        }

        return out;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    multiply: {
      value: function multiply(value) {
        var create = arguments[1] === undefined ? false : arguments[1];
        var out;
        if (create) {
          out = this.clone();
        } else {
          out = this;
        }

        if (typeof value === "object") {
          out._x *= value.x;
          out._y *= value.y;
          out._z *= value.z;
        } else {
          out._x *= value;
          out._y *= value;
          out._z *= value;
        }

        this.emit("update");

        return out;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    divide: {
      value: function divide(value) {
        var create = arguments[1] === undefined ? false : arguments[1];
        var out;
        if (create) {
          out = this.clone();
        } else {
          out = this;
        }

        if (typeof value === "object") {
          out._x /= value.x;
          out._y /= value.y;
          out._z /= value.z;

          this.emit("update");
        } else {
          out.multiply(1 / value);
        }

        return out;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    copy: {
      value: function copy(vector) {
        this.set(vector.x, vector.y, vector.z);

        return this;
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
        return this;
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
    angle: {
      value: function angle(vector) {
        return Math.acos(this.dot(vector) / this.getLength() / vector.getLength());
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    unproject: {
      value: function unproject(i) {
        if (i instanceof Matrix4) {
          var matrix = i.invert();
        } else {
          var m = i.getMatrix().clone(),
              p = i.getProjection().clone();

          var matrix = Matrix4.multiplyMatrices(m, p.invert());
        }

        return this.applyProjection(matrix);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    applyProjection: {
      value: function applyProjection(matrix) {
        var x = this.x,
            y = this.y,
            z = this.z;

        var d = 1 / (matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15]); // perspective divide

        this._x = (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) * d;
        this._y = (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) * d;
        this._z = (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) * d;

        this.emit("update");

        return this;
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
})(Emitter);

var Vector4 = (function (Emitter) {
  function Vector4() {
    var x = arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments[1] === undefined ? 0 : arguments[1];
    var z = arguments[2] === undefined ? 0 : arguments[2];
    var w = arguments[3] === undefined ? 0 : arguments[3];
    _get(Object.getPrototypeOf(Vector4.prototype), "constructor", this).call(this);

    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;
  }

  _inherits(Vector4, Emitter);

  _prototypeProperties(Vector4, null, {
    clone: {
      value: function clone() {
        return new Vector3(this.x, this.y, this.z);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    x: {
      get: function () {
        return this._x;
      },
      set: function (x) {
        this._x = x;
        this.emit("update");
      },
      enumerable: true,
      configurable: true
    },
    y: {
      get: function () {
        return this._y;
      },
      set: function (y) {
        this._y = y;
        this.emit("update");
      },
      enumerable: true,
      configurable: true
    },
    z: {
      get: function () {
        return this._z;
      },
      set: function (z) {
        this._z = z;
        this.emit("update");
      },
      enumerable: true,
      configurable: true
    },
    w: {
      get: function () {
        return this._w;
      },
      set: function (w) {
        this._w = w;
        this.emit("update");
      },
      enumerable: true,
      configurable: true
    },
    set: {
      value: function set(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    toArray: {
      value: function toArray() {
        return [this.x, this.y, this.z, this.w];
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Vector4;
})(Emitter);

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
}


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
}


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
    var positionTop = new Vector3(heightTop, Math.cos(a) * radiusTop, Math.sin(a) * radiusTop);
    var positionBottom = new Vector3(heightBottom, Math.cos(a) * radiusBottom, Math.sin(a) * radiusBottom);

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
}


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
}


var objId = 0;

var Object3D = (function () {
  /**
   * Constructor of Object3D
   *
   * @method constructor
   */
  function Object3D() {
    this.type = "object";

    this.scale = new Vector3(1, 1, 1);
    this.position = new Vector3();
    this.rotation = new Quaternion();
    this.origin = new Vector3();

    this.vertices = [];
    this.vertexNormals = false;
    this.vertexIndex = false;
    this.vertexColor = false;
    this.textureCoords = false;

    this.index = objId++;

    this.buffers = {};

    this.material = new Material();
    this.color = this.material.color;

    this.drawingMode = Common.drawingMode.LINE_STRIP;
    this.darwingFunction = Common.drawingFunctions.ARRAYS;

    this.initiated = false;

    this.display = true;
    this.getMatrix();
  }

  _prototypeProperties(Object3D, null, {
    rotation: {
      set: function (rotation) {
        var _this = this;
        this._rotation = rotation;
        rotation.on("update", function () {
          _this.getMatrix();
        });
      },
      get: function () {
        return this._rotation;
      },
      enumerable: true,
      configurable: true
    },
    position: {
      set: function (position) {
        var _this = this;
        this._position = position;
        position.on("update", function () {
          _this.getMatrix();
        });
      },
      get: function () {
        return this._position;
      },
      enumerable: true,
      configurable: true
    },
    scale: {
      set: function (scale) {
        var _this = this;
        this._scale = scale;
        scale.on("update", function () {
          _this.getMatrix();
        });
      },
      get: function () {
        return this._scale;
      },
      enumerable: true,
      configurable: true
    },
    origin: {
      set: function (origin) {
        var _this = this;
        this._origin = origin;
        origin.on("update", function () {
          _this.getMatrix();
        });
      },
      get: function () {
        return this._origin;
      },
      enumerable: true,
      configurable: true
    },
    getMatrix: {

      /**
       * Update model matrix
       *
       * @returns {Matrix4}
       */
      value: function getMatrix() {
        this.matrix = Matrix4.fromRotationTranslationScaleOrigin(this.rotation, this.position, this.scale, this.origin);

        return this.matrix;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Object3D;
})();

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


    this.world = world;
    this.camera = new PerspectiveCamera();

    this.camera.aspect = this.width / this.height;
    this.camera.getProjection();

    this.canvas = document.createElement("canvas");

    this.initGl();

    this.setSize(width, height);
    this.setBackgroundColor(color);
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
        if (WebGLRenderingContext) {
          /**
           * The WebGl Rendering context
           *
           * @type {WebGLRenderingContext}
           */
          var gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");

          gl.enable(gl.DEPTH_TEST);

          this.gl = gl;
        } else {
          throw "WebGL is not supported.";
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    setSize: {
      value: function setSize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.setAttribute("width", width);
        this.canvas.setAttribute("height", height);
        this.gl.viewport(0, 0, width, height);
        this.camera.aspect = width / height;
        this.camera.getProjection();
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    setBackgroundColor: {
      value: function setBackgroundColor(color) {
        this.color = color;

        if (color !== null) {
          color = color.array;
          this.gl.clearColor(color[0], color[1], color[2], color[3]);
        }
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
          this.initShape(this.world.children[i]);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    initShape: {
      value: function initShape(object) {
        if (!object.initiated) {
          // Create buffers
          object.buffers.vertices = this.gl.createBuffer();
          object.buffers.vertexColor = this.gl.createBuffer();
          object.buffers.normals = this.gl.createBuffer();
          object.buffers.vertexIndex = this.gl.createBuffer();

          // Create shader programmer
          if (typeof object.shader === "undefined") {
            object.shader = new ShaderProgrammer(this, object);
          }

          // Set flag
          object.initiated = true;
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

          if (!object.display) {
            continue;
          }

          var buffers = object.buffers;

          this.initShape(object);

          object.shader.use();
          object.shader.assignValues(object);

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
})(Renderer);

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
          this.onupdate.apply(this, arguments);
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
})();

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

    this.initPositionCamera();
    this.initLighting();
    this.create();
  }

  _prototypeProperties(ShaderProgrammer, null, {
    assignValues: {

      /**
       * Update program values
       *
       * @method assignValues
       */
      value: function assignValues(object) {
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
        var vertexProgram = this.vertexProgram,
            renderer = this.renderer;

        var position = vertexProgram.attribute("vec3", function (obj) {
          this.value(obj.buffers.vertices);
        }, "vPosition");

        var normal = vertexProgram.attribute("vec3", function (obj) {
          this.value(obj.buffers.normals);
        }, "vNormal");

        var pMatrix = vertexProgram.uniform("mat4", function () {
          this.value(renderer.camera.projectionMatrix);
        }, "pMatrix");

        var vMatrix = vertexProgram.uniform("mat4", function () {
          this.value(renderer.camera.viewMatrix);
        }, "vMatrix");

        var mMatrix = vertexProgram.uniform("mat4", function (obj) {
          this.value(obj.matrix);
        }, "mMatrix");

        vertexProgram.code("mat4 mvMatrix = %vm * %mm; gl_Position = %p * %vm * %mm  * vec4(%vp, 1.0);", {
          p: pMatrix,
          vm: vMatrix,
          mm: mMatrix,
          vp: position
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
        var vertexProgram = this.vertexProgram,
            fragmentProgram = this.fragmentProgram,
            renderer = this.renderer,
            world = renderer.world;

        fragmentProgram.precision("mediump", "float");

        vertexProgram.code("mat3 nMatrix = mat3(mvMatrix);");

        var color = fragmentProgram.uniform("vec3", function (obj) {
          this.value(obj.material.color.toArray());
        }, "vColor");

        if (world.lights.length > 0) {
          vertexProgram.attribute("vec3", function (obj) {
            this.value(obj.buffers.normals);
          }, "vNormal");

          vertexProgram.uniform("float", function (obj) {
            this.value(obj.material.shininess);
          }, "fShininess");

          vertexProgram.uniform("bool", function (obj) {
            this.value(obj.material.specular);
          }, "bSpecular");

          vertexProgram.uniform("bool", function (obj) {
            this.value(obj.material.diffuse);
          }, "bDiffuse");

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
})();

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
        var _this2 = this;
        var callback = arguments[1] === undefined ? null : arguments[1];
        var name = arguments[2] === undefined ? "tmp_" + tmpId++ : arguments[2];
        return (function () {
          var uniform = new Uniform(type, name, _this2._programmer);
          uniform.onupdate = callback;
          _this2._variables[name] = uniform;
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
        var _this3 = this;
        var callback = arguments[1] === undefined ? null : arguments[1];
        var name = arguments[2] === undefined ? "tmp_" + tmpId++ : arguments[2];
        return (function () {
          var attribute = new Attribute(type, name, _this3._programmer);
          attribute.onupdate = callback;
          _this3._variables[name] = attribute;
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
        var _this4 = this;
        var name = arguments[1] === undefined ? "tmp_" + tmpId++ : arguments[1];
        return (function () {
          _this4._variables[name] = { name: name, type: type, prefix: "varying" };

          return _this4._variables[name];
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
        var line = arguments[2] === undefined ? "append" : arguments[2];


        if (typeof params !== "undefined") {
          for (var i in params) {
            var variable = typeof params[i] === "object" ? params[i].name : params[i];
            code = code.replace(new RegExp("%" + i, "gm"), variable);
          }
        }

        if (line === "append") {
          this._code += code + "\n";
        } else if (line === "prepend") {
          this._code = code + "\n" + this._code;
        }

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
    clear: {
      value: function clear() {
        this._code = "";
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
            code = "";

        for (i in this._variables) {
          var variable = this._variables[i];

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
})();

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
          this.onupdate.apply(this, arguments);
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
})();

/**
 * Exports Emitter
 */
//
root.LiThree = {
  Renderer: Renderer,
  Common: Common,
  WebGLRenderer: WebGLRenderer,
  World: World,
  Object3D: Object3D,
  Interactive: Interactive,
  RayCaster: RayCaster,
    Color: Color,
  Camera: {
    Perspective: PerspectiveCamera
  },
  Math: {
    Quaternion: Quaternion,
    Vector3: Vector3,
    Ray: Ray,
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