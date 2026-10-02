(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/CartesianAxis.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartesianAxis",
    ()=>CartesianAxis,
    "defaultCartesianAxisProps",
    ()=>defaultCartesianAxisProps
]);
/**
 * @fileOverview Cartesian Axis
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.3_@babel+core@7.2_88418e4aaf92e4db3a40b2e1891787a4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$es$2d$toolkit$40$1$2e$52$2e$0$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$object$2f$get$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__get__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/es-toolkit@1.52.0/node_modules/es-toolkit/dist/compat/object/get.mjs [app-client] (ecmascript) <export get as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$es$2d$toolkit$40$1$2e$52$2e$0$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isEqual$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__isEqual__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/es-toolkit@1.52.0/node_modules/es-toolkit/dist/predicate/isEqual.mjs [app-client] (ecmascript) <export isEqual as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$container$2f$Layer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/container/Layer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/component/Text.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Label$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/component/Label.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/DataUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/types.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$getTicks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/getTicks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$svgPropertiesNoEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/svgPropertiesNoEvents.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$YAxisUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/YAxisUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$XAxisUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/XAxisUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$resolveDefaultProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/resolveDefaultProps.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$ZIndexLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/zIndex/ZIndexLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$DefaultZIndexes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/zIndex/DefaultZIndexes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$getClassNameFromUnknown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/getClassNameFromUnknown.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$renderedTicksSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/renderedTicksSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/hooks.js [app-client] (ecmascript)");
var _excluded = [
    "axisLine",
    "width",
    "height",
    "className",
    "hide",
    "ticks",
    "axisType",
    "axisId"
];
function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(r, a) {
    if (r) {
        if ("string" == typeof r) return _arrayLikeToArray(r, a);
        var t = ({}).toString.call(r).slice(8, -1);
        return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
}
function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for(var e = 0, n = Array(a); e < a; e++)n[e] = r[e];
    return n;
}
function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
        var e, n, i, u, a = [], f = !0, o = !1;
        try {
            if (i = (t = t.call(r)).next, 0 === l) {
                if (Object(t) !== t) return;
                f = !1;
            } else for(; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
        } catch (r) {
            o = !0, n = r;
        } finally{
            try {
                if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
            } finally{
                if (o) throw n;
            }
        }
        return a;
    }
}
function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
}
function _objectWithoutProperties(e, t) {
    if (null == e) return {};
    var o, r, i = _objectWithoutPropertiesLoose(e, t);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        for(r = 0; r < n.length; r++)o = n[r], -1 === t.indexOf(o) && ({}).propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
    }
    return i;
}
function _objectWithoutPropertiesLoose(r, e) {
    if (null == r) return {};
    var t = {};
    for(var n in r)if (({}).hasOwnProperty.call(r, n)) {
        if (-1 !== e.indexOf(n)) continue;
        t[n] = r[n];
    }
    return t;
}
function _extends() {
    return _extends = ("TURBOPACK compile-time truthy", 1) ? Object.assign.bind() : "TURBOPACK unreachable", _extends.apply(null, arguments);
}
function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r) {
            return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
    }
    return t;
}
function _objectSpread(e) {
    for(var r = 1; r < arguments.length; r++){
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
            _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
    }
    return e;
}
function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[r] = t, e;
}
function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
var defaultCartesianAxisProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    viewBox: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    // The orientation of axis
    orientation: 'bottom',
    // The ticks
    ticks: [],
    stroke: '#666',
    tickLine: true,
    axisLine: true,
    tick: true,
    mirror: false,
    minTickGap: 5,
    // The width or height of tick
    tickSize: 6,
    tickMargin: 2,
    interval: 'preserveEnd',
    zIndex: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$DefaultZIndexes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DefaultZIndexes"].axis
};
/*
 * `viewBox` and `scale` are SVG attributes.
 * Recharts however - unfortunately - has its own attributes named `viewBox` and `scale`
 * that are completely different data shape and different purpose.
 */ function AxisLine(axisLineProps) {
    var x = axisLineProps.x, y = axisLineProps.y, width = axisLineProps.width, height = axisLineProps.height, orientation = axisLineProps.orientation, mirror = axisLineProps.mirror, axisLine = axisLineProps.axisLine, otherSvgProps = axisLineProps.otherSvgProps;
    if (!axisLine) {
        return null;
    }
    var props = _objectSpread(_objectSpread(_objectSpread({}, otherSvgProps), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$svgPropertiesNoEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svgPropertiesNoEvents"])(axisLine)), {}, {
        fill: 'none'
    });
    if (orientation === 'top' || orientation === 'bottom') {
        var needHeight = +(orientation === 'top' && !mirror || orientation === 'bottom' && mirror);
        props = _objectSpread(_objectSpread({}, props), {}, {
            x1: x,
            y1: y + needHeight * height,
            x2: x + width,
            y2: y + needHeight * height
        });
    } else {
        var needWidth = +(orientation === 'left' && !mirror || orientation === 'right' && mirror);
        props = _objectSpread(_objectSpread({}, props), {}, {
            x1: x + needWidth * width,
            y1: y,
            x2: x + needWidth * width,
            y2: y + height
        });
    }
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("line", _extends({}, props, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])('recharts-cartesian-axis-line', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$es$2d$toolkit$40$1$2e$52$2e$0$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$object$2f$get$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__get__as__default$3e$__["default"])(axisLine, 'className'))
    }));
}
/**
 * Calculate the coordinates of endpoints in ticks.
 * @param data The data of a simple tick.
 * @param x The x-coordinate of the axis.
 * @param y The y-coordinate of the axis.
 * @param width The width of the axis.
 * @param height The height of the axis.
 * @param orientation The orientation of the axis.
 * @param tickSize The length of the tick line.
 * @param mirror If true, the ticks are mirrored.
 * @param tickMargin The margin between the tick line and the tick text.
 * @returns An object with `line` and `tick` coordinates.
 * `line` is the coordinates for the tick line, and `tick` is the coordinate for the tick text.
 */ function getTickLineCoord(data, x, y, width, height, orientation, tickSize, mirror, tickMargin) {
    var x1, x2, y1, y2, tx, ty;
    var sign = mirror ? -1 : 1;
    var finalTickSize = data.tickSize || tickSize;
    var tickCoord = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(data.tickCoord) ? data.tickCoord : data.coordinate;
    switch(orientation){
        case 'top':
            x1 = x2 = data.coordinate;
            y2 = y + +!mirror * height;
            y1 = y2 - sign * finalTickSize;
            ty = y1 - sign * tickMargin;
            tx = tickCoord;
            break;
        case 'left':
            y1 = y2 = data.coordinate;
            x2 = x + +!mirror * width;
            x1 = x2 - sign * finalTickSize;
            tx = x1 - sign * tickMargin;
            ty = tickCoord;
            break;
        case 'right':
            y1 = y2 = data.coordinate;
            x2 = x + +mirror * width;
            x1 = x2 + sign * finalTickSize;
            tx = x1 + sign * tickMargin;
            ty = tickCoord;
            break;
        default:
            x1 = x2 = data.coordinate;
            y2 = y + +mirror * height;
            y1 = y2 + sign * finalTickSize;
            ty = y1 + sign * tickMargin;
            tx = tickCoord;
            break;
    }
    return {
        line: {
            x1,
            y1,
            x2,
            y2
        },
        tick: {
            x: tx,
            y: ty
        }
    };
}
/**
 * @param orientation The orientation of the axis.
 * @param mirror If true, the ticks are mirrored.
 * @returns The text anchor of the tick.
 */ function getTickTextAnchor(orientation, mirror) {
    switch(orientation){
        case 'left':
            return mirror ? 'start' : 'end';
        case 'right':
            return mirror ? 'end' : 'start';
        default:
            return 'middle';
    }
}
/**
 * @param orientation The orientation of the axis.
 * @param mirror If true, the ticks are mirrored.
 * @returns The vertical text anchor of the tick.
 */ function getTickVerticalAnchor(orientation, mirror) {
    switch(orientation){
        case 'left':
        case 'right':
            return 'middle';
        case 'top':
            return mirror ? 'start' : 'end';
        default:
            return mirror ? 'end' : 'start';
    }
}
function TickItem(props) {
    var option = props.option, tickProps = props.tickProps, value = props.value;
    var tickItem;
    var combinedClassName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(tickProps.className, 'recharts-cartesian-axis-tick-value');
    if (/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](option)) {
        // @ts-expect-error element cloning is not typed
        tickItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"](option, _objectSpread(_objectSpread({}, tickProps), {}, {
            className: combinedClassName
        }));
    } else if (typeof option === 'function') {
        tickItem = option(_objectSpread(_objectSpread({}, tickProps), {}, {
            className: combinedClassName
        }));
    } else {
        var className = 'recharts-cartesian-axis-tick-value';
        if (typeof option !== 'boolean') {
            className = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(className, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$getClassNameFromUnknown$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getClassNameFromUnknown"])(option));
        }
        tickItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Text"], _extends({}, tickProps, {
            className: className
        }), value);
    }
    return tickItem;
}
function RenderedTicksReporter(_ref) {
    var ticks = _ref.ticks, axisType = _ref.axisType, axisId = _ref.axisId;
    var dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    /*
   * The ticks array gets a new identity on every render even when its contents are unchanged.
   * If we dispatched on every identity change, then every parent re-render would trigger
   * a store update from a passive effect. Under rapid external updates (e.g. a slider
   * driving chart data), those nested dispatches can trip React's update depth limit.
   * https://github.com/recharts/recharts/issues/7563
   */ var lastDispatchedTicksRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RenderedTicksReporter.useEffect": ()=>{
            if (axisId == null || axisType == null) {
                return;
            }
            // Filter out irrelevant internal properties before exposing externally
            var tickItems = ticks.map({
                "RenderedTicksReporter.useEffect.tickItems": (tick)=>({
                        value: tick.value,
                        coordinate: tick.coordinate,
                        offset: tick.offset,
                        index: tick.index
                    })
            }["RenderedTicksReporter.useEffect.tickItems"]);
            var last = lastDispatchedTicksRef.current;
            if (last != null && last.axisId === axisId && last.axisType === axisType && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$es$2d$toolkit$40$1$2e$52$2e$0$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$predicate$2f$isEqual$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__isEqual__as__default$3e$__["default"])(last.ticks, tickItems)) {
                return;
            }
            lastDispatchedTicksRef.current = {
                ticks: tickItems,
                axisId,
                axisType
            };
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$renderedTicksSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setRenderedTicks"])({
                ticks: tickItems,
                axisId,
                axisType
            }));
        }
    }["RenderedTicksReporter.useEffect"], [
        dispatch,
        ticks,
        axisId,
        axisType
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RenderedTicksReporter.useEffect": ()=>{
            if (axisId == null || axisType == null) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"];
            }
            return ({
                "RenderedTicksReporter.useEffect": ()=>{
                    dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$renderedTicksSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeRenderedTicks"])({
                        axisId,
                        axisType
                    }));
                }
            })["RenderedTicksReporter.useEffect"];
        }
    }["RenderedTicksReporter.useEffect"], [
        dispatch,
        axisId,
        axisType
    ]);
    return null;
}
var Ticks = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    var _props$ticks = props.ticks, ticks = _props$ticks === void 0 ? [] : _props$ticks, tick = props.tick, tickLine = props.tickLine, stroke = props.stroke, tickFormatter = props.tickFormatter, unit = props.unit, padding = props.padding, tickTextProps = props.tickTextProps, orientation = props.orientation, mirror = props.mirror, x = props.x, y = props.y, width = props.width, height = props.height, tickSize = props.tickSize, tickMargin = props.tickMargin, fontSize = props.fontSize, letterSpacing = props.letterSpacing, getTicksConfig = props.getTicksConfig, events = props.events, axisType = props.axisType, axisId = props.axisId;
    // @ts-expect-error some properties are optional in props but required in getTicks
    var finalTicks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$getTicks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTicks"])(_objectSpread(_objectSpread({}, getTicksConfig), {}, {
        ticks
    }), fontSize, letterSpacing);
    var axisProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$svgPropertiesNoEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svgPropertiesNoEvents"])(getTicksConfig);
    var customTickProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$svgPropertiesNoEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svgPropertiesNoEventsFromUnknown"])(tick);
    // Use user-provided textAnchor if available, otherwise calculate from orientation/mirror
    var textAnchor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidTextAnchor"])(axisProps.textAnchor) ? axisProps.textAnchor : getTickTextAnchor(orientation, mirror);
    var verticalAnchor = getTickVerticalAnchor(orientation, mirror);
    var tickLinePropsObject = {};
    if (typeof tickLine === 'object') {
        tickLinePropsObject = tickLine;
    }
    var tickLineProps = _objectSpread(_objectSpread({}, axisProps), {}, {
        fill: 'none'
    }, tickLinePropsObject);
    var tickLineCoords = finalTicks.map((entry)=>_objectSpread({
            entry
        }, getTickLineCoord(entry, x, y, width, height, orientation, tickSize, mirror, tickMargin)));
    var tickLines = tickLineCoords.map((_ref2)=>{
        var entry = _ref2.entry, lineCoord = _ref2.line;
        return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$container$2f$Layer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Layer"], {
            className: "recharts-cartesian-axis-tick",
            key: "tick-".concat(entry.value, "-").concat(entry.coordinate, "-").concat(entry.tickCoord)
        }, tickLine && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("line", _extends({}, tickLineProps, lineCoord, {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])('recharts-cartesian-axis-tick-line', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$es$2d$toolkit$40$1$2e$52$2e$0$2f$node_modules$2f$es$2d$toolkit$2f$dist$2f$compat$2f$object$2f$get$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__get__as__default$3e$__["default"])(tickLine, 'className'))
        })));
    });
    var tickLabels = tickLineCoords.map((_ref3, i)=>{
        var _ref4, _tickTextProps$angle;
        var entry = _ref3.entry, tickCoord = _ref3.tick;
        // @ts-expect-error we're not checking that padding and orientation types are in sync
        var tickProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({
            verticalAnchor
        }, axisProps), {}, {
            textAnchor,
            stroke: 'none',
            fill: stroke
        }, tickCoord), {}, {
            index: i,
            payload: entry,
            visibleTicksCount: finalTicks.length,
            tickFormatter,
            padding
        }, tickTextProps), {}, {
            angle: (_ref4 = (_tickTextProps$angle = tickTextProps === null || tickTextProps === void 0 ? void 0 : tickTextProps.angle) !== null && _tickTextProps$angle !== void 0 ? _tickTextProps$angle : axisProps.angle) !== null && _ref4 !== void 0 ? _ref4 : 0
        });
        // @ts-expect-error customTickProps is contributing unknown props which we don't type properly
        var finalTickProps = _objectSpread(_objectSpread({}, tickProps), customTickProps);
        return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$container$2f$Layer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Layer"], _extends({
            className: "recharts-cartesian-axis-tick-label",
            key: "tick-label-".concat(entry.value, "-").concat(entry.coordinate, "-").concat(entry.tickCoord)
        }, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adaptEventsOfChild"])(events, entry, i)), tick && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](TickItem, {
            option: tick,
            tickProps: finalTickProps,
            value: "".concat(typeof tickFormatter === 'function' ? tickFormatter(entry.value, i) : entry.value).concat(unit || '')
        }));
    });
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("g", {
        className: "recharts-cartesian-axis-ticks recharts-".concat(axisType, "-ticks")
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](RenderedTicksReporter, {
        ticks: finalTicks,
        axisId: axisId,
        axisType: axisType
    }), tickLabels.length > 0 && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$ZIndexLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZIndexLayer"], {
        zIndex: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$DefaultZIndexes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DefaultZIndexes"].label
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("g", {
        className: "recharts-cartesian-axis-tick-labels recharts-".concat(axisType, "-tick-labels"),
        ref: ref
    }, tickLabels)), tickLines.length > 0 && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("g", {
        className: "recharts-cartesian-axis-tick-lines recharts-".concat(axisType, "-tick-lines")
    }, tickLines));
});
var CartesianAxisComponent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])((props, ref)=>{
    var axisLine = props.axisLine, width = props.width, height = props.height, className = props.className, hide = props.hide, ticks = props.ticks, axisType = props.axisType, axisId = props.axisId, rest = _objectWithoutProperties(props, _excluded);
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(''), _useState2 = _slicedToArray(_useState, 2), fontSize = _useState2[0], setFontSize = _useState2[1];
    var _useState3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(''), _useState4 = _slicedToArray(_useState3, 2), letterSpacing = _useState4[0], setLetterSpacing = _useState4[1];
    var tickRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useImperativeHandle"])(ref, {
        "CartesianAxisComponent.useImperativeHandle": ()=>({
                getCalculatedWidth: ({
                    "CartesianAxisComponent.useImperativeHandle": ()=>{
                        var _props$labelRef;
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$YAxisUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCalculatedYAxisWidth"])({
                            ticks: tickRefs.current,
                            label: (_props$labelRef = props.labelRef) === null || _props$labelRef === void 0 ? void 0 : _props$labelRef.current,
                            labelGapWithTick: 5,
                            tickSize: props.tickSize,
                            tickMargin: props.tickMargin
                        });
                    }
                })["CartesianAxisComponent.useImperativeHandle"],
                getCalculatedHeight: ({
                    "CartesianAxisComponent.useImperativeHandle": ()=>{
                        var _props$labelRef2;
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$XAxisUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCalculatedXAxisHeight"])({
                            ticks: tickRefs.current,
                            label: (_props$labelRef2 = props.labelRef) === null || _props$labelRef2 === void 0 ? void 0 : _props$labelRef2.current,
                            labelGapWithTick: 5,
                            tickSize: props.tickSize,
                            tickMargin: props.tickMargin
                        });
                    }
                })["CartesianAxisComponent.useImperativeHandle"]
            })
    }["CartesianAxisComponent.useImperativeHandle"]);
    var layerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CartesianAxisComponent.useCallback[layerRef]": (el)=>{
            if (el) {
                var tickNodes = el.getElementsByClassName('recharts-cartesian-axis-tick-value');
                tickRefs.current = tickNodes;
                var tick = tickNodes[0];
                if (tick) {
                    var computedStyle = window.getComputedStyle(tick);
                    var calculatedFontSize = computedStyle.fontSize;
                    var calculatedLetterSpacing = computedStyle.letterSpacing;
                    if (calculatedFontSize !== fontSize || calculatedLetterSpacing !== letterSpacing) {
                        setFontSize(calculatedFontSize);
                        setLetterSpacing(calculatedLetterSpacing);
                    }
                }
            }
        }
    }["CartesianAxisComponent.useCallback[layerRef]"], [
        fontSize,
        letterSpacing
    ]);
    if (hide) {
        return null;
    }
    /*
   * This is different condition from what validateWidthHeight is doing;
   * the CartesianAxis does allow width or height to be undefined.
   */ if (width != null && width <= 0 || height != null && height <= 0) {
        return null;
    }
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$ZIndexLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZIndexLayer"], {
        zIndex: props.zIndex
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$container$2f$Layer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Layer"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])('recharts-cartesian-axis', className)
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](AxisLine, {
        x: props.x,
        y: props.y,
        width: width,
        height: height,
        orientation: props.orientation,
        mirror: props.mirror,
        axisLine: axisLine,
        otherSvgProps: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$svgPropertiesNoEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svgPropertiesNoEvents"])(props)
    }), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](Ticks, {
        ref: layerRef,
        axisType: axisType,
        events: rest,
        fontSize: fontSize,
        getTicksConfig: props,
        height: props.height,
        letterSpacing: letterSpacing,
        mirror: props.mirror,
        orientation: props.orientation,
        padding: props.padding,
        stroke: props.stroke,
        tick: props.tick,
        tickFormatter: props.tickFormatter,
        tickLine: props.tickLine,
        tickMargin: props.tickMargin,
        tickSize: props.tickSize,
        tickTextProps: props.tickTextProps,
        ticks: ticks,
        unit: props.unit,
        width: props.width,
        x: props.x,
        y: props.y,
        axisId: axisId
    }), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Label$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianLabelContextProvider"], {
        x: props.x,
        y: props.y,
        width: props.width,
        height: props.height,
        lowerWidth: props.width,
        upperWidth: props.width
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Label$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianLabelFromLabelProp"], {
        label: props.label,
        labelRef: props.labelRef
    }), props.children)));
});
var CartesianAxis = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((outsideProps, ref)=>{
    var props = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$resolveDefaultProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveDefaultProps"])(outsideProps, defaultCartesianAxisProps);
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](CartesianAxisComponent, _extends({}, props, {
        ref: ref
    }));
});
CartesianAxis.displayName = 'CartesianAxis';
}),
"[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartesianGrid",
    ()=>CartesianGrid,
    "defaultCartesianGridProps",
    ()=>defaultCartesianGridProps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.3_@babel+core@7.2_88418e4aaf92e4db3a40b2e1891787a4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$LogUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/LogUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/DataUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ChartUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/ChartUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$getTicks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/getTicks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/CartesianAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$chartLayoutContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/context/chartLayoutContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/selectors/axisSelectors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/hooks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$PanoramaContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/context/PanoramaContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$resolveDefaultProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/resolveDefaultProps.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$svgPropertiesNoEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/svgPropertiesNoEvents.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$isWellBehavedNumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/isWellBehavedNumber.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$ZIndexLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/zIndex/ZIndexLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$DefaultZIndexes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/zIndex/DefaultZIndexes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$theme$2f$RechartsThemeContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/theme/RechartsThemeContext.js [app-client] (ecmascript)");
