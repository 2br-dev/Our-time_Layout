(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var map;
var sideNav;
var akf;
var scrollSpy;

(function () {
  $('.lazy').lazy();

  if ($('#map').length) {
    loadScript("https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.js", function () {
      initMap();
    });
  }

  $('body').on('click', '.scroll-nav', scrollNav);
  $('body').on('mousemove', '.speaker', addHover);
  $('body').on('mouseleave', '.speaker', removeHover);
  $('body').on('click', '.close-speaker', removeHover1);
  sideNav = M.Sidenav.init(document.querySelector('.sidenav'));
  render();
})();

function addHover(e) {
  e.preventDefault();
  $(this).addClass('hover');
}

function removeHover(e) {
  e.preventDefault();
  $(this).removeClass('hover');
}

function removeHover1(e) {
  e.preventDefault();
  $(this).parents('.speaker').removeClass('hover');
  var el = $(this).parents('.speaker')[0];
}

var coords = [40.2952563, 43.6727759];
var zoom = 15;

function scrollNav(e) {
  e.preventDefault();
  var anchor = $(this).attr('href');
  var anchorST = anchor != "#" ? parseInt($(anchor).offset().top) : 0;
  sideNav.close();
  $('html, body').animate({
    scrollTop: anchorST
  });
}

function render() {
  var offset = parseInt(window.getComputedStyle(document.querySelector('section#program'), null).getPropertyValue('padding-top'));
  var min = $('.program-wrapper').offset().top;
  var max = min + $('.program-wrapper').outerHeight();
  var current = $('html, body').scrollTop() + window.innerHeight / 2;
  var percent = (current - min) / (max - min) * 100;
  var height = 0;
  $('.program-indicator').css({
    height: percent + '%'
  });
  $('.program-entry').each(function (index, pe) {
    height += pe.clientHeight;

    if ($('.program-indicator').outerHeight() > height - pe.clientHeight / 2) {
      $(pe).addClass('highlight');
    } else {
      $(pe).removeClass('highlight');
    }
  });
  $('.last').removeClass('last');
  var length = $('.highlight').length;
  $($('.highlight')[length - 1]).addClass('last');
  $('.line-wrapper .line').each(function (index, line) {
    var speed = $(line).data('speed');
    var delta = ($('.line-wrapper').offset().top - $('html, body').scrollTop()) * speed;
    $(line).css({
      transform: "skew(-35deg) translateY(".concat(delta, "px)")
    });
  });

  if ($('html, body').scrollTop() > window.innerHeight * 1.5) {
    $('#hero').css({
      opacity: 0
    });
  } else {
    $('#hero').css({
      opacity: 1
    });
  }

  akf = requestAnimationFrame(render);
}

function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == "loaded" || script.readyState == "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = function () {
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

function initMap() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZ2VuZXN5cyIsImEiOiJja2xyejVqbTAwN3c2MnBwdjZvdHVhOHpiIn0.IrmmbUMTtmXBxZjv8mcH8Q';
  var geoJson = {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "geometry": {
        "type": "point",
        "coordinates": coords
      },
      "properties": {
        "title": "Наше время",
        "coordinates": coords
      }
    }]
  };
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/genesys/ckls2dt0l12fj17qxtbz91bqg',
    center: coords,
    zoom: zoom,
    pitch: 60,
    bearing: -20
  });
  map.scrollZoom.disable();

  var _iterator = _createForOfIteratorHelper(geoJson.features),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var feature = _step.value;
      var el = $('<div class="marker"><div class="marker-element"></div></div>')[0];
      el.className = "marker";
      new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).setPopup(new mapboxgl.Popup({
        offset: 25
      }).setHTML("<div class=\"popup-header\">".concat(feature.properties.title, "</div><div class=\"popup-description\"><p>\u0433. \u0421\u043E\u0447\u0438, \u0441. \u0421\u0442\u043E-\u0421\u0430\u0434\u043E\u043A, \u043D\u0430\u0431\u0435\u0440\u0435\u0436\u043D\u0430\u044F \xAB\u041F\u0430\u043D\u043E\u0440\u0430\u043C\u0430\xBB, 4</p><a target=\"_blank\" href=\"https://yandex.ru/maps/-/CCUJVDxp8A\">\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435</a></div>"))).addTo(map);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

},{}]},{},[1]);
