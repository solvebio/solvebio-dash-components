'use strict';

exports.__esModule = true;
exports.default = undefined;

var _col = require('antd/lib/col');

var _col2 = _interopRequireDefault(_col);

var _icon = require('antd/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _button = require('antd/lib/button');

var _button2 = _interopRequireDefault(_button);

var _dropdown = require('antd/lib/dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _menu = require('antd/lib/menu');

var _menu2 = _interopRequireDefault(_menu);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp;

require('antd/lib/col/style/css');

require('antd/lib/icon/style/css');

require('antd/lib/button/style/css');

require('antd/lib/dropdown/style/css');

require('antd/lib/menu/style/css');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactAddonsShallowCompare = require('react-addons-shallow-compare');

var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

var _RuleContainer = require('./containers/RuleContainer');

var _RuleContainer2 = _interopRequireDefault(_RuleContainer);

var _Field = require('./Field');

var _Field2 = _interopRequireDefault(_Field);

var _Operator = require('./Operator');

var _Operator2 = _interopRequireDefault(_Operator);

var _Widget = require('./Widget');

var _Widget2 = _interopRequireDefault(_Widget);

var _OperatorOptions = require('./OperatorOptions');

var _OperatorOptions2 = _interopRequireDefault(_OperatorOptions);

var _configUtils = require('../utils/configUtils');

var _size = require('lodash/size');

var _size2 = _interopRequireDefault(_size);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SubMenu = _menu2.default.SubMenu;
var MenuItem = _menu2.default.Item;
var DropdownButton = _dropdown2.default.Button;

var stringify = require('json-stringify-safe');
var classNames = require('classnames');

var Rule = (0, _RuleContainer2.default)(_class = (_temp = _class2 = function (_Component) {
    _inherits(Rule, _Component);

    function Rule(props) {
        _classCallCheck(this, Rule);

        var _this = _possibleConstructorReturn(this, (Rule.__proto__ || Object.getPrototypeOf(Rule)).call(this, props));

        _this.shouldComponentUpdate = _reactAddonsShallowCompare2.default;

        _this.state = {};
        return _this;
    }

    _createClass(Rule, [{
        key: 'handleDraggerMouseDown',
        value: function handleDraggerMouseDown(e) {
            var nodeId = this.props.id;
            var dom = this.refs.rule;

            if (this.props.onDragStart) {
                this.props.onDragStart(nodeId, dom, e);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var selectedFieldPartsLabels = (0, _configUtils.getFieldPathLabels)(this.props.selectedField, this.props.config);
            var selectedFieldConfig = (0, _configUtils.getFieldConfig)(this.props.selectedField, this.props.config);
            var isSelectedGroup = selectedFieldConfig && selectedFieldConfig.type == '!struct';
            var isFieldAndOpSelected = this.props.selectedField && this.props.selectedOperator && !isSelectedGroup;
            var selectedOperatorConfig = (0, _configUtils.getOperatorConfig)(this.props.config, this.props.selectedOperator, this.props.selectedField);
            var selectedOperatorHasOptions = selectedOperatorConfig && selectedOperatorConfig.options != null;
            var selectedFieldWidgetConfig = (0, _configUtils.getFieldWidgetConfig)(this.props.config, this.props.selectedField, this.props.selectedOperator) || {};

            var styles = {};
            if (this.props.renderType == 'dragging') {
                styles = {
                    top: this.props.dragging.y,
                    left: this.props.dragging.x,
                    width: this.props.dragging.w
                };
            }

            return _react2.default.createElement(
                'div',
                {
                    className: classNames("rule", "group-or-rule", this.props.renderType == 'placeholder' ? 'qb-placeholder' : null, this.props.renderType == 'dragging' ? 'qb-draggable' : null),
                    style: styles,
                    ref: 'rule',
                    'data-id': this.props.id
                },
                _react2.default.createElement(
                    'div',
                    { className: 'rule--header' },
                    _react2.default.createElement(
                        _button2.default,
                        {
                            type: 'danger',
                            icon: 'delete',
                            onClick: this.props.removeSelf,
                            size: this.props.config.settings.renderSize || "small"
                        },
                        this.props.config.settings.deleteLabel !== undefined ? this.props.config.settings.deleteLabel : "Delete"
                    )
                ),
                this.props.config.settings.canReorder && this.props.treeNodesCnt > 2 && _react2.default.createElement(
                    'span',
                    { className: "qb-drag-handler", onMouseDown: this.handleDraggerMouseDown.bind(this) },
                    _react2.default.createElement(_icon2.default, { type: 'bars' }),
                    ' '
                ),
                true ? _react2.default.createElement(
                    _col2.default,
                    { key: "fields", className: 'rule--field' },
                    this.props.config.settings.showLabels && _react2.default.createElement(
                        'label',
                        null,
                        this.props.config.settings.fieldLabel || "Field"
                    ),
                    _react2.default.createElement(_Field2.default, {
                        key: 'field',
                        config: this.props.config,
                        selectedField: this.props.selectedField,
                        setField: this.props.setField,
                        renderAsDropdown: this.props.config.settings.renderFieldAndOpAsDropdown,
                        customProps: this.props.config.settings.customFieldSelectProps
                    })
                ) : null,
                this.props.selectedField && !selectedFieldWidgetConfig.hideOperator && _react2.default.createElement(
                    _col2.default,
                    { key: "operators-for-" + (selectedFieldPartsLabels || []).join("_"), className: 'rule--operator' },
                    this.props.config.settings.showLabels && _react2.default.createElement(
                        'label',
                        null,
                        this.props.config.settings.operatorLabel || "Operator"
                    ),
                    _react2.default.createElement(_Operator2.default, {
                        key: 'operator',
                        config: this.props.config,
                        selectedField: this.props.selectedField,
                        selectedOperator: this.props.selectedOperator,
                        setOperator: this.props.setOperator,
                        renderAsDropdown: this.props.config.settings.renderFieldAndOpAsDropdown
                    })
                ),
                this.props.selectedField && selectedFieldWidgetConfig.hideOperator && selectedFieldWidgetConfig.operatorInlineLabel && _react2.default.createElement(
                    _col2.default,
                    { key: "operators-for-" + (selectedFieldPartsLabels || []).join("_"), className: 'rule--operator' },
                    _react2.default.createElement(
                        'div',
                        { className: 'rule--operator' },
                        this.props.config.settings.showLabels ? _react2.default.createElement(
                            'label',
                            null,
                            '\xA0'
                        ) : null,
                        _react2.default.createElement(
                            'span',
                            null,
                            selectedFieldWidgetConfig.operatorInlineLabel
                        )
                    )
                ),
                isFieldAndOpSelected && _react2.default.createElement(
                    _col2.default,
                    { key: "widget-for-" + this.props.selectedOperator, className: 'rule--value' },
                    _react2.default.createElement(_Widget2.default, {
                        key: 'values',
                        field: this.props.selectedField,
                        operator: this.props.selectedOperator,
                        value: this.props.value,
                        valueSrc: this.props.valueSrc,
                        config: this.props.config,
                        setValue: this.props.setValue,
                        setValueSrc: this.props.setValueSrc
                    })
                ),
                isFieldAndOpSelected && selectedOperatorHasOptions && _react2.default.createElement(
                    _col2.default,
                    { key: "op-options-for-" + this.props.selectedOperator, className: 'rule--operator-options' },
                    _react2.default.createElement(_OperatorOptions2.default, {
                        key: 'operatorOptions',
                        selectedField: this.props.selectedField,
                        selectedOperator: this.props.selectedOperator,
                        operatorOptions: this.props.operatorOptions,
                        setOperatorOption: this.props.setOperatorOption,
                        config: this.props.config
                    })
                )
            );
        }
    }]);

    return Rule;
}(_react.Component), _class2.propTypes = {
    selectedField: _propTypes2.default.string,
    selectedOperator: _propTypes2.default.string,
    operatorOptions: _propTypes2.default.object,
    config: _propTypes2.default.object.isRequired,
    dragging: _propTypes2.default.object, //{id, x, y, w, h}
    onDragStart: _propTypes2.default.func,
    renderType: _propTypes2.default.string, //'dragging', 'placeholder', null
    value: _propTypes2.default.any, //depends on widget
    valueSrc: _propTypes2.default.any,
    //path: PropTypes.instanceOf(Immutable.List),
    //actions
    setField: _propTypes2.default.func,
    setOperator: _propTypes2.default.func,
    setOperatorOption: _propTypes2.default.func,
    removeSelf: _propTypes2.default.func,
    setValue: _propTypes2.default.func,
    setValueSrc: _propTypes2.default.func,
    treeNodesCnt: _propTypes2.default.number
}, _temp)) || _class;

exports.default = Rule;