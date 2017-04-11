"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @version 1.0
 * @author Grigory Vasilyev <postcss.hamster@gmail.com> https://github.com/h0tc0d3
 * @copyright Copyright (c) 2017, Grigory Vasilyev
 * @license Apache License, Version 2.0, http://www.apache.org/licenses/LICENSE-2.0 
 */

/**
 * Format Float Values.
 * @param {number} value - input value.
 */
function formatValue(value) {
        return value.toFixed(4).replace(/0+$/g, "").replace(/\.$/g, "");
}

/**
 * Format Number to Int.
 * @param {number} value - input value.
 */

function formatInt(value) {
        return value.toFixed(0);
}

/**
 * @module VerticalRhythm
 * 
 * @description VerticalRhythm Class for calculate rhythm sizes ans convert units.
 */

var VerticalRhythm = function () {

        /**
         * Constructor for class VerticalRhythm.
         * 
         * @memberOf module:VerticalRhythm
         * 
         * @param settings - settings hash.
         * 
         * <p>
         * Use:
         * settings["font-size"] - base font size in pixels.
         * settings["px-fallback"] - boolean pixel fallback. Convert relative sizes to pixels. If rhythm unit rem then rem value doubled with pixels values.
         * If rhythm unit px and option will be set then in line height will be pixels like 24px, else relative size like 1.45(without em or rem)
         * settings["line-height"] - base line height in pixels or relative value(without em or rem).
         * </p>
         */
        function VerticalRhythm(settings) {
                _classCallCheck(this, VerticalRhythm);

                this.baseFontSize = parseInt(settings["font-size"]);
                this.rhythmUnit = settings["unit"];
                this.pxFallback = settings["px-fallback"];
                this.minLinePadding = parseInt(settings["min-line-padding"]);
                this.roundToHalfLine = settings["round-to-half-line"];

                // Base Line Height in Pixels
                this.baseLineHeight = settings["line-height"].match(/px$/i) ? parseFloat(settings["line-height"]) : parseFloat(settings["line-height"]) * this.baseFontSize;
                this.baseLineHeightRatio = settings["line-height"].match(/px$/i) ? parseFloat(settings["line-height"]) / parseInt(this.baseFontSize) : parseFloat(settings["line-height"]);
                this.baseLeading = this.convert(this.baseLineHeight - this.baseFontSize, "px", this.rhythmUnit);
        }

        /**
         * Convert values from unit to unit.
         * 
         * @memberOf module:VerticalRhythm
         * 
         * @param {number} value - input value
         * @param valueUnit - input value unit
         * @param format - output value unit
         * @param fromContext - from base font size
         * @param toContext - to new base font size
         * 
         * @return {number} - output value.
         */


        VerticalRhythm.prototype.convert = function convert(value, valueUnit) {
                var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
                var fromContext = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
                var toContext = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;


                value = parseFloat(value);

                if (format == null) {
                        format = this.rhythmUnit;
                }

                if (valueUnit == format) {
                        return value;
                }

                if (fromContext == null) {
                        fromContext = this.baseFontSize;
                } else {
                        fromContext = parseFloat(fromContext);
                }

                if (toContext == null) {
                        toContext = fromContext;
                } else {
                        toContext = parseFloat(toContext);
                }

                var pxValue = 0;

                if (valueUnit == "em") {
                        pxValue = value * fromContext;
                } else if (valueUnit == "rem") {
                        pxValue = value * this.baseFontSize;
                } else if (valueUnit == "%") {
                        pxValue = value * fromContext / 100;
                } else if (valueUnit == "ex") {
                        pxValue = value * fromContext / 2;
                } else {
                        pxValue = value;
                }

                var result = pxValue;

                if (format == "em") {
                        result = pxValue / toContext;
                } else if (format == "rem") {
                        result = pxValue / this.baseFontSize;
                } else if (format == "%") {
                        result = pxValue * 100 / toContext;
                } else if (format == "ex") {
                        result = pxValue * 2 / toContext;
                }

                return result;
        };

        /**
         * Calculate the minimum multiple rhythm units(lines) needed to contain the font-size. 1 rhythm unit = base line height in pixels.
         * 
         * @memberOf module:VerticalRhythm
         * 
         * @param fontSize - font size in pixels, em, rem like 1.5em.
         * 
         * @return {number} - number of lines.
         */


        VerticalRhythm.prototype.lines = function lines(fontSize) {

                fontSize = parseFloat(fontSize);

                var lines = 0;

                if (this.rhythmUnit == "px") {

                        lines = this.roundToHalfLine == "true" ? Math.ceil(2 * fontSize / this.baseLineHeight) / 2 : Math.ceil(fontSize / this.baseLineHeight);
                } else if (this.rhythmUnit == "em" || this.rhythmUnit == "rem") {

                        lines = this.roundToHalfLine == "true" ? Math.ceil(2 * fontSize / this.baseLineHeightRatio) / 2 : Math.ceil(fontSize / this.baseLineHeightRatio);
                }
                //If lines are cramped include some extra lead.
                if (lines * this.baseLineHeight - fontSize < this.minLinePadding * 2) {
                        lines = this.roundToHalfLine ? lines + 0.5 : lines + 1;
                }

                return lines;
        };

        /**
         * Calculate line height value in rhythm units for font size. Generate line height from font size or input lines.
         * 
         * @memberOf module:VerticalRhythm
         * 
         * @param fontSize - font size in pixels, em, rem like 1.5em.
         * @param value - input lines, before output 1 line height will be multiply with value.
         * @param baseFontSize - base font size for calculation relative sizes for px or em.
         * @param pxFallback - boolean pixel fallback option. Ignore settings["px-fallback"] option. Convert relative sizes to pixels. If rhythm unit rem then rem value doubled with pixels values.
         * If rhythm unit px and option will be set then in line height will be pixels like 24px, else relative size like 1.45(without em or rem).
         * 
         * @return {number} - line height in rhythm unit.
         */


        VerticalRhythm.prototype.lineHeight = function lineHeight(fontSize, value) {
                var baseFontSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
                var pxFallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;


                if (fontSize == null) {
                        fontSize = this.baseFontSize + "px";
                }

                if (fontSize != null && (this.rhythmUnit == "em" || value == null)) {

                        var fontSizeUnit = fontSize.match(/(px|em|rem)$/i)[0].toLowerCase();

                        if (fontSizeUnit != this.rhythmUnit || baseFontSize != null) {

                                fontSize = baseFontSize != null ? this.convert(fontSize, fontSizeUnit, this.rhythmUnit, baseFontSize) : this.convert(fontSize, fontSizeUnit, this.rhythmUnit);
                        } else {

                                fontSize = parseFloat(fontSize);
                        }
                }

                value = value != null ? parseFloat(value) : this.lines(fontSize);

                var result = 0;

                if (this.rhythmUnit == "px") {

                        result = fontSize != null && this.pxFallback != "true" && !pxFallback ? formatValue(this.baseLineHeight / fontSize) : formatInt(this.baseLineHeight * value) + "px";
                } else if (this.rhythmUnit == "em") {

                        result = formatValue(value * this.baseLineHeightRatio / fontSize) + "em";
                } else if (this.rhythmUnit == "rem") {

                        result = formatValue(value * this.baseLineHeightRatio) + "rem";
                }

                return result;
        };

        /**
         * Calculate leading value in rhythm unit
         *
         * @memberOf module:VerticalRhythm
         * 
         * @description
         * 1 leading(in pixels) = base line height(in pixels) - base font size(in pixels).
         * 
         * @param value - input lines, before output 1 line height will be multiply with value.
         * @param fontSize - font size in pixels, em, rem like 1.5em.
         * 
         * @return {number} - leading in rhythm unit.
         */


        VerticalRhythm.prototype.leading = function leading(value, fontSize) {

                if (fontSize == null) {
                        fontSize = this.baseFontSize + "px";
                }

                var fontSizeUnit = fontSize.match(/(px|em|rem)$/i)[0].toLowerCase();

                if (fontSizeUnit != this.rhythmUnit) {

                        fontSize = this.convert(fontSize, fontSizeUnit, this.rhythmUnit);
                } else {

                        fontSize = parseFloat(fontSize);
                }

                var lines = this.lines(fontSize),
                    result = 0;

                if (this.rhythmUnit == "px") {

                        result = formatInt((lines * this.baseLineHeight - fontSize) * value) + "px";
                } else if (this.rhythmUnit == "em") {

                        result = formatValue((this.baseLineHeightRatio * lines - fontSize) * value / fontSize) + "em";
                } else if (this.rhythmUnit == "rem") {

                        result = formatValue((lines * this.baseLineHeightRatio - fontSize) * value) + "rem";
                }

                return result;
        };

        /**
         * Calculate rhythm value in rhythm unit. It used for height values, etc. 
         *
         * @memberOf module:VerticalRhythm
         * 
         * @description
         * 
         * If value 450px, and base font size 16, line-height 1.5, increase = false then return 432px.
         * If value 450px, and base font size 16, line-height 1.5, increase = true then return 456px.
         * 
         * @param value - input value like 450px; 10em; 100rem;.
         * @param fontSize - font size in pixels, em, rem like 1.5em.
         * @param increase - increase or decrease size. Default decrease. increase = false.
         * @param outputUnit - output value unit. 
         * 
         * @return {number} - rhythmd value rhythm unit.
         */

        VerticalRhythm.prototype.rhythm = function rhythm(value, fontSize) {
                var increase = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                var outputUnit = arguments[3];


                if (fontSize == null) {
                        fontSize = this.baseFontSize + "px";
                }

                if (outputUnit == null) {
                        outputUnit = this.rhythmUnit;
                }

                var fontSizeUnit = fontSize.match(/(px|em|rem)$/i)[0].toLowerCase();

                if (fontSizeUnit != this.rhythmUnit) {

                        fontSize = this.convert(fontSize, fontSizeUnit, this.rhythmUnit);
                } else {

                        fontSize = parseFloat(fontSize);
                }

                var valueUnit = value.match(/(px|em|rem)$/i)[0].toLowerCase();

                if (valueUnit != this.rhythmUnit) {

                        value = this.convert(value, valueUnit, this.rhythmUnit);
                } else {

                        value = parseFloat(value);
                }

                var lines = this.lines(value),
                    result = 0;

                if (!increase && value < lines * fontSize * this.baseLineHeightRatio) {
                        lines = lines - 1;
                }

                if (outputUnit == "px") {

                        result = formatInt(lines * this.baseLineHeight) + "px";
                } else if (outputUnit == "em") {

                        result = formatValue(this.baseLineHeightRatio * lines / fontSize) + "em";
                } else if (outputUnit == "rem") {

                        result = formatValue(this.baseLineHeightRatio * lines) + "rem";
                }

                return result;
        };

        /**
         * Convert rem to pixel value.
         * 
         * @param value - input value in rem.
         * 
         * @return {number} - output value in pixels.
         */


        VerticalRhythm.prototype.remFallback = function remFallback(value) {

                var result = value;
                var found = null;

                while (found = result.match(/([0-9\.]+)rem/i)) {
                        result = result.replace(found[0], formatInt(this.convert(found[1], "rem", "px")) + "px");
                }

                return result;
        };

        return VerticalRhythm;
}();

