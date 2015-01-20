export default
class Color {

  constructor(r = 1, g = 1, b = 1, alpha = 1) {
    this.array = [r, g, b, alpha];
  }

  set hex(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    this.array[0] = parseInt(result[1], 16) / 255;
    this.array[1] = parseInt(result[2], 16) / 255;
    this.array[2] = parseInt(result[3], 16) / 255;
  }

  get hex() {
    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    return "#" + componentToHex(this.array[0]) + componentToHex(this.array[1]) + componentToHex(this.array[2]);
  }

  rgb(r, g, b) {
    this.array[0] = r;
    this.array[1] = g;
    this.array[2] = b;
    return this;
  }

  alpha(alpha) {
    this.array[3] = alpha;
    return this;
  }

  rgba(r, g, b, alpha) {
    this.rgb(r, g, b);
    this.alpha(alpha);
    return this;
  }

  toArray() {
    return this.array;
  }
}