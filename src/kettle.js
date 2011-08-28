!function (context, doc) {
  console.log(context);
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
  
  Kettle.prototype.axis = function(axis) {
    if (axis == 'x' || axis == 'y' || axis == 'both' || axis == 'auto') this._axis = axis;
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
      hYh = Math.round ( (d.value(trackY, 'height') / d.value(content, 'height')) * 100 );
      yRatio = (d.value(content, 'height') - d.value(this.el, 'height') ) / (d.value(trackY, 'height') - hYh);
      d.value(handleY, 'height', hYh + 'px');
    }
    
    this._sY = d(handleY)
      .axis('y')
      .container(trackY)
      .dragging(function() {
        newY = Math.round(this.pos.y * yRatio) * -1;
        d.value(content, 'top', newY + 'px');
      })
      .bind();
    
    b.add(this.el, 'mousewheel', function(e) {
      var delta = (e.wheelDeltaY / 120) * self._mwspeed,
          newYc = d.value(content, 'top') + delta,
          maxYc = (d.value(content, 'height') - d.value(self.el, 'height')) * -1,
          newYh = d.value(handleY, 'top') + Math.round((delta / yRatio) * -1),
          maxYh = (d.value(trackY, 'height') - d.value(handleY, 'height'));
        
      if (newYc > 0) newYc = 0;
      if (newYc < maxYc) newYc = maxYc;
      if (newYh < 0) newYh = 0;
      if (newYh > maxYh) newYh = maxYh;
      d.value(content, 'top', newYc + 'px');
      d.value(handleY, 'top', newYh + 'px');
      console.log(delta);
    });
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