var _excluded = [
    "x1",
    "y1",
    "x2",
    "y2",
    "key"
], _excluded2 = [
    "offset"
], _excluded3 = [
    "xAxisId",
    "yAxisId"
], _excluded4 = [
    "xAxisId",
    "yAxisId"
];
function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r) {
            return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
    }
    return t;
}
function _objectSpread(e) {
    for(var r = 1; r < arguments.length; r++){
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
            _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
    }
    return e;
}
function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[r] = t, e;
}
function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
function _extends() {
    return _extends = ("TURBOPACK compile-time truthy", 1) ? Object.assign.bind() : "TURBOPACK unreachable", _extends.apply(null, arguments);
}
function _objectWithoutProperties(e, t) {
    if (null == e) return {};
    var o, r, i = _objectWithoutPropertiesLoose(e, t);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        for(r = 0; r < n.length; r++)o = n[r], -1 === t.indexOf(o) && ({}).propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
    }
    return i;
}
function _objectWithoutPropertiesLoose(r, e) {
    if (null == r) return {};
    var t = {};
    for(var n in r)if (({}).hasOwnProperty.call(r, n)) {
        if (-1 !== e.indexOf(n)) continue;
        t[n] = r[n];
    }
    return t;
}
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
/**
 * The <CartesianGrid horizontal
 */ // We exclude strokeDasharray here because Recharts allows array of numbers while DOM does not