/**
 * Export Vertical Rhythm Class.
 * Export formatValue and formatInt functions.
 */


exports.formatInt = formatInt;
exports.formatValue = formatValue;
exports.VerticalRhythm = VerticalRhythm;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlZlcnRpY2FsUmh5dGhtLmVzNiJdLCJuYW1lcyI6WyJmb3JtYXRWYWx1ZSIsInZhbHVlIiwidG9GaXhlZCIsInJlcGxhY2UiLCJmb3JtYXRJbnQiLCJWZXJ0aWNhbFJoeXRobSIsInNldHRpbmdzIiwiYmFzZUZvbnRTaXplIiwicGFyc2VJbnQiLCJyaHl0aG1Vbml0IiwicHhGYWxsYmFjayIsIm1pbkxpbmVQYWRkaW5nIiwicm91bmRUb0hhbGZMaW5lIiwiYmFzZUxpbmVIZWlnaHQiLCJtYXRjaCIsInBhcnNlRmxvYXQiLCJiYXNlTGluZUhlaWdodFJhdGlvIiwiYmFzZUxlYWRpbmciLCJjb252ZXJ0IiwidmFsdWVVbml0IiwiZm9ybWF0IiwiZnJvbUNvbnRleHQiLCJ0b0NvbnRleHQiLCJweFZhbHVlIiwicmVzdWx0IiwibGluZXMiLCJmb250U2l6ZSIsIk1hdGgiLCJjZWlsIiwibGluZUhlaWdodCIsImZvbnRTaXplVW5pdCIsInRvTG93ZXJDYXNlIiwibGVhZGluZyIsInJoeXRobSIsImluY3JlYXNlIiwib3V0cHV0VW5pdCIsInJlbUZhbGxiYWNrIiwiZm91bmQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7O0FBT0E7Ozs7QUFJQSxTQUFTQSxXQUFULENBQXFCQyxLQUFyQixFQUE0QjtBQUN4QixlQUFPQSxNQUFNQyxPQUFOLENBQWMsQ0FBZCxFQUFpQkMsT0FBakIsQ0FBeUIsTUFBekIsRUFBaUMsRUFBakMsRUFBcUNBLE9BQXJDLENBQTZDLE1BQTdDLEVBQXFELEVBQXJELENBQVA7QUFDSDs7QUFFRDs7Ozs7QUFLQSxTQUFTQyxTQUFULENBQW1CSCxLQUFuQixFQUEwQjtBQUN0QixlQUFPQSxNQUFNQyxPQUFOLENBQWMsQ0FBZCxDQUFQO0FBQ0g7O0FBRUQ7Ozs7OztJQU1NRyxjOztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7QUFlQSxnQ0FBWUMsUUFBWixFQUFzQjtBQUFBOztBQUNsQixxQkFBS0MsWUFBTCxHQUFvQkMsU0FBU0YsU0FBUyxXQUFU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Z0NBQVFBLFFBQVEsQ0FBaEI7QUFDSDs7QUFFRCxvQkFBSVUsY0FBYyxJQUFsQixFQUF3Qjs7QUFFcEJYLGlDQUFTcEIsVUFBVXFCLFFBQVEsS0FBS1osY0FBdkIsSUFBeUMsSUFBbEQ7QUFFSCxpQkFKRCxNQUlPLElBQUlzQixjQUFjLElBQWxCLEVBQXdCOztBQUUzQlgsaUNBQVN4QixZQUFZLEtBQUtnQixtQkFBTCxHQUEyQlMsS0FBM0IsR0FBbUNDLFFBQS9DLElBQTJELElBQXBFO0FBRUgsaUJBSk0sTUFJQSxJQUFJUyxjQUFjLEtBQWxCLEVBQXlCOztBQUU1QlgsaUNBQVN4QixZQUFZLEtBQUtnQixtQkFBTCxHQUEyQlMsS0FBdkMsSUFBZ0QsS0FBekQ7QUFFSDs7QUFFRCx1QkFBT0QsTUFBUDtBQUVILFM7O0FBRUQ7Ozs7Ozs7OztpQ0FPQVksVyx3QkFBWW5DLEssRUFBTzs7QUFFZixvQkFBSXVCLFNBQVN2QixLQUFiO0FBQ0Esb0JBQUlvQyxRQUFRLElBQVo7O0FBRUEsdUJBQVFBLFFBQVFiLE9BQU9WLEtBQVAsQ0FBYSxnQkFBYixDQUFoQixFQUFpRDtBQUM3Q1UsaUNBQVNBLE9BQU9yQixPQUFQLENBQWVrQyxNQUFNLENBQU4sQ0FBZixFQUF5QmpDLFVBQVUsS0FBS2MsT0FBTCxDQUFhbUIsTUFBTSxDQUFOLENBQWIsRUFBdUIsS0FBdkIsRUFBOEIsSUFBOUIsQ0FBVixJQUFpRCxJQUExRSxDQUFUO0FBQ0g7O0FBRUQsdUJBQU9iLE1BQVA7QUFDSCxTOzs7OztBQUdMOzs7Ozs7UUFLSXBCLFMsR0FBQUEsUztRQUNBSixXLEdBQUFBLFc7UUFDQUssYyxHQUFBQSxjIiwiZmlsZSI6IlZlcnRpY2FsUmh5dGhtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEB2ZXJzaW9uIDEuMFxyXG4gKiBAYXV0aG9yIEdyaWdvcnkgVmFzaWx5ZXYgPHBvc3Rjc3MuaGFtc3RlckBnbWFpbC5jb20+IGh0dHBzOi8vZ2l0aHViLmNvbS9oMHRjMGQzXHJcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDE3LCBHcmlnb3J5IFZhc2lseWV2XHJcbiAqIEBsaWNlbnNlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCwgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wIFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBGb3JtYXQgRmxvYXQgVmFsdWVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBpbnB1dCB2YWx1ZS5cclxuICovXHJcbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdmFsdWUudG9GaXhlZCg0KS5yZXBsYWNlKC8wKyQvZywgXCJcIikucmVwbGFjZSgvXFwuJC9nLCBcIlwiKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEZvcm1hdCBOdW1iZXIgdG8gSW50LlxyXG4gKiBAcGFyYW0ge251bWJlcn0gdmFsdWUgLSBpbnB1dCB2YWx1ZS5cclxuICovXHJcblxyXG5mdW5jdGlvbiBmb3JtYXRJbnQodmFsdWUpIHtcclxuICAgIHJldHVybiB2YWx1ZS50b0ZpeGVkKDApO1xyXG59XHJcblxyXG4vKipcclxuICogQG1vZHVsZSBWZXJ0aWNhbFJoeXRobVxyXG4gKiBcclxuICogQGRlc2NyaXB0aW9uIFZlcnRpY2FsUmh5dGhtIENsYXNzIGZvciBjYWxjdWxhdGUgcmh5dGhtIHNpemVzIGFucyBjb252ZXJ0IHVuaXRzLlxyXG4gKi9cclxuXHJcbmNsYXNzIFZlcnRpY2FsUmh5dGhtIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yIGZvciBjbGFzcyBWZXJ0aWNhbFJoeXRobS5cclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIG1vZHVsZTpWZXJ0aWNhbFJoeXRobVxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gc2V0dGluZ3MgLSBzZXR0aW5ncyBoYXNoLlxyXG4gICAgICogXHJcbiAgICAgKiA8cD5cclxuICAgICAqIFVzZTpcclxuICAgICAqIHNldHRpbmdzW1wiZm9udC1zaXplXCJdIC0gYmFzZSBmb250IHNpemUgaW4gcGl4ZWxzLlxyXG4gICAgICogc2V0dGluZ3NbXCJweC1mYWxsYmFja1wiXSAtIGJvb2xlYW4gcGl4ZWwgZmFsbGJhY2suIENvbnZlcnQgcmVsYXRpdmUgc2l6ZXMgdG8gcGl4ZWxzLiBJZiByaHl0aG0gdW5pdCByZW0gdGhlbiByZW0gdmFsdWUgZG91YmxlZCB3aXRoIHBpeGVscyB2YWx1ZXMuXHJcbiAgICAgKiBJZiByaHl0aG0gdW5pdCBweCBhbmQgb3B0aW9uIHdpbGwgYmUgc2V0IHRoZW4gaW4gbGluZSBoZWlnaHQgd2lsbCBiZSBwaXhlbHMgbGlrZSAyNHB4LCBlbHNlIHJlbGF0aXZlIHNpemUgbGlrZSAxLjQ1KHdpdGhvdXQgZW0gb3IgcmVtKVxyXG4gICAgICogc2V0dGluZ3NbXCJsaW5lLWhlaWdodFwiXSAtIGJhc2UgbGluZSBoZWlnaHQgaW4gcGl4ZWxzIG9yIHJlbGF0aXZlIHZhbHVlKHdpdGhvdXQgZW0gb3IgcmVtKS5cclxuICAgICAqIDwvcD5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MpIHtcclxuICAgICAgICB0aGlzLmJhc2VGb250U2l6ZSA9IHBhcnNlSW50KHNldHRpbmdzW1wiZm9udC1zaXplXCJdKTtcclxuICAgICAgICB0aGlzLnJoeXRobVVuaXQgPSBzZXR0aW5nc1tcInVuaXRcIl07XHJcbiAgICAgICAgdGhpcy5weEZhbGxiYWNrID0gc2V0dGluZ3NbXCJweC1mYWxsYmFja1wiXTtcclxuICAgICAgICB0aGlzLm1pbkxpbmVQYWRkaW5nID0gcGFyc2VJbnQoc2V0dGluZ3NbXCJtaW4tbGluZS1wYWRkaW5nXCJdKTtcclxuICAgICAgICB0aGlzLnJvdW5kVG9IYWxmTGluZSA9IHNldHRpbmdzW1wicm91bmQtdG8taGFsZi1saW5lXCJdO1xyXG5cclxuICAgICAgICAvLyBCYXNlIExpbmUgSGVpZ2h0IGluIFBpeGVsc1xyXG4gICAgICAgIHRoaXMuYmFzZUxpbmVIZWlnaHQgPSAoc2V0dGluZ3NbXCJsaW5lLWhlaWdodFwiXS5tYXRjaCgvcHgkL2kpKSA/IHBhcnNlRmxvYXQoc2V0dGluZ3NbXCJsaW5lLWhlaWdodFwiXSkgOiBwYXJzZUZsb2F0KHNldHRpbmdzW1wibGluZS1oZWlnaHRcIl0pICogdGhpcy5iYXNlRm9udFNpemU7XHJcbiAgICAgICAgdGhpcy5iYXNlTGluZUhlaWdodFJhdGlvID0gKHNldHRpbmdzW1wibGluZS1oZWlnaHRcIl0ubWF0Y2goL3B4JC9pKSkgPyBwYXJzZUZsb2F0KHNldHRpbmdzW1wibGluZS1oZWlnaHRcIl0pIC8gcGFyc2VJbnQodGhpcy5iYXNlRm9udFNpemUpIDogcGFyc2VGbG9hdChzZXR0aW5nc1tcImxpbmUtaGVpZ2h0XCJdKTtcclxuICAgICAgICB0aGlzLmJhc2VMZWFkaW5nID0gdGhpcy5jb252ZXJ0KHRoaXMuYmFzZUxpbmVIZWlnaHQgLSB0aGlzLmJhc2VGb250U2l6ZSwgXCJweFwiLCB0aGlzLnJoeXRobVVuaXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udmVydCB2YWx1ZXMgZnJvbSB1bml0IHRvIHVuaXQuXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBtb2R1bGU6VmVydGljYWxSaHl0aG1cclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlIC0gaW5wdXQgdmFsdWVcclxuICAgICAqIEBwYXJhbSB2YWx1ZVVuaXQgLSBpbnB1dCB2YWx1ZSB1bml0XHJcbiAgICAgKiBAcGFyYW0gZm9ybWF0IC0gb3V0cHV0IHZhbHVlIHVuaXRcclxuICAgICAqIEBwYXJhbSBmcm9tQ29udGV4dCAtIGZyb20gYmFzZSBmb250IHNpemVcclxuICAgICAqIEBwYXJhbSB0b0NvbnRleHQgLSB0byBuZXcgYmFzZSBmb250IHNpemVcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSAtIG91dHB1dCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgY29udmVydCh2YWx1ZSwgdmFsdWVVbml0LCBmb3JtYXQgPSBudWxsLCBmcm9tQ29udGV4dCA9IG51bGwsIHRvQ29udGV4dCA9IG51bGwpIHtcclxuXHJcbiAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcclxuXHJcbiAgICAgICAgaWYgKGZvcm1hdCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGZvcm1hdCA9IHRoaXMucmh5dGhtVW5pdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZVVuaXQgPT0gZm9ybWF0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmcm9tQ29udGV4dCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGZyb21Db250ZXh0ID0gdGhpcy5iYXNlRm9udFNpemU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZnJvbUNvbnRleHQgPSBwYXJzZUZsb2F0KGZyb21Db250ZXh0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0b0NvbnRleHQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0b0NvbnRleHQgPSBmcm9tQ29udGV4dDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0b0NvbnRleHQgPSBwYXJzZUZsb2F0KHRvQ29udGV4dCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcHhWYWx1ZSA9IDA7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZVVuaXQgPT0gXCJlbVwiKSB7XHJcbiAgICAgICAgICAgIHB4VmFsdWUgPSB2YWx1ZSAqIGZyb21Db250ZXh0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWVVbml0ID09IFwicmVtXCIpIHtcclxuICAgICAgICAgICAgcHhWYWx1ZSA9IHZhbHVlICogdGhpcy5iYXNlRm9udFNpemU7XHJcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZVVuaXQgPT0gXCIlXCIpIHtcclxuICAgICAgICAgICAgcHhWYWx1ZSA9IHZhbHVlICogZnJvbUNvbnRleHQgLyAxMDA7XHJcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZVVuaXQgPT0gXCJleFwiKSB7XHJcbiAgICAgICAgICAgIHB4VmFsdWUgPSB2YWx1ZSAqIGZyb21Db250ZXh0IC8gMjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBweFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmVzdWx0ID0gcHhWYWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKGZvcm1hdCA9PSBcImVtXCIpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gcHhWYWx1ZSAvIHRvQ29udGV4dDtcclxuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PSBcInJlbVwiKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHB4VmFsdWUgLyB0aGlzLmJhc2VGb250U2l6ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGZvcm1hdCA9PSBcIiVcIikge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBweFZhbHVlICogMTAwIC8gdG9Db250ZXh0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0ID09IFwiZXhcIikge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBweFZhbHVlICogMiAvIHRvQ29udGV4dDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxjdWxhdGUgdGhlIG1pbmltdW0gbXVsdGlwbGUgcmh5dGhtIHVuaXRzKGxpbmVzKSBuZWVkZWQgdG8gY29udGFpbiB0aGUgZm9udC1zaXplLiAxIHJoeXRobSB1bml0ID0gYmFzZSBsaW5lIGhlaWdodCBpbiBwaXhlbHMuXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBtb2R1bGU6VmVydGljYWxSaHl0aG1cclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGZvbnRTaXplIC0gZm9udCBzaXplIGluIHBpeGVscywgZW0sIHJlbSBsaWtlIDEuNWVtLlxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gbnVtYmVyIG9mIGxpbmVzLlxyXG4gICAgICovXHJcbiAgICBsaW5lcyhmb250U2l6ZSkge1xyXG5cclxuICAgICAgICBmb250U2l6ZSA9IHBhcnNlRmxvYXQoZm9udFNpemUpO1xyXG5cclxuICAgICAgICBsZXQgbGluZXMgPSAwO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yaHl0aG1Vbml0ID09IFwicHhcIikge1xyXG5cclxuICAgICAgICAgICAgbGluZXMgPSAodGhpcy5yb3VuZFRvSGFsZkxpbmUgPT0gXCJ0cnVlXCIpID8gTWF0aC5jZWlsKDIgKiBmb250U2l6ZSAvIHRoaXMuYmFzZUxpbmVIZWlnaHQpIC8gMiA6IE1hdGguY2VpbChmb250U2l6ZSAvIHRoaXMuYmFzZUxpbmVIZWlnaHQpO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmh5dGhtVW5pdCA9PSBcImVtXCIgfHwgdGhpcy5yaHl0aG1Vbml0ID09IFwicmVtXCIpIHtcclxuXHJcbiAgICAgICAgICAgIGxpbmVzID0gKHRoaXMucm91bmRUb0hhbGZMaW5lID09IFwidHJ1ZVwiKSA/IE1hdGguY2VpbCgyICogZm9udFNpemUgLyB0aGlzLmJhc2VMaW5lSGVpZ2h0UmF0aW8pIC8gMiA6IE1hdGguY2VpbChmb250U2l6ZSAvIHRoaXMuYmFzZUxpbmVIZWlnaHRSYXRpbyk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lmIGxpbmVzIGFyZSBjcmFtcGVkIGluY2x1ZGUgc29tZSBleHRyYSBsZWFkLlxyXG4gICAgICAgIGlmICgobGluZXMgKiB0aGlzLmJhc2VMaW5lSGVpZ2h0IC0gZm9udFNpemUpIDwgKHRoaXMubWluTGluZVBhZGRpbmcgKiAyKSl7XHJcbiAgICAgICAgICAgIGxpbmVzID0gKHRoaXMucm91bmRUb0hhbGZMaW5lKSA/IGxpbmVzICsgMC41IDogbGluZXMgKyAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGxpbmVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlIGxpbmUgaGVpZ2h0IHZhbHVlIGluIHJoeXRobSB1bml0cyBmb3IgZm9udCBzaXplLiBHZW5lcmF0ZSBsaW5lIGhlaWdodCBmcm9tIGZvbnQgc2l6ZSBvciBpbnB1dCBsaW5lcy5cclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlck9mIG1vZHVsZTpWZXJ0aWNhbFJoeXRobVxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gZm9udFNpemUgLSBmb250IHNpemUgaW4gcGl4ZWxzLCBlbSwgcmVtIGxpa2UgMS41ZW0uXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUgLSBpbnB1dCBsaW5lcywgYmVmb3JlIG91dHB1dCAxIGxpbmUgaGVpZ2h0IHdpbGwgYmUgbXVsdGlwbHkgd2l0aCB2YWx1ZS5cclxuICAgICAqIEBwYXJhbSBiYXNlRm9udFNpemUgLSBiYXNlIGZvbnQgc2l6ZSBmb3IgY2FsY3VsYXRpb24gcmVsYXRpdmUgc2l6ZXMgZm9yIHB4IG9yIGVtLlxyXG4gICAgICogQHBhcmFtIHB4RmFsbGJhY2sgLSBib29sZWFuIHBpeGVsIGZhbGxiYWNrIG9wdGlvbi4gSWdub3JlIHNldHRpbmdzW1wicHgtZmFsbGJhY2tcIl0gb3B0aW9uLiBDb252ZXJ0IHJlbGF0aXZlIHNpemVzIHRvIHBpeGVscy4gSWYgcmh5dGhtIHVuaXQgcmVtIHRoZW4gcmVtIHZhbHVlIGRvdWJsZWQgd2l0aCBwaXhlbHMgdmFsdWVzLlxyXG4gICAgICogSWYgcmh5dGhtIHVuaXQgcHggYW5kIG9wdGlvbiB3aWxsIGJlIHNldCB0aGVuIGluIGxpbmUgaGVpZ2h0IHdpbGwgYmUgcGl4ZWxzIGxpa2UgMjRweCwgZWxzZSByZWxhdGl2ZSBzaXplIGxpa2UgMS40NSh3aXRob3V0IGVtIG9yIHJlbSkuXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0gLSBsaW5lIGhlaWdodCBpbiByaHl0aG0gdW5pdC5cclxuICAgICAqL1xyXG4gICAgbGluZUhlaWdodChmb250U2l6ZSwgdmFsdWUsIGJhc2VGb250U2l6ZSA9IG51bGwsIHB4RmFsbGJhY2sgPSBmYWxzZSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGZvbnRTaXplID09IG51bGwpe1xyXG4gICAgICAgICAgICBmb250U2l6ZSA9IHRoaXMuYmFzZUZvbnRTaXplICsgXCJweFwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGZvbnRTaXplICE9IG51bGwgJiYgKHRoaXMucmh5dGhtVW5pdCA9PSBcImVtXCIgfHwgdmFsdWUgPT0gbnVsbCkpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBmb250U2l6ZVVuaXQgPSBmb250U2l6ZS5tYXRjaCgvKHB4fGVtfHJlbSkkL2kpWzBdLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZm9udFNpemVVbml0ICE9IHRoaXMucmh5dGhtVW5pdCB8fCBiYXNlRm9udFNpemUgIT0gbnVsbCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGZvbnRTaXplID0gKGJhc2VGb250U2l6ZSAhPSBudWxsKSA/IHRoaXMuY29udmVydChmb250U2l6ZSwgZm9udFNpemVVbml0LCB0aGlzLnJoeXRobVVuaXQsIGJhc2VGb250U2l6ZSkgOiB0aGlzLmNvbnZlcnQoZm9udFNpemUsIGZvbnRTaXplVW5pdCwgdGhpcy5yaHl0aG1Vbml0KTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9udFNpemUgPSBwYXJzZUZsb2F0KGZvbnRTaXplKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhbHVlID0gKHZhbHVlICE9IG51bGwpID8gcGFyc2VGbG9hdCh2YWx1ZSkgOiB0aGlzLmxpbmVzKGZvbnRTaXplKTtcclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IDA7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJoeXRobVVuaXQgPT0gXCJweFwiKSB7XHJcblxyXG4gICAgICAgICAgICByZXN1bHQgPSAoZm9udFNpemUgIT0gbnVsbCAmJiB0aGlzLnB4RmFsbGJhY2sgIT0gXCJ0cnVlXCIgJiYgIXB4RmFsbGJhY2spID8gZm9ybWF0VmFsdWUodGhpcy5iYXNlTGluZUhlaWdodCAvIGZvbnRTaXplKSA6IGZvcm1hdEludCh0aGlzLmJhc2VMaW5lSGVpZ2h0ICogdmFsdWUpICsgXCJweFwiO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmh5dGhtVW5pdCA9PSBcImVtXCIpIHtcclxuXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGZvcm1hdFZhbHVlKHZhbHVlICogdGhpcy5iYXNlTGluZUhlaWdodFJhdGlvIC8gZm9udFNpemUpICsgXCJlbVwiO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmh5dGhtVW5pdCA9PSBcInJlbVwiKSB7XHJcblxyXG4gICAgICAgICAgICByZXN1bHQgPSBmb3JtYXRWYWx1ZSh2YWx1ZSAqIHRoaXMuYmFzZUxpbmVIZWlnaHRSYXRpbykgKyBcInJlbVwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlIGxlYWRpbmcgdmFsdWUgaW4gcmh5dGhtIHVuaXRcclxuICAgICAqXHJcbiAgICAgKiBAbWVtYmVyT2YgbW9kdWxlOlZlcnRpY2FsUmh5dGhtXHJcbiAgICAgKiBcclxuICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICogMSBsZWFkaW5nKGluIHBpeGVscykgPSBiYXNlIGxpbmUgaGVpZ2h0KGluIHBpeGVscykgLSBiYXNlIGZvbnQgc2l6ZShpbiBwaXhlbHMpLlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUgLSBpbnB1dCBsaW5lcywgYmVmb3JlIG91dHB1dCAxIGxpbmUgaGVpZ2h0IHdpbGwgYmUgbXVsdGlwbHkgd2l0aCB2YWx1ZS5cclxuICAgICAqIEBwYXJhbSBmb250U2l6ZSAtIGZvbnQgc2l6ZSBpbiBwaXhlbHMsIGVtLCByZW0gbGlrZSAxLjVlbS5cclxuICAgICAqIFxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSAtIGxlYWRpbmcgaW4gcmh5dGhtIHVuaXQuXHJcbiAgICAgKi9cclxuICAgIGxlYWRpbmcodmFsdWUsIGZvbnRTaXplKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoZm9udFNpemUgPT0gbnVsbCl7XHJcbiAgICAgICAgICAgIGZvbnRTaXplID0gdGhpcy5iYXNlRm9udFNpemUgKyBcInB4XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBmb250U2l6ZVVuaXQgPSBmb250U2l6ZS5tYXRjaCgvKHB4fGVtfHJlbSkkL2kpWzBdLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgIGlmIChmb250U2l6ZVVuaXQgIT0gdGhpcy5yaHl0aG1Vbml0KSB7XHJcblxyXG4gICAgICAgICAgICBmb250U2l6ZSA9IHRoaXMuY29udmVydChmb250U2l6ZSwgZm9udFNpemVVbml0LCB0aGlzLnJoeXRobVVuaXQpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgZm9udFNpemUgPSBwYXJzZUZsb2F0KGZvbnRTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBsaW5lcyA9IHRoaXMubGluZXMoZm9udFNpemUpLFxyXG4gICAgICAgICAgICByZXN1bHQgPSAwO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yaHl0aG1Vbml0ID09IFwicHhcIikge1xyXG5cclxuICAgICAgICAgICAgcmVzdWx0ID0gZm9ybWF0SW50KChsaW5lcyAqIHRoaXMuYmFzZUxpbmVIZWlnaHQgLSBmb250U2l6ZSkgKiB2YWx1ZSkgKyBcInB4XCI7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yaHl0aG1Vbml0ID09IFwiZW1cIikge1xyXG5cclxuICAgICAgICAgICAgcmVzdWx0ID0gZm9ybWF0VmFsdWUoKHRoaXMuYmFzZUxpbmVIZWlnaHRSYXRpbyAqIGxpbmVzIC0gZm9udFNpemUpICogdmFsdWUgLyBmb250U2l6ZSkgKyBcImVtXCI7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yaHl0aG1Vbml0ID09IFwicmVtXCIpIHtcclxuXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGZvcm1hdFZhbHVlKChsaW5lcyAqIHRoaXMuYmFzZUxpbmVIZWlnaHRSYXRpbyAtIGZvbnRTaXplKSAqIHZhbHVlKSArIFwicmVtXCI7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ2FsY3VsYXRlIHJoeXRobSB2YWx1ZSBpbiByaHl0aG0gdW5pdC4gSXQgdXNlZCBmb3IgaGVpZ2h0IHZhbHVlcywgZXRjLiBcclxuICAgICAqXHJcbiAgICAgKiBAbWVtYmVyT2YgbW9kdWxlOlZlcnRpY2FsUmh5dGhtXHJcbiAgICAgKiBcclxuICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICogXHJcbiAgICAgKiBJZiB2YWx1ZSA0NTBweCwgYW5kIGJhc2UgZm9udCBzaXplIDE2LCBsaW5lLWhlaWdodCAxLjUsIGluY3JlYXNlID0gZmFsc2UgdGhlbiByZXR1cm4gNDMycHguXHJcbiAgICAgKiBJZiB2YWx1ZSA0NTBweCwgYW5kIGJhc2UgZm9udCBzaXplIDE2LCBsaW5lLWhlaWdodCAxLjUsIGluY3JlYXNlID0gdHJ1ZSB0aGVuIHJldHVybiA0NTZweC5cclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHZhbHVlIC0gaW5wdXQgdmFsdWUgbGlrZSA0NTBweDsgMTBlbTsgMTAwcmVtOy5cclxuICAgICAqIEBwYXJhbSBmb250U2l6ZSAtIGZvbnQgc2l6ZSBpbiBwaXhlbHMsIGVtLCByZW0gbGlrZSAxLjVlbS5cclxuICAgICAqIEBwYXJhbSBpbmNyZWFzZSAtIGluY3JlYXNlIG9yIGRlY3JlYXNlIHNpemUuIERlZmF1bHQgZGVjcmVhc2UuIGluY3JlYXNlID0gZmFsc2UuXHJcbiAgICAgKiBAcGFyYW0gb3V0cHV0VW5pdCAtIG91dHB1dCB2YWx1ZSB1bml0LiBcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSAtIHJoeXRobWQgdmFsdWUgcmh5dGhtIHVuaXQuXHJcbiAgICAgKi9cclxuXHJcbiAgICByaHl0aG0odmFsdWUsIGZvbnRTaXplLCBpbmNyZWFzZSA9IGZhbHNlLCBvdXRwdXRVbml0KSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoZm9udFNpemUgPT0gbnVsbCl7XHJcbiAgICAgICAgICAgIGZvbnRTaXplID0gdGhpcy5iYXNlRm9udFNpemUgKyBcInB4XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihvdXRwdXRVbml0ID09IG51bGwpe1xyXG4gICAgICAgICAgICBvdXRwdXRVbml0ID0gdGhpcy5yaHl0aG1Vbml0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGZvbnRTaXplVW5pdCA9IGZvbnRTaXplLm1hdGNoKC8ocHh8ZW18cmVtKSQvaSlbMF0udG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgaWYgKGZvbnRTaXplVW5pdCAhPSB0aGlzLnJoeXRobVVuaXQpIHtcclxuXHJcbiAgICAgICAgICAgIGZvbnRTaXplID0gdGhpcy5jb252ZXJ0KGZvbnRTaXplLCBmb250U2l6ZVVuaXQsIHRoaXMucmh5dGhtVW5pdCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBmb250U2l6ZSA9IHBhcnNlRmxvYXQoZm9udFNpemUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHZhbHVlVW5pdCA9IHZhbHVlLm1hdGNoKC8ocHh8ZW18cmVtKSQvaSlbMF0udG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlVW5pdCAhPSB0aGlzLnJoeXRobVVuaXQpIHtcclxuXHJcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5jb252ZXJ0KHZhbHVlLCB2YWx1ZVVuaXQsIHRoaXMucmh5dGhtVW5pdCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGxpbmVzID0gdGhpcy5saW5lcyh2YWx1ZSksXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IDA7XHJcbiAgICBcclxuICAgICAgICBpZiAoIWluY3JlYXNlICYmICh2YWx1ZSA8IChsaW5lcyAqIGZvbnRTaXplICogdGhpcy5iYXNlTGluZUhlaWdodFJhdGlvKSkpIHtcclxuICAgICAgICAgICAgbGluZXMgPSBsaW5lcyAtIDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3V0cHV0VW5pdCA9PSBcInB4XCIpIHtcclxuXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGZvcm1hdEludChsaW5lcyAqIHRoaXMuYmFzZUxpbmVIZWlnaHQpICsgXCJweFwiO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKG91dHB1dFVuaXQgPT0gXCJlbVwiKSB7XHJcblxyXG4gICAgICAgICAgICByZXN1bHQgPSBmb3JtYXRWYWx1ZSh0aGlzLmJhc2VMaW5lSGVpZ2h0UmF0aW8gKiBsaW5lcyAvIGZvbnRTaXplKSArIFwiZW1cIjtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChvdXRwdXRVbml0ID09IFwicmVtXCIpIHtcclxuXHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGZvcm1hdFZhbHVlKHRoaXMuYmFzZUxpbmVIZWlnaHRSYXRpbyAqIGxpbmVzKSArIFwicmVtXCI7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0IHJlbSB0byBwaXhlbCB2YWx1ZS5cclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHZhbHVlIC0gaW5wdXQgdmFsdWUgaW4gcmVtLlxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IC0gb3V0cHV0IHZhbHVlIGluIHBpeGVscy5cclxuICAgICAqL1xyXG4gICAgcmVtRmFsbGJhY2sodmFsdWUpIHtcclxuXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHZhbHVlO1xyXG4gICAgICAgIGxldCBmb3VuZCA9IG51bGw7XHJcblxyXG4gICAgICAgIHdoaWxlICgoZm91bmQgPSByZXN1bHQubWF0Y2goLyhbMC05XFwuXSspcmVtL2kpKSkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZShmb3VuZFswXSwgZm9ybWF0SW50KHRoaXMuY29udmVydChmb3VuZFsxXSwgXCJyZW1cIiwgXCJweFwiKSkgKyBcInB4XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEV4cG9ydCBWZXJ0aWNhbCBSaHl0aG0gQ2xhc3MuXHJcbiAqIEV4cG9ydCBmb3JtYXRWYWx1ZSBhbmQgZm9ybWF0SW50IGZ1bmN0aW9ucy5cclxuICovXHJcbmV4cG9ydCB7XHJcbiAgICBmb3JtYXRJbnQsXHJcbiAgICBmb3JtYXRWYWx1ZSxcclxuICAgIFZlcnRpY2FsUmh5dGhtXHJcbn07Il19
