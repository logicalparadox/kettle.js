/*!
  * kettle.js - copyright Jake Luer 2011
  * https://github.com/logicalparadox/kettle.js
  * MIT License
  */
!function (context, doc) {
  if ('undefined' == typeof drag) drag = require('drag');
  if ('undefined' == typeof bean) bean = require('bean');
  var d = drag;
  var b = bean;
  var is_touch_device = ('ontouchstart' in doc.documentElement) ? true : false;
  kettle = function (selector) {
    return new Kettle(d.select(selector));
  };
  Kettle = function Kettle(el) {
    if (!(this instanceof Kettle)) return new Kettle(el);
    this.el = el;
    this._axis = 'auto';
    this._track = 'track';
    this._handle = 'handle';
    this._mwspeed = 10;
  };
  Kettle.prototype.axis = function (axis) {
    if (axis == 'x' || axis == 'y' || axis == 'both' || axis == 'auto') this._axis = axis;
    return this;
  };
  Kettle.prototype.elastic = function (modifier) {
    try {
      this._move = move;
      this._elastic = true;
    } catch (err) {
      this._elastic = false;
    }
    return this;
  };
  Kettle.prototype.bind = function () {
    var self = this;
    var width = this.el,
        content = this.el.querySelector('.wrap'),
        trackX = this.el.querySelector('.track-x'),
        trackY = this.el.querySelector('.track-y'),
        handleX, handleY;
    if (trackX) handleX = trackX.querySelector('.handle');
    if (trackY) {
      handleY = trackY.querySelector('.handle');
      hYh = Math.round((d.value(trackY, 'height') / d.value(content, 'height')) * 100);
      yRatio = (d.value(content, 'height') - d.value(this.el, 'height')) / (d.value(trackY, 'height') - hYh);
      d.value(handleY, 'height', hYh + 'px');
      maxYc = (d.value(content, 'height') - d.value(self.el, 'height')) * -1;
      maxYh = (d.value(trackY, 'height') - d.value(handleY, 'height'));
    }
    this._sY = d(handleY).axis('y').container(trackY).dragging(function () {
      newY = Math.round(this.pos.y * yRatio) * -1;
      d.value(content, 'top', newY + 'px');
    }).bind();
    b.add(this.el, 'mousewheel', function (e) {
      var delta = (e.wheelDeltaY / 120) * self._mwspeed,
          newYc = d.value(content, 'top') + delta,
          newYh = d.value(handleY, 'top') + Math.round((delta / yRatio) * -1);
      if (newYc > 0) newYc = 0;
      if (newYc < maxYc) newYc = maxYc;
      if (newYh < 0) newYh = 0;
      if (newYh > maxYh) newYh = maxYh;
      d.value(content, 'top', newYc + 'px');
      d.value(handleY, 'top', newYh + 'px');
      e.preventDefault();
      e.stopPropagation();
    });
    if (is_touch_device) {
      d(content).dragging(function () {
        if (this.pos.y > 0) d.value(content, 'top', '0px');
        if (this.pos.y < maxYc) d.value(content, 'top', maxYc + 'px');
        var newYh = Math.round((this.pos.y / yRatio) * -1);
        if (newYh < 0) newYh = 0;
        if (newYh > maxYh) newYh = maxYh;
        d.value(handleY, 'top', newYh + 'px');
      }).end(function () {
        if (!self._elastic) return;
        if (this.pos.dY !== 0) {
          var friction = 0.993,
              minspeed = 0.10,
              ppm = Math.abs(this.pos.dY) / 10,
              duration = Math.log(minspeed / ppm) / Math.log(friction);
          duration = (duration > 0) ? Math.round(duration) : 0;
          var lengthF = (1 - Math.pow(friction, duration + 1)) / (1 - friction),
              length = Math.round(ppm * lengthF);
          var mTo = (this.pos.dY < 0) ? (this.pos.y - length) : (this.pos.y + length);
          if (mTo > 0) mTo = 0;
          if (mTo < maxYc) mTo = maxYc;
          var newYh = Math.round((mTo / yRatio) * -1);
          if (newYh < 0) newYh = 0;
          if (newYh > maxYh) newYh = maxYh;
          self._move(content)
            .set('top', mTo)
            .duration(duration)
            .ease('cubic-bezier(0,0.1,0.15,1)')
            .end(function () {
              // reset duration
              self._move(content).duration(0).end();
            });
          self._move(handleY)
            .set('top', newYh)
            .duration(duration)
            .ease('cubic-bezier(0,0.1,0.15,1)')
            .end(function () {
              // reset duration
              self._move(handleY).duration(0).end();
            });
        }
      }).bind();
    }
    return this;
  };
  var oldKettle = context.kettle;
  kettle.noConflict = function () {
    context.kettle = oldKettle;
    return this;
  };
  (typeof module !== 'undefined' && module.exports && (module.exports = kettle));
  context['kettle'] = kettle;
}(this, document);