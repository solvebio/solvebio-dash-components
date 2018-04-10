'use strict';

exports.__esModule = true;
exports.default = undefined;

var _select = require('antd/lib/select');

var _select2 = _interopRequireDefault(_select);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

require('antd/lib/select/style/css');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactAddonsShallowCompare = require('react-addons-shallow-compare');

var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

var _range = require('lodash/range');

var _range2 = _interopRequireDefault(_range);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Option = _select2.default.Option;
var Proximity = (_temp2 = _class = function (_Component) {
  _inherits(Proximity, _Component);

  function Proximity() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Proximity);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Proximity.__proto__ || Object.getPrototypeOf(Proximity)).call.apply(_ref, [this].concat(args))), _this), _this.shouldComponentUpdate = _reactAddonsShallowCompare2.default, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Proximity, [{
    key: 'handleChange',
    value: function handleChange(value) {
      this.props.setOption('proximity', value);
    }
  }, {
    key: 'render',
    value: function render() {
      var selectedProximity = this.props.options.get('proximity', this.props.defaults.proximity);
      return _react2.default.createElement(
        'div',
        { className: 'operator--PROXIMITY' },
        _react2.default.createElement(
          'div',
          { className: 'operator--options' },
          this.props.config.settings.showLabels && _react2.default.createElement(
            'label',
            null,
            this.props.optionLabel || "Words between"
          ),
          !this.props.config.settings.showLabels && this.props.optionTextBefore && _react2.default.createElement(
            'div',
            { className: 'operator--options--sep' },
            _react2.default.createElement(
              'span',
              null,
              this.props.optionTextBefore
            )
          ),
          _react2.default.createElement(
            _select2.default,
            {
              dropdownMatchSelectWidth: false,
              size: this.props.config.settings.renderSize || "small",
              ref: 'proximity',
              placeholder: this.props.optionPlaceholder || "Select words between",
              value: selectedProximity != null ? "" + selectedProximity : "",
              onChange: this.handleChange.bind(this)
            },
            (0, _range2.default)(this.props.minProximity || 2, (this.props.maxProximity || 10) + 1).map(function (item) {
              return _react2.default.createElement(
                Option,
                { key: "" + item, value: "" + item },
                item
              );
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'operator--widgets' },
          this.props.children
        )
      );
    }
  }]);

  return Proximity;
}(_react.Component), _class.propTypes = {
  config: _propTypes2.default.object.isRequired,
  setOption: _propTypes2.default.func.isRequired,
  defaults: _propTypes2.default.object.isRequired,
  options: _propTypes2.default.instanceOf(_immutable2.default.Map).isRequired,
  minProximity: _propTypes2.default.number,
  maxProximity: _propTypes2.default.number,
  optionPlaceholder: _propTypes2.default.string,
  optionTextBefore: _propTypes2.default.string,
  optionLabel: _propTypes2.default.string
  //children
}, _temp2);
exports.default = Proximity;