var Background = (props)=>{
    var fill = props.fill;
    if (!fill || fill === 'none') {
        return null;
    }
    var fillOpacity = props.fillOpacity, x = props.x, y = props.y, width = props.width, height = props.height, ry = props.ry;
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("rect", {
        x: x,
        y: y,
        ry: ry,
        width: width,
        height: height,
        stroke: "none",
        fill: fill,
        fillOpacity: fillOpacity,
        className: "recharts-cartesian-grid-bg"
    });
};
function LineItem(_ref) {
    var option = _ref.option, lineItemProps = _ref.lineItemProps;
    var lineItem;
    if (/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](option)) {
        // @ts-expect-error typescript does not see the props type when cloning an element
        lineItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"](option, lineItemProps);
    } else if (typeof option === 'function') {
        lineItem = option(lineItemProps);
    } else {
        var _svgPropertiesNoEvent;
        var x1 = lineItemProps.x1, y1 = lineItemProps.y1, x2 = lineItemProps.x2, y2 = lineItemProps.y2, key = lineItemProps.key, others = _objectWithoutProperties(lineItemProps, _excluded);
        var _ref2 = (_svgPropertiesNoEvent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$svgPropertiesNoEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svgPropertiesNoEvents"])(others)) !== null && _svgPropertiesNoEvent !== void 0 ? _svgPropertiesNoEvent : {}, __ = _ref2.offset, restOfFilteredProps = _objectWithoutProperties(_ref2, _excluded2);
        var strokeDasharray = Array.isArray(restOfFilteredProps.strokeDasharray) ? restOfFilteredProps.strokeDasharray.join(',') : restOfFilteredProps.strokeDasharray;
        lineItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("line", _extends({}, restOfFilteredProps, {
            strokeDasharray: strokeDasharray,
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            fill: "none",
            key: key
        }));
    }
    return lineItem;
}
function HorizontalGridLines(props) {
    var x = props.x, width = props.width, _props$horizontal = props.horizontal, horizontal = _props$horizontal === void 0 ? true : _props$horizontal, horizontalPoints = props.horizontalPoints;
    if (!horizontal || !horizontalPoints || !horizontalPoints.length) {
        return null;
    }
    var xAxisId = props.xAxisId, yAxisId = props.yAxisId, otherLineItemProps = _objectWithoutProperties(props, _excluded3);
    var items = horizontalPoints.map((entry, i)=>{
        var lineItemProps = _objectSpread(_objectSpread({}, otherLineItemProps), {}, {
            x1: x,
            y1: entry,
            x2: x + width,
            y2: entry,
            key: "line-".concat(i),
            index: i
        });
        return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](LineItem, {
            key: "line-".concat(i),
            option: horizontal,
            lineItemProps: lineItemProps
        });
    });
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("g", {
        className: "recharts-cartesian-grid-horizontal"
    }, items);
}
function VerticalGridLines(props) {
    var y = props.y, height = props.height, _props$vertical = props.vertical, vertical = _props$vertical === void 0 ? true : _props$vertical, verticalPoints = props.verticalPoints;
    if (!vertical || !verticalPoints || !verticalPoints.length) {
        return null;
    }
    var xAxisId = props.xAxisId, yAxisId = props.yAxisId, otherLineItemProps = _objectWithoutProperties(props, _excluded4);
    var items = verticalPoints.map((entry, i)=>{
        var lineItemProps = _objectSpread(_objectSpread({}, otherLineItemProps), {}, {
            x1: entry,
            y1: y,
            x2: entry,
            y2: y + height,
            key: "line-".concat(i),
            index: i
        });
        return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](LineItem, {
            option: vertical,
            lineItemProps: lineItemProps,
            key: "line-".concat(i)
        });
    });
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("g", {
        className: "recharts-cartesian-grid-vertical"
    }, items);
}
function HorizontalStripes(props) {
    var horizontalFill = props.horizontalFill, fillOpacity = props.fillOpacity, x = props.x, y = props.y, width = props.width, height = props.height, horizontalPoints = props.horizontalPoints, _props$horizontal2 = props.horizontal, horizontal = _props$horizontal2 === void 0 ? true : _props$horizontal2;
    if (!horizontal || !horizontalFill || !horizontalFill.length || horizontalPoints == null) {
        return null;
    }
    var roundedSortedHorizontalPoints = horizontalPoints.map((e)=>Math.round(e + y - y)).sort((a, b)=>a - b);
    // Why is this condition `!==` instead of `<=` ?
    if (y !== roundedSortedHorizontalPoints[0]) {
        roundedSortedHorizontalPoints.unshift(0);
    }
    var items = roundedSortedHorizontalPoints.map((entry, i)=>{
        // Why do we strip only the last stripe if it is invisible, and not all invisible stripes?
        var nextPoint = roundedSortedHorizontalPoints[i + 1];
        var lastStripe = nextPoint == null;
        var lineHeight = lastStripe ? y + height - entry : nextPoint - entry;
        if (lineHeight <= 0) {
            return null;
        }
        var colorIndex = i % horizontalFill.length;
        return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("rect", {
            key: "react-".concat(i),
            y: entry,
            x: x,
            height: lineHeight,
            width: width,
            stroke: "none",
            fill: horizontalFill[colorIndex],
            fillOpacity: fillOpacity,
            className: "recharts-cartesian-grid-bg"
        });
    });
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("g", {
        className: "recharts-cartesian-gridstripes-horizontal"
    }, items);
}
function VerticalStripes(props) {
    var _props$vertical2 = props.vertical, vertical = _props$vertical2 === void 0 ? true : _props$vertical2, verticalFill = props.verticalFill, fillOpacity = props.fillOpacity, x = props.x, y = props.y, width = props.width, height = props.height, verticalPoints = props.verticalPoints;
    if (!vertical || !verticalFill || !verticalFill.length) {
        return null;
    }
    var roundedSortedVerticalPoints = verticalPoints.map((e)=>Math.round(e + x - x)).sort((a, b)=>a - b);
    if (x !== roundedSortedVerticalPoints[0]) {
        roundedSortedVerticalPoints.unshift(0);
    }
    var items = roundedSortedVerticalPoints.map((entry, i)=>{
        var nextPoint = roundedSortedVerticalPoints[i + 1];
        var lastStripe = nextPoint == null;
        var lineWidth = lastStripe ? x + width - entry : nextPoint - entry;
        if (lineWidth <= 0) {
            return null;
        }
        var colorIndex = i % verticalFill.length;
        return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("rect", {
            key: "react-".concat(i),
            x: entry,
            y: y,
            width: lineWidth,
            height: height,
            stroke: "none",
            fill: verticalFill[colorIndex],
            fillOpacity: fillOpacity,
            className: "recharts-cartesian-grid-bg"
        });
    });
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("g", {
        className: "recharts-cartesian-gridstripes-vertical"
    }, items);
}
var defaultVerticalCoordinatesGenerator = (_ref3, syncWithTicks)=>{
    var xAxis = _ref3.xAxis, width = _ref3.width, height = _ref3.height, offset = _ref3.offset;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ChartUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCoordinatesOfGrid"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$getTicks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTicks"])(_objectSpread(_objectSpread(_objectSpread({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultCartesianAxisProps"]), xAxis), {}, {
        ticks: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ChartUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTicksOfAxis"])(xAxis, true),
        viewBox: {
            x: 0,
            y: 0,
            width,
            height
        }
    })), offset.left, offset.left + offset.width, syncWithTicks);
};
var defaultHorizontalCoordinatesGenerator = (_ref4, syncWithTicks)=>{
    var yAxis = _ref4.yAxis, width = _ref4.width, height = _ref4.height, offset = _ref4.offset;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ChartUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCoordinatesOfGrid"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$getTicks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTicks"])(_objectSpread(_objectSpread(_objectSpread({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultCartesianAxisProps"]), yAxis), {}, {
        ticks: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ChartUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTicksOfAxis"])(yAxis, true),
        viewBox: {
            x: 0,
            y: 0,
            width,
            height
        }
    })), offset.top, offset.top + offset.height, syncWithTicks);
};
var defaultCartesianGridProps = {
    horizontal: true,
    vertical: true,
    // The ordinates of horizontal grid lines
    horizontalPoints: [],
    // The abscissas of vertical grid lines
    verticalPoints: [],
    // The fill of colors of grid lines
    verticalFill: [],
    horizontalFill: [],
    xAxisId: 0,
    yAxisId: 0,
    syncWithTicks: false,
    zIndex: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$DefaultZIndexes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DefaultZIndexes"].grid
};
function CartesianGrid(props) {
    var _propsIncludingDefaul, _propsIncludingDefaul2, _propsIncludingDefaul3, _propsIncludingDefaul4, _propsIncludingDefaul5, _propsIncludingDefaul6;
    var chartWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$chartLayoutContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChartWidth"])();
    var chartHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$chartLayoutContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChartHeight"])();
    var offset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$chartLayoutContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOffsetInternal"])();
    var propsIncludingDefaults = _objectSpread(_objectSpread({}, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$resolveDefaultProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveDefaultProps"])(props, defaultCartesianGridProps)), {}, {
        x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(props.x) ? props.x : offset.left,
        y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(props.y) ? props.y : offset.top,
        width: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(props.width) ? props.width : offset.width,
        height: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(props.height) ? props.height : offset.height
    });
    var xAxisId = propsIncludingDefaults.xAxisId, yAxisId = propsIncludingDefaults.yAxisId, x = propsIncludingDefaults.x, y = propsIncludingDefaults.y, width = propsIncludingDefaults.width, height = propsIncludingDefaults.height, syncWithTicks = propsIncludingDefaults.syncWithTicks, horizontalValues = propsIncludingDefaults.horizontalValues, verticalValues = propsIncludingDefaults.verticalValues;
    var isPanorama = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$PanoramaContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsPanorama"])();
    var xAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "CartesianGrid.useAppSelector[xAxis]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectAxisPropsNeededForCartesianGridTicksGenerator"])(state, 'xAxis', xAxisId, isPanorama)
    }["CartesianGrid.useAppSelector[xAxis]"]);
    var yAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "CartesianGrid.useAppSelector[yAxis]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectAxisPropsNeededForCartesianGridTicksGenerator"])(state, 'yAxis', yAxisId, isPanorama)
    }["CartesianGrid.useAppSelector[yAxis]"]);
    var theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$theme$2f$RechartsThemeContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRechartsTheme"])();
    var themeProps = {
        stroke: (_propsIncludingDefaul = propsIncludingDefaults.stroke) !== null && _propsIncludingDefaul !== void 0 ? _propsIncludingDefaul : theme.grid.stroke,
        strokeWidth: (_propsIncludingDefaul2 = propsIncludingDefaults.strokeWidth) !== null && _propsIncludingDefaul2 !== void 0 ? _propsIncludingDefaul2 : theme.grid.strokeWidth,
        strokeOpacity: (_propsIncludingDefaul3 = propsIncludingDefaults.strokeOpacity) !== null && _propsIncludingDefaul3 !== void 0 ? _propsIncludingDefaul3 : theme.grid.strokeOpacity,
        strokeDasharray: (_propsIncludingDefaul4 = propsIncludingDefaults.strokeDasharray) !== null && _propsIncludingDefaul4 !== void 0 ? _propsIncludingDefaul4 : theme.grid.strokeDasharray
    };
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$isWellBehavedNumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPositiveNumber"])(width) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$isWellBehavedNumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPositiveNumber"])(height) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(x) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(y)) {
        return null;
    }
    /*
   * verticalCoordinatesGenerator and horizontalCoordinatesGenerator are defined
   * outside the propsIncludingDefaults because they were never part of the original props
   * and they were never passed as a prop down to horizontal/vertical custom elements.
   * If we add these two to propsIncludingDefaults then we are changing public API.
   * Not a bad thing per se but also not necessary.
   */ var verticalCoordinatesGenerator = propsIncludingDefaults.verticalCoordinatesGenerator || defaultVerticalCoordinatesGenerator;
    var horizontalCoordinatesGenerator = propsIncludingDefaults.horizontalCoordinatesGenerator || defaultHorizontalCoordinatesGenerator;
    var horizontalPoints = propsIncludingDefaults.horizontalPoints, verticalPoints = propsIncludingDefaults.verticalPoints;
    // No horizontal points are specified
    if ((!horizontalPoints || !horizontalPoints.length) && typeof horizontalCoordinatesGenerator === 'function') {
        var isHorizontalValues = horizontalValues && horizontalValues.length;
        var generatorResult = horizontalCoordinatesGenerator({
            yAxis: yAxis ? _objectSpread(_objectSpread({}, yAxis), {}, {
                ticks: isHorizontalValues ? horizontalValues : yAxis.ticks
            }) : undefined,
            width: chartWidth !== null && chartWidth !== void 0 ? chartWidth : width,
            height: chartHeight !== null && chartHeight !== void 0 ? chartHeight : height,
            offset
        }, isHorizontalValues ? true : syncWithTicks);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$LogUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warn"])(Array.isArray(generatorResult), "horizontalCoordinatesGenerator should return Array but instead it returned [".concat(typeof generatorResult, "]"));
        if (Array.isArray(generatorResult)) {
            horizontalPoints = generatorResult;
        }
    }
    // No vertical points are specified
    if ((!verticalPoints || !verticalPoints.length) && typeof verticalCoordinatesGenerator === 'function') {
        var isVerticalValues = verticalValues && verticalValues.length;
        var _generatorResult = verticalCoordinatesGenerator({
            xAxis: xAxis ? _objectSpread(_objectSpread({}, xAxis), {}, {
                ticks: isVerticalValues ? verticalValues : xAxis.ticks
            }) : undefined,
            width: chartWidth !== null && chartWidth !== void 0 ? chartWidth : width,
            height: chartHeight !== null && chartHeight !== void 0 ? chartHeight : height,
            offset
        }, isVerticalValues ? true : syncWithTicks);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$LogUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warn"])(Array.isArray(_generatorResult), "verticalCoordinatesGenerator should return Array but instead it returned [".concat(typeof _generatorResult, "]"));
        if (Array.isArray(_generatorResult)) {
            verticalPoints = _generatorResult;
        }
    }
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$ZIndexLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZIndexLayer"], {
        zIndex: propsIncludingDefaults.zIndex
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("g", {
        className: "recharts-cartesian-grid"
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](Background, {
        fill: (_propsIncludingDefaul5 = propsIncludingDefaults.fill) !== null && _propsIncludingDefaul5 !== void 0 ? _propsIncludingDefaul5 : theme.grid.fill,
        fillOpacity: (_propsIncludingDefaul6 = propsIncludingDefaults.fillOpacity) !== null && _propsIncludingDefaul6 !== void 0 ? _propsIncludingDefaul6 : theme.grid.fillOpacity,
        x: propsIncludingDefaults.x,
        y: propsIncludingDefaults.y,
        width: propsIncludingDefaults.width,
        height: propsIncludingDefaults.height,
        ry: propsIncludingDefaults.ry
    }), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](HorizontalStripes, _extends({}, propsIncludingDefaults, {
        horizontalPoints: horizontalPoints
    })), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](VerticalStripes, _extends({}, propsIncludingDefaults, {
        verticalPoints: verticalPoints
    })), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](HorizontalGridLines, _extends({}, propsIncludingDefaults, themeProps, {
        offset: offset,
        horizontalPoints: horizontalPoints,
        xAxis: xAxis,
        yAxis: yAxis
    })), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](VerticalGridLines, _extends({}, propsIncludingDefaults, themeProps, {
        offset: offset,
        verticalPoints: verticalPoints,
        xAxis: xAxis,
        yAxis: yAxis
    }))));
}
CartesianGrid.displayName = 'CartesianGrid';
}),
"[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/GraphicalItemClipPath.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GraphicalItemClipPath",
    ()=>GraphicalItemClipPath,
    "useNeedsClip",
    ()=>useNeedsClip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.3_@babel+core@7.2_88418e4aaf92e4db3a40b2e1891787a4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/hooks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/selectors/axisSelectors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/hooks.js [app-client] (ecmascript)");
;
;
;
;
function useNeedsClip(xAxisId, yAxisId) {
    var _xAxis$allowDataOverf, _yAxis$allowDataOverf;
    var xAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "useNeedsClip.useAppSelector[xAxis]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectXAxisSettings"])(state, xAxisId)
    }["useNeedsClip.useAppSelector[xAxis]"]);
    var yAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "useNeedsClip.useAppSelector[yAxis]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectYAxisSettings"])(state, yAxisId)
    }["useNeedsClip.useAppSelector[yAxis]"]);
    var needClipX = (_xAxis$allowDataOverf = xAxis === null || xAxis === void 0 ? void 0 : xAxis.allowDataOverflow) !== null && _xAxis$allowDataOverf !== void 0 ? _xAxis$allowDataOverf : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].allowDataOverflow;
    var needClipY = (_yAxis$allowDataOverf = yAxis === null || yAxis === void 0 ? void 0 : yAxis.allowDataOverflow) !== null && _yAxis$allowDataOverf !== void 0 ? _yAxis$allowDataOverf : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].allowDataOverflow;
    var needClip = needClipX || needClipY;
    return {
        needClip,
        needClipX,
        needClipY
    };
}
function GraphicalItemClipPath(_ref) {
    var xAxisId = _ref.xAxisId, yAxisId = _ref.yAxisId, clipPathId = _ref.clipPathId;
    var plotArea = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlotArea"])();
    var _useNeedsClip = useNeedsClip(xAxisId, yAxisId), needClipX = _useNeedsClip.needClipX, needClipY = _useNeedsClip.needClipY, needClip = _useNeedsClip.needClip;
    var xAxisRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "GraphicalItemClipPath.useAppSelector[xAxisRange]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectXAxisRange"])(state, xAxisId, false)
    }["GraphicalItemClipPath.useAppSelector[xAxisRange]"]);
    var yAxisRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "GraphicalItemClipPath.useAppSelector[yAxisRange]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectYAxisRange"])(state, yAxisId, false)
    }["GraphicalItemClipPath.useAppSelector[yAxisRange]"]);
    if (!needClip || !plotArea) {
        return null;
    }
    var x = plotArea.x, y = plotArea.y, width = plotArea.width, height = plotArea.height;
    var clipX = needClipX && xAxisRange ? Math.min(xAxisRange[0], xAxisRange[1]) : x - width / 2;
    var clipY = needClipY && yAxisRange ? Math.min(yAxisRange[0], yAxisRange[1]) : y - height / 2;
    var clipWidth = needClipX && xAxisRange ? Math.abs(xAxisRange[1] - xAxisRange[0]) : width * 2;
    var clipHeight = needClipY && yAxisRange ? Math.abs(yAxisRange[1] - yAxisRange[0]) : height * 2;
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("clipPath", {
        id: "clipPath-".concat(clipPathId)
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("rect", {
        x: clipX,
        y: clipY,
        width: clipWidth,
        height: clipHeight
    }));
}
}),
"[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/Line.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Line",
    ()=>Line,
    "computeLinePoints",
    ()=>computeLinePoints,
    "defaultLineProps",
    ()=>defaultLineProps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.3_@babel+core@7.2_88418e4aaf92e4db3a40b2e1891787a4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$container$2f$Layer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/container/Layer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$LineDrawShape$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/LineDrawShape.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$useAnimatedLineLength$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/useAnimatedLineLength.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$LabelList$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/component/LabelList.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Dots$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/component/Dots.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/DataUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ReactUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/ReactUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ChartUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/ChartUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ActivePoints$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/component/ActivePoints.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$SetTooltipEntrySettings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/SetTooltipEntrySettings.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$ErrorBarContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/context/ErrorBarContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$GraphicalItemClipPath$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/GraphicalItemClipPath.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$chartLayoutContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/context/chartLayoutContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$PanoramaContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/context/PanoramaContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$lineSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/selectors/lineSelectors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/hooks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$SetLegendPayload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/SetLegendPayload.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$animation$2f$AnimatedItems$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/animation/AnimatedItems.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$animation$2f$matchBy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/animation/matchBy.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$resolveDefaultProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/resolveDefaultProps.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/hooks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$RegisterGraphicalItemId$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/context/RegisterGraphicalItemId.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$SetGraphicalItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/SetGraphicalItem.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$svgPropertiesNoEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/svgPropertiesNoEvents.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$svgPropertiesAndEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/svgPropertiesAndEvents.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$getRadiusAndStrokeWidthFromDot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/getRadiusAndStrokeWidthFromDot.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ActiveShapeUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/ActiveShapeUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$ZIndexLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/zIndex/ZIndexLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$DefaultZIndexes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/zIndex/DefaultZIndexes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$propsAreEqual$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/propsAreEqual.js [app-client] (ecmascript)");
