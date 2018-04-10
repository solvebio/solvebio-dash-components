'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsShallowCompare = require('react-addons-shallow-compare');

var _reactAddonsShallowCompare2 = _interopRequireDefault(_reactAddonsShallowCompare);

var _size = require('lodash/size');

var _size2 = _interopRequireDefault(_size);

var _configUtils = require('../../utils/configUtils');

var _treeUtils = require('../../utils/treeUtils');

var _constants = require('../../constants');

var constants = _interopRequireWildcard(_constants);

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (Builder) {
  var _class, _temp;

  var CanMoveFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  return _temp = _class = function (_Component) {
    _inherits(SortableContainer, _Component);

    function SortableContainer(props) {
      _classCallCheck(this, SortableContainer);

      var _this = _possibleConstructorReturn(this, (SortableContainer.__proto__ || Object.getPrototypeOf(SortableContainer)).call(this, props));

      _this.shouldComponentUpdate = _reactAddonsShallowCompare2.default;

      _this.state = {
        dragging: {
          id: null,
          x: null,
          y: null,
          w: null,
          h: null
        }
      };

      _this.onDrag = _this._onDrag.bind(_this);
      _this.onDragEnd = _this._onDragEnd.bind(_this);

      _this.componentWillReceiveProps(props);
      return _this;
    }

    _createClass(SortableContainer, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        this.tree = (0, _treeUtils.getFlatTree)(nextProps.tree);
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps, prevState) {
        var dragging = this.draggingInfo;
        var startDragging = this.dragStartInfo;
        if (startDragging && startDragging.id) {
          dragging.itemInfo = this.tree.items[dragging.id];
          if (dragging.itemInfo.index != startDragging.itemInfo.index || dragging.itemInfo.parent != startDragging.itemInfo.parent) {
            var treeEl = startDragging.treeEl;
            var plhEl = this._getPlaceholderNodeEl(treeEl, true);
            if (plhEl) {
              var plX = plhEl.getBoundingClientRect().left + window.scrollX;
              var plY = plhEl.getBoundingClientRect().top + window.scrollY;
              var oldPlX = startDragging.plX;
              var oldPlY = startDragging.plY;
              startDragging.plX = plX;
              startDragging.plY = plY;
              startDragging.itemInfo = (0, _clone2.default)(dragging.itemInfo);
              startDragging.y = plhEl.offsetTop;
              startDragging.x = plhEl.offsetLeft;
              startDragging.clientY += plY - oldPlY;
              startDragging.clientX += plX - oldPlX;

              this._onDrag(this.mousePos, false);
            }
          }
        }
      }
    }, {
      key: '_getNodeElById',
      value: function _getNodeElById(treeEl, indexId) {
        var ignoreCache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (indexId == null) return null;
        if (!this._cacheEls) this._cacheEls = {};
        var el = this._cacheEls[indexId];
        if (el && document.contains(el) && !ignoreCache) return el;
        el = treeEl.querySelector('.group-or-rule-container[data-id="' + indexId + '"]');
        this._cacheEls[indexId] = el;
        return el;
      }
    }, {
      key: '_getDraggableNodeEl',
      value: function _getDraggableNodeEl(treeEl) {
        var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (!this._cacheEls) this._cacheEls = {};
        var el = this._cacheEls['draggable'];
        if (el && document.contains(el) && !ignoreCache) return el;
        var els = treeEl.getElementsByClassName('qb-draggable');
        el = els.length ? els[0] : null;
        this._cacheEls['draggable'] = el;
        return el;
      }
    }, {
      key: '_getPlaceholderNodeEl',
      value: function _getPlaceholderNodeEl(treeEl) {
        var ignoreCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (!this._cacheEls) this._cacheEls = {};
        var el = this._cacheEls['placeholder'];
        if (el && document.contains(el) && !ignoreCache) return el;
        var els = treeEl.getElementsByClassName('qb-placeholder');
        el = els.length ? els[0] : null;
        this._cacheEls['placeholder'] = el;
        return el;
      }
    }, {
      key: 'onDragStart',
      value: function onDragStart(id, dom, e) {
        var treeEl = dom.closest('.query-builder');
        treeEl.classList.add("qb-dragging");
        var treeElContainer = treeEl.closest('.query-builder-container');
        if (!treeElContainer) treeElContainer = dom.closest('body');
        var scrollTop = treeElContainer.scrollTop;

        var dragEl = this._getDraggableNodeEl(treeEl);
        var plhEl = this._getPlaceholderNodeEl(treeEl);

        var tmpAllGroups = treeEl.querySelectorAll('.group--children');
        var anyGroup = tmpAllGroups.length ? tmpAllGroups[0] : null;
        var groupPadding;
        if (anyGroup) {
          groupPadding = window.getComputedStyle(anyGroup, null).getPropertyValue('padding-left');
          groupPadding = parseInt(groupPadding);
        }

        this.draggingInfo = {
          id: id,
          x: dom.offsetLeft,
          y: dom.offsetTop,
          w: dom.offsetWidth,
          h: dom.offsetHeight,
          itemInfo: this.tree.items[id],
          paddingLeft: groupPadding
        };
        this.dragStartInfo = {
          id: id,
          x: dom.offsetLeft,
          y: dom.offsetTop,
          scrollTop: scrollTop,
          clientX: e.clientX,
          clientY: e.clientY,
          itemInfo: (0, _clone2.default)(this.tree.items[id]),
          treeEl: treeEl,
          treeElContainer: treeElContainer
        };
        this.didAnySortOnDrag = false;
        this.mousePos = {
          clientX: e.clientX,
          clientY: e.clientY
        };

        window.addEventListener('mousemove', this.onDrag);
        window.addEventListener('mouseup', this.onDragEnd);

        this.setState({
          dragging: this.draggingInfo
        });
      }
    }, {
      key: '_onDrag',
      value: function _onDrag(e) {
        var doHandleDrag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var dragging = this.draggingInfo;
        var startDragging = this.dragStartInfo;
        var paddingLeft = dragging.paddingLeft; //this.props.paddingLeft;
        var treeElContainer = startDragging.treeElContainer;
        var scrollTop = treeElContainer.scrollTop;
        dragging.itemInfo = this.tree.items[dragging.id];
        if (!dragging.itemInfo) {
          return;
        }

        this.mousePos = {
          clientX: e.clientX,
          clientY: e.clientY
        };

        //first init plX/plY
        if (!startDragging.plX) {
          var treeEl = startDragging.treeEl;
          var plhEl = this._getPlaceholderNodeEl(treeEl);
          if (plhEl) {
            startDragging.plX = plhEl.getBoundingClientRect().left + window.scrollX;
            startDragging.plY = plhEl.getBoundingClientRect().top + window.scrollY;
          }
        }

        var startX = startDragging.x;
        var startY = startDragging.y;
        var startClientX = startDragging.clientX;
        var startClientY = startDragging.clientY;
        var startScrollTop = startDragging.scrollTop;
        var pos = {
          x: startX + (e.clientX - startClientX),
          y: startY + (e.clientY - startClientY) + (scrollTop - startScrollTop)
        };
        dragging.x = pos.x;
        dragging.y = pos.y;
        dragging.paddingLeft = paddingLeft;

        var moved = doHandleDrag ? this.handleDrag(dragging, e, CanMoveFn) : false;

        if (moved) {
          this.didAnySortOnDrag = true;
        } else {
          if (e.preventDefault) e.preventDefault();
        }

        this.setState({
          dragging: dragging
        });
      }
    }, {
      key: '_onDragEnd',
      value: function _onDragEnd() {
        var treeEl = this.dragStartInfo.treeEl;
        this.draggingInfo = {
          id: null,
          x: null,
          y: null,
          w: null,
          h: null
        };
        this.dragStartInfo = {
          id: null
        };
        this.setState({
          dragging: this.draggingInfo
        });
        this.mousePos = {};

        treeEl.classList.remove("qb-dragging");
        this._cacheEls = {};

        if (this.didAnySortOnDrag) {
          //todo ?
        }

        window.removeEventListener('mousemove', this.onDrag);
        window.removeEventListener('mouseup', this.onDragEnd);
      }
    }, {
      key: 'handleDrag',
      value: function handleDrag(dragInfo, e, canMoveFn) {
        var _this2 = this;

        var itemInfo = dragInfo.itemInfo;
        var newItemInfo = null;
        var paddingLeft = dragInfo.paddingLeft;

        var moveInfo = null;
        var treeEl = this.dragStartInfo.treeEl;
        //var treeElContainer = this.dragStartInfo.treeElContainer;
        //var scrollTop = treeElContainer.scrollTop;
        var dragId = dragInfo.id;
        var dragEl = this._getDraggableNodeEl(treeEl);
        var plhEl = this._getPlaceholderNodeEl(treeEl);
        if (dragEl && plhEl) {
          var dragRect = dragEl.getBoundingClientRect();
          var plhRect = plhEl.getBoundingClientRect();
          if (!plhRect.width) {
            return;
          }
          var dragDirs = { hrz: 0, vrt: 0 };
          if (dragRect.top < plhRect.top) dragDirs.vrt = -1; //up
          else if (dragRect.bottom > plhRect.bottom) dragDirs.vrt = +1; //down
          if (dragRect.left > plhRect.left) dragDirs.hrz = +1; //right
          else if (dragRect.left < plhRect.left) dragDirs.hrz = -1; //left

          var treeRect = treeEl.getBoundingClientRect();
          var trgCoord = {
            x: treeRect.left + (treeRect.right - treeRect.left) / 2,
            y: dragDirs.vrt >= 0 ? dragRect.bottom : dragRect.top
          };
          var hovNodeEl = document.elementFromPoint(trgCoord.x, trgCoord.y - 1);
          var hovCNodeEl = hovNodeEl ? hovNodeEl.closest('.group-or-rule-container') : null;
          if (!hovCNodeEl) {
            console.log('out of tree bounds!');
          } else {
            var isGroup = hovCNodeEl.classList.contains('group-container');
            var hovNodeId = hovCNodeEl.getAttribute('data-id');
            var hovEl = hovCNodeEl;
            var doAppend = false;
            var doPrepend = false;
            if (hovEl) {
              var hovRect = hovEl.getBoundingClientRect();
              var hovHeight = hovRect.bottom - hovRect.top;
              var hovII = this.tree.items[hovNodeId];
              var trgRect = null,
                  trgEl = null,
                  trgII = null;

              if (dragDirs.vrt == 0) {
                trgII = itemInfo;
                trgEl = plhEl;
                if (trgEl) trgRect = trgEl.getBoundingClientRect();
              } else {
                if (isGroup) {
                  if (dragDirs.vrt > 0) {
                    //down
                    //take group header (for prepend only)
                    var hovInnerEl = hovCNodeEl.getElementsByClassName('group--header');
                    var hovEl2 = hovInnerEl.length ? hovInnerEl[0] : null;
                    var hovRect2 = hovEl2.getBoundingClientRect();
                    var hovHeight2 = hovRect2.bottom - hovRect2.top;
                    var isOverHover = dragRect.bottom - hovRect2.top > hovHeight2 * 3 / 4;
                    if (isOverHover && hovII.top > dragInfo.itemInfo.top) {
                      trgII = hovII;
                      trgRect = hovRect2;
                      trgEl = hovEl2;
                      doPrepend = true;
                    }
                  } else if (dragDirs.vrt < 0) {
                    //up
                    if (hovII.lev >= itemInfo.lev) {
                      //take whole group
                      //todo: 5 is magic for now (bottom margin), configure it!
                      var isClimbToHover = hovRect.bottom - dragRect.top >= 2;
                      if (isClimbToHover && hovII.top < dragInfo.itemInfo.top) {
                        trgII = hovII;
                        trgRect = hovRect;
                        trgEl = hovEl;
                        doAppend = true;
                      }
                    }
                  }
                  if (!doPrepend && !doAppend) {
                    //take whole group and check if we can move before/after group
                    var isOverHover = dragDirs.vrt < 0 //up
                    ? hovRect.bottom - dragRect.top > hovHeight - 5 : dragRect.bottom - hovRect.top > hovHeight - 5;
                    if (isOverHover) {
                      trgII = hovII;
                      trgRect = hovRect;
                      trgEl = hovEl;
                    }
                  }
                } else {
                  //check if we can move before/after group
                  var isOverHover = dragDirs.vrt < 0 //up
                  ? hovRect.bottom - dragRect.top > hovHeight / 2 : dragRect.bottom - hovRect.top > hovHeight / 2;
                  if (isOverHover) {
                    trgII = hovII;
                    trgRect = hovRect;
                    trgEl = hovEl;
                  }
                }
              }

              var isSamePos = trgII && trgII.id == dragId;
              if (trgRect) {
                var dragLeftOffset = dragRect.left - treeRect.left;
                var trgLeftOffset = trgRect.left - treeRect.left;
                var trgLev = trgLeftOffset / paddingLeft;
                var dragLev = Math.max(0, Math.round(dragLeftOffset / paddingLeft));
                var availMoves = [];
                if (isSamePos) {
                  //do nothing
                } else {
                  if (isGroup) {
                    if (doAppend) {
                      availMoves.push([constants.PLACEMENT_APPEND, trgII, trgII.lev + 1]);
                    } else if (doPrepend) {
                      availMoves.push([constants.PLACEMENT_PREPEND, trgII, trgII.lev + 1]);
                    }
                  }
                  if (!doAppend && !doPrepend) {
                    if (dragDirs.vrt < 0) {
                      availMoves.push([constants.PLACEMENT_BEFORE, trgII, trgII.lev]);
                    } else if (dragDirs.vrt > 0) {
                      availMoves.push([constants.PLACEMENT_AFTER, trgII, trgII.lev]);
                    }
                  }
                }

                //sanitize
                availMoves = availMoves.filter(function (am) {
                  var placement = am[0];
                  var trg = am[1];
                  if ((placement == constants.PLACEMENT_BEFORE || placement == constants.PLACEMENT_AFTER) && trg.parent == null) return false;
                  if (trg.collapsed && (placement == constants.PLACEMENT_APPEND || placement == constants.PLACEMENT_PREPEND)) return false;

                  var isInside = trg.id == itemInfo.id;
                  if (!isInside) {
                    var tmp = trg;
                    while (tmp.parent) {
                      tmp = _this2.tree.items[tmp.parent];
                      if (tmp.id == itemInfo.id) {
                        isInside = true;
                        break;
                      }
                    }
                  }
                  return !isInside;
                }).map(function (am) {
                  var placement = am[0],
                      toII = am[1];
                  var toParentII = null;
                  if (placement == constants.PLACEMENT_APPEND || placement == constants.PLACEMENT_PREPEND) toParentII = toII;else toParentII = _this2.tree.items[toII.parent];
                  if (toParentII && toParentII.parent == null) toParentII = null;
                  am[3] = toParentII;
                  return am;
                });

                var bestMode = null;
                availMoves = availMoves.filter(function (am) {
                  return _this2.canMove(itemInfo, am[1], am[0], am[3], canMoveFn);
                });
                var levs = availMoves.map(function (am) {
                  return am[2];
                });
                var curLev = itemInfo.lev;
                var allLevs = levs.concat(curLev);
                var closestDragLev = null;
                if (allLevs.indexOf(dragLev) != -1) closestDragLev = dragLev;else if (dragLev > Math.max.apply(Math, _toConsumableArray(allLevs))) closestDragLev = Math.max.apply(Math, _toConsumableArray(allLevs));else if (dragLev < Math.min.apply(Math, _toConsumableArray(allLevs))) closestDragLev = Math.min.apply(Math, _toConsumableArray(allLevs));
                bestMode = availMoves.find(function (am) {
                  return am[2] == closestDragLev;
                });
                if (!isSamePos && !bestMode && availMoves.length) bestMode = availMoves[0];
                moveInfo = bestMode;
              }
            }
          }
        }

        if (moveInfo) {
          console.log('moveInfo', moveInfo);
          this.move(itemInfo, moveInfo[1], moveInfo[0], moveInfo[3]);
          return true;
        }

        return false;
      }
    }, {
      key: 'canMove',
      value: function canMove(fromII, toII, placement, toParentII, canMoveFn) {
        if (!fromII || !toII) return false;
        if (fromII.id === toII.id) return false;

        var res = true;
        if (canMoveFn) res = canMoveFn(fromII.node.toJS(), toII.node.toJS(), placement, toParentII ? toParentII.node.toJS() : null);
        return res;
      }
    }, {
      key: 'move',
      value: function move(fromII, toII, placement, toParentII) {
        //console.log('move', fromII, toII, placement, toParentII);
        this.props.actions.moveItem(fromII.path, toII.path, placement);
      }
    }, {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(Builder, _extends({}, this.props, {
          dragging: this.state.dragging,
          onDragStart: this.onDragStart.bind(this)
        }));
      }
    }]);

    return SortableContainer;
  }(_react.Component), _class.propTypes = {
    tree: _propTypes2.default.instanceOf(_immutable2.default.Map).isRequired,
    actions: _propTypes2.default.object.isRequired // {moveItem: Function, ..}
    //... see Builder
  }, _temp;
};