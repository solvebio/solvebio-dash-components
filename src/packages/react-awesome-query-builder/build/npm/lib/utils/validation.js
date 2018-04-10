'use strict';

exports.__esModule = true;
exports.validateTree = undefined;

var _configUtils = require('./configUtils');

var _stuff = require('../utils/stuff');

var _defaultUtils = require('../utils/defaultUtils');

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _pickBy = require('lodash/pickBy');

var _pickBy2 = _interopRequireDefault(_pickBy);

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _tree = require('../stores/tree');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validateTree = exports.validateTree = function validateTree(tree, oldTree, config, oldConfig) {
	var removeEmptyGroups = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
	var removeInvalidRules = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

	var treeSanitized = false;

	var _validateItem = function _validateItem(item) {
		var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

		var type = item.get('type');
		var id = item.get('id');
		var properties = item.get('properties');
		var children = item.get('children1');
		var oldChildren = children;

		if (type === 'group' && children && children.size) {
			var conjunction = properties.get('conjunction');
			var conjunctionDefinition = config.conjunctions[conjunction];

			//validate children
			var sanitized = false;
			children = children.map(function (currentChild) {
				return _validateItem(currentChild, path.concat(id));
			});
			if (removeEmptyGroups) children = children.filter(function (currentChild) {
				return currentChild != undefined;
			});
			if (oldChildren.size != children.size) sanitized = treeSanitized = true;
			if (!children.size) {
				if (removeEmptyGroups && path.length) {
					sanitized = treeSanitized = true;
					return undefined;
				}
			}
			if (treeSanitized) item = item.set('children1', children);
			return item;
		} else if (type === 'rule') {
			var field = properties.get('field');
			var operator = properties.get('operator');
			var operatorOptions = properties.get('operatorOptions');
			var valueSrc = properties.get('valueSrc');
			var value = properties.get('value');
			var oldSerialized = {
				field: field,
				operator: operator,
				operatorOptions: operatorOptions ? operatorOptions.toJS() : {},
				valueSrc: valueSrc ? valueSrc.toJS() : null,
				value: value ? value.toJS() : null
			};
			var wasValid = field && operator && value && !value.find(function (v, ind) {
				return v === undefined;
			});

			//validate field
			var fieldDefinition = field ? (0, _configUtils.getFieldConfig)(field, config) : null;
			if (!fieldDefinition) field = null;
			if (field == null) {
				properties = ['operator', 'operatorOptions', 'valueSrc', 'value'].reduce(function (map, key) {
					return map.delete(key);
				}, properties);
				operator = null;
			}
			var typeConfig = fieldDefinition ? config.types[fieldDefinition.type] : null;

			//validate operator
			operator = properties.get('operator');
			var operatorDefinition = operator ? (0, _configUtils.getOperatorConfig)(config, operator, field) : null;
			if (!operatorDefinition) operator = null;
			var availOps = field ? (0, _configUtils.getOperatorsForField)(config, field) : [];
			if (availOps.indexOf(operator) == -1) operator = null;
			if (operator == null) {
				properties = properties.delete('operatorOptions');
				properties = properties.delete('valueSrc');
				properties = properties.delete('value');
			}

			//validate operator options
			operatorOptions = properties.get('operatorOptions');
			var operatorCardinality = operator ? (0, _stuff.defaultValue)(operatorDefinition.cardinality, 1) : null;
			if (!operator || operatorOptions && !operatorDefinition.options) {
				operatorOptions = null;
				properties = properties.delete('operatorOptions');
			} else if (operator && !operatorOptions && operatorDefinition.options) {
				operatorOptions = (0, _defaultUtils.defaultOperatorOptions)(config, operator, field);
				properties = properties.set('operatorOptions', operatorOptions);
			}

			//validate values
			valueSrc = properties.get('valueSrc');
			value = properties.get('value');

			var _getNewValueForFieldO = (0, _tree._getNewValueForFieldOp)(config, oldConfig, properties, field, operator, null),
			    canReuseValue = _getNewValueForFieldO.canReuseValue,
			    newValue = _getNewValueForFieldO.newValue,
			    newValueSrc = _getNewValueForFieldO.newValueSrc,
			    newValueType = _getNewValueForFieldO.newValueType;

			value = newValue;
			valueSrc = newValueSrc;
			properties = properties.set('value', value);
			properties = properties.set('valueSrc', valueSrc);

			var newSerialized = {
				field: field,
				operator: operator,
				operatorOptions: operatorOptions ? operatorOptions.toJS() : {},
				valueSrc: valueSrc ? valueSrc.toJS() : null,
				value: value ? value.toJS() : null
			};
			var _sanitized = JSON.stringify(oldSerialized) != JSON.stringify(newSerialized);
			if (_sanitized) treeSanitized = true;
			var isValid = field && operator && value && !value.find(function (v, ind) {
				return v === undefined;
			});

			if (_sanitized && !isValid && removeInvalidRules) return undefined;

			if (_sanitized) item = item.set('properties', properties);
			return item;
		} else {
			return item;
		}
	};

	var validatedTree = _validateItem(tree, []);
	return validatedTree;
};