var _excluded = [
    "id"
], _excluded2 = [
    "type",
    "layout",
    "connectNulls",
    "needClip",
    "shape",
    "strokeDasharray"
], _excluded3 = [
    "activeDot",
    "animateNewValues",
    "animationBegin",
    "animationDuration",
    "animationEasing",
    "connectNulls",
    "dot",
    "hide",
    "isAnimationActive",
    "label",
    "legendType",
    "xAxisId",
    "yAxisId",
    "id"
];
function _extends() {
    return _extends = ("TURBOPACK compile-time truthy", 1) ? Object.assign.bind() : "TURBOPACK unreachable", _extends.apply(null, arguments);
}
function _objectWithoutProperties(e, t) {
    if (null == e) return {};
    var o, r, i = _objectWithoutPropertiesLoose(e, t);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        for(r = 0; r < n.length; r++)o = n[r], -1 === t.indexOf(o) && ({}).propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
    }
    return i;
}
function _objectWithoutPropertiesLoose(r, e) {
    if (null == r) return {};
    var t = {};
    for(var n in r)if (({}).hasOwnProperty.call(r, n)) {
        if (-1 !== e.indexOf(n)) continue;
        t[n] = r[n];
    }
    return t;
}
function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r) {
            return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
    }
    return t;
}
function _objectSpread(e) {
    for(var r = 1; r < arguments.length; r++){
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
            _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
    }
    return e;
}
function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[r] = t, e;
}
function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
/**
 * Internal props, combination of external props + defaultProps + private Recharts state
 */ /**
 * External props, intended for end users to fill in
 */ function getTotalLength(mainCurve) {
    try {
        return mainCurve && mainCurve.getTotalLength && mainCurve.getTotalLength() || 0;
    } catch (_unused) {
        return 0;
    }
}
/**
 * Compute the average x-shift between matched pairs (prev → next).
 * This tells us the overall direction and magnitude of the data movement.
 */ function averageShift(items) {
    var total = 0;
    var count = 0;
    for (var item of items){
        if (item.status === 'matched' && item.prev.x != null && item.next.x != null) {
            total += item.next.x - item.prev.x;
            count++;
        }
    }
    return count > 0 ? total / count : 0;
}
var defaultLineAnimateItems = (items, animationElapsedTime)=>{
    if (items == null) {
        // First render: return empty, stroke-dasharray handles the reveal
        return [];
    }
    // At animationElapsedTime=1 return only the non-removed items
    if (animationElapsedTime === 1) return items.flatMap((item)=>item.status === 'removed' ? [] : [
            item.next
        ]);
    var shift = averageShift(items);
    var result = [];
    for (var item of items){
        if (item.status === 'matched') {
            result.push(_objectSpread(_objectSpread({}, item.next), {}, {
                x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["interpolate"])(item.prev.x, item.next.x, animationElapsedTime),
                y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["interpolate"])(item.prev.y, item.next.y, animationElapsedTime)
            }));
        } else if (item.status === 'added') {
            if (item.next.x != null) {
                // Extrapolate entry position: the point starts where it "would have been"
                var entryX = item.next.x - shift;
                result.push(_objectSpread(_objectSpread({}, item.next), {}, {
                    x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["interpolate"])(entryX, item.next.x, animationElapsedTime),
                    y: item.next.y
                }));
            } else {
                result.push(item.next);
            }
        } else if (item.status === 'removed') {
            if (item.prev.x != null) {
                var exitX = item.prev.x + shift;
                result.push(_objectSpread(_objectSpread({}, item.prev), {}, {
                    x: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["interpolate"])(item.prev.x, exitX, animationElapsedTime),
                    y: item.prev.y
                }));
            }
        // else: removed items are simply dropped
        }
    }
    return result;
};
var defaultLineProps = {
    activeDot: true,
    animateNewValues: true,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease',
    animationInterpolateFn: defaultLineAnimateItems,
    animationMatchBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$animation$2f$matchBy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["matchByIndex"],
    connectNulls: false,
    dot: true,
    fill: '#fff',
    hide: false,
    isAnimationActive: 'auto',
    label: false,
    legendType: 'line',
    shape: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$LineDrawShape$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LineDrawShape"],
    stroke: '#3182bd',
    strokeWidth: 1,
    xAxisId: 0,
    yAxisId: 0,
    zIndex: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$DefaultZIndexes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DefaultZIndexes"].line,
    type: 'linear'
};
/**
 * Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
 */ var computeLegendPayloadFromAreaData = (props)=>{
    var dataKey = props.dataKey, name = props.name, stroke = props.stroke, legendType = props.legendType, hide = props.hide;
    return [
        {
            inactive: hide,
            dataKey,
            type: legendType,
            color: stroke,
            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ChartUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTooltipNameProp"])(name, dataKey),
            payload: props
        }
    ];
};
var SetLineTooltipEntrySettings = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"]((_ref)=>{
    var dataKey = _ref.dataKey, data = _ref.data, stroke = _ref.stroke, strokeWidth = _ref.strokeWidth, fill = _ref.fill, name = _ref.name, hide = _ref.hide, unit = _ref.unit, formatter = _ref.formatter, tooltipType = _ref.tooltipType, id = _ref.id;
    var tooltipEntrySettings = {
        dataDefinedOnItem: data,
        getPosition: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"],
        settings: {
            stroke,
            strokeWidth,
            fill,
            dataKey,
            nameKey: undefined,
            name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ChartUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTooltipNameProp"])(name, dataKey),
            hide,
            type: tooltipType,
            color: stroke,
            unit,
            formatter,
            graphicalItemId: id
        }
    };
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$SetTooltipEntrySettings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SetTooltipEntrySettings"], {
        tooltipEntrySettings: tooltipEntrySettings
    });
});
function LineDotsWrapper(_ref2) {
    var clipPathId = _ref2.clipPathId, points = _ref2.points, props = _ref2.props;
    var dot = props.dot, dataKey = props.dataKey, needClip = props.needClip;
    /*
   * Exclude ID from the props passed to the Dots component
   * because then the ID would be applied to multiple dots, and it would no longer be unique.
   */ var id = props.id, propsWithoutId = _objectWithoutProperties(props, _excluded);
    var lineProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$svgPropertiesNoEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svgPropertiesNoEvents"])(propsWithoutId);
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Dots$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dots"], {
        points: points,
        dot: dot,
        className: "recharts-line-dots",
        dotClassName: "recharts-line-dot",
        dataKey: dataKey,
        baseProps: lineProps,
        needClip: needClip,
        clipPathId: clipPathId
    });
}
function LineLabelListProvider(_ref3) {
    var showLabels = _ref3.showLabels, children = _ref3.children, points = _ref3.points;
    var labelListEntries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LineLabelListProvider.useMemo[labelListEntries]": ()=>{
            return points === null || points === void 0 ? void 0 : points.map({
                "LineLabelListProvider.useMemo[labelListEntries]": (point)=>{
                    var _point$x, _point$y;
                    var viewBox = {
                        x: (_point$x = point.x) !== null && _point$x !== void 0 ? _point$x : 0,
                        y: (_point$y = point.y) !== null && _point$y !== void 0 ? _point$y : 0,
                        width: 0,
                        lowerWidth: 0,
                        upperWidth: 0,
                        height: 0
                    };
                    return _objectSpread(_objectSpread({}, viewBox), {}, {
                        value: point.value,
                        payload: point.payload,
                        viewBox,
                        /*
         * Line is not passing parentViewBox to the LabelList so the labels can escape - looks like a bug, should we pass parentViewBox?
         * Or should this just be the root chart viewBox?
         */ parentViewBox: undefined,
                        fill: undefined
                    });
                }
            }["LineLabelListProvider.useMemo[labelListEntries]"]);
        }
    }["LineLabelListProvider.useMemo[labelListEntries]"], [
        points
    ]);
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$LabelList$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianLabelListContextProvider"], {
        value: showLabels ? labelListEntries : undefined
    }, children);
}
function StaticCurve(_ref4) {
    var clipPathId = _ref4.clipPathId, pathRef = _ref4.pathRef, points = _ref4.points, props = _ref4.props, animationElapsedTime = _ref4.animationElapsedTime, isAnimating = _ref4.isAnimating, isEntrance = _ref4.isEntrance, visibleLength = _ref4.visibleLength;
    var type = props.type, layout = props.layout, connectNulls = props.connectNulls, needClip = props.needClip, shape = props.shape, strokeDasharray = props.strokeDasharray, others = _objectWithoutProperties(props, _excluded2);
    var curveProps = _objectSpread(_objectSpread({}, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$svgPropertiesAndEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svgPropertiesAndEvents"])(others)), {}, {
        fill: 'none',
        className: 'recharts-line-curve',
        clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : undefined,
        points,
        type,
        layout,
        connectNulls,
        strokeDasharray: strokeDasharray !== null && strokeDasharray !== void 0 ? strokeDasharray : props.strokeDasharray,
        pathRef,
        animationElapsedTime,
        isAnimating,
        isEntrance: props.animateNewValues ? isEntrance : false,
        visibleLength
    });
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], null, (points === null || points === void 0 ? void 0 : points.length) > 1 && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ActiveShapeUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Shape"], {
        option: shape,
        DefaultShape: defaultLineProps.shape,
        shapeProps: curveProps
    }), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](LineDotsWrapper, {
        points: points,
        clipPathId: clipPathId,
        props: props
    }));
}
function CurveWithAnimation(_ref5) {
    var clipPathId = _ref5.clipPathId, props = _ref5.props, pathRef = _ref5.pathRef, previousPointsRef = _ref5.previousPointsRef;
    var points = props.points, isAnimationActive = props.isAnimationActive, animationBegin = props.animationBegin, animationDuration = props.animationDuration, animationEasing = props.animationEasing, animationMatchBy = props.animationMatchBy, animationInterpolateFn = props.animationInterpolateFn, layout = props.layout;
    var totalLength = getTotalLength(pathRef.current);
    var _useAnimationCallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$animation$2f$AnimatedItems$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnimationCallbacks"])(props.onAnimationStart, props.onAnimationEnd), isAnimating = _useAnimationCallback.isAnimating, handleAnimationStart = _useAnimationCallback.handleAnimationStart, handleAnimationEnd = _useAnimationCallback.handleAnimationEnd;
    var showLabels = !isAnimating;
    var getVisibleLength = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$useAnimatedLineLength$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnimatedLineLength"])(points);
    // Guard for totalLength: don't update previousPointsRef before SVG path is measured
    var shouldUpdatePreviousRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CurveWithAnimation.useCallback[shouldUpdatePreviousRef]": (animationElapsedTime)=>animationElapsedTime > 0 && totalLength > 0
    }["CurveWithAnimation.useCallback[shouldUpdatePreviousRef]"], [
        totalLength
    ]);
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](LineLabelListProvider, {
        points: points,
        showLabels: showLabels
    }, props.children, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$animation$2f$AnimatedItems$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatedItems"], {
        animationInput: points,
        animationIdPrefix: "recharts-line-",
        items: points,
        previousItemsRef: previousPointsRef,
        isAnimationActive: isAnimationActive,
        animationBegin: animationBegin,
        animationDuration: animationDuration,
        animationEasing: animationEasing,
        onAnimationStart: handleAnimationStart,
        onAnimationEnd: handleAnimationEnd,
        animationInterpolateFn: animationInterpolateFn,
        animationMatchBy: animationMatchBy,
        shouldUpdatePreviousRef: shouldUpdatePreviousRef,
        layout: layout
    }, (stepData, animationElapsedTime, isEntrance)=>{
        var animationActive = isAnimating || animationElapsedTime < 1;
        var visibleLength = animationActive ? getVisibleLength(animationElapsedTime, totalLength) : null;
        return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](StaticCurve, {
            props: props,
            points: stepData,
            clipPathId: clipPathId,
            pathRef: pathRef,
            animationElapsedTime: animationElapsedTime,
            isAnimating: animationActive,
            isEntrance: isEntrance,
            visibleLength: visibleLength
        });
    }), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$LabelList$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LabelListFromLabelProp"], {
        label: props.label
    }));
}
function RenderCurve(_ref6) {
    var clipPathId = _ref6.clipPathId, props = _ref6.props;
    var previousPointsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var pathRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](CurveWithAnimation, {
        props: props,
        clipPathId: clipPathId,
        previousPointsRef: previousPointsRef,
        pathRef: pathRef
    });
}
var errorBarDataPointFormatter = (dataPoint, dataKey)=>{
    var _dataPoint$x, _dataPoint$y;
    return {
        x: (_dataPoint$x = dataPoint.x) !== null && _dataPoint$x !== void 0 ? _dataPoint$x : undefined,
        y: (_dataPoint$y = dataPoint.y) !== null && _dataPoint$y !== void 0 ? _dataPoint$y : undefined,
        value: dataPoint.value,
        // getValueByDataKey does not validate the output type
        errorVal: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ChartUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getValueByDataKey"])(dataPoint.payload, dataKey)
    };
};
// eslint-disable-next-line react/prefer-stateless-function
class LineWithState extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Component"] {
    render() {
        var _this$props = this.props, hide = _this$props.hide, dot = _this$props.dot, points = _this$props.points, className = _this$props.className, xAxisId = _this$props.xAxisId, yAxisId = _this$props.yAxisId, top = _this$props.top, left = _this$props.left, width = _this$props.width, height = _this$props.height, id = _this$props.id, needClip = _this$props.needClip, zIndex = _this$props.zIndex;
        if (hide) {
            return null;
        }
        var layerClass = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])('recharts-line', className);
        var clipPathId = id;
        var _getRadiusAndStrokeWi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$getRadiusAndStrokeWidthFromDot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRadiusAndStrokeWidthFromDot"])(dot), r = _getRadiusAndStrokeWi.r, strokeWidth = _getRadiusAndStrokeWi.strokeWidth;
        var clipDot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ReactUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isClipDot"])(dot);
        var dotSize = r * 2 + strokeWidth;
        var activePointsClipPath = needClip ? "url(#clipPath-".concat(clipDot ? '' : 'dots-').concat(clipPathId, ")") : undefined;
        return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$ZIndexLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZIndexLayer"], {
            zIndex: zIndex
        }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$container$2f$Layer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Layer"], {
            className: layerClass
        }, needClip && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("defs", null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$GraphicalItemClipPath$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GraphicalItemClipPath"], {
            clipPathId: clipPathId,
            xAxisId: xAxisId,
            yAxisId: yAxisId
        }), !clipDot && /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("clipPath", {
            id: "clipPath-dots-".concat(clipPathId)
        }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("rect", {
            x: left - dotSize / 2,
            y: top - dotSize / 2,
            width: width + dotSize,
            height: height + dotSize
        }))), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$ErrorBarContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SetErrorBarContext"], {
            xAxisId: xAxisId,
            yAxisId: yAxisId,
            data: points,
            dataPointFormatter: errorBarDataPointFormatter,
            errorBarOffset: 0
        }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](RenderCurve, {
            props: this.props,
            clipPathId: clipPathId
        }))), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ActivePoints$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActivePoints"], {
            activeDot: this.props.activeDot,
            points: points,
            mainColor: this.props.stroke,
            itemDataKey: this.props.dataKey,
            clipPath: activePointsClipPath
        }));
    }
}
function LineImpl(props) {
    var _resolveDefaultProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$resolveDefaultProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveDefaultProps"])(props, defaultLineProps), activeDot = _resolveDefaultProps.activeDot, animateNewValues = _resolveDefaultProps.animateNewValues, animationBegin = _resolveDefaultProps.animationBegin, animationDuration = _resolveDefaultProps.animationDuration, animationEasing = _resolveDefaultProps.animationEasing, connectNulls = _resolveDefaultProps.connectNulls, dot = _resolveDefaultProps.dot, hide = _resolveDefaultProps.hide, isAnimationActive = _resolveDefaultProps.isAnimationActive, label = _resolveDefaultProps.label, legendType = _resolveDefaultProps.legendType, xAxisId = _resolveDefaultProps.xAxisId, yAxisId = _resolveDefaultProps.yAxisId, id = _resolveDefaultProps.id, everythingElse = _objectWithoutProperties(_resolveDefaultProps, _excluded3);
    var _useNeedsClip = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$GraphicalItemClipPath$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNeedsClip"])(xAxisId, yAxisId), needClip = _useNeedsClip.needClip;
    var plotArea = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePlotArea"])();
    var layout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$chartLayoutContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useChartLayout"])();
    var isPanorama = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$PanoramaContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsPanorama"])();
    var points = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "LineImpl.useAppSelector[points]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$lineSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectLinePoints"])(state, xAxisId, yAxisId, isPanorama, id)
    }["LineImpl.useAppSelector[points]"]);
    if (layout !== 'horizontal' && layout !== 'vertical' || points == null || plotArea == null) {
        // Cannot render Line in an unsupported layout
        return null;
    }
    var height = plotArea.height, width = plotArea.width, left = plotArea.x, top = plotArea.y;
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](LineWithState, _extends({}, everythingElse, {
        id: id,
        connectNulls: connectNulls,
        dot: dot,
        activeDot: activeDot,
        animateNewValues: animateNewValues,
        animationBegin: animationBegin,
        animationDuration: animationDuration,
        animationEasing: animationEasing,
        isAnimationActive: isAnimationActive,
        hide: hide,
        label: label,
        legendType: legendType,
        xAxisId: xAxisId,
        yAxisId: yAxisId,
        points: points,
        layout: layout,
        height: height,
        width: width,
        left: left,
        top: top,
        needClip: needClip
    }));
}
function computeLinePoints(_ref7) {
    var layout = _ref7.layout, xAxis = _ref7.xAxis, yAxis = _ref7.yAxis, xAxisTicks = _ref7.xAxisTicks, yAxisTicks = _ref7.yAxisTicks, dataKey = _ref7.dataKey, bandSize = _ref7.bandSize, displayedData = _ref7.displayedData;
    return displayedData.map((entry, index)=>{
        // getValueByDataKey does not validate the output type
        var value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ChartUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getValueByDataKey"])(entry, dataKey);
        if (layout === 'horizontal') {
            var _x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ChartUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCateCoordinateOfLine"])({
                axis: xAxis,
                ticks: xAxisTicks,
                bandSize,
                entry,
                index
            });
            var _y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNullish"])(value) ? null : yAxis.scale.map(value);
            return {
                x: _x,
                y: _y !== null && _y !== void 0 ? _y : null,
                value,
                payload: entry
            };
        }
        var x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNullish"])(value) ? null : xAxis.scale.map(value);
        var y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ChartUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCateCoordinateOfLine"])({
            axis: yAxis,
            ticks: yAxisTicks,
            bandSize,
            entry,
            index
        });
        if (x == null || y == null) {
            return null;
        }
        return {
            x,
            y,
            value,
            payload: entry
        };
    }).filter(Boolean);
}
function LineFn(outsideProps) {
    var props = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$resolveDefaultProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveDefaultProps"])(outsideProps, defaultLineProps);
    var isPanorama = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$PanoramaContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsPanorama"])();
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$RegisterGraphicalItemId$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RegisterGraphicalItemId"], {
        id: props.id,
        type: "line"
    }, (id)=>/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$SetLegendPayload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SetLegendPayload"], {
            legendPayload: computeLegendPayloadFromAreaData(props)
        }), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](SetLineTooltipEntrySettings, {
            dataKey: props.dataKey,
            data: props.data,
            stroke: props.stroke,
            strokeWidth: props.strokeWidth,
            fill: props.fill,
            name: props.name,
            hide: props.hide,
            unit: props.unit,
            formatter: props.formatter,
            tooltipType: props.tooltipType,
            id: id
        }), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$SetGraphicalItem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SetCartesianGraphicalItem"], {
            type: "line",
            id: id,
            data: props.data,
            xAxisId: props.xAxisId,
            yAxisId: props.yAxisId,
            zAxisId: 0,
            dataKey: props.dataKey,
            hide: props.hide,
            isPanorama: isPanorama
        }), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](LineImpl, _extends({}, props, {
            id: id
        }))));
}
var Line = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"](LineFn, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$propsAreEqual$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["propsAreEqual"]);
// @ts-expect-error we need to set the displayName for debugging purposes
Line.displayName = 'Line';
}),
"[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/LineDrawShape.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LineDrawShape",
    ()=>LineDrawShape
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.3_@babel+core@7.2_88418e4aaf92e4db3a40b2e1891787a4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$shape$2f$Curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/shape/Curve.js [app-client] (ecmascript)");
var _excluded = [
    "animationElapsedTime",
    "isAnimating",
    "isEntrance",
    "visibleLength",
    "strokeDasharray",
    "connectNulls"
];
function _extends() {
    return _extends = ("TURBOPACK compile-time truthy", 1) ? Object.assign.bind() : "TURBOPACK unreachable", _extends.apply(null, arguments);
}
function _objectWithoutProperties(e, t) {
    if (null == e) return {};
    var o, r, i = _objectWithoutPropertiesLoose(e, t);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        for(r = 0; r < n.length; r++)o = n[r], -1 === t.indexOf(o) && ({}).propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
    }
    return i;
}
function _objectWithoutPropertiesLoose(r, e) {
    if (null == r) return {};
    var t = {};
    for(var n in r)if (({}).hasOwnProperty.call(r, n)) {
        if (-1 !== e.indexOf(n)) continue;
        t[n] = r[n];
    }
    return t;
}
;
;
/**
 * Reads the total length of an SVG path element, returning 0 if the element
 * is null or the measurement fails (e.g. in JSDOM).
 */ function getTotalLength(path) {
    try {
        return path && path.getTotalLength && path.getTotalLength() || 0;
    } catch (_unused) {
        return 0;
    }
}
/**
 * Generates a simple stroke-dasharray string for animating a line draw effect.
 *
 * Uses `totalLength` as the gap (instead of `totalLength - length`) to prevent a floating-point
 * precision artifact: when fractional dash and gap values are serialized to a string attribute
 * and reparsed by the SVG renderer, their sum can differ from the actual path length by a ULP,
 * causing the dasharray pattern to repeat and render a phantom dot at the path endpoint
 * with round or square strokeLinecap.
 *
 * @param totalLength The total length of the SVG path
 * @param length The currently visible portion of the path
 * @returns A stroke-dasharray string like "50px 200px"
 */ function generateSimpleStrokeDasharray(totalLength, length) {
    return "".concat(length, "px ").concat(totalLength, "px");
}
/**
 * Normalizes a dash pattern to the even-length sequence used by SVG renderers.
 * Odd-length stroke-dasharray values repeat once, so "5" behaves like "5 5".
 *
 * @param lines Array of dash/gap lengths to repeat
 * @returns An even-length dash pattern
 */ function normalizeDashPattern(lines) {
    return lines.length % 2 !== 0 ? [
        ...lines,
        ...lines
    ] : lines;
}
/**
 * Repeats a dash pattern array a given number of times.
 *
 * @param lines Array of dash/gap lengths to repeat
 * @param count Number of times to repeat the pattern
 * @returns A new array with the pattern repeated `count` times
 */ function repeat(lines, count) {
    var result = [];
    for(var i = 0; i < count; ++i){
        result.push(...lines);
    }
    return result;
}
/**
 * Computes a stroke-dasharray string for animating a custom-dashed line draw effect.
 *
 * Given a user-specified dash pattern (e.g. `"7,3"`), this function builds a dasharray
 * that reveals exactly `length` pixels of that pattern, followed by a gap of `totalLength`
 * to hide the remainder of the path.
 *
 * Like {@link generateSimpleStrokeDasharray}, the trailing gap uses `totalLength` rather than
 * `totalLength - length` to avoid floating-point precision artifacts with round/square strokeLinecap.
 *
 * @param length The currently visible portion of the path
 * @param totalLength The total length of the SVG path
 * @param lines The user-specified dash pattern as an array of numbers (e.g. [7, 3])
 * @returns A stroke-dasharray string incorporating the custom dash pattern
 */ function getStrokeDasharray(length, totalLength, lines) {
    var normalizedLines = normalizeDashPattern(lines);
    var lineLength = normalizedLines.reduce((pre, next)=>pre + next, 0);
    // if lineLength is 0 return the default when no strokeDasharray is provided
    if (!lineLength) {
        return generateSimpleStrokeDasharray(totalLength, length);
    }
    var count = Math.floor(length / lineLength);
    var remainLength = length % lineLength;
    var remainLines = [];
    for(var i = 0, sum = 0; i < normalizedLines.length; sum += (_normalizedLines$i = normalizedLines[i]) !== null && _normalizedLines$i !== void 0 ? _normalizedLines$i : 0, ++i){
        var _normalizedLines$i;
        var lineValue = normalizedLines[i];
        if (lineValue != null && sum + lineValue > remainLength) {
            remainLines = [
                ...normalizedLines.slice(0, i),
                remainLength - sum
            ];
            break;
        }
    }
    var emptyLines = remainLines.length % 2 === 0 ? [
        0,
        totalLength
    ] : [
        totalLength
    ];
    return [
        ...repeat(normalizedLines, count),
        ...remainLines,
        ...emptyLines
    ].map((line)=>"".concat(line, "px")).join(', ');
}
/**
 * Computes the animated stroke-dasharray for a line's entrance animation.
 *
 * @param userStrokeDasharray The user-specified stroke-dasharray (e.g. "5,3"), if any
 * @param totalLength Total SVG path length
 * @param visibleLength How much of the path should be visible
 * @returns A stroke-dasharray string for the current animation frame
 */ function computeAnimatedStrokeDasharray(userStrokeDasharray, totalLength, visibleLength) {
    if (userStrokeDasharray) {
        var lines = "".concat(userStrokeDasharray).split(/[,\s]+/gim).map((num)=>parseFloat(num));
        return getStrokeDasharray(visibleLength, totalLength, lines);
    }
    return generateSimpleStrokeDasharray(totalLength, visibleLength);
}
function LineDrawShape(props) {
    var _animationElapsedTime = props.animationElapsedTime, isAnimating = props.isAnimating, isEntrance = props.isEntrance, visibleLength = props.visibleLength, userStrokeDasharray = props.strokeDasharray, connectNulls = props.connectNulls, curveProps = _objectWithoutProperties(props, _excluded);
    var finalConnectNulls = connectNulls !== null && connectNulls !== void 0 ? connectNulls : false;
    var strokeDasharray;
    if (visibleLength != null) {
        var _pathRef$current;
        var pathRef = curveProps.pathRef;
        var totalLength = getTotalLength((_pathRef$current = pathRef === null || pathRef === void 0 ? void 0 : pathRef.current) !== null && _pathRef$current !== void 0 ? _pathRef$current : null);
        strokeDasharray = computeAnimatedStrokeDasharray(userStrokeDasharray, totalLength, visibleLength);
    } else if (userStrokeDasharray != null) {
        strokeDasharray = String(userStrokeDasharray);
    }
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$shape$2f$Curve$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Curve"], _extends({}, curveProps, {
        connectNulls: finalConnectNulls,
        strokeDasharray: strokeDasharray
    }));
}
}),
"[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/ReferenceLine.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReferenceLine",
    ()=>ReferenceLine,
    "getEndPoints",
    ()=>getEndPoints,
    "referenceLineDefaultProps",
    ()=>referenceLineDefaultProps
]);
/**
 * @fileOverview Reference Line
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.3_@babel+core@7.2_88418e4aaf92e4db3a40b2e1891787a4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$container$2f$Layer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/container/Layer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Label$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/component/Label.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/DataUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$CartesianUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/CartesianUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$chartLayoutContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/context/chartLayoutContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$referenceElementsSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/referenceElementsSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/hooks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/selectors/axisSelectors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$PanoramaContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/context/PanoramaContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$container$2f$ClipPathProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/container/ClipPathProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$svgPropertiesAndEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/svgPropertiesAndEvents.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$resolveDefaultProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/resolveDefaultProps.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$ZIndexLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/zIndex/ZIndexLayer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$DefaultZIndexes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/zIndex/DefaultZIndexes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$isWellBehavedNumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/isWellBehavedNumber.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$scale$2f$CartesianScaleHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/scale/CartesianScaleHelper.js [app-client] (ecmascript)");
function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r) {
            return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
    }
    return t;
}
function _objectSpread(e) {
    for(var r = 1; r < arguments.length; r++){
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
            _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
    }
    return e;
}
function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[r] = t, e;
}
function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
function _extends() {
    return _extends = ("TURBOPACK compile-time truthy", 1) ? Object.assign.bind() : "TURBOPACK unreachable", _extends.apply(null, arguments);
}
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
/**
 * Single point that defines one end of a segment.
 * These coordinates are in data space, meaning that you should provide
 * values that correspond to the data domain of the axes.
 * So you would provide a value of `Page A` to indicate the data value `Page A`
 * and then recharts will convert that to pixels.
 *
 * Likewise for numbers. If your x-axis goes from 0 to 100,
 * and you want the line to end at 50, you would provide `50` here.
 *
 * @inline
 */ /**
 * This excludes `viewBox` prop from svg for two reasons:
 * 1. The components wants viewBox of object type, and svg wants string
 *    - so there's a conflict, and the component will throw if it gets string
 * 2. Internally the component calls `svgPropertiesNoEvents` which filters the viewBox away anyway
 */ var renderLine = (option, props)=>{
    var line;
    if (/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](option)) {
        // @ts-expect-error element cloning is not typed
        line = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"](option, props);
    } else if (typeof option === 'function') {
        line = option(props);
    } else {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$isWellBehavedNumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWellBehavedNumber"])(props.x1) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$isWellBehavedNumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWellBehavedNumber"])(props.y1) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$isWellBehavedNumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWellBehavedNumber"])(props.x2) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$isWellBehavedNumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWellBehavedNumber"])(props.y2)) {
            return null;
        }
        line = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("line", _extends({}, props, {
            className: "recharts-reference-line-line"
        }));
    }
    return line;
};
var getHorizontalLineEndPoints = (yCoord, ifOverflow, position, yAxisOrientation, yAxisScale, viewBox)=>{
    var x = viewBox.x, width = viewBox.width;
    var coord = yAxisScale.map(yCoord, {
        position
    });
    // don't render the line if the scale can't compute a result that makes sense
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$isWellBehavedNumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWellBehavedNumber"])(coord)) {
        return null;
    }
    if (ifOverflow === 'discard' && !yAxisScale.isInRange(coord)) {
        return null;
    }
    var points = [
        {
            x: x + width,
            y: coord
        },
        {
            x,
            y: coord
        }
    ];
    return yAxisOrientation === 'left' ? points.reverse() : points;
};
var getVerticalLineEndPoints = (xCoord, ifOverflow, position, xAxisOrientation, xAxisScale, viewBox)=>{
    var y = viewBox.y, height = viewBox.height;
    var coord = xAxisScale.map(xCoord, {
        position
    });
    // don't render the line if the scale can't compute a result that makes sense
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$isWellBehavedNumber$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWellBehavedNumber"])(coord)) {
        return null;
    }
    if (ifOverflow === 'discard' && !xAxisScale.isInRange(coord)) {
        return null;
    }
    var points = [
        {
            x: coord,
            y: y + height
        },
        {
            x: coord,
            y
        }
    ];
    return xAxisOrientation === 'top' ? points.reverse() : points;
};
var getSegmentLineEndPoints = (segment, ifOverflow, position, scales)=>{
    var points = [
        scales.mapWithFallback(segment[0], {
            position,
            fallback: 'rangeMin'
        }),
        scales.mapWithFallback(segment[1], {
            position,
            fallback: 'rangeMax'
        })
    ];
    if (ifOverflow === 'discard' && points.some((p)=>!scales.isInRange(p))) {
        return null;
    }
    return points;
};
var getEndPoints = (xAxisScale, yAxisScale, viewBox, position, xAxisOrientation, yAxisOrientation, props)=>{
    var xCoord = props.x, yCoord = props.y, segment = props.segment, ifOverflow = props.ifOverflow;
    var isFixedX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumOrStr"])(xCoord);
    var isFixedY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumOrStr"])(yCoord);
    if (isFixedY) {
        return getHorizontalLineEndPoints(yCoord, ifOverflow, position, yAxisOrientation, yAxisScale, viewBox);
    }
    if (isFixedX) {
        return getVerticalLineEndPoints(xCoord, ifOverflow, position, xAxisOrientation, xAxisScale, viewBox);
    }
    if (segment != null && segment.length === 2) {
        return getSegmentLineEndPoints(segment, ifOverflow, position, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$scale$2f$CartesianScaleHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianScaleHelperImpl"]({
            x: xAxisScale,
            y: yAxisScale
        }));
    }
    return null;
};
function ReportReferenceLine(props) {
    var dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ReportReferenceLine.useEffect": ()=>{
            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$referenceElementsSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addLine"])(props));
            return ({
                "ReportReferenceLine.useEffect": ()=>{
                    dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$referenceElementsSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeLine"])(props));
                }
            })["ReportReferenceLine.useEffect"];
        }
    }["ReportReferenceLine.useEffect"]);
    return null;
}
function ReferenceLineImpl(props) {
    var xAxisId = props.xAxisId, yAxisId = props.yAxisId, shape = props.shape, className = props.className, ifOverflow = props.ifOverflow;
    var isPanorama = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$PanoramaContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsPanorama"])();
    var clipPathId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$container$2f$ClipPathProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClipPathId"])();
    var xAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "ReferenceLineImpl.useAppSelector[xAxis]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectXAxisSettings"])(state, xAxisId)
    }["ReferenceLineImpl.useAppSelector[xAxis]"]);
    var yAxis = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "ReferenceLineImpl.useAppSelector[yAxis]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectYAxisSettings"])(state, yAxisId)
    }["ReferenceLineImpl.useAppSelector[yAxis]"]);
    var xAxisScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "ReferenceLineImpl.useAppSelector[xAxisScale]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectAxisScale"])(state, 'xAxis', xAxisId, isPanorama)
    }["ReferenceLineImpl.useAppSelector[xAxisScale]"]);
    var yAxisScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "ReferenceLineImpl.useAppSelector[yAxisScale]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectAxisScale"])(state, 'yAxis', yAxisId, isPanorama)
    }["ReferenceLineImpl.useAppSelector[yAxisScale]"]);
    var viewBox = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$chartLayoutContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useViewBox"])();
    if (!clipPathId || !viewBox || xAxis == null || yAxis == null || xAxisScale == null || yAxisScale == null) {
        return null;
    }
    var endPoints = getEndPoints(xAxisScale, yAxisScale, viewBox, props.position, xAxis.orientation, yAxis.orientation, props);
    if (!endPoints) {
        return null;
    }
    var point1 = endPoints[0];
    var point2 = endPoints[1];
    if (point1 == null || point2 == null) {
        return null;
    }
    var x1 = point1.x, y1 = point1.y;
    var x2 = point2.x, y2 = point2.y;
    var clipPath = ifOverflow === 'hidden' ? "url(#".concat(clipPathId, ")") : undefined;
    var lineProps = _objectSpread(_objectSpread({
        clipPath
    }, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$svgPropertiesAndEvents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["svgPropertiesAndEvents"])(props)), {}, {
        x1,
        y1,
        x2,
        y2
    });
    var rect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$CartesianUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rectWithCoords"])({
        x1,
        y1,
        x2,
        y2
    });
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$ZIndexLayer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZIndexLayer"], {
        zIndex: props.zIndex
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$container$2f$Layer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Layer"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])('recharts-reference-line', className)
    }, renderLine(shape, lineProps), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Label$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianLabelContextProvider"], _extends({}, rect, {
        lowerWidth: rect.width,
        upperWidth: rect.width
    }), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Label$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianLabelFromLabelProp"], {
        label: props.label
    }), props.children)));
}
var referenceLineDefaultProps = {
    ifOverflow: 'discard',
    xAxisId: 0,
    yAxisId: 0,
    fill: 'none',
    label: false,
    stroke: '#ccc',
    fillOpacity: 1,
    strokeWidth: 1,
    position: 'middle',
    zIndex: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$zIndex$2f$DefaultZIndexes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DefaultZIndexes"].line
};
function ReferenceLine(outsideProps) {
    var props = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$resolveDefaultProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveDefaultProps"])(outsideProps, referenceLineDefaultProps);
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](ReportReferenceLine, {
        yAxisId: props.yAxisId,
        xAxisId: props.xAxisId,
        ifOverflow: props.ifOverflow,
        x: props.x,
        y: props.y,
        segment: props.segment
    }), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](ReferenceLineImpl, props));
}
ReferenceLine.displayName = 'ReferenceLine';
}),
"[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "XAxis",
    ()=>XAxis,
    "xAxisDefaultProps",
    ()=>xAxisDefaultProps
]);
/**
 * @fileOverview X Axis
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.3_@babel+core@7.2_88418e4aaf92e4db3a40b2e1891787a4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/CartesianAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/hooks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$cartesianAxisSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/cartesianAxisSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/selectors/axisSelectors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$selectChartOffsetInternal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/selectors/selectChartOffsetInternal.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$PanoramaContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/context/PanoramaContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Label$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/component/Label.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$resolveDefaultProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/resolveDefaultProps.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$axisPropsAreEqual$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/axisPropsAreEqual.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$chartLayoutContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/context/chartLayoutContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$getAxisTypeBasedOnLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/getAxisTypeBasedOnLayout.js [app-client] (ecmascript)");
var _excluded = [
    "type"
], _excluded2 = [
    "dangerouslySetInnerHTML",
    "ticks",
    "scale"
], _excluded3 = [
    "id",
    "scale"
];
function _extends() {
    return _extends = ("TURBOPACK compile-time truthy", 1) ? Object.assign.bind() : "TURBOPACK unreachable", _extends.apply(null, arguments);
}
function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r) {
            return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
    }
    return t;
}
function _objectSpread(e) {
    for(var r = 1; r < arguments.length; r++){
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
            _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
    }
    return e;
}
function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[r] = t, e;
}
function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
function _objectWithoutProperties(e, t) {
    if (null == e) return {};
    var o, r, i = _objectWithoutPropertiesLoose(e, t);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        for(r = 0; r < n.length; r++)o = n[r], -1 === t.indexOf(o) && ({}).propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
    }
    return i;
}
function _objectWithoutPropertiesLoose(r, e) {
    if (null == r) return {};
    var t = {};
    for(var n in r)if (({}).hasOwnProperty.call(r, n)) {
        if (-1 !== e.indexOf(n)) continue;
        t[n] = r[n];
    }
    return t;
}
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function SetXAxisSettings(props) {
    var dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    var prevSettingsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var layout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$chartLayoutContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartesianChartLayout"])();
    var typeFromProps = props.type, restProps = _objectWithoutProperties(props, _excluded);
    var evaluatedType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$getAxisTypeBasedOnLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAxisTypeBasedOnLayout"])(layout, 'xAxis', typeFromProps);
    var settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SetXAxisSettings.useMemo[settings]": ()=>{
            if (evaluatedType == null) {
                return undefined;
            }
            return _objectSpread(_objectSpread({}, restProps), {}, {
                type: evaluatedType
            });
        }
    }["SetXAxisSettings.useMemo[settings]"], [
        restProps,
        evaluatedType
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "SetXAxisSettings.useLayoutEffect": ()=>{
            if (settings == null) {
                return;
            }
            if (prevSettingsRef.current === null) {
                dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$cartesianAxisSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addXAxis"])(settings));
            } else if (prevSettingsRef.current !== settings) {
                dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$cartesianAxisSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["replaceXAxis"])({
                    prev: prevSettingsRef.current,
                    next: settings
                }));
            }
            prevSettingsRef.current = settings;
        }
    }["SetXAxisSettings.useLayoutEffect"], [
        settings,
        dispatch
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "SetXAxisSettings.useLayoutEffect": ()=>{
            return ({
                "SetXAxisSettings.useLayoutEffect": ()=>{
                    if (prevSettingsRef.current) {
                        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$cartesianAxisSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeXAxis"])(prevSettingsRef.current));
                        prevSettingsRef.current = null;
                    }
                }
            })["SetXAxisSettings.useLayoutEffect"];
        }
    }["SetXAxisSettings.useLayoutEffect"], [
        dispatch
    ]);
    return null;
}
var XAxisImpl = (props)=>{
    var xAxisId = props.xAxisId, className = props.className, height = props.height, label = props.label;
    var cartesianAxisRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var labelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var viewBox = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$selectChartOffsetInternal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectAxisViewBox"]);
    var isPanorama = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$PanoramaContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsPanorama"])();
    var dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    var axisType = 'xAxis';
    var cartesianTickItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "XAxisImpl.useAppSelector[cartesianTickItems]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectTicksOfAxis"])(state, axisType, xAxisId, isPanorama)
    }["XAxisImpl.useAppSelector[cartesianTickItems]"]);
    var axisSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "XAxisImpl.useAppSelector[axisSize]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectXAxisSize"])(state, xAxisId)
    }["XAxisImpl.useAppSelector[axisSize]"]);
    var position = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "XAxisImpl.useAppSelector[position]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectXAxisPosition"])(state, xAxisId)
    }["XAxisImpl.useAppSelector[position]"]);
    /*
   * Here we select settings from the store and prefer to use them instead of the actual props
   * so that the chart is consistent. If we used the props directly, some components will use axis settings
   * from state and some from props and because there is a render step between these two, they might be showing different things.
   * https://github.com/recharts/recharts/issues/6257
   */ var synchronizedSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "XAxisImpl.useAppSelector[synchronizedSettings]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectXAxisSettingsNoDefaults"])(state, xAxisId)
    }["XAxisImpl.useAppSelector[synchronizedSettings]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "XAxisImpl.useLayoutEffect": ()=>{
            // No dynamic height calculation is done when height !== 'auto'
            // or when a function/react element is used for label
            if (height !== 'auto' || !axisSize || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Label$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLabelContentAFunction"])(label) || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"])(label) || synchronizedSettings == null) {
                return;
            }
            var axisComponent = cartesianAxisRef.current;
            if (!axisComponent) {
                return;
            }
            var updatedXAxisHeight = axisComponent.getCalculatedHeight();
            // if the height has changed, dispatch an action to update the height
            if (Math.round(axisSize.height) !== Math.round(updatedXAxisHeight)) {
                dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$cartesianAxisSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateXAxisHeight"])({
                    id: xAxisId,
                    height: updatedXAxisHeight
                }));
            }
        }
    }["XAxisImpl.useLayoutEffect"], [
        // The dependency on cartesianAxisRef.current is not needed because useLayoutEffect will run after every render.
        // The ref will be populated by then.
        // To re-run this effect when ticks change, we can depend on the ticks array from the store.
        cartesianTickItems,
        axisSize,
        dispatch,
        label,
        xAxisId,
        height,
        synchronizedSettings
    ]);
    if (axisSize == null || position == null || synchronizedSettings == null) {
        return null;
    }
    var dangerouslySetInnerHTML = props.dangerouslySetInnerHTML, ticks = props.ticks, del = props.scale, allOtherProps = _objectWithoutProperties(props, _excluded2);
    var id = synchronizedSettings.id, del2 = synchronizedSettings.scale, restSynchronizedSettings = _objectWithoutProperties(synchronizedSettings, _excluded3);
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianAxis"], _extends({}, allOtherProps, restSynchronizedSettings, {
        ref: cartesianAxisRef,
        labelRef: labelRef,
        x: position.x,
        y: position.y,
        width: axisSize.width,
        height: axisSize.height,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])("recharts-".concat(axisType, " ").concat(axisType), className),
        viewBox: viewBox,
        ticks: cartesianTickItems,
        axisType: axisType,
        axisId: xAxisId
    }));
};
var xAxisDefaultProps = {
    allowDataOverflow: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].allowDataOverflow,
    allowDecimals: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].allowDecimals,
    allowDuplicatedCategory: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].allowDuplicatedCategory,
    angle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].angle,
    axisLine: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultCartesianAxisProps"].axisLine,
    height: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].height,
    hide: false,
    includeHidden: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].includeHidden,
    interval: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].interval,
    label: false,
    minTickGap: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].minTickGap,
    mirror: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].mirror,
    orientation: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].orientation,
    padding: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].padding,
    reversed: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].reversed,
    scale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].scale,
    tick: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].tick,
    tickCount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].tickCount,
    tickLine: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultCartesianAxisProps"].tickLine,
    tickSize: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultCartesianAxisProps"].tickSize,
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].type,
    niceTicks: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitXAxis"].niceTicks,
    xAxisId: 0
};
var XAxisSettingsDispatcher = (outsideProps)=>{
    var props = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$resolveDefaultProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveDefaultProps"])(outsideProps, xAxisDefaultProps);
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](SetXAxisSettings, {
        allowDataOverflow: props.allowDataOverflow,
        allowDecimals: props.allowDecimals,
        allowDuplicatedCategory: props.allowDuplicatedCategory,
        angle: props.angle,
        dataKey: props.dataKey,
        domain: props.domain,
        height: props.height,
        hide: props.hide,
        id: props.xAxisId,
        includeHidden: props.includeHidden,
        interval: props.interval,
        minTickGap: props.minTickGap,
        mirror: props.mirror,
        name: props.name,
        orientation: props.orientation,
        padding: props.padding,
        reversed: props.reversed,
        scale: props.scale,
        tick: props.tick,
        tickCount: props.tickCount,
        tickFormatter: props.tickFormatter,
        ticks: props.ticks,
        type: props.type,
        unit: props.unit,
        niceTicks: props.niceTicks
    }), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](XAxisImpl, props));
};
var XAxis = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"](XAxisSettingsDispatcher, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$axisPropsAreEqual$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axisPropsAreEqual"]);
// @ts-expect-error we need to set the displayName for debugging purposes
XAxis.displayName = 'XAxis';
}),
"[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "YAxis",
    ()=>YAxis,
    "yAxisDefaultProps",
    ()=>yAxisDefaultProps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.3_@babel+core@7.2_88418e4aaf92e4db3a40b2e1891787a4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/CartesianAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$cartesianAxisSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/cartesianAxisSlice.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/hooks.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/selectors/axisSelectors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$selectChartOffsetInternal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/state/selectors/selectChartOffsetInternal.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$PanoramaContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/context/PanoramaContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Label$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/component/Label.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$resolveDefaultProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/resolveDefaultProps.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$axisPropsAreEqual$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/axisPropsAreEqual.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$chartLayoutContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/context/chartLayoutContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$getAxisTypeBasedOnLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/getAxisTypeBasedOnLayout.js [app-client] (ecmascript)");
