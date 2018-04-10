'use strict';

exports.__esModule = true;
exports.default = undefined;

var _localeProvider = require('antd/lib/locale-provider');

var _localeProvider2 = _interopRequireDefault(_localeProvider);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp, _class2, _temp2;

require('antd/lib/locale-provider/style/css');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _tree = require('../stores/tree');

var _tree2 = _interopRequireDefault(_tree);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _actions = require('../actions');

var actions = _interopRequireWildcard(_actions);

var _configUtils = require('../utils/configUtils');

var _stuff = require('../utils/stuff');

var _validation = require('../utils/validation');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConnectedQuery = (_temp = _class = function (_Component) {
    _inherits(ConnectedQuery, _Component);

    function ConnectedQuery(props) {
        _classCallCheck(this, ConnectedQuery);

        var _this = _possibleConstructorReturn(this, (ConnectedQuery.__proto__ || Object.getPrototypeOf(ConnectedQuery)).call(this, props));

        _this.validatedTree = _this.validateTree(props, props.config, props.tree);
        if (props.tree !== _this.validatedTree) {
            props.onChange && props.onChange(_this.validatedTree);
        }
        return _this;
    }

    _createClass(ConnectedQuery, [{
        key: 'validateTree',
        value: function validateTree(props, oldConfig, oldTree) {
            return (0, _validation.validateTree)(props.tree, oldTree, props.config, oldConfig, true, true);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var tree = nextProps.tree,
                onChange = nextProps.onChange;

            var oldTree = this.props.tree;
            var oldConfig = this.props.config;
            var newTree = nextProps.tree;
            var oldValidatedTree = this.validatedTree;
            this.validatedTree = this.validateTree(nextProps, oldConfig, oldTree);
            var validatedTreeChanged = oldValidatedTree !== this.validatedTree && JSON.stringify(oldValidatedTree) != JSON.stringify(this.validatedTree);
            if (validatedTreeChanged) {
                onChange && onChange(this.validatedTree);
                this.setState({ treeChanged: true });
            } else {
                this.setState({ treeChanged: false });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                config = _props.config,
                tree = _props.tree,
                get_children = _props.get_children,
                dispatch = _props.dispatch,
                props = _objectWithoutProperties(_props, ['config', 'tree', 'get_children', 'dispatch']);

            var validatedTree = this.validatedTree;
            return _react2.default.createElement(
                'div',
                null,
                get_children({
                    tree: this.validatedTree,
                    actions: (0, _stuff.bindActionCreators)(_extends({}, actions.tree, actions.group, actions.rule), config, dispatch),
                    config: config,
                    dispatch: dispatch
                })
            );
        }
    }]);

    return ConnectedQuery;
}(_react.Component), _class.propTypes = {
    config: _propTypes2.default.object.isRequired,
    onChange: _propTypes2.default.func,
    get_children: _propTypes2.default.func,
    tree: _propTypes2.default.instanceOf(_immutable2.default.Map)
    //dispatch: PropTypes.func.isRequired,
}, _temp);


var QueryContainer = (0, _reactRedux.connect)(function (tree) {
    return { tree: tree };
})(ConnectedQuery);

var Query = (_temp2 = _class2 = function (_Component2) {
    _inherits(Query, _Component2);

    function Query(props, context) {
        _classCallCheck(this, Query);

        var _this2 = _possibleConstructorReturn(this, (Query.__proto__ || Object.getPrototypeOf(Query)).call(this, props, context));

        var config = {
            conjunctions: props.conjunctions,
            fields: props.fields,
            types: props.types,
            operators: props.operators,
            widgets: props.widgets,
            settings: props.settings,
            tree: props.value
        };

        var tree = (0, _tree2.default)(config);

        _this2.state = {
            store: (0, _redux.createStore)(tree)
        };
        return _this2;
    }

    // handle case when value property changes


    _createClass(Query, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var tree = nextProps.value;
            var oldTree = this.props.tree;
            if (tree !== oldTree) {
                //TODO: This causes infinite loop! Dispatch in updating lifecycle methods is evil!
                this.state.store.dispatch(
                 actions.tree.setTree(this.props.config, tree)
                )
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                conjunctions = _props2.conjunctions,
                fields = _props2.fields,
                types = _props2.types,
                operators = _props2.operators,
                widgets = _props2.widgets,
                settings = _props2.settings,
                get_children = _props2.get_children,
                onChange = _props2.onChange,
                value = _props2.value,
                tree = _props2.tree,
                children = _props2.children,
                props = _objectWithoutProperties(_props2, ['conjunctions', 'fields', 'types', 'operators', 'widgets', 'settings', 'get_children', 'onChange', 'value', 'tree', 'children']);

            var config = { conjunctions: conjunctions, fields: fields, types: types, operators: operators, widgets: widgets, settings: settings };
            config = (0, _configUtils.extendConfig)(config);

            return _react2.default.createElement(
                _localeProvider2.default,
                { locale: config.settings.locale.antd },
                _react2.default.createElement(
                    _reactRedux.Provider,
                    { store: this.state.store },
                    _react2.default.createElement(QueryContainer, {
                        store: this.state.store,
                        get_children: get_children,
                        config: config,
                        onChange: onChange
                    })
                )
            );
        }
    }]);

    return Query;
}(_react.Component), _class2.propTypes = {
    //config
    conjunctions: _propTypes2.default.object.isRequired,
    fields: _propTypes2.default.object.isRequired,
    types: _propTypes2.default.object.isRequired,
    operators: _propTypes2.default.object.isRequired,
    widgets: _propTypes2.default.object.isRequired,
    settings: _propTypes2.default.object.isRequired,

    onChange: _propTypes2.default.func,
    get_children: _propTypes2.default.func,
    value: _propTypes2.default.instanceOf(_immutable2.default.Map)
}, _temp2);
exports.default = Query;