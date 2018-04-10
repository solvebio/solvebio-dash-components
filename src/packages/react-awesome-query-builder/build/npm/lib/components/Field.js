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

var _class, _temp;

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

var _configUtils = require('../utils/configUtils');

var _stuff = require('../utils/stuff');

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _last = require('lodash/last');

var _last2 = _interopRequireDefault(_last);

var _keys = require('lodash/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Option = _select2.default.Option,
    OptGroup = _select2.default.OptGroup;

var SubMenu = _menu2.default.SubMenu;
var MenuItem = _menu2.default.Item;
var DropdownButton = _dropdown2.default.Button;
var Field = (_temp = _class = function (_Component) {
    _inherits(Field, _Component);

    function Field(props) {
        _classCallCheck(this, Field);

        var _this = _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this, props));

        _this.shouldComponentUpdate = _reactAddonsShallowCompare2.default;
        return _this;
    }

    _createClass(Field, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            //let prevProps = this.props;
        }
    }, {
        key: 'curField',
        value: function curField() {
            return this.props.selectedField ? (0, _configUtils.getFieldConfig)(this.props.selectedField, this.props.config) : null;
        }
    }, {
        key: 'curFieldOpts',
        value: function curFieldOpts() {
            return Object.assign({}, {
                label: this.props.selectedField
            }, this.curField() || {});
        }
    }, {
        key: 'handleFieldMenuSelect',
        value: function handleFieldMenuSelect(_ref) {
            var key = _ref.key,
                keyPath = _ref.keyPath;

            this.props.setField(key);
        }
    }, {
        key: 'handleFieldSelect',
        value: function handleFieldSelect(key) {
            this.props.setField(key);
        }
    }, {
        key: 'filterOption',
        value: function filterOption(input, option) {
            var isInChildren = option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            var isInValue = option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            var isInGroupLabel = false;

            if (option.props.groupLabel) {
                isInGroupLabel = option.props.groupLabel.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }

            return isInChildren || isInValue || isInGroupLabel;
        }
    }, {
        key: 'getFieldDisplayLabel',
        value: function getFieldDisplayLabel(field, fieldKey) {
            var fieldSeparator = this.props.config.settings.fieldSeparator;
            var maxLabelsLength = this.props.config.settings.maxLabelsLength || 100;
            var label = field.label || (0, _last2.default)(fieldKey.split(fieldSeparator));
            label = (0, _stuff.truncateString)(label, maxLabelsLength);
            return label;
        }
    }, {
        key: 'buildMenuItems',
        value: function buildMenuItems(fields) {
            var _this2 = this;

            var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var fieldSeparator = this.props.config.settings.fieldSeparator;
            if (!fields) return null;
            var prefix = path ? path.join(fieldSeparator) + fieldSeparator : '';

            return (0, _keys2.default)(fields).map(function (fieldKey) {
                var field = fields[fieldKey];
                var label = _this2.getFieldDisplayLabel(field, fieldKey);
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
            var optGroupLabel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            var fieldSeparator = this.props.config.settings.fieldSeparator;
            if (!fields) return null;
            var prefix = path ? path.join(fieldSeparator) + fieldSeparator : '';

            return (0, _keys2.default)(fields).map(function (fieldKey) {
                var field = fields[fieldKey];
                var label = _this3.getFieldDisplayLabel(field, fieldKey);
                if (field.type == "!struct") {
                    var subpath = (path ? path : []).concat(fieldKey);
                    return _react2.default.createElement(
                        OptGroup,
                        {
                            key: prefix + fieldKey,
                            label: label
                        },
                        _this3.buildSelectItems(field.subfields, subpath, label)
                    );
                } else {
                    return _react2.default.createElement(
                        Option,
                        {
                            key: prefix + fieldKey,
                            value: prefix + fieldKey,
                            groupLabel: optGroupLabel
                        },
                        label
                    );
                }
            });
        }
    }, {
        key: 'buildMenuToggler',
        value: function buildMenuToggler(label, fullLabel, customLabel) {
            var btnLabel = customLabel ? customLabel : label;
            var maxLabelsLength = this.props.config.settings.maxLabelsLength || 100;
            btnLabel = (0, _stuff.truncateString)(btnLabel, maxLabelsLength);
            var toggler = _react2.default.createElement(
                _button2.default,
                {
                    size: this.props.config.settings.renderSize || "small"
                },
                btnLabel,
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
            var _this4 = this;

            var isFieldSelected = !!this.props.selectedField;
            var dropdownPlacement = this.props.config.settings.dropdownPlacement;
            var maxLabelsLength = this.props.config.settings.maxLabelsLength || 100;
            var fieldOptions = this.props.config.fields;
            var selectedFieldPartsLabels = (0, _configUtils.getFieldPathLabels)(this.props.selectedField, this.props.config);
            var selectedFieldFullLabel = selectedFieldPartsLabels ? selectedFieldPartsLabels.join(this.props.config.settings.fieldSeparatorDisplay) : null;
            var placeholder = !isFieldSelected ? this.props.config.settings.fieldPlaceholder : null;
            var fieldDisplayLabel = isFieldSelected ? this.getFieldDisplayLabel(this.curField(), this.props.selectedField) : null;
            var selectText = isFieldSelected ? fieldDisplayLabel : placeholder;
            selectText = (0, _stuff.truncateString)(selectText, maxLabelsLength);
            var selectWidth = (0, _stuff.calcTextWidth)(selectText, '12px');
            //let tooltip = this.curFieldOpts().label2 || selectedFieldFullLabel || this.curFieldOpts().label;
            var fieldSelectItems = this.buildSelectItems(fieldOptions);
            var customProps = this.props.customProps || {};

            var fieldSelect = _react2.default.createElement(
                _select2.default,
                _extends({
                    dropdownAlign: dropdownPlacement ? _stuff.BUILT_IN_PLACEMENTS[dropdownPlacement] : undefined,
                    dropdownMatchSelectWidth: false,
                    style: { width: isFieldSelected && !customProps.showSearch ? null : selectWidth + 36 },
                    ref: 'field',
                    placeholder: placeholder,
                    size: this.props.config.settings.renderSize || "small",
                    onChange: this.handleFieldSelect.bind(this),
                    value: this.props.selectedField || undefined,
                    filterOption: function filterOption(input, option) {
                        return _this4.filterOption(input, option);
                    }
                }, customProps),
                fieldSelectItems
            );

            return fieldSelect;
        }
    }, {
        key: 'renderAsDropdown',
        value: function renderAsDropdown() {
            var fieldOptions = this.props.config.fields;
            var selectedFieldKeys = (0, _configUtils.getFieldPath)(this.props.selectedField, this.props.config);
            var selectedFieldPartsLabels = (0, _configUtils.getFieldPathLabels)(this.props.selectedField, this.props.config);
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

    return Field;
}(_react.Component), _class.propTypes = {
    config: _propTypes2.default.object.isRequired,
    selectedField: _propTypes2.default.string,
    renderAsDropdown: _propTypes2.default.bool,
    customProps: _propTypes2.default.object,
    //actions
    setField: _propTypes2.default.func.isRequired
}, _temp);
exports.default = Field;