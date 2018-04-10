'use strict';

exports.__esModule = true;
exports.default = undefined;

var _col = require('antd/lib/col');

var _col2 = _interopRequireDefault(_col);

var _inputNumber = require('antd/lib/input-number');

var _inputNumber2 = _interopRequireDefault(_inputNumber);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

require('antd/lib/col/style/css');

require('antd/lib/input-number/style/css');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

require('antd/lib/date-picker/style');

var _configUtils = require('../../utils/configUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NumberWidget = (_temp = _class = function (_Component) {
  _inherits(NumberWidget, _Component);

  function NumberWidget() {
    _classCallCheck(this, NumberWidget);

    return _possibleConstructorReturn(this, (NumberWidget.__proto__ || Object.getPrototypeOf(NumberWidget)).apply(this, arguments));
  }

  _createClass(NumberWidget, [{
    key: 'handleChange',
    value: function handleChange(val) {
      if (val === '') val = undefined;
      this.props.setValue(val);
    }
  }, {
    key: 'render',
    value: function render() {
      var fieldDefinition = (0, _configUtils.getFieldConfig)(this.props.field, this.props.config);
      var fieldSettings = fieldDefinition.fieldSettings || {};
      var min = this.props.min != null ? this.props.min : fieldSettings.min;
      var max = this.props.max != null ? this.props.max : fieldSettings.max;
      var step = this.props.step != null ? this.props.step : fieldSettings.step;
      var customProps = this.props.customProps || {};

      return _react2.default.createElement(
        _col2.default,
        null,
        _react2.default.createElement(_inputNumber2.default, _extends({
          key: 'widget-number',
          size: this.props.config.settings.renderSize || "small",
          ref: 'num',
          value: this.props.value != undefined ? this.props.value : null,
          min: min,
          max: max,
          step: step,
          placeholder: this.props.placeholder,
          onChange: this.handleChange.bind(this)
        }, customProps))
      );
    }
  }]);

  return NumberWidget;
}(_react.Component), _class.propTypes = {
  setValue: _propTypes2.default.func.isRequired,
  min: _propTypes2.default.number,
  max: _propTypes2.default.number,
  step: _propTypes2.default.number,
  placeholder: _propTypes2.default.string,
  config: _propTypes2.default.object.isRequired,
  field: _propTypes2.default.string.isRequired,
  value: _propTypes2.default.number,
  customProps: _propTypes2.default.object
}, _class.defaultProps = {
  min: undefined,
  max: undefined,
  step: undefined
}, _temp);
exports.default = NumberWidget;