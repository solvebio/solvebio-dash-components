'use strict';

exports.__esModule = true;
exports.setNot = exports.setConjunction = undefined;

var _constants = require('../constants');

var constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {string} conjunction
 */
var setConjunction = exports.setConjunction = function setConjunction(config, path, conjunction) {
  return {
    type: constants.SET_CONJUNCTION,
    path: path,
    conjunction: conjunction
  };
};

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {bool} not
 */
var setNot = exports.setNot = function setNot(config, path, not) {
  return {
    type: constants.SET_NOT,
    path: path,
    not: not
  };
};