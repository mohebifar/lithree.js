"use strict";

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
          return hex.length == 1 ? "0" + hex : hex;
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
        return this.array;
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return Color;
})();