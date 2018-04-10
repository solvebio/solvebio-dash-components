'use strict';

exports.__esModule = true;
exports.default = exports.groupActionsPositionList = undefined;

var _icon = require('antd/lib/icon');

var _icon2 = _interopRequireDefault(_icon);

var _radio = require('antd/lib/radio');

var _radio2 = _interopRequireDefault(_radio);

var _button = require('antd/lib/button');

var _button2 = _interopRequireDefault(_button);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp2;

require('antd/lib/icon/style/css');

require('antd/lib/radio/style/css');

require('antd/lib/button/style/css');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactAddonsShallowCompare = require('react-addons-shallow-compare');

var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

var _map = require('lodash/map');

var _map2 = _interopRequireDefault(_map);

var _startsWith = require('lodash/startsWith');

var _startsWith2 = _interopRequireDefault(_startsWith);

var _GroupContainer = require('./containers/GroupContainer');

var _GroupContainer2 = _interopRequireDefault(_GroupContainer);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ButtonGroup = _button2.default.Group;
var RadioButton = _radio2.default.Button;
var RadioGroup = _radio2.default.Group;
var classNames = require('classnames');
var groupActionsPositionList = exports.groupActionsPositionList = {
  topLeft: 'group--actions--tl',
  topCenter: 'group--actions--tc',
  topRight: 'group--actions--tr',
  bottomLeft: 'group--actions--bl',
  bottomCenter: 'group--actions--bc',
  bottomRight: 'group--actions--br'
};

var defaultPosition = 'topRight';