var _excluded = [
    "type"
], _excluded2 = [
    "dangerouslySetInnerHTML",
    "ticks",
    "scale"
], _excluded3 = [
    "id",
    "scale"
];
function _extends() {
    return _extends = ("TURBOPACK compile-time truthy", 1) ? Object.assign.bind() : "TURBOPACK unreachable", _extends.apply(null, arguments);
}
function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r) {
            return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
    }
    return t;
}
function _objectSpread(e) {
    for(var r = 1; r < arguments.length; r++){
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
            _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
    }
    return e;
}
function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[r] = t, e;
}
function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
function _objectWithoutProperties(e, t) {
    if (null == e) return {};
    var o, r, i = _objectWithoutPropertiesLoose(e, t);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(e);
        for(r = 0; r < n.length; r++)o = n[r], -1 === t.indexOf(o) && ({}).propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
    }
    return i;
}
function _objectWithoutPropertiesLoose(r, e) {
    if (null == r) return {};
    var t = {};
    for(var n in r)if (({}).hasOwnProperty.call(r, n)) {
        if (-1 !== e.indexOf(n)) continue;
        t[n] = r[n];
    }
    return t;
}
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function SetYAxisSettings(props) {
    var dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    var prevSettingsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var layout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$chartLayoutContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartesianChartLayout"])();
    var typeFromProps = props.type, restProps = _objectWithoutProperties(props, _excluded);
    var evaluatedType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$getAxisTypeBasedOnLayout$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAxisTypeBasedOnLayout"])(layout, 'yAxis', typeFromProps);
    var settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SetYAxisSettings.useMemo[settings]": ()=>{
            if (evaluatedType == null) {
                return undefined;
            }
            return _objectSpread(_objectSpread({}, restProps), {}, {
                type: evaluatedType
            });
        }
    }["SetYAxisSettings.useMemo[settings]"], [
        evaluatedType,
        restProps
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "SetYAxisSettings.useLayoutEffect": ()=>{
            if (settings == null) {
                return;
            }
            if (prevSettingsRef.current === null) {
                dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$cartesianAxisSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addYAxis"])(settings));
            } else if (prevSettingsRef.current !== settings) {
                dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$cartesianAxisSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["replaceYAxis"])({
                    prev: prevSettingsRef.current,
                    next: settings
                }));
            }
            prevSettingsRef.current = settings;
        }
    }["SetYAxisSettings.useLayoutEffect"], [
        settings,
        dispatch
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "SetYAxisSettings.useLayoutEffect": ()=>{
            return ({
                "SetYAxisSettings.useLayoutEffect": ()=>{
                    if (prevSettingsRef.current) {
                        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$cartesianAxisSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeYAxis"])(prevSettingsRef.current));
                        prevSettingsRef.current = null;
                    }
                }
            })["SetYAxisSettings.useLayoutEffect"];
        }
    }["SetYAxisSettings.useLayoutEffect"], [
        dispatch
    ]);
    return null;
}
function YAxisImpl(props) {
    var yAxisId = props.yAxisId, className = props.className, width = props.width, label = props.label;
    var cartesianAxisRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var labelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var viewBox = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$selectChartOffsetInternal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectAxisViewBox"]);
    var isPanorama = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$context$2f$PanoramaContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsPanorama"])();
    var dispatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppDispatch"])();
    var axisType = 'yAxis';
    var axisSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "YAxisImpl.useAppSelector[axisSize]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectYAxisSize"])(state, yAxisId)
    }["YAxisImpl.useAppSelector[axisSize]"]);
    var position = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "YAxisImpl.useAppSelector[position]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectYAxisPosition"])(state, yAxisId)
    }["YAxisImpl.useAppSelector[position]"]);
    var cartesianTickItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "YAxisImpl.useAppSelector[cartesianTickItems]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectTicksOfAxis"])(state, axisType, yAxisId, isPanorama)
    }["YAxisImpl.useAppSelector[cartesianTickItems]"]);
    /*
   * Here we select settings from the store and prefer to use them instead of the actual props
   * so that the chart is consistent. If we used the props directly, some components will use axis settings
   * from state and some from props and because there is a render step between these two, they might be showing different things.
   * https://github.com/recharts/recharts/issues/6257
   */ var synchronizedSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAppSelector"])({
        "YAxisImpl.useAppSelector[synchronizedSettings]": (state)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["selectYAxisSettingsNoDefaults"])(state, yAxisId)
    }["YAxisImpl.useAppSelector[synchronizedSettings]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "YAxisImpl.useLayoutEffect": ()=>{
            // No dynamic width calculation is done when width !== 'auto'
            // or when a function/react element is used for label
            if (width !== 'auto' || !axisSize || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Label$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLabelContentAFunction"])(label) || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"])(label) || synchronizedSettings == null) {
                return;
            }
            var axisComponent = cartesianAxisRef.current;
            if (!axisComponent) {
                return;
            }
            var updatedYAxisWidth = axisComponent.getCalculatedWidth();
            // if the width has changed, dispatch an action to update the width
            if (Math.round(axisSize.width) !== Math.round(updatedYAxisWidth)) {
                dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$cartesianAxisSlice$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateYAxisWidth"])({
                    id: yAxisId,
                    width: updatedYAxisWidth
                }));
            }
        }
    }["YAxisImpl.useLayoutEffect"], [
        // The dependency on cartesianAxisRef.current is not needed because useLayoutEffect will run after every render.
        // The ref will be populated by then.
        // To re-run this effect when ticks change, we can depend on the ticks array from the store.
        cartesianTickItems,
        axisSize,
        dispatch,
        label,
        yAxisId,
        width,
        synchronizedSettings
    ]);
    if (axisSize == null || position == null || synchronizedSettings == null) {
        return null;
    }
    var dangerouslySetInnerHTML = props.dangerouslySetInnerHTML, ticks = props.ticks, del = props.scale, allOtherProps = _objectWithoutProperties(props, _excluded2);
    var id = synchronizedSettings.id, del2 = synchronizedSettings.scale, restSynchronizedSettings = _objectWithoutProperties(synchronizedSettings, _excluded3);
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianAxis"], _extends({}, allOtherProps, restSynchronizedSettings, {
        ref: cartesianAxisRef,
        labelRef: labelRef,
        x: position.x,
        y: position.y,
        tickTextProps: width === 'auto' ? {
            width: undefined
        } : {
            width
        },
        width: axisSize.width,
        height: axisSize.height,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])("recharts-".concat(axisType, " ").concat(axisType), className),
        viewBox: viewBox,
        ticks: cartesianTickItems,
        axisType: axisType,
        axisId: yAxisId
    }));
}
var yAxisDefaultProps = {
    allowDataOverflow: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].allowDataOverflow,
    allowDecimals: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].allowDecimals,
    allowDuplicatedCategory: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].allowDuplicatedCategory,
    angle: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].angle,
    axisLine: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultCartesianAxisProps"].axisLine,
    hide: false,
    includeHidden: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].includeHidden,
    interval: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].interval,
    label: false,
    minTickGap: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].minTickGap,
    mirror: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].mirror,
    orientation: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].orientation,
    padding: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].padding,
    reversed: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].reversed,
    scale: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].scale,
    tick: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].tick,
    tickCount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].tickCount,
    tickLine: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultCartesianAxisProps"].tickLine,
    tickSize: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultCartesianAxisProps"].tickSize,
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].type,
    niceTicks: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].niceTicks,
    width: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$state$2f$selectors$2f$axisSelectors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["implicitYAxis"].width,
    yAxisId: 0
};
var YAxisSettingsDispatcher = (outsideProps)=>{
    var props = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$resolveDefaultProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveDefaultProps"])(outsideProps, yAxisDefaultProps);
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](SetYAxisSettings, {
        interval: props.interval,
        id: props.yAxisId,
        scale: props.scale,
        type: props.type,
        domain: props.domain,
        allowDataOverflow: props.allowDataOverflow,
        dataKey: props.dataKey,
        allowDuplicatedCategory: props.allowDuplicatedCategory,
        allowDecimals: props.allowDecimals,
        tickCount: props.tickCount,
        padding: props.padding,
        includeHidden: props.includeHidden,
        reversed: props.reversed,
        ticks: props.ticks,
        width: props.width,
        orientation: props.orientation,
        mirror: props.mirror,
        hide: props.hide,
        unit: props.unit,
        name: props.name,
        angle: props.angle,
        minTickGap: props.minTickGap,
        tick: props.tick,
        tickFormatter: props.tickFormatter,
        niceTicks: props.niceTicks
    }), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"](YAxisImpl, props));
};
var YAxis = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"](YAxisSettingsDispatcher, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$axisPropsAreEqual$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axisPropsAreEqual"]);
// @ts-expect-error we need to set the displayName for debugging purposes
YAxis.displayName = 'YAxis';
}),
"[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/cartesianPositionToCSSTranslate.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * CalculatedCartesianPosition returns horizontalAnchor and verticalAnchor
 * which work directly with an SVG text element
 * but for use in HTML context we have to translate them into CSS transform(translate)
 * so this is what this function is doing.
 *
 * horizontalPosition is type: type TextAnchor = 'start' | 'middle' | 'end' | 'inherit'
 * verticalPosition is type: type TextVerticalAnchor = 'start' | 'middle' | 'end'
 *
 * @param horizontalPosition as returned from {@link getCartesianPosition}
 * @param verticalPosition as returned from {@link getCartesianPosition}
 * @return CSS transform string
 */ __turbopack_context__.s([
    "cartesianPositionToCSSTranslate",
    ()=>cartesianPositionToCSSTranslate
]);
function cartesianPositionToCSSTranslate(horizontalPosition, verticalPosition) {
    var _verticalValues$verti;
    // 'start' / 'start' is the default HTML behavior, no transform needed
    if (horizontalPosition === 'start' && verticalPosition === 'start') {
        return '';
    }
    var horizontalValues = {
        start: '0',
        middle: '-50%',
        end: '-100%'
    };
    var verticalValues = {
        start: '0',
        middle: '-50%',
        end: '-100%'
    };
    var x = horizontalPosition === 'inherit' ? '0' : horizontalValues[horizontalPosition];
    var y = (_verticalValues$verti = verticalValues[verticalPosition]) !== null && _verticalValues$verti !== void 0 ? _verticalValues$verti : '0';
    return "translate(".concat(x, ", ").concat(y, ")");
}
}),
"[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/cartesianViewBoxToTrapezoid.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cartesianViewBoxToTrapezoid",
    ()=>cartesianViewBoxToTrapezoid
]);
function cartesianViewBoxToTrapezoid(box) {
    if (!box) {
        return undefined;
    }
    return {
        x: box.x,
        y: box.y,
        upperWidth: 'upperWidth' in box ? box.upperWidth : box.width,
        lowerWidth: 'lowerWidth' in box ? box.lowerWidth : box.width,
        width: box.width,
        height: box.height
    };
}
}),
"[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/getCartesianPosition.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCartesianPosition",
    ()=>getCartesianPosition,
    "isOutsidePosition",
    ()=>isOutsidePosition
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/DataUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$cartesianViewBoxToTrapezoid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/cartesianViewBoxToTrapezoid.js [app-client] (ecmascript)");
function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r) {
            return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
    }
    return t;
}
function _objectSpread(e) {
    for(var r = 1; r < arguments.length; r++){
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
            _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
    }
    return e;
}
function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[r] = t, e;
}
function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
;
;
var getCartesianPosition = (options)=>{
    var viewBox = options.viewBox, position = options.position, _options$offset = options.offset, offset = _options$offset === void 0 ? 0 : _options$offset, parentViewBoxFromOptions = options.parentViewBox, clamp = options.clamp;
    var _cartesianViewBoxToTr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$cartesianViewBoxToTrapezoid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cartesianViewBoxToTrapezoid"])(viewBox), x = _cartesianViewBoxToTr.x, y = _cartesianViewBoxToTr.y, height = _cartesianViewBoxToTr.height, upperWidth = _cartesianViewBoxToTr.upperWidth, lowerWidth = _cartesianViewBoxToTr.lowerWidth;
    // Funnel.tsx provides a viewBox where `x` is the top-left of the trapezoid shape.
    var upperX = x;
    // The trapezoid is centered, so we can calculate the other corners from the top-left.
    var lowerX = x + (upperWidth - lowerWidth) / 2;
    // middleX is the x-coordinate of the left edge at the vertical midpoint of the trapezoid.
    var middleX = (upperX + lowerX) / 2;
    // The width of the trapezoid at its vertical midpoint.
    var midHeightWidth = (upperWidth + lowerWidth) / 2;
    // The center x-coordinate is constant for the entire height of the trapezoid.
    var centerX = upperX + upperWidth / 2;
    // Define vertical offsets and position inverts based on the value being positive or negative.
    // This allows labels to be positioned correctly for bars with negative height.
    var verticalSign = height >= 0 ? 1 : -1;
    var verticalOffset = verticalSign * offset;
    var verticalEnd = verticalSign > 0 ? 'end' : 'start';
    var verticalStart = verticalSign > 0 ? 'start' : 'end';
    // Define horizontal offsets and position inverts based on the value being positive or negative.
    // This allows labels to be positioned correctly for bars with negative width.
    var horizontalSign = upperWidth >= 0 ? 1 : -1;
    var horizontalOffset = horizontalSign * offset;
    var horizontalEnd = horizontalSign > 0 ? 'end' : 'start';
    var horizontalStart = horizontalSign > 0 ? 'start' : 'end';
    // We assume parentViewBox is generic if provided.
    // The user has asserted that parentViewBox will be CartesianViewBoxRequired if present.
    var parentViewBox = parentViewBoxFromOptions;
    if (position === 'top') {
        var result = {
            x: upperX + upperWidth / 2,
            y: y - verticalOffset,
            horizontalAnchor: 'middle',
            verticalAnchor: verticalEnd
        };
        if (clamp && parentViewBox) {
            result.height = Math.max(y - parentViewBox.y, 0);
            result.width = upperWidth;
        }
        return result;
    }
    if (position === 'bottom') {
        var _result = {
            x: lowerX + lowerWidth / 2,
            y: y + height + verticalOffset,
            horizontalAnchor: 'middle',
            verticalAnchor: verticalStart
        };
        if (clamp && parentViewBox) {
            _result.height = Math.max(parentViewBox.y + parentViewBox.height - (y + height), 0);
            _result.width = lowerWidth;
        }
        return _result;
    }
    if (position === 'left') {
        var _result2 = {
            x: middleX - horizontalOffset,
            y: y + height / 2,
            horizontalAnchor: horizontalEnd,
            verticalAnchor: 'middle'
        };
        if (clamp && parentViewBox) {
            _result2.width = Math.max(_result2.x - parentViewBox.x, 0);
            _result2.height = height;
        }
        return _result2;
    }
    if (position === 'right') {
        var _result3 = {
            x: middleX + midHeightWidth + horizontalOffset,
            y: y + height / 2,
            horizontalAnchor: horizontalStart,
            verticalAnchor: 'middle'
        };
        if (clamp && parentViewBox) {
            _result3.width = Math.max(parentViewBox.x + parentViewBox.width - _result3.x, 0);
            _result3.height = height;
        }
        return _result3;
    }
    var sizeAttrs = clamp && parentViewBox ? {
        width: midHeightWidth,
        height
    } : {};
    if (position === 'insideLeft') {
        return _objectSpread({
            x: middleX + horizontalOffset,
            y: y + height / 2,
            horizontalAnchor: horizontalStart,
            verticalAnchor: 'middle'
        }, sizeAttrs);
    }
    if (position === 'insideRight') {
        return _objectSpread({
            x: middleX + midHeightWidth - horizontalOffset,
            y: y + height / 2,
            horizontalAnchor: horizontalEnd,
            verticalAnchor: 'middle'
        }, sizeAttrs);
    }
    if (position === 'insideTop') {
        return _objectSpread({
            x: upperX + upperWidth / 2,
            y: y + verticalOffset,
            horizontalAnchor: 'middle',
            verticalAnchor: verticalStart
        }, sizeAttrs);
    }
    if (position === 'insideBottom') {
        return _objectSpread({
            x: lowerX + lowerWidth / 2,
            y: y + height - verticalOffset,
            horizontalAnchor: 'middle',
            verticalAnchor: verticalEnd
        }, sizeAttrs);
    }
    if (position === 'insideTopLeft') {
        return _objectSpread({
            x: upperX + horizontalOffset,
            y: y + verticalOffset,
            horizontalAnchor: horizontalStart,
            verticalAnchor: verticalStart
        }, sizeAttrs);
    }
    if (position === 'insideTopRight') {
        return _objectSpread({
            x: upperX + upperWidth - horizontalOffset,
            y: y + verticalOffset,
            horizontalAnchor: horizontalEnd,
            verticalAnchor: verticalStart
        }, sizeAttrs);
    }
    if (position === 'insideBottomLeft') {
        return _objectSpread({
            x: lowerX + horizontalOffset,
            y: y + height - verticalOffset,
            horizontalAnchor: horizontalStart,
            verticalAnchor: verticalEnd
        }, sizeAttrs);
    }
    if (position === 'insideBottomRight') {
        return _objectSpread({
            x: lowerX + lowerWidth - horizontalOffset,
            y: y + height - verticalOffset,
            horizontalAnchor: horizontalEnd,
            verticalAnchor: verticalEnd
        }, sizeAttrs);
    }
    if (!!position && typeof position === 'object' && ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(position.x) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPercent"])(position.x)) && ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(position.y) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPercent"])(position.y))) {
        // TODO: This is not quite right. The width of the trapezoid changes with y.
        // A percentage-based x should be relative to the width at that y.
        // For now, we use the mid-height width as a reasonable approximation.
        return _objectSpread({
            x: x + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPercentValue"])(position.x, midHeightWidth),
            y: y + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPercentValue"])(position.y, height),
            horizontalAnchor: 'end',
            verticalAnchor: 'end'
        }, sizeAttrs);
    }
    return _objectSpread({
        x: centerX,
        y: y + height / 2,
        horizontalAnchor: 'middle',
        verticalAnchor: 'middle'
    }, sizeAttrs);
};
var absolutePositions = [
    'top',
    'left',
    'right',
    'bottom'
];
function isOutsidePosition(position) {
    if (position == null) {
        return false;
    }
    if (typeof position === 'object') {
        return true;
    }
    return absolutePositions.includes(position);
}
}),
"[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/getEquidistantTicks.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getEquidistantPreserveEndTicks",
    ()=>getEquidistantPreserveEndTicks,
    "getEquidistantTicks",
    ()=>getEquidistantTicks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$TickUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/TickUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$getEveryNth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/getEveryNth.js [app-client] (ecmascript)");
