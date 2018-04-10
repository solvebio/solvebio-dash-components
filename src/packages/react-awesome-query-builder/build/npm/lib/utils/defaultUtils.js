'use strict';

exports.__esModule = true;
exports.defaultRoot = exports.getChild = exports.defaultGroupProperties = exports.defaultConjunction = exports.defaultRuleProperties = exports.defaultOperatorOptions = exports.defaultOperator = exports.defaultField = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _range = require('lodash/range');

var _range2 = _interopRequireDefault(_range);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _configUtils = require('./configUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultField = exports.defaultField = function defaultField(config) {
  var canGetFirst = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  return typeof config.settings.defaultField === 'function' ? config.settings.defaultField() : config.settings.defaultField || (canGetFirst ? (0, _configUtils.getFirstField)(config) : null);
};

var defaultOperator = exports.defaultOperator = function defaultOperator(config, field) {
  var canGetFirst = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var fieldConfig = (0, _configUtils.getFieldConfig)(field, config);
  var fieldDefaultOperator = fieldConfig && fieldConfig.defaultOperator || (canGetFirst ? (0, _configUtils.getFirstOperator)(config, field) : null);
  var op = typeof config.settings.defaultOperator === 'function' ? config.settings.defaultOperator(field, fieldConfig) : fieldDefaultOperator;
  return op;
};

//used for complex operators like proximity
var defaultOperatorOptions = exports.defaultOperatorOptions = function defaultOperatorOptions(config, operator, field) {
  var operatorConfig = operator ? (0, _configUtils.getOperatorConfig)(config, operator, field) : null;
  if (!operatorConfig) return null; //new Immutable.Map();
  return operatorConfig.options ? new _immutable2.default.Map(operatorConfig.options && operatorConfig.options.defaults || {}) : null;
};

var defaultRuleProperties = exports.defaultRuleProperties = function defaultRuleProperties(config) {
  var field = null,
      operator = null;
  if (config.settings.setDefaultFieldAndOp) {
    field = defaultField(config);
    operator = defaultOperator(config, field);
  }

  return new _immutable2.default.Map({
    field: field,
    operator: operator,
    value: new _immutable2.default.List(),
    valueSrc: new _immutable2.default.List(),
    //used for complex operators like proximity
    operatorOptions: defaultOperatorOptions(config, operator, field)
  });
};

//------------

var defaultConjunction = exports.defaultConjunction = function defaultConjunction(config) {
  return config.settings.defaultConjunction || Object.keys(config.conjunctions)[0];
};

var defaultGroupProperties = exports.defaultGroupProperties = function defaultGroupProperties(config) {
  return new _immutable2.default.Map({
    conjunction: defaultConjunction(config)
  });
};

//------------

var getChild = exports.getChild = function getChild(id, config) {
  return _defineProperty({}, id, new _immutable2.default.Map({
    type: 'rule',
    id: id,
    properties: defaultRuleProperties(config)
  }));
};

var defaultRoot = exports.defaultRoot = function defaultRoot(config) {
  if (config.tree) {
    return new _immutable2.default.Map(config.tree);
  }

  return new _immutable2.default.Map({
    type: 'group',
    id: (0, _uuid2.default)(),
    children1: new _immutable2.default.OrderedMap(_extends({}, getChild((0, _uuid2.default)(), config))),
    properties: defaultGroupProperties(config)
  });
};