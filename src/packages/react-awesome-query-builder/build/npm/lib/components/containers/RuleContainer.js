'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactAddonsShallowCompare = require('react-addons-shallow-compare');

var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

var _size = require('lodash/size');

var _size2 = _interopRequireDefault(_size);

var _configUtils = require('../../utils/configUtils');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (Rule) {
  var _class, _temp;

  return _temp = _class = function (_Component) {
    _inherits(RuleContainer, _Component);

    function RuleContainer(props) {
      _classCallCheck(this, RuleContainer);

      var _this = _possibleConstructorReturn(this, (RuleContainer.__proto__ || Object.getPrototypeOf(RuleContainer)).call(this, props));

      _this.shouldComponentUpdate = _reactAddonsShallowCompare2.default;


      _this.componentWillReceiveProps(props);
      return _this;
    }

    _createClass(RuleContainer, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {}
    }, {
      key: 'removeSelf',
      value: function removeSelf() {
        this.props.actions.removeRule(this.props.path);
      }
    }, {
      key: 'setField',
      value: function setField(field) {
        this.props.actions.setField(this.props.path, field);
      }
    }, {
      key: 'setOperator',
      value: function setOperator(operator) {
        this.props.actions.setOperator(this.props.path, operator);
      }
    }, {
      key: 'setOperatorOption',
      value: function setOperatorOption(name, value) {
        this.props.actions.setOperatorOption(this.props.path, name, value);
      }
    }, {
      key: 'setValue',
      value: function setValue(delta, value, type) {
        this.props.actions.setValue(this.props.path, delta, value, type);
      }
    }, {
      key: 'setValueSrc',
      value: function setValueSrc(delta, srcKey) {
        this.props.actions.setValueSrc(this.props.path, delta, srcKey);
      }
    }, {
      key: 'render',
      value: function render() {
        var _React$createElement;

        var fieldConfig = (0, _configUtils.getFieldConfig)(this.props.field, this.props.config);
        var isGroup = fieldConfig && fieldConfig.type == '!struct';

        return _react2.default.createElement(
          'div',
          {
            className: 'group-or-rule-container rule-container',
            'data-id': this.props.id
          },
          [this.props.dragging && this.props.dragging.id == this.props.id ? _react2.default.createElement(Rule, (_React$createElement = {
            key: "dragging",
            id: this.props.id,
            removeSelf: this.removeSelf.bind(this),
            setField: function setField() {},
            setOperator: function setOperator() {},
            setOperatorOption: function setOperatorOption() {}
          }, _defineProperty(_React$createElement, 'removeSelf', function removeSelf() {}), _defineProperty(_React$createElement, 'selectedField', this.props.field || null), _defineProperty(_React$createElement, 'selectedOperator', this.props.operator || null), _defineProperty(_React$createElement, 'value', this.props.value || null), _defineProperty(_React$createElement, 'valueSrc', this.props.valueSrc || null), _defineProperty(_React$createElement, 'operatorOptions', this.props.operatorOptions), _defineProperty(_React$createElement, 'config', this.props.config), _defineProperty(_React$createElement, 'tree', this.props.tree), _defineProperty(_React$createElement, 'treeNodesCnt', this.props.treeNodesCnt), _defineProperty(_React$createElement, 'dragging', this.props.dragging), _defineProperty(_React$createElement, 'renderType', 'dragging'), _React$createElement)) : null, _react2.default.createElement(Rule, {
            key: this.props.id,
            id: this.props.id,
            removeSelf: this.removeSelf.bind(this),
            setField: this.setField.bind(this),
            setOperator: this.setOperator.bind(this),
            setOperatorOption: this.setOperatorOption.bind(this),
            setValue: this.setValue.bind(this),
            setValueSrc: this.setValueSrc.bind(this),
            selectedField: this.props.field || null,
            selectedOperator: this.props.operator || null,
            value: this.props.value || null,
            valueSrc: this.props.valueSrc || null,
            operatorOptions: this.props.operatorOptions,
            config: this.props.config,
            tree: this.props.tree,
            treeNodesCnt: this.props.treeNodesCnt,
            onDragStart: this.props.onDragStart,
            dragging: this.props.dragging,
            renderType: this.props.dragging && this.props.dragging.id == this.props.id ? 'placeholder' : null
          })]
        );
      }
    }]);

    return RuleContainer;
  }(_react.Component), _class.propTypes = {
    id: _propTypes2.default.string.isRequired,
    config: _propTypes2.default.object.isRequired,
    path: _propTypes2.default.instanceOf(_immutable2.default.List).isRequired,
    operator: _propTypes2.default.string,
    field: _propTypes2.default.string,
    actions: _propTypes2.default.object.isRequired, //{removeRule: Funciton, setField, setOperator, setOperatorOption, setValue, setValueSrc, ...}
    dragging: _propTypes2.default.object, //{id, x, y, w, h}
    onDragStart: _propTypes2.default.func,
    value: _propTypes2.default.any, //depends on widget
    valueSrc: _propTypes2.default.any,
    operatorOptions: _propTypes2.default.object,
    treeNodesCnt: _propTypes2.default.number
  }, _temp;
};