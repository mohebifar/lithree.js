export default
class Color {

  constructor(r = 1, g = 1, b = 1, alpha = 1) {
    this.array = [r, g, b, alpha];
  }

  set hex(hex) {
    hex = Math.floor(hex);

    this.array[0] = ( hex >> 16 & 255 ) / 255;
    this.array[1] = ( hex >> 8 & 255 ) / 255;
    this.array[2] = ( hex & 255 ) / 255;
  }

  get hex() {
    return ( this.array[0] * 255 ) << 16 ^ ( this.array[1] * 255 ) << 8 ^ ( this.array[2] * 255 ) << 0;
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

  toArray(size = 3) {
    return this.array.slice(0, size);
  }
}