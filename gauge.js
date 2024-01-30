;(function ($, window, document, undefined) {
  
  var Gauge = function (el) {
    this.$element = el,
      this.defaults = {},
      this.options = $.extend({}, this.defaults, {})
  };
  
  Gauge.prototype = {
    colors: ['gauge-green', 'gauge-orange', 'gauge-yellow', 'gauge-blue', 'gauge-red'],
    partSize: 0,
    initParams: function () {
      var colorLen = Gauge.prototype.colors.length;
      Gauge.prototype.partSize = 100.0 / colorLen;
    },
    createGauge: function (elArray) {
      elArray.each(function () {
        Gauge.prototype.updateGauge($(this));
      });
      
      //updateGauge
      elArray.bind('updateGauge', function (e, num) {
        $(this).data('percentage', num);
        Gauge.prototype.updateGauge($(this));
      });
    },
    updateGauge: function (el) {
      Gauge.prototype.initParams();
      var percentage = el.data('percentage');
      percentage = (percentage > 100) ? 100 : (percentage < 0) ? 0 : percentage;
      
      let color = 'gauge-green';

      if (percentage <= 45) {
        color = 'gauge-green';
      }
      if (percentage > 45) {
        color = 'gauge-orange';
      }
      if (percentage > 84) {
        color = 'gauge-red';
      }

      el.css('transform', 'rotate(' + ((1.8 * percentage) - 90) + 'deg)');
      el.parent()
        .removeClass(Gauge.prototype.colors.join(' '))
        .addClass(color);
    }
  };
  
  $.fn.cmGauge = function () {
    var gauge = new Gauge(this);
    return gauge.createGauge(this);
  }
  
})(jQuery, window, document);


$(document).ready(function () {

	$('#gaugeDemo .gauge-arrow').cmGauge();

  function fetchData() {
    $.getJSON("https://mqttjson.rosenheim.dev/70b3d5d7202002cc-co2.json", function(result){
      console.log('fetching data...');
      console.log(result);
      $('#gaugeDemo .gauge-arrow').trigger('updateGauge', result['co2']/22);
      $('#gauge__value').text(result['co2'] + ' ppm');
    });
  }
  
  fetchData();
  
  setInterval(fetchData, 30000);

});