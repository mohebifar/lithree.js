"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var Camera = (function () {
  function Camera() {
    var fovy = arguments[0] === undefined ? 0.785398 : arguments[0];
    var aspect = arguments[1] === undefined ? 1 : arguments[1];
    var near = arguments[2] === undefined ? 0.1 : arguments[2];
    var far = arguments[3] === undefined ? 100 : arguments[3];
    this.fovy = fovy;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.matrix = mat4.create();
    this.lookAt = [0, 0, 0];
    this.position = [0, 0, 5];
    this.up = [0, 1, 0];
    this._zoom = 1;
  }

  _prototypeProperties(Camera, null, {
    zoom: {
      set: function (zoom) {
        if (zoom < 1) {
          throw "Zoom should be equal or greater than 1";
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
        mat4.perspective(this.matrix, fovy, this.aspect, this.near, this.far);
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Camera;
})();