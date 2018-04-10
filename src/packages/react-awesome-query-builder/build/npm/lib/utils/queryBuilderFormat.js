'use strict';

exports.__esModule = true;
exports.queryBuilderFormat = undefined;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _uuid = require('./uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _stuff = require('./stuff');

var _configUtils = require('./configUtils');

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 Build tree to http://querybuilder.js.org/ like format

 Example:
 {
 "condition": "AND",
 "rules": [
 {
 "id": "price",
 "field": "price",
 "type": "double",
 "input": "text",
 "operator": "less",
 "value": "10.25"
 },
 {
 "condition": "OR",
 "rules": [
 {
 "id": "category",
 "field": "category",
 "type": "integer",
 "input": "select",
 "operator": "equal",
 "value": "2"
 },
 {
 "id": "category",
 "field": "category",
 "type": "integer",
 "input": "select",
 "operator": "equal",
 "value": "1"
 }
 ]}
 ]
 }
 */
var queryBuilderFormat = exports.queryBuilderFormat = function queryBuilderFormat(item, config) {
    var rootQuery = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var type = item.get('type');
    var properties = item.get('properties');
    var children = item.get('children1');
    var id = item.get('id');

    var resultQuery = {};
    var isRoot = rootQuery === null;
    if (isRoot) {
        rootQuery = resultQuery;
        // rootQuery.usedFields = [];
    }

    if (type === 'group' && children && children.size) {
        var conjunction = properties.get('conjunction');
        var not = properties.get('not');
        var conjunctionDefinition = config.conjunctions[conjunction];

        var list = children.map(function (currentChild) {
            return queryBuilderFormat(currentChild, config, rootQuery);
        }).filter(function (currentChild) {
            return typeof currentChild !== 'undefined';
        });
        if (!list.size) return undefined;
        // resultQuery['rules'] = list.toList();
        // resultQuery['condition'] = conjunction.toUpperCase();
        if (not) {
          resultQuery['not'] = {};
          resultQuery['not'][conjunction.toLowerCase()] = list.toList();
        } else {
          resultQuery[conjunction.toLowerCase()] = list.toList();
        }

        return resultQuery;
    } else if (type === 'rule') {
        var operator = properties.get('operator');
        var options = properties.get('operatorOptions');
        var field = properties.get('field');
        var value = properties.get('value');
        var valueSrc = properties.get('valueSrc');
        var valueType = properties.get('valueType');

        var hasUndefinedValues = false;
        value.map(function (currentValue, ind) {
            if (currentValue === undefined) {
                hasUndefinedValues = true;
                return undefined;
            }
        });

        if (field == null || operator == null || hasUndefinedValues) return undefined;

        var fieldDefinition = (0, _configUtils.getFieldConfig)(field, config) || {};
        var operatorDefinition = (0, _configUtils.getOperatorConfig)(config, operator, field) || {};
        //const reversedOp = operatorDefinition.reversedOp;
        //const revOperatorDefinition = getOperatorConfig(config, reversedOp, field) || {};
        var fieldType = fieldDefinition.type || "undefined";
        var cardinality = (0, _stuff.defaultValue)(operatorDefinition.cardinality, 1);
        var widget = (0, _configUtils.getWidgetForFieldOp)(config, field, operator);
        var _fieldWidgetDefinition = (0, _omit2.default)((0, _configUtils.getFieldWidgetConfig)(config, field, operator, widget), ['factory']);
        var typeConfig = config.types[fieldDefinition.type] || {};

        //format field
        if (fieldDefinition.tableName) {
            var regex = new RegExp(field.split(config.settings.fieldSeparator)[0]);
            field = field.replace(regex, fieldDefinition.tableName);
        }

        if (value.size < cardinality) return undefined;

        // if (rootQuery.usedFields.indexOf(field) == -1) rootQuery.usedFields.push(field);
        value = value.toArray();
        valueSrc = valueSrc.toArray();
        valueType = valueType.toArray();

        if (operator === 'select_any_in' && value[0] !== null) {
          value = [value[0].split(',')];
        }
        var values = [];
        for (var i = 0; i < value.length; i++) {
            var val = {
                type: valueType[i],
                value: value[i]
            };
            values.push(val);
            if (valueSrc[i] == 'field') {
                var secondField = value[i];
                // if (rootQuery.usedFields.indexOf(secondField) == -1) rootQuery.usedFields.push(secondField);
            }
        }

        var operatorOptions = options ? options.toJS() : null;
        if (operatorOptions && !Object.keys(operatorOptions).length) operatorOptions = null;

        // var ruleQuery = {
        //     id: id,
        //     field: field,
        //     type: fieldType,
        //     input: typeConfig.mainWidget,
        //     operator: operator
        // };
        // if (operatorOptions) ruleQuery.operatorOptions = operatorOptions;
        // ruleQuery.values = values;

        switch (operator) {
          case 'exactly_equals':
            var modifiedField = field + '__exact';
            break;
          case 'equal':
            var modifiedField = field;
            break;
          case 'is_none':
            var modifiedField = field;
            break;
          case 'is':
            var modifiedField = field;
            break;
          case 'less':
            var modifiedField = field + '__lt';
            break;
          case 'less_or_equal':
            var modifiedField = field + '__lte';
            break
          case 'greater':
            var modifiedField = field + '__gt';
            break
          case 'greater_or_equal':
            var modifiedField = field + '__gte';
            break
          case 'select_any_in':
            var modifiedField = field + '__in';
            break
          case 'contains':
            var modifiedField = field + '__contains';
            break
          case 'prefix':
            var modifiedField = field + '__prefix';
            break
          case 'regex':
            var modifiedField = field + '__regex';
            break
        }

        var modifiedValue = values[0] ? values[0].value : null;
        var ruleQuery = [modifiedField, modifiedValue];

        return ruleQuery;
    }
    return undefined;
};