import Emitter from 'emitter.js';

export default
class Interactive extends Emitter {

  constructor(renderer) {
    super();
    this.isDragging = false;
    this.clickFlag = false;
    this.lastPosition = {x: 0, y: 0};
    this.renderer = renderer;
    this.delta = {x: 0, y: 0};
    this._attachListeners();
  }

  updatePosition(x, y) {
    x = x - this.renderer.canvas.offsetLeft;
    y = y - this.renderer.canvas.offsetTop;

    this.delta.x = this.lastPosition.x - x;
    this.delta.y = this.lastPosition.y - y;

    this.lastPosition.x = x;
    this.lastPosition.y = y;
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
      _this.clickFlag = true;

      if (_this.hasEvent('start')) {
        _this.emit('start', _this.lastPosition, unproject, e);
        return false;
      }

    });

    dom.addEventListener('contextmenu', function (e) {
      e.preventDefault();

    });

    dom.addEventListener('mousemove', function (e) {
      e.preventDefault();

      if (_this.isDragging) {
        _this.clickFlag = false;
        _this.updatePosition(e.clientX, e.clientY);

        if (_this.hasEvent('drag')) {
          _this.emit('drag', _this.lastPosition, _this.delta, unproject, e);
        }
      } else if (_this.hasEvent('move')) {
        _this.updatePosition(e.clientX, e.clientY);

        _this.emit('move', _this.lastPosition, _this.delta, unproject, e);
      }
    });

    dom.addEventListener('mouseup', function (e) {
      e.preventDefault();

      _this.isDragging = false;
      _this.updatePosition(e.clientX, e.clientY);

      if (_this.hasEvent('click') && _this.clickFlag === true) {
        _this.emit('click', _this.lastPosition, unproject, e);
      } else if (_this.hasEvent('end')) {
        _this.emit('end', _this.lastPosition, unproject, e);
      }
    });

    dom.addEventListener('mousewheel', function (e) {
      e.preventDefault();

      if (_this.hasEvent('wheel')) {
        _this.emit('wheel', e.wheelDelta, e);
      }
    });

    dom.addEventListener('DOMMouseScroll', function (e) {
      e.preventDefault();

      if (_this.hasEvent('wheel')) {
        _this.emit('wheel', e.detail * -40, e);
      }
    });
  }

}