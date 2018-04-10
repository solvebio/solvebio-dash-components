'use strict';

exports.__esModule = true;
exports.getWidgetForFieldOp = exports.getValueSourcesForFieldOp = exports.getWidgetsForFieldOp = exports.getValueLabel = exports.getFieldWidgetConfig = exports.getOperatorConfig = exports.getFieldPathLabels = exports.getFieldPath = exports.getFirstOperator = exports.getOperatorsForField = exports.getFirstField = exports.getFieldConfig = exports.getFieldRawConfig = exports.extendConfig = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _last = require('lodash/last');

var _last2 = _interopRequireDefault(_last);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _pickBy = require('lodash/pickBy');

var _pickBy2 = _interopRequireDefault(_pickBy);

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _mergeWith = require('lodash/mergeWith');

var _mergeWith2 = _interopRequireDefault(_mergeWith);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extendConfig = exports.extendConfig = function extendConfig(config) {
    //operators, defaultOperator - merge
    //widgetProps (including valueLabel, valuePlaceholder, hideOperator, operatorInlineLabel) - concrete by widget

    //extend 'types' path
    for (var type in config.types) {
        var typeConfig = config.types[type];
        var operators = null,
            defaultOperator = null;
        typeConfig.mainWidget = typeConfig.mainWidget || Object.keys(typeConfig.widgets).filter(function (w) {
            return w != 'field';
        })[0];
        for (var widget in typeConfig.widgets) {
            var typeWidgetConfig = typeConfig.widgets[widget];
            if (typeWidgetConfig.operators) {
                if (!operators) operators = [];
                operators = operators.concat(typeWidgetConfig.operators.slice());
            }
            if (typeWidgetConfig.defaultOperator) defaultOperator = typeWidgetConfig.defaultOperator;
            if (widget == typeConfig.mainWidget) {
                typeWidgetConfig = (0, _merge2.default)({}, { widgetProps: typeConfig.mainWidgetProps || {} }, typeWidgetConfig);
            }
            typeConfig.widgets[widget] = typeWidgetConfig;
        }
        if (!typeConfig.valueSources) typeConfig.valueSources = Object.keys(config.settings.valueSourcesInfo);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = typeConfig.valueSources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var valueSrc = _step.value;

                if (valueSrc != 'value' && !typeConfig.widgets[valueSrc]) {
                    typeConfig.widgets[valueSrc] = {};
                }
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

        if (!typeConfig.operators && operators) typeConfig.operators = Array.from(new Set(operators)); //unique
        if (!typeConfig.defaultOperator && defaultOperator) typeConfig.defaultOperator = defaultOperator;
        config.types[type] = typeConfig;
    }

    //extend 'fields' path
    function _extendFieldConfig(fieldConfig) {
        var operators = null,
            defaultOperator = null;
        var typeConfig = config.types[fieldConfig.type];
        if (fieldConfig.type != '!struct') {
            if (!fieldConfig.widgets) fieldConfig.widgets = {};
            fieldConfig.mainWidget = fieldConfig.mainWidget || typeConfig.mainWidget;
            fieldConfig.valueSources = fieldConfig.valueSources || typeConfig.valueSources;
            for (var _widget in typeConfig.widgets) {
                var fieldWidgetConfig = fieldConfig.widgets[_widget] || {};
                if (fieldWidgetConfig.operators) {
                    if (!operators) operators = [];
                    operators = operators.concat(fieldWidgetConfig.operators.slice());
                }
                if (fieldWidgetConfig.defaultOperator) defaultOperator = fieldWidgetConfig.defaultOperator;
                if (_widget == fieldConfig.mainWidget) {
                    fieldWidgetConfig = (0, _merge2.default)({}, { widgetProps: fieldConfig.mainWidgetProps || {} }, fieldWidgetConfig);
                }
                fieldConfig.widgets[_widget] = fieldWidgetConfig;
            }
            if (!fieldConfig.operators && operators) fieldConfig.operators = Array.from(new Set(operators));
            if (!fieldConfig.defaultOperator && defaultOperator) fieldConfig.defaultOperator = defaultOperator;
        }
    };
    function _extendFieldsConfig(subconfig) {
        for (var field in subconfig) {
            _extendFieldConfig(subconfig[field]);
            if (subconfig[field].subfields) {
                _extendFieldsConfig(subconfig[field].subfields);
            }
        }
    }
    _extendFieldsConfig(config.fields);
    //console.log(config); 
    return config;
};

