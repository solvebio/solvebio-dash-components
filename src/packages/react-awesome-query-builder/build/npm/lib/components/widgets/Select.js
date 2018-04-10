'use strict';

exports.__esModule = true;
exports.default = undefined;

var _select = require('antd/lib/select');

var _select2 = _interopRequireDefault(_select);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

require('antd/lib/select/style/css');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _configUtils = require('../../utils/configUtils');

var _stuff = require('../../utils/stuff');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Option = _select2.default.Option;

var SelectWidget = (_temp = _class = function (_Component) {
  _inherits(SelectWidget, _Component);

  function SelectWidget() {
    _classCallCheck(this, SelectWidget);

    return _possibleConstructorReturn(this, (SelectWidget.__proto__ || Object.getPrototypeOf(SelectWidget)).apply(this, arguments));
  }

  _createClass(SelectWidget, [{
    key: 'handleChange',
    value: function handleChange(val) {
      this.props.setValue(val);
    }
  }, {
    key: 'render',
    value: function render() {
      var size = this.props.config.settings.renderSize || "small";
      var placeholder = this.props.placeholder || "Select option";
      var fieldDefinition = (0, _configUtils.getFieldConfig)(this.props.field, this.props.config);
      var options = (0, _map2.default)(fieldDefinition.listValues, function (label, value) {
        return _react2.default.createElement(
          Option,
          { key: value, value: value },
          label
        );
      });
      var placeholderWidth = (0, _stuff.calcTextWidth)(placeholder, '12px');
      var customProps = this.props.customProps || {};

      return _react2.default.createElement(
        _select2.default,
        _extends({
          style: { width: this.props.value ? null : placeholderWidth + 36 },
          key: "widget-select",
          dropdownMatchSelectWidth: false,
          ref: 'val',
          placeholder: placeholder,
          size: size,
          value: this.props.value || undefined //note: (bug?) null forces placeholder to hide
          , onChange: this.handleChange.bind(this),
          filterOption: function filterOption(input, option) {
            return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          }
        }, customProps),
        options
      );
    }
  }]);

  return SelectWidget;
}(_react.Component), _class.propTypes = {
  setValue: _propTypes2.default.func.isRequired,
  config: _propTypes2.default.object.isRequired,
  field: _propTypes2.default.string.isRequired,
  value: _propTypes2.default.string, //key in listValues
  customProps: _propTypes2.default.object
}, _temp);
exports.default = SelectWidget;