'use strict';

exports.__esModule = true;
exports.getItemByPath = exports.expandTreeSubpath = exports.expandTreePath = exports.getTotalNodesCountInTree = exports.getFlatTree = undefined;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getFlatTree = exports.getFlatTree = function getFlatTree(tree) {

    var flat = [];
    var items = {};
    var realHeight = 0;

    function _flatizeTree(item, path, insideCollapsed, lev, info) {
        var type = item.get('type');
        var collapsed = item.get('collapsed');
        var id = item.get('id');
        var children = item.get('children1');
        var childrenIds = children ? children.map(function (child, childId) {
            return childId;
        }) : null;

        var itemsBefore = flat.length;
        var top = realHeight;
        flat.push(id);
        if (!insideCollapsed) realHeight += 1;
        info.height = (info.height || 0) + 1;
        if (children) {
            var subinfo = {};
            children.map(function (child, childId) {
                _flatizeTree(child, path.concat(id), insideCollapsed || collapsed, lev + 1, subinfo);
            });
            if (!collapsed) {
                info.height = (info.height || 0) + (subinfo.height || 0);
            }
        }
        var itemsAfter = flat.length;
        var bottom = realHeight;
        var height = info.height;

        items[id] = {
            type: type,
            parent: path.length ? path[path.length - 1] : null,
            path: path.concat(id),
            lev: lev,
            leaf: !children,
            index: itemsBefore,
            id: id,
            children: childrenIds,
            _top: itemsBefore,
            _height: itemsAfter - itemsBefore,
            top: insideCollapsed ? null : top,
            height: height,
            bottom: (insideCollapsed ? null : top) + height,
            collapsed: collapsed,
            node: item
        };
    }

    _flatizeTree(tree, [], false, 0, {});

    for (var i = 0; i < flat.length; i++) {
        var prevId = i > 0 ? flat[i - 1] : null;
        var nextId = i < flat.length - 1 ? flat[i + 1] : null;
        var item = items[flat[i]];
        item.prev = prevId;
        item.next = nextId;
    }

    return { flat: flat, items: items };
};

var getTotalNodesCountInTree = exports.getTotalNodesCountInTree = function getTotalNodesCountInTree(tree) {
    if (!tree) return -1;
    var cnt = 0;

    function _processNode(item, path, lev) {
        var id = item.get('id');
        var children = item.get('children1');
        cnt++;
        if (children) {
            children.map(function (child, childId) {
                _processNode(child, path.concat(id), lev + 1);
            });
        }
    };

    _processNode(tree, [], 0);

    return cnt;
};

/**
 * @param {Immutable.List} path
 * @param {...string} suffix
 */
var expandTreePath = exports.expandTreePath = function expandTreePath(path) {
    for (var _len = arguments.length, suffix = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        suffix[_key - 1] = arguments[_key];
    }

    return path.interpose('children1').withMutations(function (list) {
        list.skip(1);
        list.push.apply(list, suffix);
        return list;
    });
};

/**
 * @param {Immutable.List} path
 * @param {...string} suffix
 */
var expandTreeSubpath = exports.expandTreeSubpath = function expandTreeSubpath(path) {
    for (var _len2 = arguments.length, suffix = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        suffix[_key2 - 1] = arguments[_key2];
    }

    return path.interpose('children1').withMutations(function (list) {
        list.push.apply(list, suffix);
        return list;
    });
};

/**
 * @param {Immutable.Map} path
 * @param {Immutable.List} path
 */
var getItemByPath = exports.getItemByPath = function getItemByPath(tree, path) {
    var children = new _immutable2.default.OrderedMap(_defineProperty({}, tree.get('id'), tree));
    var res = tree;
    path.forEach(function (id) {
        res = children.get(id);
        children = res.get('children1');
    });
    return res;
};