'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactAddonsShallowCompare = require('react-addons-shallow-compare');

var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var stringify = require('json-stringify-safe');

exports.default = function (Group) {
  var _class, _temp2;

  return _temp2 = _class = function (_Component) {
    _inherits(GroupContainer, _Component);

    function GroupContainer() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, GroupContainer);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = GroupContainer.__proto__ || Object.getPrototypeOf(GroupContainer)).call.apply(_ref, [this].concat(args))), _this), _this.shouldComponentUpdate = _reactAddonsShallowCompare2.default, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(GroupContainer, [{
      key: 'setConjunction',
      value: function setConjunction() {
        var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var conj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (!conj && e) {
          //for RadioGroup
          conj = e.target.value;
        }

        this.props.actions.setConjunction(this.props.path, conj);
      }
    }, {
      key: 'setNot',
      value: function setNot() {
        var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var not = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        this.props.actions.setNot(this.props.path, not);
      }
    }, {
      key: 'removeSelf',
      value: function removeSelf(event) {
        this.props.actions.removeGroup(this.props.path);
        event.preventDefault();
        return false;
      }
    }, {
      key: 'addGroup',
      value: function addGroup(event) {
        this.props.actions.addGroup(this.props.path);
        event.preventDefault();
        return false;
      }
    }, {
      key: 'addRule',
      value: function addRule(event) {
        this.props.actions.addRule(this.props.path);
        event.preventDefault();
        return false;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var currentNesting = this.props.path.size;
        var maxNesting = this.props.config.settings.maxNesting;

        // Don't allow nesting further than the maximum configured depth and don't
        // allow removal of the root group.
        var allowFurtherNesting = typeof maxNesting === 'undefined' || currentNesting < maxNesting;
        var isRoot = currentNesting == 1;

        var conjunctionOptions = (0, _mapValues2.default)(this.props.config.conjunctions, function (item, index) {
          return {
            id: 'conjunction-' + _this2.props.id + '-' + index,
            name: 'conjunction[' + _this2.props.id + ']',
            key: index,
            label: item.label,
            checked: index === _this2.props.conjunction
          };
        });

        return _react2.default.createElement(
          'div',
          {
            className: 'group-or-rule-container group-container',
            'data-id': this.props.id
          },
          [this.props.dragging && this.props.dragging.id == this.props.id ? _react2.default.createElement(
            Group,
            {
              key: "dragging",
              id: this.props.id,
              isRoot: isRoot,
              allowFurtherNesting: allowFurtherNesting,
              conjunctionOptions: conjunctionOptions,
              not: this.props.not,
              selectedConjunction: this.props.conjunction,
              setConjunction: this.setConjunction.bind(this),
              setNot: this.setNot.bind(this),
              removeSelf: this.removeSelf.bind(this),
              addGroup: this.addGroup.bind(this),
              addRule: this.addRule.bind(this),
              config: this.props.config,
              tree: this.props.tree,
              treeNodesCnt: this.props.treeNodesCnt,
              dragging: this.props.dragging,
              renderType: 'dragging'
            },
            this.props.children
          ) : null, _react2.default.createElement(
            Group,
            {
              key: this.props.id,
              id: this.props.id,
              isRoot: isRoot,
              allowFurtherNesting: allowFurtherNesting,
              conjunctionOptions: conjunctionOptions,
              not: this.props.not,
              selectedConjunction: this.props.conjunction,
              setConjunction: this.setConjunction.bind(this),
              setNot: this.setNot.bind(this),
              removeSelf: this.removeSelf.bind(this),
              addGroup: this.addGroup.bind(this),
              addRule: this.addRule.bind(this),
              config: this.props.config,
              tree: this.props.tree,
              treeNodesCnt: this.props.treeNodesCnt,
              onDragStart: this.props.onDragStart,
              dragging: this.props.dragging,
              renderType: this.props.dragging && this.props.dragging.id == this.props.id ? 'placeholder' : null
            },
            this.props.children
          )]
        );
      }
    }]);

    return GroupContainer;
  }(_react.Component), _class.propTypes = {
    tree: _propTypes2.default.instanceOf(_immutable2.default.Map).isRequired,
    config: _propTypes2.default.object.isRequired,
    actions: _propTypes2.default.object.isRequired, //{setConjunction: Funciton, removeGroup, addGroup, addRule, ...}
    path: _propTypes2.default.instanceOf(_immutable2.default.List).isRequired,
    id: _propTypes2.default.string.isRequired,
    conjunction: _propTypes2.default.string,
    not: _propTypes2.default.bool,
    children: _propTypes2.default.instanceOf(_immutable2.default.List),
    dragging: _propTypes2.default.object, //{id, x, y, w, h}
    onDragStart: _propTypes2.default.func,
    treeNodesCnt: _propTypes2.default.number
  }, _temp2;
};