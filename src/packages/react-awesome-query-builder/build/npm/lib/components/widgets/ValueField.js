'use strict';

exports.__esModule = true;
exports.default = undefined;

var _tooltip = require('antd/lib/tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _button = require('antd/lib/button');

var _button2 = _interopRequireDefault(_button);

var _icon = require('antd/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _dropdown = require('antd/lib/dropdown');

var _dropdown2 = _interopRequireDefault(_dropdown);

var _menu = require('antd/lib/menu');

var _menu2 = _interopRequireDefault(_menu);

var _select = require('antd/lib/select');

var _select2 = _interopRequireDefault(_select);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

require('antd/lib/tooltip/style/css');

require('antd/lib/button/style/css');

require('antd/lib/icon/style/css');

require('antd/lib/dropdown/style/css');

require('antd/lib/menu/style/css');

require('antd/lib/select/style/css');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactAddonsShallowCompare = require('react-addons-shallow-compare');

var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

var _configUtils = require('../../utils/configUtils');

var _stuff = require('../../utils/stuff');

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _last = require('lodash/last');

var _last2 = _interopRequireDefault(_last);

var _keys = require('lodash/keys');

var _keys2 = _interopRequireDefault(_keys);

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Option = _select2.default.Option,
    OptGroup = _select2.default.OptGroup;

var SubMenu = _menu2.default.SubMenu;
var MenuItem = _menu2.default.Item;
var DropdownButton = _dropdown2.default.Button;


//tip: this.props.value - right value, this.props.field - left value

var ValueField = (_temp2 = _class = function (_Component) {
    _inherits(ValueField, _Component);

    function ValueField() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ValueField);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ValueField.__proto__ || Object.getPrototypeOf(ValueField)).call.apply(_ref, [this].concat(args))), _this), _this.shouldComponentUpdate = _reactAddonsShallowCompare2.default, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ValueField, [{
        key: 'curFieldOpts',
        value: function curFieldOpts() {
            return Object.assign({}, { label: this.props.value }, (0, _configUtils.getFieldConfig)(this.props.value, this.props.config) || {});
        }
    }, {
        key: 'handleFieldMenuSelect',
        value: function handleFieldMenuSelect(_ref2) {
            var key = _ref2.key,
                keyPath = _ref2.keyPath;

            this.props.setValue(key);
        }
    }, {
        key: 'handleFieldSelect',
        value: function handleFieldSelect(key) {
            this.props.setValue(key);
        }

        //tip: empty groups are ok for antd

    }, {
        key: 'filterFields',
        value: function filterFields(config, fields, leftFieldFullkey, operator) {
            fields = (0, _clone2.default)(fields);
            var fieldSeparator = config.settings.fieldSeparator;
            var leftFieldConfig = (0, _configUtils.getFieldConfig)(leftFieldFullkey, config);
            var expectedType = void 0;
            var widget = (0, _configUtils.getWidgetForFieldOp)(config, leftFieldFullkey, operator, 'value');
            if (widget) {
                var widgetConfig = config.widgets[widget];
                var widgetType = widgetConfig.type;
                //expectedType = leftFieldConfig.type;
                expectedType = widgetType;
            } else {
                expectedType = leftFieldConfig.type;
            }

            function _filter(list, path) {
                for (var rightFieldKey in list) {
                    var subfields = list[rightFieldKey].subfields;
                    var subpath = (path ? path : []).concat(rightFieldKey);
                    var rightFieldFullkey = subpath.join(fieldSeparator);
                    var rightFieldConfig = (0, _configUtils.getFieldConfig)(rightFieldFullkey, config);
                    if (rightFieldConfig.type == "!struct") {
                        _filter(subfields, subpath);
                    } else {
                        var canUse = rightFieldConfig.type == expectedType && rightFieldFullkey != leftFieldFullkey;
                        var fn = config.settings.canCompareFieldWithField;
                        if (fn) canUse = canUse && fn(leftFieldFullkey, leftFieldConfig, rightFieldFullkey, rightFieldConfig);
                        if (!canUse) delete list[rightFieldKey];
                    }
                }
            }

            _filter(fields, []);

            return fields;
        }
    }, {
        key: 'buildMenuItems',
        value: function buildMenuItems(fields) {
            var _this2 = this;

            var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var fieldSeparator = this.props.config.settings.fieldSeparator;
            var maxLabelsLength = this.props.config.settings.maxLabelsLength || 100;
            if (!fields) return null;
            var prefix = path ? path.join(fieldSeparator) + fieldSeparator : '';

            return (0, _keys2.default)(fields).map(function (fieldKey) {
                var field = fields[fieldKey];
                var label = field.label || (0, _last2.default)(fieldKey.split(fieldSeparator));
                label = (0, _stuff.truncateString)(label, maxLabelsLength);
                if (field.type == "!struct") {
                    var subpath = (path ? path : []).concat(fieldKey);
                    return _react2.default.createElement(
                        SubMenu,
                        {
                            key: prefix + fieldKey,
                            title: _react2.default.createElement(
                                'span',
                                null,
                                label,
                                ' \xA0\xA0\xA0\xA0'
                            )
                        },
                        _this2.buildMenuItems(field.subfields, subpath)
                    );
                } else {
                    return _react2.default.createElement(
                        MenuItem,
                        { key: prefix + fieldKey },
                        label
                    );
                }
            });
        }
    }, {
        key: 'buildSelectItems',
        value: function buildSelectItems(fields) {
            var _this3 = this;

            var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var fieldSeparator = this.props.config.settings.fieldSeparator;
            var maxLabelsLength = this.props.config.settings.maxLabelsLength || 100;
            if (!fields) return null;
            var prefix = path ? path.join(fieldSeparator) + fieldSeparator : '';

            return (0, _keys2.default)(fields).map(function (fieldKey) {
                var field = fields[fieldKey];
                var label = field.label || (0, _last2.default)(fieldKey.split(fieldSeparator));
                label = (0, _stuff.truncateString)(label, maxLabelsLength);
                if (field.type == "!struct") {
                    var subpath = (path ? path : []).concat(fieldKey);
                    return _react2.default.createElement(
                        OptGroup,
                        {
                            key: prefix + fieldKey,
                            label: label
                        },
                        _this3.buildSelectItems(field.subfields, subpath)
                    );
                } else {
                    return _react2.default.createElement(
                        Option,
                        {
                            key: prefix + fieldKey,
                            value: prefix + fieldKey
                        },
                        label
                    );
                }
            });
        }
    }, {
        key: 'buildMenuToggler',
        value: function buildMenuToggler(label, fullLabel, customLabel) {
            var toggler = _react2.default.createElement(
                _button2.default,
                {
                    size: this.props.config.settings.renderSize || "small"
                },
                customLabel ? customLabel : label,
                ' ',
                _react2.default.createElement(_icon2.default, { type: 'down' })
            );

            if (fullLabel && fullLabel != label) {
                toggler = _react2.default.createElement(
                    _tooltip2.default,
                    {
                        placement: 'top',
                        title: fullLabel
                    },
                    toggler
                );
            }

            return toggler;
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.props.renderAsDropdown) return this.renderAsDropdown();else return this.renderAsSelect();
        }
    }, {
        key: 'renderAsSelect',
        value: function renderAsSelect() {
            var dropdownPlacement = this.props.config.settings.dropdownPlacement;
            var fieldOptions = this.filterFields(this.props.config, this.props.config.fields, this.props.field, this.props.operator);
            var placeholder = this.curFieldOpts().label || this.props.config.settings.fieldPlaceholder;
            var placeholderWidth = (0, _stuff.calcTextWidth)(placeholder, '12px');
            var fieldSelectItems = this.buildSelectItems(fieldOptions);
            var customProps = this.props.customProps || {};

            var fieldSelect = _react2.default.createElement(
                _select2.default,
                _extends({
                    dropdownAlign: dropdownPlacement ? _stuff.BUILT_IN_PLACEMENTS[dropdownPlacement] : undefined,
                    dropdownMatchSelectWidth: false,
                    style: { width: this.props.value ? null : placeholderWidth + 36 },
                    ref: 'field',
                    placeholder: placeholder,
                    size: this.props.config.settings.renderSize || "small",
                    onChange: this.handleFieldSelect.bind(this),
                    value: this.props.value || undefined,
                    filterOption: function filterOption(input, option) {
                        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }
                }, customProps),
                fieldSelectItems
            );

            return fieldSelect;
        }
    }, {
        key: 'renderAsDropdown',
        value: function renderAsDropdown() {
            var fieldOptions = this.filterFields(this.props.config, this.props.config.fields, this.props.field, this.props.operator);
            var selectedFieldKeys = (0, _configUtils.getFieldPath)(this.props.value, this.props.config);
            var selectedFieldPartsLabels = (0, _configUtils.getFieldPathLabels)(this.props.value, this.props.config);
            var selectedFieldFullLabel = selectedFieldPartsLabels ? selectedFieldPartsLabels.join(this.props.config.settings.fieldSeparatorDisplay) : null;
            var placeholder = this.curFieldOpts().label || this.props.config.settings.fieldPlaceholder;
            var customProps = this.props.customProps || {};

            var fieldMenuItems = this.buildMenuItems(fieldOptions);
            var fieldMenu = _react2.default.createElement(
                _menu2.default,
                _extends({
                    //size={this.props.config.settings.renderSize || "small"}
                    selectedKeys: selectedFieldKeys,
                    onClick: this.handleFieldMenuSelect.bind(this)
                }, customProps),
                fieldMenuItems
            );
            var fieldToggler = this.buildMenuToggler(placeholder, selectedFieldFullLabel, this.curFieldOpts().label2);

            return _react2.default.createElement(
                _dropdown2.default,
                {
                    overlay: fieldMenu,
                    trigger: ['click'],
                    placement: this.props.config.settings.dropdownPlacement
                },
                fieldToggler
            );
        }
    }]);

    return ValueField;
}(_react.Component), _class.propTypes = {
    setValue: _propTypes2.default.func.isRequired,
    renderAsDropdown: _propTypes2.default.bool,
    config: _propTypes2.default.object.isRequired,
    field: _propTypes2.default.string.isRequired,
    value: _propTypes2.default.string,
    operator: _propTypes2.default.string,
    customProps: _propTypes2.default.object
}, _temp2);
exports.default = ValueField;