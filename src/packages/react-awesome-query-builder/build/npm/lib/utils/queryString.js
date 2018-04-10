'use strict';

exports.__esModule = true;
exports.queryString = undefined;

var _configUtils = require('./configUtils');

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _stuff = require('./stuff');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var queryString = exports.queryString = function queryString(item, config) {
    var isForDisplay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var type = item.get('type');
    var properties = item.get('properties');
    var children = item.get('children1');
    var id = item.get('id');

    if (type === 'group' && children && children.size) {
        var conjunction = properties.get('conjunction');
        var conjunctionDefinition = config.conjunctions[conjunction];

        var list = children.map(function (currentChild) {
            return queryString(currentChild, config, isForDisplay);
        }).filter(function (currentChild) {
            return typeof currentChild !== 'undefined';
        });
        if (!list.size) return undefined;

        return conjunctionDefinition.formatConj(list, conjunction, isForDisplay);
    } else if (type === 'rule') {
        var field = properties.get('field');
        var operator = properties.get('operator');
        var operatorOptions = properties.get('operatorOptions');
        if (field == null || operator == null) return undefined;

        var fieldDefinition = (0, _configUtils.getFieldConfig)(field, config) || {};
        var operatorDefinition = (0, _configUtils.getOperatorConfig)(config, operator, field) || {};
        var reversedOp = operatorDefinition.reversedOp;
        var revOperatorDefinition = (0, _configUtils.getOperatorConfig)(config, reversedOp, field) || {};
        var cardinality = (0, _stuff.defaultValue)(operatorDefinition.cardinality, 1);
        var typeConfig = config.types[fieldDefinition.type] || {};
        var fieldSeparator = config.settings.fieldSeparator;

        //format value
        var valueSrcs = [];
        var valueTypes = [];
        var hasUndefinedValues = false;
        var value = properties.get('value').map(function (currentValue, ind) {
            if (currentValue === undefined) {
                hasUndefinedValues = true;
                return undefined;
            }
            var valueSrc = properties.get('valueSrc') ? properties.get('valueSrc').get(ind) : null;
            var valueType = properties.get('valueType') ? properties.get('valueType').get(ind) : null;
            var widget = (0, _configUtils.getWidgetForFieldOp)(config, field, operator, valueSrc);
            var fieldWidgetDefinition = (0, _omit2.default)((0, _configUtils.getFieldWidgetConfig)(config, field, operator, widget, valueSrc), ['factory']);
            if (valueSrc == 'field') {
                //format field
                var rightField = currentValue;
                var _formattedField = null;
                if (rightField) {
                    var rightFieldDefinition = (0, _configUtils.getFieldConfig)(rightField, config) || {};
                    var _fieldParts = rightField.split(fieldSeparator);
                    //let fieldKeys = getFieldPath(rightField, config);
                    var _fieldPartsLabels = (0, _configUtils.getFieldPathLabels)(rightField, config);
                    var _fieldFullLabel = _fieldPartsLabels ? _fieldPartsLabels.join(config.settings.fieldSeparatorDisplay) : null;
                    var _fieldLabel = rightFieldDefinition.label2 || _fieldFullLabel;
                    _formattedField = config.settings.formatField(rightField, _fieldParts, _fieldLabel, rightFieldDefinition, config, isForDisplay);
                }
                return _formattedField;
            } else {
                if (typeof fieldWidgetDefinition.formatValue === 'function') {
                    var _fn = fieldWidgetDefinition.formatValue;
                    var _args = [currentValue, (0, _pick2.default)(fieldDefinition, ['fieldSettings', 'listValues']), (0, _omit2.default)(fieldWidgetDefinition, ['formatValue']), //useful options: valueFormat for date/time
                    isForDisplay];
                    if (valueSrc == 'field') {
                        var valFieldDefinition = (0, _configUtils.getFieldConfig)(currentValue, config) || {};
                        _args.push(valFieldDefinition);
                    }
                    return _fn.apply(undefined, _args);
                }
                return currentValue;
            }
            valueSrcs.push(valueSrc);
            valueTypes.push(valueType);
        });
        if (hasUndefinedValues || value.size < cardinality) return undefined;
        var formattedValue = cardinality == 1 ? value.first() : value;

        //find fn to format expr
        var isRev = false;
        var fn = operatorDefinition.formatOp;
        if (!fn && reversedOp) {
            fn = revOperatorDefinition.formatOp;
            if (fn) {
                isRev = true;
            }
        }
        if (!fn && cardinality == 1) {
            var _operator = operatorDefinition.labelForFormat || operator;
            fn = function fn(field, op, values, valueSrc, opDef, operatorOptions, isForDisplay) {
                return field + ' ' + _operator + ' ' + values;
            };
        }
        if (!fn) return undefined;

        //format field
        if (fieldDefinition.tableName) {
            var regex = new RegExp(field.split(fieldSeparator)[0]);
            field = field.replace(regex, fieldDefinition.tableName);
        }
        var fieldParts = field.split(fieldSeparator);
        //let fieldKeys = getFieldPath(field, config);
        var fieldPartsLabels = (0, _configUtils.getFieldPathLabels)(field, config);
        var fieldFullLabel = fieldPartsLabels ? fieldPartsLabels.join(config.settings.fieldSeparatorDisplay) : null;
        var fieldLabel2 = fieldDefinition.label2 || fieldFullLabel;
        var formattedField = config.settings.formatField(field, fieldParts, fieldLabel2, fieldDefinition, config, isForDisplay);

        //format expr
        var args = [formattedField, operator, formattedValue, valueSrcs.length > 1 ? valueSrcs : valueSrcs[0], valueTypes.length > 1 ? valueTypes : valueTypes[0], (0, _omit2.default)(operatorDefinition, ['formatOp']), operatorOptions, isForDisplay];
        var ret = fn.apply(undefined, args);
        if (isRev) {
            ret = config.settings.formatReverse(ret, operator, reversedOp, operatorDefinition, revOperatorDefinition, isForDisplay);
        }
        return ret;
    }

    return undefined;
};