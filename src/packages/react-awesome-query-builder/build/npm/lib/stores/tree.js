'use strict';

exports.__esModule = true;
exports._getNewValueForFieldOp = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _treeUtils = require('../utils/treeUtils');

var _defaultUtils = require('../utils/defaultUtils');

var _configUtils = require('../utils/configUtils');

var _constants = require('../constants');

var constants = _interopRequireWildcard(_constants);

var _uuid = require('../utils/uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _stuff = require('../utils/stuff');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var stringify = require('json-stringify-safe');

var hasChildren = function hasChildren(tree, path) {
    return tree.getIn((0, _treeUtils.expandTreePath)(path, 'children1')).size > 0;
};

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {object} properties
 */
var addNewGroup = function addNewGroup(state, path, properties, config) {
    //console.log("Adding group");
    var groupUuid = (0, _uuid2.default)();
    state = addItem(state, path, 'group', groupUuid, (0, _defaultUtils.defaultGroupProperties)(config).merge(properties || {}));

    var groupPath = path.push(groupUuid);
    // If we don't set the empty map, then the following merge of addItem will create a Map rather than an OrderedMap for some reason
    state = state.setIn((0, _treeUtils.expandTreePath)(groupPath, 'children1'), new _immutable2.default.OrderedMap());
    state = addItem(state, groupPath, 'rule', (0, _uuid2.default)(), (0, _defaultUtils.defaultRuleProperties)(config).merge(properties || {}));
    return state;
};

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {object} properties
 */
var removeGroup = function removeGroup(state, path, config) {
    state = removeItem(state, path);

    var parentPath = path.slice(0, -1);
    var isEmptyGroup = !hasChildren(state, parentPath);
    var isEmptyRoot = isEmptyGroup && parentPath.size == 1;
    var canLeaveEmpty = isEmptyGroup && config.settings.canLeaveEmptyGroup && !isEmptyRoot;
    if (isEmptyGroup && !canLeaveEmpty) {
        state = addItem(state, parentPath, 'rule', (0, _uuid2.default)(), (0, _defaultUtils.defaultRuleProperties)(config));
    }
    return state;
};

/**
 * @param {object} config
 * @param {Immutable.List} path
 */
var removeRule = function removeRule(state, path, config) {
    state = removeItem(state, path);

    var parentPath = path.slice(0, -1);
    var isEmptyGroup = !hasChildren(state, parentPath);
    var isEmptyRoot = isEmptyGroup && parentPath.size == 1;
    var canLeaveEmpty = isEmptyGroup && config.settings.canLeaveEmptyGroup && !isEmptyRoot;
    if (isEmptyGroup && !canLeaveEmpty) {
        state = addItem(state, parentPath, 'rule', (0, _uuid2.default)(), (0, _defaultUtils.defaultRuleProperties)(config));
    }
    return state;
};

/**
 * @param {Immutable.Map} state
 * @param {Immutable.List} path
 * @param {string} conjunction
 */
var setConjunction = function setConjunction(state, path, conjunction) {
    return state.setIn((0, _treeUtils.expandTreePath)(path, 'properties', 'conjunction'), conjunction);
};

/**
 * @param {Immutable.Map} state
 * @param {Immutable.List} path
 * @param {bool} not
 */
var setNot = function setNot(state, path, not) {
    return state.setIn((0, _treeUtils.expandTreePath)(path, 'properties', 'not'), not);
};

/**
 * @param {Immutable.Map} state
 * @param {Immutable.List} path
 * @param {string} type
 * @param {string} id
 * @param {Immutable.OrderedMap} properties
 */
var addItem = function addItem(state, path, type, id, properties) {
    return state.mergeIn((0, _treeUtils.expandTreePath)(path, 'children1'), new _immutable2.default.OrderedMap(_defineProperty({}, id, new _immutable2.default.Map({ type: type, id: id, properties: properties }))));
};

/**
 * @param {Immutable.Map} state
 * @param {Immutable.List} path
 */
var removeItem = function removeItem(state, path) {
    return state.deleteIn((0, _treeUtils.expandTreePath)(path));
};

/**
 * @param {Immutable.Map} state
 * @param {Immutable.List} fromPath
 * @param {Immutable.List} toPath
 * @param {string} placement, see constants PLACEMENT_*: PLACEMENT_AFTER, PLACEMENT_BEFORE, PLACEMENT_APPEND, PLACEMENT_PREPEND
 * @param {object} config
 */
var moveItem = function moveItem(state, fromPath, toPath, placement, config) {
    var from = (0, _treeUtils.getItemByPath)(state, fromPath);
    var sourcePath = fromPath.pop();
    var source = fromPath.size > 1 ? (0, _treeUtils.getItemByPath)(state, sourcePath) : null;
    var sourceChildren = source ? source.get('children1') : null;

    var to = (0, _treeUtils.getItemByPath)(state, toPath);
    var targetPath = placement == constants.PLACEMENT_APPEND || placement == constants.PLACEMENT_PREPEND ? toPath : toPath.pop();
    var target = placement == constants.PLACEMENT_APPEND || placement == constants.PLACEMENT_PREPEND ? to : toPath.size > 1 ? (0, _treeUtils.getItemByPath)(state, targetPath) : null;
    var targetChildren = target ? target.get('children1') : null;

    if (!source || !target) return state;

    var isSameParent = source.get('id') == target.get('id');
    var isSourceInsideTarget = targetPath.size < sourcePath.size && JSON.stringify(targetPath.toArray()) == JSON.stringify(sourcePath.toArray().slice(0, targetPath.size));
    var isTargetInsideSource = targetPath.size > sourcePath.size && JSON.stringify(sourcePath.toArray()) == JSON.stringify(targetPath.toArray().slice(0, sourcePath.size));
    var sourceSubpathFromTarget = null;
    var targetSubpathFromSource = null;
    if (isSourceInsideTarget) {
        sourceSubpathFromTarget = _immutable2.default.List(sourcePath.toArray().slice(targetPath.size));
    } else if (isTargetInsideSource) {
        targetSubpathFromSource = _immutable2.default.List(targetPath.toArray().slice(sourcePath.size));
    }

    var newTargetChildren = targetChildren,
        newSourceChildren = sourceChildren;
    if (!isTargetInsideSource) newSourceChildren = newSourceChildren.delete(from.get('id'));
    if (isSameParent) {
        newTargetChildren = newSourceChildren;
    } else if (isSourceInsideTarget) {
        newTargetChildren = newTargetChildren.updateIn((0, _treeUtils.expandTreeSubpath)(sourceSubpathFromTarget, 'children1'), function (oldChildren) {
            return newSourceChildren;
        });
    }

    if (placement == constants.PLACEMENT_BEFORE || placement == constants.PLACEMENT_AFTER) {
        newTargetChildren = _immutable2.default.OrderedMap().withMutations(function (r) {
            var itemId = void 0,
                item = void 0,
                i = 0,
                size = newTargetChildren.size;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = newTargetChildren.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _slicedToArray(_step.value, 2);

                    itemId = _step$value[0];
                    item = _step$value[1];

                    if (itemId == to.get('id') && placement == constants.PLACEMENT_BEFORE) {
                        r.set(from.get('id'), from);
                    }

                    r.set(itemId, item);

                    if (itemId == to.get('id') && placement == constants.PLACEMENT_AFTER) {
                        r.set(from.get('id'), from);
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
        });
    } else if (placement == constants.PLACEMENT_APPEND) {
        newTargetChildren = newTargetChildren.merge(_defineProperty({}, from.get('id'), from));
    } else if (placement == constants.PLACEMENT_PREPEND) {
        newTargetChildren = _immutable2.default.OrderedMap(_defineProperty({}, from.get('id'), from)).merge(newTargetChildren);
    }

    if (isTargetInsideSource) {
        newSourceChildren = newSourceChildren.updateIn((0, _treeUtils.expandTreeSubpath)(targetSubpathFromSource, 'children1'), function (oldChildren) {
            return newTargetChildren;
        });
        newSourceChildren = newSourceChildren.delete(from.get('id'));
    }

    if (!isSameParent && !isSourceInsideTarget) state = state.updateIn((0, _treeUtils.expandTreePath)(sourcePath, 'children1'), function (oldChildren) {
        return newSourceChildren;
    });
    if (!isTargetInsideSource) state = state.updateIn((0, _treeUtils.expandTreePath)(targetPath, 'children1'), function (oldChildren) {
        return newTargetChildren;
    });

    return state;
};

/**
 * @param {object} config
 * @param {object} oldConfig
 * @param {Immutable.Map} current
 * @param {string} newField
 * @param {string} newOperator
 * @param {string} changedField
 * @return {object} - {canReuseValue, newValue, newValueSrc, newValueType}
 */
var _getNewValueForFieldOp = exports._getNewValueForFieldOp = function _getNewValueForFieldOp(config) {
    var oldConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var current = arguments[2];
    var newField = arguments[3];
    var newOperator = arguments[4];
    var changedField = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

    if (!oldConfig) oldConfig = config;
    var currentField = current.get('field');
    var currentOperator = current.get('operator');
    var currentValue = current.get('value');
    var currentValueSrc = current.get('valueSrc', new _immutable2.default.List());
    var currentValueType = current.get('valueType', new _immutable2.default.List());

    var currentOperatorConfig = (0, _configUtils.getOperatorConfig)(oldConfig, currentOperator, currentField);
    var newOperatorConfig = (0, _configUtils.getOperatorConfig)(config, newOperator, newField);
    var operatorCardinality = newOperator ? (0, _stuff.defaultValue)(newOperatorConfig.cardinality, 1) : null;
    var currentFieldConfig = (0, _configUtils.getFieldConfig)(currentField, oldConfig);
    var currentWidgets = Array.from({ length: operatorCardinality }, function (_ignore, i) {
        var vs = currentValueSrc.get(i) || null;
        var w = (0, _configUtils.getWidgetForFieldOp)(oldConfig, currentField, currentOperator, vs);
        return w;
    });

    var newFieldConfig = (0, _configUtils.getFieldConfig)(newField, config);
    var newWidgets = Array.from({ length: operatorCardinality }, function (_ignore, i) {
        var vs = currentValueSrc.get(i) || null;
        var w = (0, _configUtils.getWidgetForFieldOp)(config, newField, newOperator, vs);
        return w;
    });
    var commonWidgetsCnt = Math.min(newWidgets.length, currentWidgets.length);
    var firstWidgetConfig = (0, _configUtils.getFieldWidgetConfig)(config, newField, newOperator, null, currentValueSrc.first());
    var valueSources = (0, _configUtils.getValueSourcesForFieldOp)(config, newField, newOperator);
    var canReuseValue = currentField && currentOperator && newOperator && (!changedField || changedField == 'field' && !config.settings.clearValueOnChangeField || changedField == 'operator' && !config.settings.clearValueOnChangeOp) && currentFieldConfig && newFieldConfig && currentFieldConfig.type == newFieldConfig.type && JSON.stringify(currentWidgets.slice(0, commonWidgetsCnt)) == JSON.stringify(newWidgets.slice(0, commonWidgetsCnt));

    if (canReuseValue) {
        var _loop = function _loop(i) {
            var v = currentValue.get(i);
            var vType = currentValueType.get(i) || null;
            var vSrc = currentValueSrc.get(i) || null;
            var isValidSrc = valueSources.find(function (v) {
                return v == vSrc;
            }) != null;
            var isValid = _validateValue(config, newField, newOperator, v, vType, vSrc);
            if (!isValidSrc || !isValid) {
                canReuseValue = false;
                return 'break';
            }
        };

        for (var i = 0; i < commonWidgetsCnt; i++) {
            var _ret = _loop(i);

            if (_ret === 'break') break;
        }
    }

    var newValue = null,
        newValueSrc = null,
        newValueType = null;
    newValue = new _immutable2.default.List(Array.from({ length: operatorCardinality }, function (_ignore, i) {
        var v = undefined;
        if (canReuseValue) {
            if (i < currentValue.size) v = currentValue.get(i);
        } else if (operatorCardinality == 1 && firstWidgetConfig && firstWidgetConfig.defaultValue !== undefined) {
            v = firstWidgetConfig.defaultValue;
        }
        return v;
    }));
    newValueSrc = new _immutable2.default.List(Array.from({ length: operatorCardinality }, function (_ignore, i) {
        var vs = null;
        if (canReuseValue) {
            if (i < currentValueSrc.size) vs = currentValueSrc.get(i);
        } else if (valueSources.length == 1) {
            vs = valueSources[0];
        } else if (valueSources.length > 1) {
            vs = valueSources[0];
        }
        return vs;
    }));
    newValueType = new _immutable2.default.List(Array.from({ length: operatorCardinality }, function (_ignore, i) {
        var v = null;
        if (canReuseValue) {
            if (i < currentValueType.size) v = currentValueType.get(i);
        } else if (operatorCardinality == 1 && firstWidgetConfig && firstWidgetConfig.defaultValue !== undefined) {
            v = firstWidgetConfig.type;
        }
        return v;
    }));

    return { canReuseValue: canReuseValue, newValue: newValue, newValueSrc: newValueSrc, newValueType: newValueType };
};

var _validateValue = function _validateValue(config, field, operator, value, valueType, valueSrc) {
    var v = value,
        vType = valueType,
        vSrc = valueSrc;
    var fieldConfig = (0, _configUtils.getFieldConfig)(field, config);
    var w = (0, _configUtils.getWidgetForFieldOp)(config, field, operator, vSrc);
    var wConfig = config.widgets[w];
    var wType = wConfig.type;
    var fieldWidgetDefinition = (0, _omit2.default)((0, _configUtils.getFieldWidgetConfig)(config, field, operator, w, vSrc), ['factory', 'formatValue']);
    var isValid = true;
    if (v != null) {
        var rightFieldDefinition = vSrc == 'field' ? (0, _configUtils.getFieldConfig)(v, config) : null;
        if (vSrc == 'field') {
            if (v == field || !rightFieldDefinition) {
                //can't compare field with itself or no such field
                isValid = false;
            }
        } else if (vSrc == 'value') {
            if (vType != wType) {
                isValid = false;
            }
            if (fieldConfig && fieldConfig.listValues) {
                if (v instanceof Array) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = v[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var _v = _step2.value;

                            if (fieldConfig.listValues[_v] == undefined) {
                                //prev value is not in new list of values!
                                isValid = false;
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                } else {
                    if (fieldConfig.listValues[v] == undefined) {
                        //prev value is not in new list of values!
                        isValid = false;
                    }
                }
            }
            var fieldSettings = fieldConfig.fieldSettings;
            if (fieldSettings) {
                if (fieldSettings.min != null) {
                    isValid = isValid && v >= fieldSettings.min;
                }
                if (fieldSettings.max != null) {
                    isValid = isValid && v <= fieldSettings.max;
                }
            }
        }
        var fn = fieldWidgetDefinition.validateValue;
        if (typeof fn == 'function') {
            var args = [v,
            //field,
            fieldConfig];
            if (vSrc == 'field') v.push(rightFieldDefinition);
            isValid = isValid && fn.apply(undefined, args);
        }
    }
    return isValid;
};

/**
 * @param {Immutable.Map} state
 * @param {Immutable.List} path
 * @param {string} field
 */
var setField = function setField(state, path, newField, config) {
    if (!newField) return removeItem(state, path);

    return state.updateIn((0, _treeUtils.expandTreePath)(path, 'properties'), function (map) {
        return map.withMutations(function (current) {
            var currentField = current.get('field');
            var currentOperator = current.get('operator');
            var currentOperatorOptions = current.get('operatorOptions');
            //const currentValue = current.get('value');
            //const currentValueSrc = current.get('valueSrc', new Immutable.List());
            //const currentValueType = current.get('valueType', new Immutable.List());

            // If the newly selected field supports the same operator the rule currently
            // uses, keep it selected.
            var newFieldConfig = (0, _configUtils.getFieldConfig)(newField, config);
            var lastOp = newFieldConfig && newFieldConfig.operators.indexOf(currentOperator) !== -1 ? currentOperator : null;
            var newOperator = null;
            var availOps = (0, _configUtils.getOperatorsForField)(config, newField);
            if (availOps.length == 1) newOperator = availOps[0];else if (availOps.length > 1) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = (config.settings.setOpOnChangeField || [])[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var strategy = _step3.value;

                        if (strategy == 'keep') newOperator = lastOp;else if (strategy == 'default') newOperator = (0, _defaultUtils.defaultOperator)(config, newField, false);else if (strategy == 'first') newOperator = (0, _configUtils.getFirstOperator)(config, newField);
                        if (newOperator) //found op for strategy
                            break;
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            }

            var _getNewValueForFieldO = _getNewValueForFieldOp(config, config, current, newField, newOperator, 'field'),
                canReuseValue = _getNewValueForFieldO.canReuseValue,
                newValue = _getNewValueForFieldO.newValue,
                newValueSrc = _getNewValueForFieldO.newValueSrc,
                newValueType = _getNewValueForFieldO.newValueType;

            var newOperatorOptions = canReuseValue ? currentOperatorOptions : (0, _defaultUtils.defaultOperatorOptions)(config, newOperator, newField);

            return current.set('field', newField).set('operator', newOperator).set('operatorOptions', newOperatorOptions).set('value', newValue).set('valueSrc', newValueSrc).set('valueType', newValueType);
        });
    });
};

/**
 * @param {Immutable.Map} state
 * @param {Immutable.List} path
 * @param {string} operator
 */
var setOperator = function setOperator(state, path, newOperator, config) {
    return state.updateIn((0, _treeUtils.expandTreePath)(path, 'properties'), function (map) {
        return map.withMutations(function (current) {
            var currentValue = current.get('value', new _immutable2.default.List());
            var currentValueSrc = current.get('valueSrc', new _immutable2.default.List());
            var currentField = current.get('field');
            var currentOperator = current.get('operator');
            var currentOperatorOptions = current.get('operatorOptions');

            var _getNewValueForFieldO2 = _getNewValueForFieldOp(config, config, current, currentField, newOperator, 'operator'),
                canReuseValue = _getNewValueForFieldO2.canReuseValue,
                newValue = _getNewValueForFieldO2.newValue,
                newValueSrc = _getNewValueForFieldO2.newValueSrc,
                newValueType = _getNewValueForFieldO2.newValueType;

            var newOperatorOptions = canReuseValue ? currentOperatorOptions : (0, _defaultUtils.defaultOperatorOptions)(config, newOperator, currentField);

            return current.set('operator', newOperator).set('operatorOptions', newOperatorOptions).set('value', newValue).set('valueSrc', newValueSrc).set('valueType', newValueType);
        });
    });
};

/**
 * @param {Immutable.Map} state
 * @param {Immutable.List} path
 * @param {integer} delta
 * @param {*} value
 * @param {string} valueType
 */
var setValue = function setValue(state, path, delta, value, valueType, config) {
    var valueSrc = state.getIn((0, _treeUtils.expandTreePath)(path, 'properties', 'valueSrc', delta + '')) || null;
    var field = state.getIn((0, _treeUtils.expandTreePath)(path, 'properties', 'field')) || null;
    var operator = state.getIn((0, _treeUtils.expandTreePath)(path, 'properties', 'operator')) || null;
    var isValid = _validateValue(config, field, operator, value, valueType, valueSrc);

    if (isValid) {
        if (typeof value === "undefined") {
            state = state.setIn((0, _treeUtils.expandTreePath)(path, 'properties', 'value', delta + ''), undefined);
            state = state.setIn((0, _treeUtils.expandTreePath)(path, 'properties', 'valueType', delta + ''), null);
        } else {
            state = state.setIn((0, _treeUtils.expandTreePath)(path, 'properties', 'value', delta + ''), value);
            state = state.setIn((0, _treeUtils.expandTreePath)(path, 'properties', 'valueType', delta + ''), valueType);
        }
    }

    return state;
};

/**
 * @param {Immutable.Map} state
 * @param {Immutable.List} path
 * @param {integer} delta
 * @param {*} srcKey
 */
var setValueSrc = function setValueSrc(state, path, delta, srcKey) {
    state = state.setIn((0, _treeUtils.expandTreePath)(path, 'properties', 'value', delta + ''), undefined);
    state = state.setIn((0, _treeUtils.expandTreePath)(path, 'properties', 'valueType', delta + ''), null);

    if (typeof srcKey === "undefined") {
        state = state.setIn((0, _treeUtils.expandTreePath)(path, 'properties', 'valueSrc', delta + ''), null);
    } else {
        state = state.setIn((0, _treeUtils.expandTreePath)(path, 'properties', 'valueSrc', delta + ''), srcKey);
    }
    return state;
};

/**
 * @param {Immutable.Map} state
 * @param {Immutable.List} path
 * @param {string} name
 * @param {*} value
 */
var setOperatorOption = function setOperatorOption(state, path, name, value) {
    return state.setIn((0, _treeUtils.expandTreePath)(path, 'properties', 'operatorOptions', name), value);
};

/**
 * @param {Immutable.Map} state
 * @param {object} action
 */

exports.default = function (config) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _defaultUtils.defaultRoot)(config);
        var action = arguments[1];

        switch (action.type) {
            case constants.SET_TREE:
                return action.tree;

            case constants.ADD_NEW_GROUP:
                return addNewGroup(state, action.path, action.properties, action.config);

            case constants.ADD_GROUP:
                return addItem(state, action.path, 'group', action.id, action.properties);

            case constants.REMOVE_GROUP:
                return removeGroup(state, action.path, action.config);

            case constants.ADD_RULE:
                return addItem(state, action.path, 'rule', action.id, action.properties);

            case constants.REMOVE_RULE:
                return removeRule(state, action.path, action.config);

            case constants.SET_CONJUNCTION:
                return setConjunction(state, action.path, action.conjunction);

            case constants.SET_NOT:
                return setNot(state, action.path, action.not);

            case constants.SET_FIELD:
                return setField(state, action.path, action.field, action.config);

            case constants.SET_OPERATOR:
                return setOperator(state, action.path, action.operator, action.config);

            case constants.SET_VALUE:
                return setValue(state, action.path, action.delta, action.value, action.valueType, action.config);

            case constants.SET_VALUE_SRC:
                return setValueSrc(state, action.path, action.delta, action.srcKey);

            case constants.SET_OPERATOR_OPTION:
                return setOperatorOption(state, action.path, action.name, action.value);

            case constants.MOVE_ITEM:
                return moveItem(state, action.fromPath, action.toPath, action.placement, action.config);

            default:
                return state;
        }
    };
};