;
;
function getEquidistantTicks(sign, boundaries, getTickSize, ticks, minTickGap) {
    // If the ticks are readonly, then the slice might not be necessary
    var result = (ticks || []).slice();
    var initialStart = boundaries.start, end = boundaries.end;
    var index = 0;
    // Premature optimisation idea 1: Estimate a lower bound, and start from there.
    // For now, start from every tick
    var stepsize = 1;
    var start = initialStart;
    var _loop = function _loop() {
        // Given stepsize, evaluate whether every stepsize-th tick can be shown.
        // If it can not, then increase the stepsize by 1, and try again.
        var entry = ticks === null || ticks === void 0 ? void 0 : ticks[index];
        // Break condition - If we have evaluated all the ticks, then we are done.
        if (entry === undefined) {
            return {
                v: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$getEveryNth$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEveryNth"])(ticks, stepsize)
            };
        }
        // Check if the element collides with the next element
        var i = index;
        var size;
        var getSize = ()=>{
            if (size === undefined) {
                size = getTickSize(entry, i);
            }
            return size;
        };
        var tickCoord = entry.coordinate;
        // We will always show the first tick.
        var isShow = index === 0 || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$TickUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isVisible"])(sign, tickCoord, getSize, start, end);
        if (!isShow) {
            // Start all over with a larger stepsize
            index = 0;
            start = initialStart;
            stepsize += 1;
        }
        if (isShow) {
            // If it can be shown, update the start
            start = tickCoord + sign * (getSize() / 2 + minTickGap);
            index += stepsize;
        }
    }, _ret;
    while(stepsize <= result.length){
        _ret = _loop();
        if (_ret) return _ret.v;
    }
    return [];
}
function getEquidistantPreserveEndTicks(sign, boundaries, getTickSize, ticks, minTickGap) {
    // If the ticks are readonly, then the slice might not be necessary
    // Reworked logic for getEquidistantPreserveEndTicks
    var result = (ticks || []).slice();
    var len = result.length;
    if (len === 0) {
        return [];
    }
    var initialStart = boundaries.start, end = boundaries.end;
    // Start with stepsize = 1 (every tick) up to the maximum possible stepsize (len)
    for(var stepsize = 1; stepsize <= len; stepsize++){
        // 1. Calculate the offset so the last tick (index len - 1) is always included in the sequence.
        var offset = (len - 1) % stepsize;
        var start = initialStart; // `start` tracks the coordinate of the last successfully drawn tick + gap
        var ok = true;
        // 2. Iterate through the end-anchored sequence: offset, offset + stepsize, ..., len - 1
        var _loop2 = function _loop2() {
            var entry = ticks[index];
            if (entry == null) {
                return 0; // continue
            }
            var i = index;
            var size;
            // Use a function to get size, as in the original code
            var getSize = ()=>{
                if (size === undefined) {
                    size = getTickSize(entry, i);
                }
                return size;
            };
            var tickCoord = entry.coordinate;
            // 3. Apply visibility logic (including the first tick special case)
            // The reviewer says *not* to unconditionally bypass checks for the last tick.
            var isShow = index === offset || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$TickUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isVisible"])(sign, tickCoord, getSize, start, end);
            if (!isShow) {
                // If any tick in this end-anchored sequence fails visibility/collision,
                // reject this stepsize and move to the next iteration (larger stepsize).
                ok = false;
                return 1; // break
            }
            // 4. If showable, update the 'start' coordinate for the next collision check
            if (isShow) {
                start = tickCoord + sign * (getSize() / 2 + minTickGap);
            }
        }, _ret2;
        for(var index = offset; index < len; index += stepsize){
            _ret2 = _loop2();
            if (_ret2 === 0) continue;
            if (_ret2 === 1) break;
        }
        // 5. If the entire sequence for this stepsize passed the visibility check, return the result
        if (ok) {
            // Build the final result array explicitly using the validated stepsize and offset.
            var finalTicks = [];
            for(var _index = offset; _index < len; _index += stepsize){
                var tick = ticks[_index];
                if (tick != null) {
                    finalTicks.push(tick);
                }
            }
            return finalTicks;
        }
    }
    // If no stepsize works (this shouldn't happen unless minTickGap is huge), return an empty array.
    return [];
}
}),
"[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/getTicks.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTicks",
    ()=>getTicks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/DataUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DOMUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/DOMUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$Global$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/Global.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$TickUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/TickUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$getEquidistantTicks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/getEquidistantTicks.js [app-client] (ecmascript)");
