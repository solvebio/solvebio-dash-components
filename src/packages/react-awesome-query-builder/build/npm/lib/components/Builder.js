'use strict';

exports.__esModule = true;
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _Item = require('../components/Item');

var _Item2 = _interopRequireDefault(_Item);

var _SortableContainer = require('./containers/SortableContainer');

var _SortableContainer2 = _interopRequireDefault(_SortableContainer);

var _treeUtils = require('../utils/treeUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Builder = (0, _SortableContainer2.default)(_class = (_temp = _class2 = function (_Component) {
  _inherits(Builder, _Component);

  function Builder() {
    _classCallCheck(this, Builder);

    return _possibleConstructorReturn(this, (Builder.__proto__ || Object.getPrototypeOf(Builder)).apply(this, arguments));
  }

  _createClass(Builder, [{
    key: 'render',
    value: function render() {
      var treeNodesCnt = (0, _treeUtils.getTotalNodesCountInTree)(this.props.tree);
      var id = this.props.tree.get('id');
      return _react2.default.createElement(_Item2.default, { key: id,
        id: id,
        path: _immutable2.default.List.of(id),
        type: this.props.tree.get('type'),
        properties: this.props.tree.get('properties'),
        config: this.props.config,
        actions: this.props.actions,
        dispatch: this.props.dispatch,
        children1: this.props.tree.get('children1'),
        tree: this.props.tree,
        treeNodesCnt: treeNodesCnt,
        onDragStart: this.props.onDragStart,
        dragging: this.props.dragging
      });
    }
  }]);

  return Builder;
}(_react.Component), _class2.propTypes = {
  tree: _propTypes2.default.instanceOf(_immutable2.default.Map).isRequired,
  config: _propTypes2.default.object.isRequired,
  actions: _propTypes2.default.object.isRequired,
  //dispatch: PropTypes.func.isRequired,
  onDragStart: _propTypes2.default.func,
  dragging: _propTypes2.default.object //{id, x, y, w, h}
}, _temp)) || _class;

exports.default = Builder;