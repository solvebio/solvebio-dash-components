'use strict';

exports.__esModule = true;
exports.default = undefined;

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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

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

var _pickBy = require('lodash/pickBy');

var _pickBy2 = _interopRequireDefault(_pickBy);

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Option = _select2.default.Option,
    OptGroup = _select2.default.OptGroup;

var SubMenu = _menu2.default.SubMenu;
var MenuItem = _menu2.default.Item;
var DropdownButton = _dropdown2.default.Button;
var Operator = (_temp = _class = function (_Component) {
    _inherits(Operator, _Component);

    function Operator(props) {
        _classCallCheck(this, Operator);

        var _this = _possibleConstructorReturn(this, (Operator.__proto__ || Object.getPrototypeOf(Operator)).call(this, props));

        _this.shouldComponentUpdate = _reactAddonsShallowCompare2.default;

        _this.onPropsChanged(props);
        return _this;
    }

    _createClass(Operator, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props) {
            this.onPropsChanged(props);
        }
    }, {
        key: 'onPropsChanged',
        value: function onPropsChanged(props) {
            var fieldConfig = (0, _configUtils.getFieldConfig)(props.selectedField, props.config);
            this.operatorOptions = (0, _mapValues2.default)((0, _pickBy2.default)(props.config.operators, function (item, key) {
                return fieldConfig && fieldConfig.operators && fieldConfig.operators.indexOf(key) !== -1;
            }));
        }
    }, {
        key: 'curOpOpts',
        value: function curOpOpts() {
            return Object.assign({}, { label: this.props.selectedOperator }, this.operatorOptions[this.props.selectedOperator] || {});
        }
    }, {
        key: 'handleOperatorMenuSelect',
        value: function handleOperatorMenuSelect(_ref) {
            var key = _ref.key,
                keyPath = _ref.keyPath;

            this.props.setOperator(key);
        }
    }, {
        key: 'handleOperatorSelect',
        value: function handleOperatorSelect(key) {
            this.props.setOperator(key);
        }
    }, {
        key: 'buildMenuItems',
        value: function buildMenuItems(fields) {
            if (!fields) return null;
            return (0, _keys2.default)(fields).map(function (fieldKey) {
                var field = fields[fieldKey];
                return _react2.default.createElement(
                    MenuItem,
                    { key: fieldKey },
                    field.label
                );
            });
        }
    }, {
        key: 'buildMenuToggler',
        value: function buildMenuToggler(label) {
            var toggler = _react2.default.createElement(
                _button2.default,
                {
                    size: this.props.config.settings.renderSize || "small"
                },
                label,
                ' ',
                _react2.default.createElement(_icon2.default, { type: 'down' })
            );

            return toggler;
        }
    }, {
        key: 'buildSelectItems',
        value: function buildSelectItems(fields) {
            if (!fields) return null;
            return (0, _keys2.default)(fields).map(function (fieldKey) {
                var field = fields[fieldKey];
                return _react2.default.createElement(
                    Option,
                    {
                        key: fieldKey,
                        value: fieldKey
                    },
                    field.label
                );
            });
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
            var selectedOpKey = this.props.selectedOperator;
            var opMenuItems = this.buildMenuItems(this.operatorOptions);
            var placeholder = this.curOpOpts().label || this.props.config.settings.operatorPlaceholder;
            var placeholderWidth = (0, _stuff.calcTextWidth)(placeholder, '12px');
            var fieldSelectItems = this.buildSelectItems(this.operatorOptions);
            var opSelect = _react2.default.createElement(
                _select2.default,
                {
                    dropdownAlign: dropdownPlacement ? _stuff.BUILT_IN_PLACEMENTS[dropdownPlacement] : undefined,
                    dropdownMatchSelectWidth: false,
                    style: { width: this.props.selectedOperator ? null : placeholderWidth + 36 },
                    ref: 'field',
                    placeholder: placeholder,
                    size: this.props.config.settings.renderSize || "small",
                    onChange: this.handleOperatorSelect.bind(this),
                    value: this.props.selectedOperator || undefined
                },
                fieldSelectItems
            );

            return opSelect;
        }
    }, {
        key: 'renderAsDropdown',
        value: function renderAsDropdown() {
            var selectedOpKey = this.props.selectedOperator;
            var placeholder = this.curOpOpts().label || this.props.config.settings.operatorPlaceholder;
            var opMenuItems = this.buildMenuItems(this.operatorOptions);
            var opMenu = _react2.default.createElement(
                _menu2.default,
                {
                    //size={this.props.config.settings.renderSize || "small"}
                    selectedKeys: [selectedOpKey],
                    onClick: this.handleOperatorMenuSelect.bind(this)
                },
                opMenuItems
            );
            var opToggler = this.buildMenuToggler(placeholder);

            return _react2.default.createElement(
                _dropdown2.default,
                {
                    overlay: opMenu,
                    trigger: ['click'],
                    placement: this.props.config.settings.dropdownPlacement
                },
                opToggler
            );
        }
    }]);

    return Operator;
}(_react.Component), _class.propTypes = {
    config: _propTypes2.default.object.isRequired,
    selectedField: _propTypes2.default.string,
    selectedOperator: _propTypes2.default.string,
    renderAsDropdown: _propTypes2.default.bool,
    //actions
    setOperator: _propTypes2.default.func.isRequired
}, _temp);
exports.default = Operator;