function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function(r) {
            return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
    }
    return t;
}
function _objectSpread(e) {
    for(var r = 1; r < arguments.length; r++){
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
            _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
            Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
    }
    return e;
}
function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[r] = t, e;
}
function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
;
;
;
;
;
function getTicksEnd(sign, boundaries, getTickSize, ticks, minTickGap) {
    var result = (ticks || []).slice();
    var len = result.length;
    var start = boundaries.start;
    var end = boundaries.end;
    var _loop = function _loop(i) {
        var initialEntry = result[i];
        if (initialEntry == null) {
            return 1; // continue
        }
        var entry = initialEntry;
        var size;
        var getSize = ()=>{
            if (size === undefined) {
                size = getTickSize(initialEntry, i);
            }
            return size;
        };
        if (i === len - 1) {
            var gap = sign * (entry.coordinate + sign * getSize() / 2 - end);
            result[i] = entry = _objectSpread(_objectSpread({}, entry), {}, {
                tickCoord: gap > 0 ? entry.coordinate - gap * sign : entry.coordinate
            });
        } else {
            result[i] = entry = _objectSpread(_objectSpread({}, entry), {}, {
                tickCoord: entry.coordinate
            });
        }
        if (entry.tickCoord != null) {
            var isShow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$TickUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isVisible"])(sign, entry.tickCoord, getSize, start, end);
            if (isShow) {
                end = entry.tickCoord - sign * (getSize() / 2 + minTickGap);
                result[i] = _objectSpread(_objectSpread({}, entry), {}, {
                    isShow: true
                });
            }
        }
    };
    for(var i = len - 1; i >= 0; i--){
        if (_loop(i)) continue;
    }
    return result;
}
function getTicksStart(sign, boundaries, getTickSize, ticks, minTickGap, preserveEnd) {
    // This method is mutating the array so clone is indeed necessary here
    var result = (ticks || []).slice();
    var len = result.length;
    var start = boundaries.start, end = boundaries.end;
    if (preserveEnd) {
        // Try to guarantee the tail to be displayed
        var tail = ticks[len - 1];
        if (tail != null) {
            var tailSize = getTickSize(tail, len - 1);
            var tailGap = sign * (tail.coordinate + sign * tailSize / 2 - end);
            result[len - 1] = tail = _objectSpread(_objectSpread({}, tail), {}, {
                tickCoord: tailGap > 0 ? tail.coordinate - tailGap * sign : tail.coordinate
            });
            if (tail.tickCoord != null) {
                var isTailShow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$TickUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isVisible"])(sign, tail.tickCoord, ()=>tailSize, start, end);
                if (isTailShow) {
                    end = tail.tickCoord - sign * (tailSize / 2 + minTickGap);
                    result[len - 1] = _objectSpread(_objectSpread({}, tail), {}, {
                        isShow: true
                    });
                }
            }
        }
    }
    var count = preserveEnd ? len - 1 : len;
    var _loop2 = function _loop2(i) {
        var initialEntry = result[i];
        if (initialEntry == null) {
            return 1; // continue
        }
        var entry = initialEntry;
        var size;
        var getSize = ()=>{
            if (size === undefined) {
                size = getTickSize(initialEntry, i);
            }
            return size;
        };
        if (i === 0) {
            var gap = sign * (entry.coordinate - sign * getSize() / 2 - start);
            result[i] = entry = _objectSpread(_objectSpread({}, entry), {}, {
                tickCoord: gap < 0 ? entry.coordinate - gap * sign : entry.coordinate
            });
        } else {
            result[i] = entry = _objectSpread(_objectSpread({}, entry), {}, {
                tickCoord: entry.coordinate
            });
        }
        if (entry.tickCoord != null) {
            var isShow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$TickUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isVisible"])(sign, entry.tickCoord, getSize, start, end);
            if (isShow) {
                start = entry.tickCoord + sign * (getSize() / 2 + minTickGap);
                result[i] = _objectSpread(_objectSpread({}, entry), {}, {
                    isShow: true
                });
            }
        }
    };
    for(var i = 0; i < count; i++){
        if (_loop2(i)) continue;
    }
    return result;
}
function getTicks(props, fontSize, letterSpacing) {
    var tick = props.tick, ticks = props.ticks, viewBox = props.viewBox, minTickGap = props.minTickGap, orientation = props.orientation, interval = props.interval, tickFormatter = props.tickFormatter, unit = props.unit, angle = props.angle;
    if (!ticks || !ticks.length || !tick) {
        return [];
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(interval) || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$Global$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Global"].isSsr) {
        var _getNumberIntervalTic;
        return (_getNumberIntervalTic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$TickUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNumberIntervalTicks"])(ticks, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNumber"])(interval) ? interval : 0)) !== null && _getNumberIntervalTic !== void 0 ? _getNumberIntervalTic : [];
    }
    var candidates = [];
    var sizeKey = orientation === 'top' || orientation === 'bottom' ? 'width' : 'height';
    var unitSize = unit && sizeKey === 'width' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DOMUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStringSize"])(unit, {
        fontSize,
        letterSpacing
    }) : {
        width: 0,
        height: 0
    };
    var getTickSize = (content, index)=>{
        var value = typeof tickFormatter === 'function' ? tickFormatter(content.value, index) : content.value;
        // Recharts only supports angles when sizeKey === 'width'
        return sizeKey === 'width' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$TickUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAngledTickWidth"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DOMUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStringSize"])(value, {
            fontSize,
            letterSpacing
        }), unitSize, angle) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DOMUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStringSize"])(value, {
            fontSize,
            letterSpacing
        })[sizeKey];
    };
    var tick0 = ticks[0];
    var tick1 = ticks[1];
    var sign = ticks.length >= 2 && tick0 != null && tick1 != null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mathSign"])(tick1.coordinate - tick0.coordinate) : 1;
    var boundaries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$TickUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTickBoundaries"])(viewBox, sign, sizeKey);
    if (interval === 'equidistantPreserveStart') {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$getEquidistantTicks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEquidistantTicks"])(sign, boundaries, getTickSize, ticks, minTickGap);
    }
    if (interval === 'equidistantPreserveEnd') {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$getEquidistantTicks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEquidistantPreserveEndTicks"])(sign, boundaries, getTickSize, ticks, minTickGap);
    }
    if (interval === 'preserveStart' || interval === 'preserveStartEnd') {
        candidates = getTicksStart(sign, boundaries, getTickSize, ticks, minTickGap, interval === 'preserveStartEnd');
    } else {
        candidates = getTicksEnd(sign, boundaries, getTickSize, ticks, minTickGap);
    }
    return candidates.filter((entry)=>entry.isShow);
}
}),
"[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/cartesian/useAnimatedLineLength.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAnimatedLineLength",
    ()=>useAnimatedLineLength
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.3.3_@babel+core@7.2_88418e4aaf92e4db3a40b2e1891787a4/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/recharts@3.10.1_@types+reac_a3bedd50d15c0c93a134b6d462427b3d/node_modules/recharts/es6/util/round.js [app-client] (ecmascript)");
;
;
function useAnimatedLineLength(points) {
    var startingLengthRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    var maxAnimatedLengthRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    var reachedFullRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    var prevPointsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(points);
    if (prevPointsRef.current !== points) {
        startingLengthRef.current = maxAnimatedLengthRef.current;
        prevPointsRef.current = points;
    }
    // The callback is stable (never changes identity) because it only reads from refs.
    // This avoids triggering unnecessary re-renders in consumers.
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$3$2e$3_$40$babel$2b$core$40$7$2e$2_88418e4aaf92e4db3a40b2e1891787a4$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAnimatedLineLength.useCallback": (animationElapsedTime, totalLength)=>{
            if (reachedFullRef.current) {
                return null;
            }
            var visibleLength = Math.min((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$3$2e$10$2e$1_$40$types$2b$reac_a3bedd50d15c0c93a134b6d462427b3d$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$round$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["round"])(startingLengthRef.current + animationElapsedTime * totalLength), totalLength);
            if (animationElapsedTime > 0 && totalLength > 0) {
                maxAnimatedLengthRef.current = Math.max(maxAnimatedLengthRef.current, visibleLength);
                if (visibleLength >= totalLength) {
                    reachedFullRef.current = true;
                    return null;
                }
            }
            return visibleLength;
        }
    }["useAnimatedLineLength.useCallback"], []);
}
}),
]);

//# sourceMappingURL=20zw_recharts_es6_cartesian_0svmji7._.js.map