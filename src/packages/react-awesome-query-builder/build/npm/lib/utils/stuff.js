'use strict';

exports.__esModule = true;
exports.eqArrSet = exports.eqSet = exports.BUILT_IN_PLACEMENTS = exports.truncateString = exports.calcTextWidth = exports.bindActionCreators = exports.defaultValue = undefined;

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// RegExp.quote = function (str) {
//     return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
// };


var defaultValue = exports.defaultValue = function defaultValue(value, _default) {
  return typeof value === "undefined" ? _default || undefined : value;
};

var bindActionCreators = exports.bindActionCreators = function bindActionCreators(actionCreators, config, dispatch) {
  return (0, _mapValues2.default)(actionCreators, function (actionCreator) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return dispatch(actionCreator.apply(undefined, [config].concat(args)));
    };
  });
};

var calcTextWidth = exports.calcTextWidth = function calcTextWidth(str, font) {
  var f = font || '12px';
  var div = document.createElement("div");
  div.innerHTML = str;
  var css = {
    'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f
  };
  for (var k in css) {
    div.style[k] = css[k];
  }
  div = document.body.appendChild(div);
  var w = div.offsetWidth;
  div.remove();
  return w;
};

var truncateString = exports.truncateString = function truncateString(str, n, useWordBoundary) {
  if (str.length <= n) {
    return str;
  }
  var subString = str.substr(0, n - 1);
  return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) : subString) + "...";
};

var BUILT_IN_PLACEMENTS = exports.BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  bottomRight: {
    points: ['tr', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1
    }
  },
  topRight: {
    points: ['br', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1
    }
  }
};

//Do sets have same values?
var eqSet = exports.eqSet = function eqSet(as, bs) {
  if (as.size !== bs.size) return false;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = as[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var a = _step.value;
      if (!bs.has(a)) return false;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return true;
};

//Do arrays have same values?
var eqArrSet = exports.eqArrSet = function eqArrSet(arr1, arr2) {
  return eqSet(new Set(arr1), new Set(arr2));
};