var getFieldRawConfig = exports.getFieldRawConfig = function getFieldRawConfig(field, config) {
    if (!field || field == ':empty:') return null;
    var fieldSeparator = config.settings.fieldSeparator;
    var parts = field.split(fieldSeparator);
    var fields = config.fields;
    var fieldConfig = null;
    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        var tmpFieldConfig = fields[part];
        if (!tmpFieldConfig) return null;
        if (i == parts.length - 1) {
            fieldConfig = tmpFieldConfig;
        } else {
            fields = tmpFieldConfig.subfields;
            if (!fields) return null;
        }
    }
    return fieldConfig;
};

var getFieldConfig = exports.getFieldConfig = function getFieldConfig(field, config) {
    if (!field || field == ':empty:') return null;
    var fieldConfig = getFieldRawConfig(field, config);
    if (!fieldConfig) return null; //throw new Error("Can't find field " + field + ", please check your config");

    //merge, but don't merge operators (rewrite instead)
    var typeConfig = config.types[fieldConfig.type] || {};
    var ret = (0, _mergeWith2.default)({}, typeConfig, fieldConfig || {}, function (objValue, srcValue, key, object, source, stack) {
        if (Array.isArray(objValue)) {
            return srcValue;
        }
    });

    return ret;
};

var getFirstField = exports.getFirstField = function getFirstField(config) {
    var fieldSeparator = config.settings.fieldSeparator;
    var firstField = null,
        key = null,
        keysPath = [];
    if (Object.keys(config.fields).length > 0) {
        key = Object.keys(config.fields)[0];
        firstField = config.fields[key];
        keysPath.push(key);
        while (firstField.type == '!struct') {
            var subfields = firstField.subfields;
            if (!subfields || !Object.keys(subfields).length) {
                firstField = key = null;
                break;
            }
            key = Object.keys(subfields)[0];
            keysPath.push(key);
            firstField = subfields[key];
        }
    }
    return keysPath.join(fieldSeparator);
};

var getOperatorsForField = exports.getOperatorsForField = function getOperatorsForField(config, field) {
    var fieldConfig = getFieldConfig(field, config);
    var fieldOps = fieldConfig ? fieldConfig.operators : [];
    return fieldOps;
};

var getFirstOperator = exports.getFirstOperator = function getFirstOperator(config, field) {
    var fieldOps = getOperatorsForField(config, field);
    return fieldOps ? fieldOps[0] : null;
};

var getFieldPath = exports.getFieldPath = function getFieldPath(field, config) {
    if (!field || field == ':empty:') return null;
    var fieldSeparator = config.settings.fieldSeparator;
    return field.split(fieldSeparator).map(function (curr, ind, arr) {
        return arr.slice(0, ind + 1);
    }).map(function (parts) {
        return parts.join(fieldSeparator);
    });
};

var getFieldPathLabels = exports.getFieldPathLabels = function getFieldPathLabels(field, config) {
    if (!field || field == ':empty:') return null;
    var fieldSeparator = config.settings.fieldSeparator;
    return field.split(fieldSeparator).map(function (curr, ind, arr) {
        return arr.slice(0, ind + 1);
    }).map(function (parts) {
        return parts.join(fieldSeparator);
    }).map(function (part) {
        var cnf = getFieldConfig(part, config);
        return cnf && cnf.label || (0, _last2.default)(part.split(fieldSeparator));
    });
};

var getOperatorConfig = exports.getOperatorConfig = function getOperatorConfig(config, operator) {
    var field = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    if (!operator) return null;
    var opConfig = config.operators[operator];
    if (field) {
        var fieldConfig = getFieldConfig(field, config);
        var widget = getWidgetForFieldOp(config, field, operator);
        var fieldWidgetConfig = (fieldConfig && fieldConfig.widgets ? fieldConfig.widgets[widget] : {}) || {};
        var fieldWidgetOpProps = (fieldWidgetConfig.opProps || {})[operator];
        var mergedOpConfig = (0, _merge2.default)({}, opConfig, fieldWidgetOpProps);
        return mergedOpConfig;
    } else {
        return opConfig;
    }
};

var getFieldWidgetConfig = exports.getFieldWidgetConfig = function getFieldWidgetConfig(config, field, operator) {
    var widget = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var valueSrc = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    if (!field || !(operator || widget)) return null;
    var fieldConfig = getFieldConfig(field, config);
    if (!widget) widget = getWidgetForFieldOp(config, field, operator, valueSrc);
    var widgetConfig = config.widgets[widget] || {};
    var fieldWidgetConfig = (fieldConfig && fieldConfig.widgets ? fieldConfig.widgets[widget] : {}) || {};
    var fieldWidgetProps = fieldWidgetConfig.widgetProps || {};
    var mergedConfig = (0, _merge2.default)({}, widgetConfig, fieldWidgetProps);
    return mergedConfig;
};

