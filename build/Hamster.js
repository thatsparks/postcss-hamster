"use strict";

exports.__esModule = true;

var _FontSizes = require("./FontSizes");

var _FontSizes2 = _interopRequireDefault(_FontSizes);

var _VerticalRhythm = require("./VerticalRhythm");

var _PngImage = require("./PngImage");

var _PngImage2 = _interopRequireDefault(_PngImage);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _postcss = require("postcss");

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module Hamster
 * 
 * @description PostCSS Hamster framework main functionality.
 *
 * @version 1.0
 * @author Grigory Vasilyev <postcss.hamster@gmail.com> https://github.com/h0tc0d3
 * @copyright Copyright (c) 2017, Grigory Vasilyev
 * @license Apache License, Version 2.0, http://www.apache.org/licenses/LICENSE-2.0 
 * 
 */

var hamster = function hamster() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;


    //Default Global Variables
    var globalSettings = {

        "font-size": "16px",
        "line-height": "1.5",
        "unit": "em",
        "px-fallback": "true",
        "px-baseline": "false",
        "font-ratio": "0",

        "properties": "inline",

        "min-line-padding": "2px",
        "round-to-half-line": "false",

        "ruler": "true",
        "ruler-style": "always ruler-debug",
        "ruler-icon-position": "top: 1.5em;left: 1.5em;",
        "ruler-icon-colors": "#cccccc #44576a",
        "ruler-icon-size": "24px",
        "ruler-color": "rgba(19, 134, 191, .8)",
        "ruler-thickness": "1",
        "ruler-background": "gradient",
        "ruler-output": "base64",
        "ruler-pattern": "1 0 0 0",
        "ruler-scale": "1",

        "browser-font-size": "16px",
        "legacy-browsers": "true",
        "remove-comments": "false"

    };

    var helpers = {
        "reset": _fs2.default.readFileSync(_path2.default.resolve(__dirname, "../helpers/reset.css"), "utf8"),
        "normalize": _fs2.default.readFileSync(_path2.default.resolve(__dirname, "../helpers/normalize.css"), "utf8"),
        "nowrap": "white-space: nowrap;",
        "forcewrap": "white-space: pre;" + "white-space: pre-line;" + "white-space: -pre-wrap;" + "white-space: -o-pre-wrap;" + "white-space: -moz-pre-wrap;" + "white-space: -hp-pre-wrap;" + "white-space: pre-wrap;" + "word-wrap: break-word;",
        "ellipsis": "overflow: hidden;" + "text-overflow: ellipsis;"
    };

    // Current Variables
    var currentSettings = {};
    var currentSettingsRegexp = void 0;
    //Current FontSizes
    var currentFontSizes = "";
    // font Sizes
    var fontSizesCollection = void 0;
    // Vertical Rhythm Calculator
    var rhythmCalculator = void 0;
    // Last Css File
    var extendNodes = {};
    // let lastFile;

    // let vm = new VirtualMachine();
    // fontSize property Regexp
    var fontSizeRegexp = new RegExp("fontSize\\s+([\\-\\$\\@0-9a-zA-Z]+)", "i");

    // lineHeight property Regexp
    var lineRegexp = new RegExp("(lineHeight|spacing|leading)\\((.*?)\\)", "i");

    // Copy Values from object 2 to object 1;
    var extend = function extend(object1, object2) {

        for (var i = 0, keys = Object.keys(object2), keysSize = keys.length; i < keysSize; i++) {
            var key = keys[i];
            object1[key] = object2[key];
        }
        return object1;
    };

    if (options != null) {
        extend(globalSettings, options);
    }

    var toCamelCase = function toCamelCase(value) {
        return value.toLowerCase().replace(/^[^a-z0-9]*(.*)[^a-z0-9]*$/, "$1").replace(/[^a-z0-9]+([a-z0-9])/g, function (match, letter) {
            return letter.toUpperCase();
        });
    };
    // Init current Settings
    var initSettings = function initSettings() {
        // Add fontSizes
        if ("font-sizes" in globalSettings) {
            currentFontSizes = globalSettings["font-sizes"];
        }

        if ("font-sizes" in currentSettings) {
            currentFontSizes = currentFontSizes + ", " + currentSettings["font-sizes"];
        }

        fontSizesCollection = new _FontSizes2.default(currentSettings);
        rhythmCalculator = new _VerticalRhythm.VerticalRhythm(currentSettings);
        fontSizesCollection.addFontSizes(currentFontSizes, rhythmCalculator);
        currentSettingsRegexp = new RegExp("\\@(" + Object.keys(currentSettings).join("|").replace(/(\-|\_)/g, "\\$1") + ")", "i");
    };

    var walkDecls = function walkDecls(node) {
        node.walkDecls(function (decl) {

            var found = void 0;

            // Replace Variables with values
            while (found = decl.value.match(currentSettingsRegexp)) {
                var variable = found[1];
                decl.value = decl.value.replace(currentSettingsRegexp, currentSettings[variable]);
            }

            // Replace Font Size
            while (found = decl.value.match(fontSizeRegexp)) {
                var _found$1$split = found[1].split(/\$/i),
                    fontSize = _found$1$split[0],
                    sizeUnit = _found$1$split[1];

                sizeUnit = sizeUnit != null ? sizeUnit.toLowerCase() : null;

                var size = fontSizesCollection.getSize(fontSize);
                // Write font size
                if (sizeUnit != null && (sizeUnit == "em" || sizeUnit == "rem")) {

                    decl.value = decl.value.replace(fontSizeRegexp, (0, _VerticalRhythm.formatValue)(size.rel) + sizeUnit);
                } else if (sizeUnit != null && sizeUnit == "px") {

                    decl.value = decl.value.replace(fontSizeRegexp, (0, _VerticalRhythm.formatInt)(size.px) + "px");
                } else {

                    var unit = globalSettings["unit"].toLowerCase();
                    var cfsize = unit == "px" ? (0, _VerticalRhythm.formatInt)(size.px) : (0, _VerticalRhythm.formatValue)(size.rel);

                    decl.value = decl.value.replace(fontSizeRegexp, cfsize + unit);
                }
            }

            // Adjust Font Size
            if (decl.prop == "adjust-font-size") {
                var _decl$value$split = decl.value.split(/\s+/),
                    fontSize = _decl$value$split[0],
                    lines = _decl$value$split[1],
                    baseFontSize = _decl$value$split[2];

                var fontSizeUnit = fontSize.match(/(px|em|rem)$/i)[0].toLowerCase();

                fontSize = rhythmCalculator.convert(fontSize, fontSizeUnit, null, baseFontSize) + currentSettings["unit"];

                decl.value = fontSize;

                var lineHeight = rhythmCalculator.lineHeight(fontSize, lines, baseFontSize);

                var lineHeightDecl = _postcss2.default.decl({
                    prop: "line-height",
                    value: lineHeight,
                    source: decl.source
                });

                decl.prop = "font-size";
                decl.parent.insertAfter(decl, lineHeightDecl);
            }
            // lineHeight, spacing, leading
            while (found = decl.value.match(lineRegexp)) {

                var property = found[1].toLowerCase(); // spacing or lineHeight
                var parameters = found[2].split(/\s*\,\s*/);
                var _lineHeight = "";
                for (var i = 0, parametersSize = parameters.length; i < parametersSize; i++) {
                    var _parameters$i$split = parameters[i].split(/\s+/),
                        value = _parameters$i$split[0],
                        _fontSize = _parameters$i$split[1];

                    if (_fontSize == null) {
                        decl.parent.walkDecls("font-size", function (fsdecl) {
                            _fontSize = fsdecl.value;
                        });
                    }

                    if (_fontSize == null) {
                        _fontSize = currentSettings["font-size"];
                    }

                    if (property == "lineheight") {
                        _lineHeight += rhythmCalculator.lineHeight(_fontSize, value) + " ";
                    } else if (property == "spacing") {
                        _lineHeight += rhythmCalculator.lineHeight(_fontSize, value, null, true) + " ";
                    } else if (property == "leading") {
                        _lineHeight += rhythmCalculator.leading(value, _fontSize) + " ";
                    }
                }
                decl.value = decl.value.replace(found[0], _lineHeight.replace(/\s+$/, ""));
            }

            if (currentSettings["px-fallback"] == "true" && decl.value.match(/[0-9\.]+rem/i)) {
                decl.parent.insertBefore(decl, decl.clone({
                    value: rhythmCalculator.remFallback(decl.value),
                    source: decl.source
                }));
            }
        });
    };

    return function (css) {

        css.walk(function (node) {
            // if (lastFile != node.source.input.file) {
            // 	lastFile = node.source.input.file;
            // }

            if (node.type == "atrule") {

                var rule = node;

                if (rule.name == "hamster") {

                    if (rule.params != "end") {
                        // Add Global Variables
                        rule.walkDecls(function (decl) {
                            globalSettings[decl.prop] = decl.value;
                        });
                    }

                    // Add fontSizes
                    if ("font-sizes" in globalSettings) {
                        currentFontSizes = globalSettings["font-sizes"];
                    }
                    // Reset current variables
                    currentSettings = extend({}, globalSettings);

                    // Init current Settings
                    initSettings();

                    // Remove Rule Hamster
                    rule.remove();
                } else if (rule.name == "!hamster") {

                    //currentSettings = extend({}, globalSettings);

                    rule.walkDecls(function (decl) {
                        currentSettings[decl.prop] = decl.value;
                    });

                    // Init current Settings
                    initSettings();

                    rule.remove();
                } else if (rule.name == "baseline") {

                    var fontSize = parseInt(currentSettings["font-size"]);
                    var browserFontSize = parseInt(currentSettings["browser-font-size"]);
                    var legacyBrowsers = currentSettings["legacy-browsers"].toLowerCase();
                    var pxBaseline = currentSettings["px-baseline"].toLowerCase();

                    var rhythmUnit = currentSettings["unit"].toLowerCase();

                    var lineHeight = rhythmCalculator.lineHeight(fontSize + "px");

                    // baseline font size
                    var fontSizeDecl = null;

                    if (pxBaseline == "true" || rhythmUnit == "px" && legacyBrowsers != "true") {

                        fontSizeDecl = _postcss2.default.decl({
                            prop: "font-size",
                            value: fontSize + "px",
                            source: rule.source
                        });
                    } else {

                        var relativeSize = 100 * fontSize / browserFontSize;

                        fontSizeDecl = _postcss2.default.decl({
                            prop: "font-size",
                            value: (0, _VerticalRhythm.formatValue)(relativeSize) + "%",
                            source: rule.source
                        });
                    }

                    var lineHeightDecl = _postcss2.default.decl({
                        prop: "line-height",
                        value: lineHeight,
                        source: rule.source
                    });

                    if (rule.params.match(/\s*html\s*/)) {

                        var htmlRule = _postcss2.default.rule({
                            selector: "html",
                            source: rule.source
                        });

                        htmlRule.append(fontSizeDecl);
                        htmlRule.append(lineHeightDecl);

                        rule.parent.insertAfter(rule, htmlRule);

                        if (rhythmUnit == "px" && legacyBrowsers == "true") {
                            var asteriskHtmlRule = _postcss2.default.rule({
                                selector: "* html",
                                source: rule.source
                            });
                            asteriskHtmlRule.append(lineHeightDecl);
                            rule.parent.insertAfter(rule, asteriskHtmlRule);
                        }
                    } else {

                        rule.parent.insertAfter(rule, lineHeightDecl);
                        rule.parent.insertAfter(rule, fontSizeDecl);

                        if (rhythmUnit == "rem" && currentSettings["px-fallback"] == "true") {

                            rule.parent.insertBefore(lineHeightDecl, _postcss2.default.decl({
                                prop: "line-height",
                                value: rhythmCalculator.remFallback(lineHeight),
                                source: rule.source
                            }));
                        }
                    }

                    rule.remove();
                } else if (rule.name == "ruler") {

                    var rulerIconPosition = currentSettings["ruler-icon-position"].replace(/(\'|\")/g, "").replace(/\;/g, ";\n");

                    var _lineHeight2 = currentSettings["line-height"].match(/px$/i) ? currentSettings["line-height"] : currentSettings["line-height"] + "em";

                    //let svg = "data:image/svg+xml;charset=utf8,%3Csvg xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27 viewBox%3D%270 0 24 24%27%3E%3Cpath fill%3D%27{color}%27 d%3D%27M18 24c-0.3 0-0.548-0.246-0.548-0.546V18c0-0.3 0.248-0.546 0.548-0.546h5.452  C23.754 17.454 24 17.7 24 18v5.454c0 0.3-0.246 0.546-0.548 0.546H18z M9.271 24c-0.298 0-0.543-0.246-0.543-0.546V18  c0-0.3 0.245-0.546 0.543-0.546h5.457c0.3 0 0.543 0.246 0.543 0.546v5.454c0 0.3-0.243 0.546-0.543 0.546H9.271z M0.548 24  C0.246 24 0 23.754 0 23.454V18c0-0.3 0.246-0.546 0.548-0.546H6c0.302 0 0.548 0.246 0.548 0.546v5.454C6.548 23.754 6.302 24 6 24  H0.548z M18 15.271c-0.3 0-0.548-0.244-0.548-0.542V9.272c0-0.299 0.248-0.545 0.548-0.545h5.452C23.754 8.727 24 8.973 24 9.272  v5.457c0 0.298-0.246 0.542-0.548 0.542H18z M9.271 15.271c-0.298 0-0.543-0.244-0.543-0.542V9.272c0-0.299 0.245-0.545 0.543-0.545  h5.457c0.3 0 0.543 0.246 0.543 0.545v5.457c0 0.298-0.243 0.542-0.543 0.542H9.271z M0.548 15.271C0.246 15.271 0 15.026 0 14.729  V9.272c0-0.299 0.246-0.545 0.548-0.545H6c0.302 0 0.548 0.246 0.548 0.545v5.457c0 0.298-0.246 0.542-0.548 0.542H0.548z M18 6.545  c-0.3 0-0.548-0.245-0.548-0.545V0.545C17.452 0.245 17.7 0 18 0h5.452C23.754 0 24 0.245 24 0.545V6c0 0.3-0.246 0.545-0.548 0.545  H18z M9.271 6.545C8.974 6.545 8.729 6.3 8.729 6V0.545C8.729 0.245 8.974 0 9.271 0h5.457c0.3 0 0.543 0.245 0.543 0.545V6  c0 0.3-0.243 0.545-0.543 0.545H9.271z M0.548 6.545C0.246 6.545 0 6.3 0 6V0.545C0 0.245 0.246 0 0.548 0H6  c0.302 0 0.548 0.245 0.548 0.545V6c0 0.3-0.246 0.545-0.548 0.545H0.548z%27%2F%3E%3C%2Fsvg%3E";
                    var svg = "data:image/svg+xml;charset=utf8,%3Csvg xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27 viewBox%3D%270 0 24 24%27%3E%3Cpath fill%3D%27{color}%27 d%3D%27M0,6c0,0.301,0.246,0.545,0.549,0.545h22.906C23.756,6.545,24,6.301,24,6V2.73c0-0.305-0.244-0.549-0.545-0.549H0.549  C0.246,2.182,0,2.426,0,2.73V6z M0,13.637c0,0.297,0.246,0.545,0.549,0.545h22.906c0.301,0,0.545-0.248,0.545-0.545v-3.273  c0-0.297-0.244-0.545-0.545-0.545H0.549C0.246,9.818,0,10.066,0,10.363V13.637z M0,21.27c0,0.305,0.246,0.549,0.549,0.549h22.906  c0.301,0,0.545-0.244,0.545-0.549V18c0-0.301-0.244-0.545-0.545-0.545H0.549C0.246,17.455,0,17.699,0,18V21.27z%27%2F%3E%3C%2Fsvg%3E";
                    //let svg = "data:image/svg+xml;charset=utf8,%3Csvg xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27 viewBox%3D%270 0 32 32%27%3E%3Cpath fill%3D%27{color}%27 d%3D%27M28,20h-4v-8h4c1.104,0,2-0.896,2-2s-0.896-2-2-2h-4V4c0-1.104-0.896-2-2-2s-2,0.896-2,2v4h-8V4c0-1.104-0.896-2-2-2  S8,2.896,8,4v4H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h4v8H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h4v4c0,1.104,0.896,2,2,2s2-0.896,2-2v-4  h8v4c0,1.104,0.896,2,2,2s2-0.896,2-2v-4h4c1.104,0,2-0.896,2-2S29.104,20,28,20z M12,20v-8h8v8H12z%27%2F%3E%3C%2Fsvg%3E";
                    var gthickness = parseFloat(currentSettings["ruler-thickness"]);

                    var background = "";

                    if (currentSettings["ruler-background"] == "png") {

                        var imageHeight = currentSettings["line-height"].match(/px$/) ? parseInt(currentSettings["line-height"]) : (parseFloat(currentSettings["line-height"]) * parseFloat(currentSettings["font-size"])).toFixed(0);
                        var pattern = currentSettings["ruler-pattern"].split(/\s+/);
                        var image = new _PngImage2.default();
                        image.rulerMatrix(imageHeight, currentSettings["ruler-color"], pattern, gthickness, currentSettings["ruler-scale"]);
                        if (currentSettings["ruler-output"] != "base64") {
                            image.getFile(currentSettings["ruler-output"]);
                            background = "background-image: url(\"../" + currentSettings["ruler-output"] + "\");" + "background-position: left top;" + "background-repeat: repeat;" + "background-size: " + pattern.length + "px " + imageHeight + "px;";
                        } else {
                            background = "background-image: url(\"data:image/png;base64," + image.getBase64() + "\");" + "background-position: left top;" + "background-repeat: repeat;" + "background-size: " + pattern.length + "px " + imageHeight + "px;";
                        }
                    } else {

                        gthickness = gthickness * 3;

                        background = "background-image: linear-gradient(to top, " + currentSettings["ruler-color"] + " " + gthickness + "%, transparent " + gthickness + "%);" + "background-size: 100% " + _lineHeight2 + ";";
                    }

                    var ruler = "position: absolute;" + "left: 0;" + "top: 0;" + "margin: 0;" + "padding: 0;" + "width: 100%;" + "height: 100%;" + "z-index: 9900;" + background;

                    var iconSize = currentSettings["ruler-icon-size"];

                    var _currentSettings$rule = currentSettings["ruler-style"].split(/\s+/),
                        style = _currentSettings$rule[0],
                        rulerClass = _currentSettings$rule[1];

                    var _currentSettings$rule2 = currentSettings["ruler-icon-colors"].split(/\s+/),
                        color = _currentSettings$rule2[0],
                        hoverColor = _currentSettings$rule2[1];

                    var rulerRule = null;

                    if (style == "switch") {

                        rulerRule = _postcss2.default.parse("." + rulerClass + "{" + "display: none;" + ruler + "}" + "input[id=\"" + rulerClass + "\"] {" + "display:none;" + "}" + "input[id=\"" + rulerClass + "\"] + label {" + "z-index: 9999;" + "display: inline-block;" + "position: absolute;" + rulerIconPosition + "margin: 0;" + "padding: 0;" + "width: " + iconSize + ";" + "height: " + iconSize + ";" + "cursor: pointer;" + "background-image: url(\"" + svg.replace(/\{color\}/, escape(color)) + "\");" + "}" + "input[id=\"" + rulerClass + "\"]:checked + label, input[id=\"" + rulerClass + "\"]:hover + label {" + "background-image: url(\"" + svg.replace(/\{color\}/, escape(hoverColor)) + "\");" + "}" + "input[id=\"" + rulerClass + "\"]:checked ~ ." + rulerClass + "{" + "display: block;" + "}");
                    } else if (style == "hover") {

                        rulerRule = _postcss2.default.parse("." + rulerClass + "{" + "position: absolute;" + rulerIconPosition + "margin: 0;" + "padding: 0;" + "width: " + iconSize + ";" + "height: " + iconSize + ";" + "background-image: url(\"" + svg.replace(/\{color\}/, escape(color)) + "\");" + "transition: background-image 0.5s ease-in-out;" + "}" + "." + rulerClass + ":hover" + "{" + "cursor: pointer;" + ruler + "}");
                    } else if (style == "always") {

                        rulerRule = _postcss2.default.parse("." + rulerClass + "{\n" + ruler + "}\n");
                    }

                    if (rulerRule != null) {
                        rulerRule.source = rule.source;
                        rule.parent.insertBefore(rule, rulerRule);
                    }

                    rule.remove();
                } else if (rule.name.match(/^(ellipsis|nowrap|forcewrap)$/i)) {

                    var property = rule.name.toLowerCase();

                    var decls = helpers[property];

                    if (property == "ellipsis" && rule.params == "true") {
                        decls = helpers["nowrap"] + decls;
                    }

                    if (currentSettings["properties"] == "inline") {

                        var idecls = _postcss2.default.parse(decls);
                        rule.parent.insertBefore(rule, idecls);
                    } else if (currentSettings["properties"] == "extend") {

                        var extendName = toCamelCase(rule.name.toLowerCase() + " " + rule.params);

                        if (extendNodes[extendName] == null) {

                            // Save extend info
                            extendNodes[extendName] = {
                                selector: rule.parent.selector,
                                decls: decls,
                                parents: [rule.parent],
                                prev: rule.prev(),
                                source: rule.source,
                                count: 1
                            };
                        } else {

                            //Append selector and update counter
                            extendNodes[extendName].selector = extendNodes[extendName].selector + ", " + rule.parent.selector;
                            extendNodes[extendName].parents.push(rule.parent);
                            extendNodes[extendName].count++;
                        }
                    }

                    rule.remove();
                } else if (rule.name.match(/^(reset|normalize)$/i)) {
                    var _property = rule.name.toLowerCase();
                    var rules = _postcss2.default.parse(helpers[_property]);
                    rules.source = rule.source;
                    rule.parent.insertAfter(rule, rules);
                    rule.remove();
                }
                // Walk in media queries
                node.walk(function (child) {

                    if (child.type == "rule") {
                        // Walk decls in rule
                        walkDecls(child);
                    }
                });
                // else if (rule.name == "js") {

                //     let jcss = rule.toString();
                //     // let code = jcss.replace(/\@js\s*\{([\s\S]+)\}$/i, "$1");

                //     console.log(jcss);
                //     // rulerRule.source = rule.source;
                //     // rule.parent.insertBefore(rule, rulerRule);
                //     rule.remove();
                // }
            } else if (node.type == "rule") {

                // Walk decls in rule
                walkDecls(node);
            } else if (currentSettings["remove-comments"] == "true" && node.type == "comment") {
                node.remove();
            }
        });

        // Append Extends to CSS
        for (var i = 0, keys = Object.keys(extendNodes), keysSize = keys.length; i < keysSize; i++) {
            var key = keys[i];
            if (extendNodes[key].count > 1) {
                var rule = _postcss2.default.parse(extendNodes[key].selector + "{" + extendNodes[key].decls + "}");
                rule.source = extendNodes[key].source;

                css.insertBefore(extendNodes[key].parents[0], rule);
            } else {
                var decls = _postcss2.default.parse(extendNodes[key].decls);
                decls.source = extendNodes[key].source;
                extendNodes[key].parents[0].insertAfter(extendNodes[key].prev, decls);
            }

            // Remove unused parent nodes.
            for (var j = 0, parents = extendNodes[key].parents.length; j < parents; j++) {
                if (extendNodes[key].parents[j].nodes.length == 0) {
                    extendNodes[key].parents[j].remove();
                }
            }
        }
    };
};
// import VirtualMachine from "./VirtualMachine";

exports.default = hamster;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhhbXN0ZXIuZXM2Il0sIm5hbWVzIjpbImhhbXN0ZXIiLCJvcHRpb25zIiwiZ2xvYmFsU2V0dGluZ3MiLCJoZWxwZXJzIiwicmVhZEZpbGVTeW5jIiwicmVzb2x2ZSIsIl9fZGlybmFtZSIsImN1cnJlbnRTZXR0aW5ncyIsImN1cnJlbnRTZXR0aW5nc1JlZ2V4cCIsImN1cnJlbnRGb250U2l6ZXMiLCJmb250U2l6ZXNDb2xsZWN0aW9uIiwicmh5dGhtQ2FsY3VsYXRvciIsImV4dGVuZE5vZGVzIiwiZm9udFNpemVSZWdleHAiLCJSZWdFeHAiLCJsaW5lUmVnZXhwIiwiZXh0ZW5kIiwib2JqZWN0MSIsIm9iamVjdDIiLCJpIiwia2V5cyIsIk9iamVjdCIsImtleXNTaXplIiwibGVuZ3RoIiwia2V5IiwidG9DYW1lbENhc2UiLCJ2YWx1ZSIsInRvTG93ZXJDYXNlIiwicmVwbGFjZSIsIm1hdGNoIiwibGV0dGVyIiwidG9VcHBlckNhc2UiLCJpbml0U2V0dGluZ3MiLCJhZGRGb250U2l6ZXMiLCJqb2luIiwid2Fsa0RlY2xzIiwibm9kZSIsImZvdW5kIiwiZGVjbCIsInZhcmlhYmxlIiwic3BsaXQiLCJmb250U2l6ZSIsInNpemVVbml0Iiwic2l6ZSIsImdldFNpemUiLCJyZWwiLCJweCIsInVuaXQiLCJjZnNpemUiLCJwcm9wIiwibGluZXMiLCJiYXNlRm9udFNpemUiLCJmb250U2l6ZVVuaXQiLCJjb252ZXJ0IiwibGluZUhlaWdodCIsImxpbmVIZWlnaHREZWNsIiwic291cmNlIiwicGFyZW50IiwiaW5zZXJ0QWZ0ZXIiLCJwcm9wZXJ0eSIsInBhcmFtZXRlcnMiLCJwYXJhbWV0ZXJzU2l6ZSIsImZzZGVjbCIsImxlYWRpbmciLCJpbnNlcnRCZWZvcmUiLCJjbG9uZSIsInJlbUZhbGxiYWNrIiwiY3NzIiwid2FsayIsInR5cGUiLCJydWxlIiwibmFtZSIsInBhcmFtcyIsInJlbW92ZSIsInBhcnNlSW50IiwiYnJvd3NlckZvbnRTaXplIiwibGVnYWN5QnJvd3NlcnMiLCJweEJhc2VsaW5lIiwicmh5dGhtVW5pdCIsImZvbnRTaXplRGVjbCIsInJlbGF0aXZlU2l6ZSIsImh0bWxSdWxlIiwic2VsZWN0b3IiLCJhcHBlbmQiLCJhc3Rlcmlza0h0bWxSdWxlIiwicnVsZXJJY29uUG9zaXRpb24iLCJzdmciLCJndGhpY2tuZXNzIiwicGFyc2VGbG9hdCIsImJhY2tncm91bmQiLCJpbWFnZUhlaWdodCIsInRvRml4ZWQiLCJwYXR0ZXJuIiwiaW1hZ2UiLCJydWxlck1hdHJpeCIsImdldEZpbGUiLCJnZXRCYXNlNjQiLCJydWxlciIsImljb25TaXplIiwic3R5bGUiLCJydWxlckNsYXNzIiwiY29sb3IiLCJob3ZlckNvbG9yIiwicnVsZXJSdWxlIiwicGFyc2UiLCJlc2NhcGUiLCJkZWNscyIsImlkZWNscyIsImV4dGVuZE5hbWUiLCJwYXJlbnRzIiwicHJldiIsImNvdW50IiwicHVzaCIsInJ1bGVzIiwiY2hpbGQiLCJqIiwibm9kZXMiXSwibWFwcGluZ3MiOiI7Ozs7QUFZQTs7OztBQUVBOztBQU1BOzs7O0FBR0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7QUExQkE7Ozs7Ozs7Ozs7OztBQTRCQSxJQUFNQSxVQUFVLFNBQVZBLE9BQVUsR0FBb0I7QUFBQSxRQUFuQkMsT0FBbUIsdUVBQVQsSUFBUzs7O0FBRWhDO0FBQ0EsUUFBSUMsaUJBQWlCOztBQUVqQixxQkFBYSxNQUZJO0FBR2pCLHVCQUFlLEtBSEU7QUFJakIsZ0JBQVEsSUFKUztBQUtqQix1QkFBZSxNQUxFO0FBTWpCLHVCQUFlLE9BTkU7QUFPakIsc0JBQWMsR0FQRzs7QUFTakIsc0JBQWMsUUFURzs7QUFXakIsNEJBQW9CLEtBWEg7QUFZakIsOEJBQXNCLE9BWkw7O0FBY2pCLGlCQUFTLE1BZFE7QUFlakIsdUJBQWUsb0JBZkU7QUFnQmpCLCtCQUF1Qix5QkFoQk47QUFpQmpCLDZCQUFxQixpQkFqQko7QUFrQmpCLDJCQUFtQixNQWxCRjtBQW1CakIsdUJBQWUsd0JBbkJFO0FBb0JqQiwyQkFBbUIsR0Fw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QTZqQmV6RSxPIiwiZmlsZSI6IkhhbXN0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQG1vZHVsZSBIYW1zdGVyXHJcbiAqIFxyXG4gKiBAZGVzY3JpcHRpb24gUG9zdENTUyBIYW1zdGVyIGZyYW1ld29yayBtYWluIGZ1bmN0aW9uYWxpdHkuXHJcbiAqXHJcbiAqIEB2ZXJzaW9uIDEuMFxyXG4gKiBAYXV0aG9yIEdyaWdvcnkgVmFzaWx5ZXYgPHBvc3Rjc3MuaGFtc3RlckBnbWFpbC5jb20+IGh0dHBzOi8vZ2l0aHViLmNvbS9oMHRjMGQzXHJcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE3LCBHcmlnb3J5IFZhc2lseWV2XHJcbiAqIEBsaWNlbnNlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCwgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wIFxyXG4gKiBcclxuICovXHJcblxyXG5pbXBvcnQgRm9udFNpemVzIGZyb20gXCIuL0ZvbnRTaXplc1wiO1xyXG5cclxuaW1wb3J0IHtcclxuICAgIGZvcm1hdEludCxcclxuICAgIGZvcm1hdFZhbHVlLFxyXG4gICAgVmVydGljYWxSaHl0aG1cclxufSBmcm9tIFwiLi9WZXJ0aWNhbFJoeXRobVwiO1xyXG5cclxuaW1wb3J0IFBuZ0ltYWdlIGZyb20gXCIuL1BuZ0ltYWdlXCI7XHJcbi8vIGltcG9ydCBWaXJ0dWFsTWFjaGluZSBmcm9tIFwiLi9WaXJ0dWFsTWFjaGluZVwiO1xyXG5cclxuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5cclxuaW1wb3J0IHBvc3Rjc3MgZnJvbSBcInBvc3Rjc3NcIjtcclxuXHJcbmNvbnN0IGhhbXN0ZXIgPSAob3B0aW9ucyA9IG51bGwpID0+IHtcclxuXHJcbiAgICAvL0RlZmF1bHQgR2xvYmFsIFZhcmlhYmxlc1xyXG4gICAgbGV0IGdsb2JhbFNldHRpbmdzID0ge1xyXG5cclxuICAgICAgICBcImZvbnQtc2l6ZVwiOiBcIjE2cHhcIixcclxuICAgICAgICBcImxpbmUtaGVpZ2h0XCI6IFwiMS41XCIsXHJcbiAgICAgICAgXCJ1bml0XCI6IFwiZW1cIixcclxuICAgICAgICBcInB4LWZhbGxiYWNrXCI6IFwidHJ1ZVwiLFxyXG4gICAgICAgIFwicHgtYmFzZWxpbmVcIjogXCJmYWxzZVwiLFxyXG4gICAgICAgIFwiZm9udC1yYXRpb1wiOiBcIjBcIixcclxuXHJcbiAgICAgICAgXCJwcm9wZXJ0aWVzXCI6IFwiaW5saW5lXCIsXHJcblxyXG4gICAgICAgIFwibWluLWxpbmUtcGFkZGluZ1wiOiBcIjJweFwiLFxyXG4gICAgICAgIFwicm91bmQtdG8taGFsZi1saW5lXCI6IFwiZmFsc2VcIixcclxuXHJcbiAgICAgICAgXCJydWxlclwiOiBcInRydWVcIixcclxuICAgICAgICBcInJ1bGVyLXN0eWxlXCI6IFwiYWx3YXlzIHJ1bGVyLWRlYnVnXCIsXHJcbiAgICAgICAgXCJydWxlci1pY29uLXBvc2l0aW9uXCI6IFwidG9wOiAxLjVlbTtsZWZ0OiAxLjVlbTtcIixcclxuICAgICAgICBcInJ1bGVyLWljb24tY29sb3JzXCI6IFwiI2NjY2NjYyAjNDQ1NzZhXCIsXHJcbiAgICAgICAgXCJydWxlci1pY29uLXNpemVcIjogXCIyNHB4XCIsXHJcbiAgICAgICAgXCJydWxlci1jb2xvclwiOiBcInJnYmEoMTksIDEzNCwgMTkxLCAuOClcIixcclxuICAgICAgICBcInJ1bGVyLXRoaWNrbmVzc1wiOiBcIjFcIixcclxuICAgICAgICBcInJ1bGVyLWJhY2tncm91bmRcIjogXCJncmFkaWVudFwiLFxyXG4gICAgICAgIFwicnVsZXItb3V0cHV0XCI6IFwiYmFzZTY0XCIsXHJcbiAgICAgICAgXCJydWxlci1wYXR0ZXJuXCI6IFwiMSAwIDAgMFwiLFxyXG4gICAgICAgIFwicnVsZXItc2NhbGVcIjogXCIxXCIsXHJcblxyXG4gICAgICAgIFwiYnJvd3Nlci1mb250LXNpemVcIjogXCIxNnB4XCIsXHJcbiAgICAgICAgXCJsZWdhY3ktYnJvd3NlcnNcIjogXCJ0cnVlXCIsXHJcbiAgICAgICAgXCJyZW1vdmUtY29tbWVudHNcIjogXCJmYWxzZVwiXHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgaGVscGVycyA9IHtcclxuICAgICAgICBcInJlc2V0XCI6IGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uL2hlbHBlcnMvcmVzZXQuY3NzXCIpLCBcInV0ZjhcIiksXHJcbiAgICAgICAgXCJub3JtYWxpemVcIjogZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vaGVscGVycy9ub3JtYWxpemUuY3NzXCIpLCBcInV0ZjhcIiksXHJcbiAgICAgICAgXCJub3dyYXBcIjogXCJ3aGl0ZS1zcGFjZTogbm93cmFwO1wiLFxyXG4gICAgICAgIFwiZm9yY2V3cmFwXCI6IFwid2hpdGUtc3BhY2U6IHByZTtcIiArXHJcbiAgICAgICAgICAgIFwid2hpdGUtc3BhY2U6IHByZS1saW5lO1wiICtcclxuICAgICAgICAgICAgXCJ3aGl0ZS1zcGFjZTogLXByZS13cmFwO1wiICtcclxuICAgICAgICAgICAgXCJ3aGl0ZS1zcGFjZTogLW8tcHJlLXdyYXA7XCIgK1xyXG4gICAgICAgICAgICBcIndoaXRlLXNwYWNlOiAtbW96LXByZS13cmFwO1wiICtcclxuICAgICAgICAgICAgXCJ3aGl0ZS1zcGFjZTogLWhwLXByZS13cmFwO1wiICtcclxuICAgICAgICAgICAgXCJ3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XCIgK1xyXG4gICAgICAgICAgICBcIndvcmQtd3JhcDogYnJlYWstd29yZDtcIixcclxuICAgICAgICBcImVsbGlwc2lzXCI6IFwib3ZlcmZsb3c6IGhpZGRlbjtcIiArXHJcbiAgICAgICAgICAgIFwidGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XCJcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIEN1cnJlbnQgVmFyaWFibGVzXHJcbiAgICBsZXQgY3VycmVudFNldHRpbmdzID0ge307XHJcbiAgICBsZXQgY3VycmVudFNldHRpbmdzUmVnZXhwO1xyXG4gICAgLy9DdXJyZW50IEZvbnRTaXplc1xyXG4gICAgbGV0IGN1cnJlbnRGb250U2l6ZXMgPSBcIlwiO1xyXG4gICAgLy8gZm9udCBTaXplc1xyXG4gICAgbGV0IGZvbnRTaXplc0NvbGxlY3Rpb247XHJcbiAgICAvLyBWZXJ0aWNhbCBSaHl0aG0gQ2FsY3VsYXRvclxyXG4gICAgbGV0IHJoeXRobUNhbGN1bGF0b3I7XHJcbiAgICAvLyBMYXN0IENzcyBGaWxlXHJcbiAgICBsZXQgZXh0ZW5kTm9kZXMgPSB7fTtcclxuICAgIC8vIGxldCBsYXN0RmlsZTtcclxuXHJcbiAgICAvLyBsZXQgdm0gPSBuZXcgVmlydHVhbE1hY2hpbmUoKTtcclxuICAgIC8vIGZvbnRTaXplIHByb3BlcnR5IFJlZ2V4cFxyXG4gICAgY29uc3QgZm9udFNpemVSZWdleHAgPSBuZXcgUmVnRXhwKFwiZm9udFNpemVcXFxccysoW1xcXFwtXFxcXCRcXFxcQDAtOWEtekEtWl0rKVwiLCBcImlcIik7XHJcblxyXG4gICAgLy8gbGluZUhlaWdodCBwcm9wZXJ0eSBSZWdleHBcclxuICAgIGNvbnN0IGxpbmVSZWdleHAgPSBuZXcgUmVnRXhwKFwiKGxpbmVIZWlnaHR8c3BhY2luZ3xsZWFkaW5nKVxcXFwoKC4qPylcXFxcKVwiLCBcImlcIik7XHJcblxyXG4gICAgLy8gQ29weSBWYWx1ZXMgZnJvbSBvYmplY3QgMiB0byBvYmplY3QgMTtcclxuICAgIGNvbnN0IGV4dGVuZCA9IChvYmplY3QxLCBvYmplY3QyKSA9PiB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0MiksIGtleXNTaXplID0ga2V5cy5sZW5ndGg7IGkgPCBrZXlzU2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBrZXkgPSBrZXlzW2ldO1xyXG4gICAgICAgICAgICBvYmplY3QxW2tleV0gPSBvYmplY3QyW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYmplY3QxO1xyXG4gICAgfTtcclxuICAgIFxyXG4gICAgaWYob3B0aW9ucyAhPSBudWxsKXtcclxuICAgICAgICBleHRlbmQoZ2xvYmFsU2V0dGluZ3MsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRvQ2FtZWxDYXNlID0gKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXlteYS16MC05XSooLiopW15hLXowLTldKiQvLCBcIiQxXCIpLnJlcGxhY2UoL1teYS16MC05XSsoW2EtejAtOV0pL2csIChtYXRjaCwgbGV0dGVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBsZXR0ZXIudG9VcHBlckNhc2UoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvLyBJbml0IGN1cnJlbnQgU2V0dGluZ3NcclxuICAgIGNvbnN0IGluaXRTZXR0aW5ncyA9ICgpID0+IHtcclxuICAgICAgICAvLyBBZGQgZm9udFNpemVzXHJcbiAgICAgICAgaWYgKFwiZm9udC1zaXplc1wiIGluIGdsb2JhbFNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRGb250U2l6ZXMgPSBnbG9iYWxTZXR0aW5nc1tcImZvbnQtc2l6ZXNcIl07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoXCJmb250LXNpemVzXCIgaW4gY3VycmVudFNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRGb250U2l6ZXMgPSBjdXJyZW50Rm9udFNpemVzICsgXCIsIFwiICsgY3VycmVudFNldHRpbmdzW1wiZm9udC1zaXplc1wiXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvbnRTaXplc0NvbGxlY3Rpb24gPSBuZXcgRm9udFNpemVzKGN1cnJlbnRTZXR0aW5ncyk7XHJcbiAgICAgICAgcmh5dGhtQ2FsY3VsYXRvciA9IG5ldyBWZXJ0aWNhbFJoeXRobShjdXJyZW50U2V0dGluZ3MpO1xyXG4gICAgICAgIGZvbnRTaXplc0NvbGxlY3Rpb24uYWRkRm9udFNpemVzKGN1cnJlbnRGb250U2l6ZXMsIHJoeXRobUNhbGN1bGF0b3IpO1xyXG4gICAgICAgIGN1cnJlbnRTZXR0aW5nc1JlZ2V4cCA9IG5ldyBSZWdFeHAoXCJcXFxcQChcIiArIE9iamVjdC5rZXlzKGN1cnJlbnRTZXR0aW5ncykuam9pbihcInxcIikucmVwbGFjZSgvKFxcLXxcXF8pL2csIFwiXFxcXCQxXCIpICsgXCIpXCIsIFwiaVwiKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHdhbGtEZWNscyA9IChub2RlKSA9PiB7XHJcbiAgICAgICAgbm9kZS53YWxrRGVjbHMoZGVjbCA9PiB7XHJcblxyXG4gICAgICAgICAgICBsZXQgZm91bmQ7XHJcblxyXG4gICAgICAgICAgICAvLyBSZXBsYWNlIFZhcmlhYmxlcyB3aXRoIHZhbHVlc1xyXG4gICAgICAgICAgICB3aGlsZSAoKGZvdW5kID0gZGVjbC52YWx1ZS5tYXRjaChjdXJyZW50U2V0dGluZ3NSZWdleHApKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhcmlhYmxlID0gZm91bmRbMV07XHJcbiAgICAgICAgICAgICAgICBkZWNsLnZhbHVlID0gZGVjbC52YWx1ZS5yZXBsYWNlKGN1cnJlbnRTZXR0aW5nc1JlZ2V4cCwgY3VycmVudFNldHRpbmdzW3ZhcmlhYmxlXSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBSZXBsYWNlIEZvbnQgU2l6ZVxyXG4gICAgICAgICAgICB3aGlsZSAoKGZvdW5kID0gZGVjbC52YWx1ZS5tYXRjaChmb250U2l6ZVJlZ2V4cCkpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IFtmb250U2l6ZSwgc2l6ZVVuaXRdID0gZm91bmRbMV0uc3BsaXQoL1xcJC9pKTtcclxuICAgICAgICAgICAgICAgIHNpemVVbml0ID0gKHNpemVVbml0ICE9IG51bGwpID8gc2l6ZVVuaXQudG9Mb3dlckNhc2UoKSA6IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHNpemUgPSBmb250U2l6ZXNDb2xsZWN0aW9uLmdldFNpemUoZm9udFNpemUpO1xyXG4gICAgICAgICAgICAgICAgLy8gV3JpdGUgZm9udCBzaXplXHJcbiAgICAgICAgICAgICAgICBpZiAoc2l6ZVVuaXQgIT0gbnVsbCAmJiAoc2l6ZVVuaXQgPT0gXCJlbVwiIHx8IHNpemVVbml0ID09IFwicmVtXCIpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRlY2wudmFsdWUgPSBkZWNsLnZhbHVlLnJlcGxhY2UoZm9udFNpemVSZWdleHAsIGZvcm1hdFZhbHVlKHNpemUucmVsKSArIHNpemVVbml0KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNpemVVbml0ICE9IG51bGwgJiYgc2l6ZVVuaXQgPT0gXCJweFwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRlY2wudmFsdWUgPSBkZWNsLnZhbHVlLnJlcGxhY2UoZm9udFNpemVSZWdleHAsIGZvcm1hdEludChzaXplLnB4KSArIFwicHhcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVuaXQgPSBnbG9iYWxTZXR0aW5nc1tcInVuaXRcIl0udG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2ZzaXplID0gKHVuaXQgPT0gXCJweFwiKSA/IGZvcm1hdEludChzaXplLnB4KSA6IGZvcm1hdFZhbHVlKHNpemUucmVsKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZGVjbC52YWx1ZSA9IGRlY2wudmFsdWUucmVwbGFjZShmb250U2l6ZVJlZ2V4cCwgY2ZzaXplICsgdW5pdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQWRqdXN0IEZvbnQgU2l6ZVxyXG4gICAgICAgICAgICBpZiAoZGVjbC5wcm9wID09IFwiYWRqdXN0LWZvbnQtc2l6ZVwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IFtmb250U2l6ZSwgbGluZXMsIGJhc2VGb250U2l6ZV0gPSBkZWNsLnZhbHVlLnNwbGl0KC9cXHMrLyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZm9udFNpemVVbml0ID0gZm9udFNpemUubWF0Y2goLyhweHxlbXxyZW0pJC9pKVswXS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvbnRTaXplID0gcmh5dGhtQ2FsY3VsYXRvci5jb252ZXJ0KGZvbnRTaXplLCBmb250U2l6ZVVuaXQsIG51bGwsIGJhc2VGb250U2l6ZSkgKyBjdXJyZW50U2V0dGluZ3NbXCJ1bml0XCJdO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlY2wudmFsdWUgPSBmb250U2l6ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbGluZUhlaWdodCA9IHJoeXRobUNhbGN1bGF0b3IubGluZUhlaWdodChmb250U2l6ZSwgbGluZXMsIGJhc2VGb250U2l6ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGxpbmVIZWlnaHREZWNsID0gcG9zdGNzcy5kZWNsKHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wOiBcImxpbmUtaGVpZ2h0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGxpbmVIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBkZWNsLnNvdXJjZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGVjbC5wcm9wID0gXCJmb250LXNpemVcIjtcclxuICAgICAgICAgICAgICAgIGRlY2wucGFyZW50Lmluc2VydEFmdGVyKGRlY2wsIGxpbmVIZWlnaHREZWNsKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gbGluZUhlaWdodCwgc3BhY2luZywgbGVhZGluZ1xyXG4gICAgICAgICAgICB3aGlsZSAoKGZvdW5kID0gZGVjbC52YWx1ZS5tYXRjaChsaW5lUmVnZXhwKSkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvcGVydHkgPSBmb3VuZFsxXS50b0xvd2VyQ2FzZSgpOyAvLyBzcGFjaW5nIG9yIGxpbmVIZWlnaHRcclxuICAgICAgICAgICAgICAgIGxldCBwYXJhbWV0ZXJzID0gZm91bmRbMl0uc3BsaXQoL1xccypcXCxcXHMqLyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGluZUhlaWdodCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgcGFyYW1ldGVyc1NpemUgPSBwYXJhbWV0ZXJzLmxlbmd0aDsgaSA8IHBhcmFtZXRlcnNTaXplOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBsZXQgW3ZhbHVlLCBmb250U2l6ZV0gPSBwYXJhbWV0ZXJzW2ldLnNwbGl0KC9cXHMrLyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmb250U2l6ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlY2wucGFyZW50LndhbGtEZWNscyhcImZvbnQtc2l6ZVwiLCBmc2RlY2wgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemUgPSBmc2RlY2wudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvbnRTaXplID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemUgPSBjdXJyZW50U2V0dGluZ3NbXCJmb250LXNpemVcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgPT0gXCJsaW5laGVpZ2h0XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZUhlaWdodCArPSByaHl0aG1DYWxjdWxhdG9yLmxpbmVIZWlnaHQoZm9udFNpemUsIHZhbHVlKSArIFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcGVydHkgPT0gXCJzcGFjaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZUhlaWdodCArPSByaHl0aG1DYWxjdWxhdG9yLmxpbmVIZWlnaHQoZm9udFNpemUsIHZhbHVlLCBudWxsLCB0cnVlKSArIFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcGVydHkgPT0gXCJsZWFkaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZUhlaWdodCArPSByaHl0aG1DYWxjdWxhdG9yLmxlYWRpbmcodmFsdWUsIGZvbnRTaXplKSArIFwiIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkZWNsLnZhbHVlID0gZGVjbC52YWx1ZS5yZXBsYWNlKGZvdW5kWzBdLCBsaW5lSGVpZ2h0LnJlcGxhY2UoL1xccyskLywgXCJcIikpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudFNldHRpbmdzW1wicHgtZmFsbGJhY2tcIl0gPT0gXCJ0cnVlXCIgJiYgZGVjbC52YWx1ZS5tYXRjaCgvWzAtOVxcLl0rcmVtL2kpKSB7XHJcbiAgICAgICAgICAgICAgICBkZWNsLnBhcmVudC5pbnNlcnRCZWZvcmUoZGVjbCwgZGVjbC5jbG9uZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJoeXRobUNhbGN1bGF0b3IucmVtRmFsbGJhY2soZGVjbC52YWx1ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBkZWNsLnNvdXJjZVxyXG4gICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiAoY3NzKSA9PiB7XHJcblxyXG4gICAgICAgIGNzcy53YWxrKG5vZGUgPT4ge1xyXG4gICAgICAgICAgICAvLyBpZiAobGFzdEZpbGUgIT0gbm9kZS5zb3VyY2UuaW5wdXQuZmlsZSkge1xyXG4gICAgICAgICAgICAvLyBcdGxhc3RGaWxlID0gbm9kZS5zb3VyY2UuaW5wdXQuZmlsZTtcclxuICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgaWYgKG5vZGUudHlwZSA9PSBcImF0cnVsZVwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJ1bGUgPSBub2RlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChydWxlLm5hbWUgPT0gXCJoYW1zdGVyXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bGUucGFyYW1zICE9IFwiZW5kXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIEdsb2JhbCBWYXJpYWJsZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgcnVsZS53YWxrRGVjbHMoZGVjbCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxTZXR0aW5nc1tkZWNsLnByb3BdID0gZGVjbC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGZvbnRTaXplc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcImZvbnQtc2l6ZXNcIiBpbiBnbG9iYWxTZXR0aW5ncykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50Rm9udFNpemVzID0gZ2xvYmFsU2V0dGluZ3NbXCJmb250LXNpemVzXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBSZXNldCBjdXJyZW50IHZhcmlhYmxlc1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTZXR0aW5ncyA9IGV4dGVuZCh7fSwgZ2xvYmFsU2V0dGluZ3MpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJbml0IGN1cnJlbnQgU2V0dGluZ3NcclxuICAgICAgICAgICAgICAgICAgICBpbml0U2V0dGluZ3MoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVtb3ZlIFJ1bGUgSGFtc3RlclxyXG4gICAgICAgICAgICAgICAgICAgIHJ1bGUucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChydWxlLm5hbWUgPT0gXCIhaGFtc3RlclwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vY3VycmVudFNldHRpbmdzID0gZXh0ZW5kKHt9LCBnbG9iYWxTZXR0aW5ncyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJ1bGUud2Fsa0RlY2xzKGRlY2wgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50U2V0dGluZ3NbZGVjbC5wcm9wXSA9IGRlY2wudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEluaXQgY3VycmVudCBTZXR0aW5nc1xyXG4gICAgICAgICAgICAgICAgICAgIGluaXRTZXR0aW5ncygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBydWxlLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocnVsZS5uYW1lID09IFwiYmFzZWxpbmVcIikge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgZm9udFNpemUgPSBwYXJzZUludChjdXJyZW50U2V0dGluZ3NbXCJmb250LXNpemVcIl0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBicm93c2VyRm9udFNpemUgPSBwYXJzZUludChjdXJyZW50U2V0dGluZ3NbXCJicm93c2VyLWZvbnQtc2l6ZVwiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxlZ2FjeUJyb3dzZXJzID0gY3VycmVudFNldHRpbmdzW1wibGVnYWN5LWJyb3dzZXJzXCJdLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHB4QmFzZWxpbmUgPSBjdXJyZW50U2V0dGluZ3NbXCJweC1iYXNlbGluZVwiXS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmh5dGhtVW5pdCA9IGN1cnJlbnRTZXR0aW5nc1tcInVuaXRcIl0udG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpbmVIZWlnaHQgPSByaHl0aG1DYWxjdWxhdG9yLmxpbmVIZWlnaHQoZm9udFNpemUgKyBcInB4XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBiYXNlbGluZSBmb250IHNpemVcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZm9udFNpemVEZWNsID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHB4QmFzZWxpbmUgPT0gXCJ0cnVlXCIgfHwgKHJoeXRobVVuaXQgPT0gXCJweFwiICYmIGxlZ2FjeUJyb3dzZXJzICE9IFwidHJ1ZVwiKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemVEZWNsID0gcG9zdGNzcy5kZWNsKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3A6IFwiZm9udC1zaXplXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZm9udFNpemUgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHJ1bGUuc291cmNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlbGF0aXZlU2l6ZSA9IDEwMCAqIGZvbnRTaXplIC8gYnJvd3NlckZvbnRTaXplO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemVEZWNsID0gcG9zdGNzcy5kZWNsKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3A6IFwiZm9udC1zaXplXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZm9ybWF0VmFsdWUocmVsYXRpdmVTaXplKSArIFwiJVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBydWxlLnNvdXJjZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbGluZUhlaWdodERlY2wgPSBwb3N0Y3NzLmRlY2woe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wOiBcImxpbmUtaGVpZ2h0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBsaW5lSGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHJ1bGUuc291cmNlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocnVsZS5wYXJhbXMubWF0Y2goL1xccypodG1sXFxzKi8pKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaHRtbFJ1bGUgPSBwb3N0Y3NzLnJ1bGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6IFwiaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBydWxlLnNvdXJjZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWxSdWxlLmFwcGVuZChmb250U2l6ZURlY2wpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sUnVsZS5hcHBlbmQobGluZUhlaWdodERlY2wpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcnVsZS5wYXJlbnQuaW5zZXJ0QWZ0ZXIocnVsZSwgaHRtbFJ1bGUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJoeXRobVVuaXQgPT0gXCJweFwiICYmIGxlZ2FjeUJyb3dzZXJzID09IFwidHJ1ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXN0ZXJpc2tIdG1sUnVsZSA9IHBvc3Rjc3MucnVsZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I6IFwiKiBodG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBydWxlLnNvdXJjZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3Rlcmlza0h0bWxSdWxlLmFwcGVuZChsaW5lSGVpZ2h0RGVjbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBydWxlLnBhcmVudC5pbnNlcnRBZnRlcihydWxlLCBhc3Rlcmlza0h0bWxSdWxlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcnVsZS5wYXJlbnQuaW5zZXJ0QWZ0ZXIocnVsZSwgbGluZUhlaWdodERlY2wpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBydWxlLnBhcmVudC5pbnNlcnRBZnRlcihydWxlLCBmb250U2l6ZURlY2wpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJoeXRobVVuaXQgPT0gXCJyZW1cIiAmJiBjdXJyZW50U2V0dGluZ3NbXCJweC1mYWxsYmFja1wiXSA9PSBcInRydWVcIikge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGUucGFyZW50Lmluc2VydEJlZm9yZShsaW5lSGVpZ2h0RGVjbCwgcG9zdGNzcy5kZWNsKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wOiBcImxpbmUtaGVpZ2h0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJoeXRobUNhbGN1bGF0b3IucmVtRmFsbGJhY2sobGluZUhlaWdodCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBydWxlLnNvdXJjZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcnVsZS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJ1bGUubmFtZSA9PSBcInJ1bGVyXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJ1bGVySWNvblBvc2l0aW9uID0gY3VycmVudFNldHRpbmdzW1wicnVsZXItaWNvbi1wb3NpdGlvblwiXS5yZXBsYWNlKC8oXFwnfFxcXCIpL2csIFwiXCIpLnJlcGxhY2UoL1xcOy9nLCBcIjtcXG5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBsaW5lSGVpZ2h0ID0gKGN1cnJlbnRTZXR0aW5nc1tcImxpbmUtaGVpZ2h0XCJdLm1hdGNoKC9weCQvaSkpID8gY3VycmVudFNldHRpbmdzW1wibGluZS1oZWlnaHRcIl0gOiBjdXJyZW50U2V0dGluZ3NbXCJsaW5lLWhlaWdodFwiXSArIFwiZW1cIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9sZXQgc3ZnID0gXCJkYXRhOmltYWdlL3N2Zyt4bWw7Y2hhcnNldD11dGY4LCUzQ3N2ZyB4bWxucyUzRCUyN2h0dHAlM0ElMkYlMkZ3d3cudzMub3JnJTJGMjAwMCUyRnN2ZyUyNyB2aWV3Qm94JTNEJTI3MCAwIDI0IDI0JTI3JTNFJTNDcGF0aCBmaWxsJTNEJTI3e2NvbG9yfSUyNyBkJTNEJTI3TTE4IDI0Yy0wLjMgMC0wLjU0OC0wLjI0Ni0wLjU0OC0wLjU0NlYxOGMwLTAuMyAwLjI0OC0wLjU0NiAwLjU0OC0wLjU0Nmg1LjQ1MiAgQzIzLjc1NCAxNy40NTQgMjQgMTcuNyAyNCAxOHY1LjQ1NGMwIDAuMy0wLjI0NiAwLjU0Ni0wLjU0OCAwLjU0NkgxOHogTTkuMjcxIDI0Yy0wLjI5OCAwLTAuNTQzLTAuMjQ2LTAuNTQzLTAuNTQ2VjE4ICBjMC0wLjMgMC4yNDUtMC41NDYgMC41NDMtMC41NDZoNS40NTdjMC4zIDAgMC41NDMgMC4yNDYgMC41NDMgMC41NDZ2NS40NTRjMCAwLjMtMC4yNDMgMC41NDYtMC41NDMgMC41NDZIOS4yNzF6IE0wLjU0OCAyNCAgQzAuMjQ2IDI0IDAgMjMuNzU0IDAgMjMuNDU0VjE4YzAtMC4zIDAuMjQ2LTAuNTQ2IDAuNTQ4LTAuNTQ2SDZjMC4zMDIgMCAwLjU0OCAwLjI0NiAwLjU0OCAwLjU0NnY1LjQ1NEM2LjU0OCAyMy43NTQgNi4zMDIgMjQgNiAyNCAgSDAuNTQ4eiBNMTggMTUuMjcxYy0wLjMgMC0wLjU0OC0wLjI0NC0wLjU0OC0wLjU0MlY5LjI3MmMwLTAuMjk5IDAuMjQ4LTAuNTQ1IDAuNTQ4LTAuNTQ1aDUuNDUyQzIzLjc1NCA4LjcyNyAyNCA4Ljk3MyAyNCA5LjI3MiAgdjUuNDU3YzAgMC4yOTgtMC4yNDYgMC41NDItMC41NDggMC41NDJIMTh6IE05LjI3MSAxNS4yNzFjLTAuMjk4IDAtMC41NDMtMC4yNDQtMC41NDMtMC41NDJWOS4yNzJjMC0wLjI5OSAwLjI0NS0wLjU0NSAwLjU0My0wLjU0NSAgaDUuNDU3YzAuMyAwIDAuNTQzIDAuMjQ2IDAuNTQzIDAuNTQ1djUuNDU3YzAgMC4yOTgtMC4yNDMgMC41NDItMC41NDMgMC41NDJIOS4yNzF6IE0wLjU0OCAxNS4yNzFDMC4yNDYgMTUuMjcxIDAgMTUuMDI2IDAgMTQuNzI5ICBWOS4yNzJjMC0wLjI5OSAwLjI0Ni0wLjU0NSAwLjU0OC0wLjU0NUg2YzAuMzAyIDAgMC41NDggMC4yNDYgMC41NDggMC41NDV2NS40NTdjMCAwLjI5OC0wLjI0NiAwLjU0Mi0wLjU0OCAwLjU0MkgwLjU0OHogTTE4IDYuNTQ1ICBjLTAuMyAwLTAuNTQ4LTAuMjQ1LTAuNTQ4LTAuNTQ1VjAuNTQ1QzE3LjQ1MiAwLjI0NSAxNy43IDAgMTggMGg1LjQ1MkMyMy43NTQgMCAyNCAwLjI0NSAyNCAwLjU0NVY2YzAgMC4zLTAuMjQ2IDAuNTQ1LTAuNTQ4IDAuNTQ1ICBIMTh6IE05LjI3MSA2LjU0NUM4Ljk3NCA2LjU0NSA4LjcyOSA2LjMgOC43MjkgNlYwLjU0NUM4LjcyOSAwLjI0NSA4Ljk3NCAwIDkuMjcxIDBoNS40NTdjMC4zIDAgMC41NDMgMC4yNDUgMC41NDMgMC41NDVWNiAgYzAgMC4zLTAuMjQzIDAuNTQ1LTAuNTQzIDAuNTQ1SDkuMjcxeiBNMC41NDggNi41NDVDMC4yNDYgNi41NDUgMCA2LjMgMCA2VjAuNTQ1QzAgMC4yNDUgMC4yNDYgMCAwLjU0OCAwSDYgIGMwLjMwMiAwIDAuNTQ4IDAuMjQ1IDAuNTQ4IDAuNTQ1VjZjMCAwLjMtMC4yNDYgMC41NDUtMC41NDggMC41NDVIMC41NDh6JTI3JTJGJTNFJTNDJTJGc3ZnJTNFXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN2ZyA9IFwiZGF0YTppbWFnZS9zdmcreG1sO2NoYXJzZXQ9dXRmOCwlM0NzdmcgeG1sbnMlM0QlMjdodHRwJTNBJTJGJTJGd3d3LnczLm9yZyUyRjIwMDAlMkZzdmclMjcgdmlld0JveCUzRCUyNzAgMCAyNCAyNCUyNyUzRSUzQ3BhdGggZmlsbCUzRCUyN3tjb2xvcn0lMjcgZCUzRCUyN00wLDZjMCwwLjMwMSwwLjI0NiwwLjU0NSwwLjU0OSwwLjU0NWgyMi45MDZDMjMuNzU2LDYuNTQ1LDI0LDYuMzAxLDI0LDZWMi43M2MwLTAuMzA1LTAuMjQ0LTAuNTQ5LTAuNTQ1LTAuNTQ5SDAuNTQ5ICBDMC4yNDYsMi4xODIsMCwyLjQyNiwwLDIuNzNWNnogTTAsMTMuNjM3YzAsMC4yOTcsMC4yNDYsMC41NDUsMC41NDksMC41NDVoMjIuOTA2YzAuMzAxLDAsMC41NDUtMC4yNDgsMC41NDUtMC41NDV2LTMuMjczICBjMC0wLjI5Ny0wLjI0NC0wLjU0NS0wLjU0NS0wLjU0NUgwLjU0OUMwLjI0Niw5LjgxOCwwLDEwLjA2NiwwLDEwLjM2M1YxMy42Mzd6IE0wLDIxLjI3YzAsMC4zMDUsMC4yNDYsMC41NDksMC41NDksMC41NDloMjIuOTA2ICBjMC4zMDEsMCwwLjU0NS0wLjI0NCwwLjU0NS0wLjU0OVYxOGMwLTAuMzAxLTAuMjQ0LTAuNTQ1LTAuNTQ1LTAuNTQ1SDAuNTQ5QzAuMjQ2LDE3LjQ1NSwwLDE3LjY5OSwwLDE4VjIxLjI3eiUyNyUyRiUzRSUzQyUyRnN2ZyUzRVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vbGV0IHN2ZyA9IFwiZGF0YTppbWFnZS9zdmcreG1sO2NoYXJzZXQ9dXRmOCwlM0NzdmcgeG1sbnMlM0QlMjdodHRwJTNBJTJGJTJGd3d3LnczLm9yZyUyRjIwMDAlMkZzdmclMjcgdmlld0JveCUzRCUyNzAgMCAzMiAzMiUyNyUzRSUzQ3BhdGggZmlsbCUzRCUyN3tjb2xvcn0lMjcgZCUzRCUyN00yOCwyMGgtNHYtOGg0YzEuMTA0LDAsMi0wLjg5NiwyLTJzLTAuODk2LTItMi0yaC00VjRjMC0xLjEwNC0wLjg5Ni0yLTItMnMtMiwwLjg5Ni0yLDJ2NGgtOFY0YzAtMS4xMDQtMC44OTYtMi0yLTIgIFM4LDIuODk2LDgsNHY0SDRjLTEuMTA0LDAtMiwwLjg5Ni0yLDJzMC44OTYsMiwyLDJoNHY4SDRjLTEuMTA0LDAtMiwwLjg5Ni0yLDJzMC44OTYsMiwyLDJoNHY0YzAsMS4xMDQsMC44OTYsMiwyLDJzMi0wLjg5NiwyLTJ2LTQgIGg4djRjMCwxLjEwNCwwLjg5NiwyLDIsMnMyLTAuODk2LDItMnYtNGg0YzEuMTA0LDAsMi0wLjg5NiwyLTJTMjkuMTA0LDIwLDI4LDIweiBNMTIsMjB2LThoOHY4SDEyeiUyNyUyRiUzRSUzQyUyRnN2ZyUzRVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBndGhpY2tuZXNzID0gcGFyc2VGbG9hdChjdXJyZW50U2V0dGluZ3NbXCJydWxlci10aGlja25lc3NcIl0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgYmFja2dyb3VuZCA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U2V0dGluZ3NbXCJydWxlci1iYWNrZ3JvdW5kXCJdID09IFwicG5nXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbWFnZUhlaWdodCA9IChjdXJyZW50U2V0dGluZ3NbXCJsaW5lLWhlaWdodFwiXS5tYXRjaCgvcHgkLykpID9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGN1cnJlbnRTZXR0aW5nc1tcImxpbmUtaGVpZ2h0XCJdKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAocGFyc2VGbG9hdChjdXJyZW50U2V0dGluZ3NbXCJsaW5lLWhlaWdodFwiXSkgKiBwYXJzZUZsb2F0KGN1cnJlbnRTZXR0aW5nc1tcImZvbnQtc2l6ZVwiXSkpLnRvRml4ZWQoMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXR0ZXJuID0gY3VycmVudFNldHRpbmdzW1wicnVsZXItcGF0dGVyblwiXS5zcGxpdCgvXFxzKy8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW1hZ2UgPSBuZXcgUG5nSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2UucnVsZXJNYXRyaXgoaW1hZ2VIZWlnaHQsIGN1cnJlbnRTZXR0aW5nc1tcInJ1bGVyLWNvbG9yXCJdLCBwYXR0ZXJuLCBndGhpY2tuZXNzLCBjdXJyZW50U2V0dGluZ3NbXCJydWxlci1zY2FsZVwiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U2V0dGluZ3NbXCJydWxlci1vdXRwdXRcIl0gIT0gXCJiYXNlNjRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2UuZ2V0RmlsZShjdXJyZW50U2V0dGluZ3NbXCJydWxlci1vdXRwdXRcIl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZCA9IFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKFxcXCIuLi9cIiArIGN1cnJlbnRTZXR0aW5nc1tcInJ1bGVyLW91dHB1dFwiXSArIFwiXFxcIik7XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1wb3NpdGlvbjogbGVmdCB0b3A7XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1yZXBlYXQ6IHJlcGVhdDtcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLXNpemU6IFwiICsgcGF0dGVybi5sZW5ndGggKyBcInB4IFwiICsgaW1hZ2VIZWlnaHQgKyBcInB4O1wiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQgPSBcImJhY2tncm91bmQtaW1hZ2U6IHVybChcXFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LFwiICsgaW1hZ2UuZ2V0QmFzZTY0KCkgKyBcIlxcXCIpO1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtcG9zaXRpb246IGxlZnQgdG9wO1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtcmVwZWF0OiByZXBlYXQ7XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1zaXplOiBcIiArIHBhdHRlcm4ubGVuZ3RoICsgXCJweCBcIiArIGltYWdlSGVpZ2h0ICsgXCJweDtcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGd0aGlja25lc3MgPSBndGhpY2tuZXNzICogMztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQgPSBcImJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byB0b3AsIFwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTZXR0aW5nc1tcInJ1bGVyLWNvbG9yXCJdICsgXCIgXCIgKyBndGhpY2tuZXNzICsgXCIlLCB0cmFuc3BhcmVudCBcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBndGhpY2tuZXNzICsgXCIlKTtcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtc2l6ZTogMTAwJSBcIiArIGxpbmVIZWlnaHQgKyBcIjtcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBydWxlciA9IFwicG9zaXRpb246IGFic29sdXRlO1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsZWZ0OiAwO1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0b3A6IDA7XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm1hcmdpbjogMDtcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFkZGluZzogMDtcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwid2lkdGg6IDEwMCU7XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImhlaWdodDogMTAwJTtcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiei1pbmRleDogOTkwMDtcIiArIGJhY2tncm91bmQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpY29uU2l6ZSA9IGN1cnJlbnRTZXR0aW5nc1tcInJ1bGVyLWljb24tc2l6ZVwiXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IFtzdHlsZSwgcnVsZXJDbGFzc10gPSBjdXJyZW50U2V0dGluZ3NbXCJydWxlci1zdHlsZVwiXS5zcGxpdCgvXFxzKy8pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBbY29sb3IsIGhvdmVyQ29sb3JdID0gY3VycmVudFNldHRpbmdzW1wicnVsZXItaWNvbi1jb2xvcnNcIl0uc3BsaXQoL1xccysvKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJ1bGVyUnVsZSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdHlsZSA9PSBcInN3aXRjaFwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBydWxlclJ1bGUgPSBwb3N0Y3NzLnBhcnNlKFwiLlwiICsgcnVsZXJDbGFzcyArIFwie1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzcGxheTogbm9uZTtcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBydWxlciArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIn1cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlucHV0W2lkPVxcXCJcIiArIHJ1bGVyQ2xhc3MgKyBcIlxcXCJdIHtcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRpc3BsYXk6bm9uZTtcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIn1cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlucHV0W2lkPVxcXCJcIiArIHJ1bGVyQ2xhc3MgKyBcIlxcXCJdICsgbGFiZWwge1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiei1pbmRleDogOTk5OTtcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRpc3BsYXk6IGlubGluZS1ibG9jaztcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBvc2l0aW9uOiBhYnNvbHV0ZTtcIiArIHJ1bGVySWNvblBvc2l0aW9uICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWFyZ2luOiAwO1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGFkZGluZzogMDtcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIndpZHRoOiBcIiArIGljb25TaXplICsgXCI7XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoZWlnaHQ6IFwiICsgaWNvblNpemUgKyBcIjtcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImN1cnNvcjogcG9pbnRlcjtcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtaW1hZ2U6IHVybChcXFwiXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ZnLnJlcGxhY2UoL1xce2NvbG9yXFx9LywgZXNjYXBlKGNvbG9yKSkgKyBcIlxcXCIpO1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwifVwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5wdXRbaWQ9XFxcIlwiICsgcnVsZXJDbGFzcyArIFwiXFxcIl06Y2hlY2tlZCArIGxhYmVsLCBpbnB1dFtpZD1cXFwiXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVsZXJDbGFzcyArIFwiXFxcIl06aG92ZXIgKyBsYWJlbCB7XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXFxcIlwiICsgc3ZnLnJlcGxhY2UoL1xce2NvbG9yXFx9LywgZXNjYXBlKGhvdmVyQ29sb3IpKSArIFwiXFxcIik7XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ9XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpbnB1dFtpZD1cXFwiXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVsZXJDbGFzcyArIFwiXFxcIl06Y2hlY2tlZCB+IC5cIiArIHJ1bGVyQ2xhc3MgKyBcIntcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRpc3BsYXk6IGJsb2NrO1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwifVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdHlsZSA9PSBcImhvdmVyXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGVyUnVsZSA9IHBvc3Rjc3MucGFyc2UoXCIuXCIgKyBydWxlckNsYXNzICsgXCJ7XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwb3NpdGlvbjogYWJzb2x1dGU7XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVsZXJJY29uUG9zaXRpb24gK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtYXJnaW46IDA7XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwYWRkaW5nOiAwO1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwid2lkdGg6IFwiICsgaWNvblNpemUgKyBcIjtcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImhlaWdodDogXCIgKyBpY29uU2l6ZSArIFwiO1wiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKFxcXCJcIiArIHN2Zy5yZXBsYWNlKC9cXHtjb2xvclxcfS8sIGVzY2FwZShjb2xvcikpICsgXCJcXFwiKTtcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRyYW5zaXRpb246IGJhY2tncm91bmQtaW1hZ2UgMC41cyBlYXNlLWluLW91dDtcIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIn1cIiArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIi5cIiArIHJ1bGVyQ2xhc3MgKyBcIjpob3ZlclwiICsgXCJ7XCIgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjdXJzb3I6IHBvaW50ZXI7XCIgKyBydWxlciArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIn1cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc3R5bGUgPT0gXCJhbHdheXNcIikge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcnVsZXJSdWxlID0gcG9zdGNzcy5wYXJzZShcIi5cIiArIHJ1bGVyQ2xhc3MgKyBcIntcXG5cIiArIHJ1bGVyICsgXCJ9XFxuXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChydWxlclJ1bGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBydWxlclJ1bGUuc291cmNlID0gcnVsZS5zb3VyY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGUucGFyZW50Lmluc2VydEJlZm9yZShydWxlLCBydWxlclJ1bGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcnVsZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocnVsZS5uYW1lLm1hdGNoKC9eKGVsbGlwc2lzfG5vd3JhcHxmb3JjZXdyYXApJC9pKSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcGVydHkgPSBydWxlLm5hbWUudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRlY2xzID0gaGVscGVyc1twcm9wZXJ0eV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PSBcImVsbGlwc2lzXCIgJiYgcnVsZS5wYXJhbXMgPT0gXCJ0cnVlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVjbHMgPSBoZWxwZXJzW1wibm93cmFwXCJdICsgZGVjbHM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U2V0dGluZ3NbXCJwcm9wZXJ0aWVzXCJdID09IFwiaW5saW5lXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpZGVjbHMgPSBwb3N0Y3NzLnBhcnNlKGRlY2xzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcnVsZS5wYXJlbnQuaW5zZXJ0QmVmb3JlKHJ1bGUsIGlkZWNscyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFNldHRpbmdzW1wicHJvcGVydGllc1wiXSA9PSBcImV4dGVuZFwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXh0ZW5kTmFtZSA9IHRvQ2FtZWxDYXNlKHJ1bGUubmFtZS50b0xvd2VyQ2FzZSgpICsgXCIgXCIgKyBydWxlLnBhcmFtcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXh0ZW5kTm9kZXNbZXh0ZW5kTmFtZV0gPT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNhdmUgZXh0ZW5kIGluZm9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuZE5vZGVzW2V4dGVuZE5hbWVdID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBydWxlLnBhcmVudC5zZWxlY3RvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWNsczogZGVjbHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50czogW3J1bGUucGFyZW50XSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2OiBydWxlLnByZXYoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHJ1bGUuc291cmNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0FwcGVuZCBzZWxlY3RvciBhbmQgdXBkYXRlIGNvdW50ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuZE5vZGVzW2V4dGVuZE5hbWVdLnNlbGVjdG9yID0gZXh0ZW5kTm9kZXNbZXh0ZW5kTmFtZV0uc2VsZWN0b3IgKyBcIiwgXCIgKyBydWxlLnBhcmVudC5zZWxlY3RvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuZE5vZGVzW2V4dGVuZE5hbWVdLnBhcmVudHMucHVzaChydWxlLnBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRlbmROb2Rlc1tleHRlbmROYW1lXS5jb3VudCsrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcnVsZS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJ1bGUubmFtZS5tYXRjaCgvXihyZXNldHxub3JtYWxpemUpJC9pKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwcm9wZXJ0eSA9IHJ1bGUubmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBydWxlcyA9IHBvc3Rjc3MucGFyc2UoaGVscGVyc1twcm9wZXJ0eV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJ1bGVzLnNvdXJjZSA9IHJ1bGUuc291cmNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJ1bGUucGFyZW50Lmluc2VydEFmdGVyKHJ1bGUsIHJ1bGVzKTtcclxuICAgICAgICAgICAgICAgICAgICBydWxlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gV2FsayBpbiBtZWRpYSBxdWVyaWVzXHJcbiAgICAgICAgICAgICAgICBub2RlLndhbGsoY2hpbGQgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQudHlwZSA9PSBcInJ1bGVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXYWxrIGRlY2xzIGluIHJ1bGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2Fsa0RlY2xzKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvLyBlbHNlIGlmIChydWxlLm5hbWUgPT0gXCJqc1wiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gICAgIGxldCBqY3NzID0gcnVsZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIGxldCBjb2RlID0gamNzcy5yZXBsYWNlKC9cXEBqc1xccypcXHsoW1xcc1xcU10rKVxcfSQvaSwgXCIkMVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coamNzcyk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gcnVsZXJSdWxlLnNvdXJjZSA9IHJ1bGUuc291cmNlO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIHJ1bGUucGFyZW50Lmluc2VydEJlZm9yZShydWxlLCBydWxlclJ1bGUpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIHJ1bGUucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUudHlwZSA9PSBcInJ1bGVcIikge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFdhbGsgZGVjbHMgaW4gcnVsZVxyXG4gICAgICAgICAgICAgICAgd2Fsa0RlY2xzKG5vZGUpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50U2V0dGluZ3NbXCJyZW1vdmUtY29tbWVudHNcIl0gPT0gXCJ0cnVlXCIgJiYgbm9kZS50eXBlID09IFwiY29tbWVudFwiKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBBcHBlbmQgRXh0ZW5kcyB0byBDU1NcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwga2V5cyA9IE9iamVjdC5rZXlzKGV4dGVuZE5vZGVzKSwga2V5c1NpemUgPSBrZXlzLmxlbmd0aDsgaSA8IGtleXNTaXplOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IGtleSA9IGtleXNbaV07XHJcbiAgICAgICAgICAgIGlmIChleHRlbmROb2Rlc1trZXldLmNvdW50ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJ1bGUgPSBwb3N0Y3NzLnBhcnNlKGV4dGVuZE5vZGVzW2tleV0uc2VsZWN0b3IgKyBcIntcIiArIGV4dGVuZE5vZGVzW2tleV0uZGVjbHMgKyBcIn1cIik7XHJcbiAgICAgICAgICAgICAgICBydWxlLnNvdXJjZSA9IGV4dGVuZE5vZGVzW2tleV0uc291cmNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGNzcy5pbnNlcnRCZWZvcmUoZXh0ZW5kTm9kZXNba2V5XS5wYXJlbnRzWzBdLCBydWxlKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGVjbHMgPSBwb3N0Y3NzLnBhcnNlKGV4dGVuZE5vZGVzW2tleV0uZGVjbHMpO1xyXG4gICAgICAgICAgICAgICAgZGVjbHMuc291cmNlID0gZXh0ZW5kTm9kZXNba2V5XS5zb3VyY2U7XHJcbiAgICAgICAgICAgICAgICBleHRlbmROb2Rlc1trZXldLnBhcmVudHNbMF0uaW5zZXJ0QWZ0ZXIoZXh0ZW5kTm9kZXNba2V5XS5wcmV2LCBkZWNscyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSB1bnVzZWQgcGFyZW50IG5vZGVzLlxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgcGFyZW50cyA9IGV4dGVuZE5vZGVzW2tleV0ucGFyZW50cy5sZW5ndGg7IGogPCBwYXJlbnRzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChleHRlbmROb2Rlc1trZXldLnBhcmVudHNbal0ubm9kZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBleHRlbmROb2Rlc1trZXldLnBhcmVudHNbal0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBoYW1zdGVyOyJdfQ==