var Group = (0, _GroupContainer2.default)(_class = (_temp2 = _class2 = function (_Component) {
  _inherits(Group, _Component);

  function Group() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Group);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Group.__proto__ || Object.getPrototypeOf(Group)).call.apply(_ref, [this].concat(args))), _this), _this.shouldComponentUpdate = _reactAddonsShallowCompare2.default, _this.getGroupPositionClass = function () {
      var groupActionsPosition = _this.props.config.settings.groupActionsPosition;

      return groupActionsPositionList[groupActionsPosition] || groupActionsPositionList[defaultPosition];
    }, _this.isGroupTopPosition = function () {
      return (0, _startsWith2.default)(_this.props.config.settings.groupActionsPosition || defaultPosition, 'top');
    }, _this.renderGroup = function (position) {
      return _react2.default.createElement(
        'div',
        { className: 'group--actions ' + position },
        _react2.default.createElement(
          ButtonGroup,
          {
            size: _this.props.config.settings.renderSize || "small"
          },
          _react2.default.createElement(
            _button2.default,
            {
              icon: 'plus',
              className: 'action action--ADD-RULE',
              onClick: _this.props.addRule
            },
            _this.props.config.settings.addRuleLabel || "Add rule"
          ),
          _this.props.allowFurtherNesting ? _react2.default.createElement(
            _button2.default,
            {
              className: 'action action--ADD-GROUP',
              icon: 'plus-circle-o',
              onClick: _this.props.addGroup
            },
            _this.props.config.settings.addGroupLabel || "Add group"
          ) : null,
          !_this.props.isRoot ? _react2.default.createElement(
            _button2.default,
            {
              type: 'danger',
              icon: 'delete',
              className: 'action action--ADD-DELETE',
              onClick: _this.props.removeSelf
            },
            _this.props.config.settings.delGroupLabel !== undefined ? _this.props.config.settings.delGroupLabel : "Delete"
          ) : null
        )
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Group, [{
    key: 'handleDraggerMouseDown',
    value: function handleDraggerMouseDown(e) {
      var nodeId = this.props.id;
      var dom = this.refs.group;
      if (this.props.onDragStart) {
        this.props.onDragStart(nodeId, dom, e);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var renderConjsAsRadios = false;

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
          className: classNames("group", "group-or-rule", this.props.renderType == 'placeholder' ? 'qb-placeholder' : null, this.props.renderType == 'dragging' ? 'qb-draggable' : null),
          style: styles,
          ref: 'group',
          'data-id': this.props.id
        },
        _react2.default.createElement(
          'div',
          { className: 'group--header' },
          _react2.default.createElement(
            'div',
            { className: classNames("group--conjunctions"
              // this.props.children.size < 2 && this.props.config.settings.hideConjForOne ? 'hide--conj' : ''
              ) },
            this.props.config.settings.renderConjsAsRadios ? _react2.default.createElement(
              RadioGroup,
              {
                disabled: this.props.children.size < 2,
                value: this.props.selectedConjunction,
                size: this.props.config.settings.renderSize || "small",
                onChange: this.props.setConjunction
              },
              (0, _map2.default)(this.props.conjunctionOptions, function (item, index) {
                return _react2.default.createElement(
                  RadioButton,
                  {
                    value: item.key
                    //checked={item.checked}
                  },
                  item.label
                );
              })
            ) : _react2.default.createElement(
              ButtonGroup,
              {
                size: this.props.config.settings.renderSize || "small",
                disabled: this.props.children.size < 2
              },
              _react2.default.createElement(
                _button2.default,
                {
                  type: this.props.not ? "primary" : null,
                  onClick: function onClick(ev) {
                    return _this2.props.setNot(ev, !_this2.props.not);
                  }
                },
                'Not'
              ),
              (0, _map2.default)(this.props.conjunctionOptions, function (item, index) {
                return _react2.default.createElement(
                  _button2.default,
                  {
                    disabled: _this2.props.children.size < 2,
                    key: item.id,
                    type: item.checked ? "primary" : null,
                    onClick: function onClick(ev) {
                      return _this2.props.setConjunction(ev, item.key);
                    }
                  },
                  item.label
                );
              })
            ),
            this.props.config.settings.canReorder && this.props.treeNodesCnt > 2 && !this.props.isRoot && _react2.default.createElement(
              'span',
              { className: "qb-drag-handler", onMouseDown: this.handleDraggerMouseDown.bind(this) },
              ' ',
              _react2.default.createElement(_icon2.default, { type: 'bars' }),
              ' '
            )
          ),
          this.isGroupTopPosition() && this.renderGroup(this.getGroupPositionClass())
        ),
        this.props.children ? _react2.default.createElement(
          'div',
          { className: classNames("group--children", this.props.children.size < 2 && this.props.config.settings.hideConjForOne ? 'hide--line' : '') },
          this.props.children
        ) : null,
        !this.isGroupTopPosition() && _react2.default.createElement(
          'div',
          { className: 'group--footer' },
          this.renderGroup(this.getGroupPositionClass())
        )
      );
    }
  }]);

  return Group;
}(_react.Component), _class2.propTypes = {
  tree: _propTypes2.default.instanceOf(_immutable2.default.Map).isRequired,
  treeNodesCnt: _propTypes2.default.number,
  conjunctionOptions: _propTypes2.default.object.isRequired,
  not: _propTypes2.default.bool,
  allowFurtherNesting: _propTypes2.default.bool.isRequired,
  isRoot: _propTypes2.default.bool.isRequired,
  selectedConjunction: _propTypes2.default.string,
  config: _propTypes2.default.object.isRequired,
  renderType: _propTypes2.default.string, //'dragging', 'placeholder', null
  id: _propTypes2.default.string.isRequired,
  //path: PropTypes.instanceOf(Immutable.List),
  dragging: _propTypes2.default.object, //{id, x, y, w, h}
  onDragStart: _propTypes2.default.func,
  children: _propTypes2.default.instanceOf(_immutable2.default.List),
  //actions
  addRule: _propTypes2.default.func.isRequired,
  addGroup: _propTypes2.default.func.isRequired,
  removeSelf: _propTypes2.default.func.isRequired,
  setConjunction: _propTypes2.default.func.isRequired,
  setNot: _propTypes2.default.func.isRequired
}, _temp2)) || _class;

exports.default = Group;