var getValueLabel = exports.getValueLabel = function getValueLabel(config, field, operator, delta) {
    var valueSrc = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    var fieldWidgetConfig = getFieldWidgetConfig(config, field, operator, null, valueSrc) || {};
    var mergedOpConfig = getOperatorConfig(config, operator, field) || {};

    var cardinality = mergedOpConfig.cardinality;
    var ret = null;
    if (cardinality > 1) {
        var valueLabels = mergedOpConfig.valueLabels;
        if (valueLabels) ret = valueLabels[delta];
        if (ret && (typeof ret === 'undefined' ? 'undefined' : _typeof(ret)) != 'object') {
            ret = { label: ret, placeholder: ret };
        }
        if (!ret) {
            ret = {
                label: (config.settings.valueLabel || "Value") + " " + (delta + 1),
                placeholder: (config.settings.valuePlaceholder || "Value") + " " + (delta + 1)
            };
        }
    } else {
        ret = {
            label: fieldWidgetConfig.valueLabel || config.settings.valueLabel || "Value",
            placeholder: fieldWidgetConfig.valuePlaceholder || config.settings.valuePlaceholder || "Value"
        };
    }
    return ret;
};

function _getWidgetsAndSrcsForFieldOp(config, field, operator) {
    var valueSrc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    var widgets = [];
    var valueSrcs = [];
    if (!field || !operator) return { widgets: widgets, valueSrcs: valueSrcs };
    var fieldConfig = getFieldConfig(field, config);
    //const typeConfig = config.types[fieldConfig.type] || {};
    var opConfig = config.operators[operator];
    if (fieldConfig && fieldConfig.widgets) {
        var _loop = function _loop(widget) {
            var widgetConfig = fieldConfig.widgets[widget];
            var widgetValueSrc = config.widgets[widget].valueSrc;
            var canAdd = widgetConfig.operators ? widgetConfig.operators.indexOf(operator) != -1 : valueSrc != 'value';
            canAdd = canAdd && (!valueSrc || valueSrc == widgetValueSrc);
            if (opConfig.isUnary && widgetValueSrc != 'value') canAdd = false;
            if (canAdd) {
                widgets.push(widget);
                if (fieldConfig.valueSources && fieldConfig.valueSources.indexOf(widgetValueSrc) != -1 && !valueSrcs.find(function (v) {
                    return v == widgetValueSrc;
                })) valueSrcs.push(widgetValueSrc);
            }
        };

        for (var widget in fieldConfig.widgets) {
            _loop(widget);
        }
    }
    widgets.sort(function (w1, w2) {
        var w1Main = w1 == fieldConfig.mainWidget;
        var w2Main = w2 == fieldConfig.mainWidget;
        if (w1 != w2) {
            return w1 ? -1 : +1;
        }
        return 0;
    });
    return { widgets: widgets, valueSrcs: valueSrcs };
};

var getWidgetsForFieldOp = exports.getWidgetsForFieldOp = function getWidgetsForFieldOp(config, field, operator) {
    var valueSrc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    var _getWidgetsAndSrcsFor = _getWidgetsAndSrcsForFieldOp(config, field, operator, valueSrc),
        widgets = _getWidgetsAndSrcsFor.widgets,
        valueSrcs = _getWidgetsAndSrcsFor.valueSrcs;

    return widgets;
};

var getValueSourcesForFieldOp = exports.getValueSourcesForFieldOp = function getValueSourcesForFieldOp(config, field, operator) {
    var _getWidgetsAndSrcsFor2 = _getWidgetsAndSrcsForFieldOp(config, field, operator, null),
        widgets = _getWidgetsAndSrcsFor2.widgets,
        valueSrcs = _getWidgetsAndSrcsFor2.valueSrcs;

    return valueSrcs;
};

var getWidgetForFieldOp = exports.getWidgetForFieldOp = function getWidgetForFieldOp(config, field, operator) {
    var valueSrc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    var _getWidgetsAndSrcsFor3 = _getWidgetsAndSrcsForFieldOp(config, field, operator, valueSrc),
        widgets = _getWidgetsAndSrcsFor3.widgets,
        valueSrcs = _getWidgetsAndSrcsFor3.valueSrcs;

    return widgets.length ? widgets[0] : null;
};