import Emitter from 'emitter.js';

export default
class Interactive extends Emitter {

  constructor(renderer) {
    super();
    this.isDragging = false;
    this.lastDown = 0;
    this.clickPrecisionTime = 300;
    this.lastPosition = {x: 0, y: 0};
    this.renderer = renderer;

    this._attachListeners();
  }

  updatePosition(x, y) {
    this.lastPosition.x = x - this.renderer.canvas.offsetLeft;
    this.lastPosition.y = y - this.renderer.canvas.offsetTop;
  }

  unproject(x, y, z) {
    var camera = this.renderer.camera;

    var vector = new LiThree.Math.Vector3(
      ( x / renderer.width ) * 2 - 1,
      -( y / renderer.height ) * 2 + 1,
      z);

    vector.unproject(camera);

    var dir = vector.subtract(camera.position).normalize();
    var distance = -camera.position.z / dir.z;

    var position = camera.position.clone().add(dir.multiply(distance));
    position.x *= -1;
    position.y *= -1;
    return position;
  }

  _attachListeners() {
    var dom = this.renderer.canvas;
    var _this = this;

    var unproject = function unproject(z) {
      return _this.unproject(_this.lastPosition.x, _this.lastPosition.y, z);
    };

    dom.addEventListener('mousedown', function (e) {
      e.preventDefault();
      _this.isDragging = true;
      _this.updatePosition(e.clientX, e.clientY);

      if (_this.hasEvent('start')) {
        _this.emit('start', _this.lastPosition, unproject);
      }

      _this.lastDown = Date.now();
    });

    dom.addEventListener('mousemove', function (e) {
      e.preventDefault();

      if (_this.isDragging) {
        _this.updatePosition(e.clientX, e.clientY);

        if (_this.hasEvent('drag')) {
          _this.emit('drag', _this.lastPosition, unproject);
        }
      } else if (_this.hasEvent('move')) {
        _this.updatePosition(e.clientX, e.clientY);

        _this.emit('move', _this.lastPosition, unproject);
      }
    });

    dom.addEventListener('mouseup', function (e) {
      e.preventDefault();

      _this.isDragging = false;
      _this.updatePosition(e.clientX, e.clientY);

      if (_this.hasEvent('click') && Date.now() - _this.lastDown < _this.clickPrecisionTime) {
        _this.emit('click', _this.lastPosition, unproject);
      } else if (_this.hasEvent('end')) {
        _this.emit('end', _this.lastPosition, unproject);
      }
    });
  }

}