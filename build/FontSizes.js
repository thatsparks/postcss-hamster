"use strict";

exports.__esModule = true;

var _Helpers = require("./Helpers");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module FontSizes
 * 
 * @description Font size collection manager and generator proportional fonts sizes with aliases.
 *
 * @version 1.0
 * @author Grigory Vasilyev <postcss.hamster@gmail.com> https://github.com/h0tc0d3
 * @copyright Copyright (c) 2017, Grigory Vasilyev
 * @license Apache License, Version 2.0, http://www.apache.org/licenses/LICENSE-2.0 
 * 
 */
var FontSizes = function () {
    /**
     * Constructor for font size collection manager.
     * 
     * @memberOf module:FontSizes
     * 
     * @param settings - settings.
     * 
     * Use settings["font-ratio"] - font scale ratio and settings["font-size"] - base font size(will be 0 size).
     * All sizes will be generated from base font size * ratio.
     */
    function FontSizes(settings) {
        _classCallCheck(this, FontSizes);

        var fontRatio = {
            "golden": {
                "desc": "1:1.618",
                "value": 1.618
            },
            "double-octave": {
                "desc": "1:4",
                "value": 4
            },
            "major-twelfth": {
                "desc": "1:3",
                "value": 3
            },
            "major-eleventh": {
                "desc": "3:8",
                "value": 2.667
            },
            "major-tenth": {
                "desc": "2:5",
                "value": 2.5
            },
            "octave": {
                "desc": "1:2",
                "value": 2
            },
            "major-seventh": {
                "desc": "8:15",
                "value": 1.875
            },
            "minor-seventh": {
                "desc": "9:16",
                "value": 1.778
            },
            "major-sixth": {
                "desc": "3:5",
                "value": 1.667
            },
            "minor-sixth": {
                "desc": "5:8",
                "value": 1.6
            },
            "perfect-fifth": {
                "desc": "2:3",
                "value": 1.5
            },
            "augmented-fourth": {
                "desc": "1:√2",
                "value": 1.414
            },
            "perfect-fourth": {
                "desc": "3:4",
                "value": 1.333
            },
            "major-third": {
                "desc": "4:5",
                "value": 1.25
            },
            "minor-third": {
                "desc": "5:6",
                "value": 1.2
            },
            "major-second": {
                "desc": "8:9",
                "value": 1.125
            },
            "minor-second": {
                "desc": "15:16",
                "value": 1.067
            }
        };

        this.aliases = {
            "tiny": "-2",
            "t": "-2",
            "small": "-1",
            "s": "-1",
            "base": "0",
            "b": "0",
            "medium": "1",
            "m": "1",
            "large": "2",
            "l": "2",
            "xlarge": "3",
            "xl": "3",
            "xxlarge": "4",
            "xxl": "4",
            "xxxlarge": "5",
            "xxxl": "5",
            //Double scaled sizes
            "tiny@x2": "-2@x2",
            "t@x2": "-2@x2",
            "small@x2": "-1@x2",
            "s@x2": "-1@x2",
            "base@x2": "0@x2",
            "b@x2": "0@x2",
            "medium@x2": "1@x2",
            "m@x2": "1@x2",
            "large@x2": "2@x2",
            "l@x2": "2@x2",
            "xlarge@x2": "3@x2",
            "xl@x2": "3@x2",
            "xxlarge@x2": "4@x2",
            "xxl@x2": "4@x2",
            "xxxlarge@x2": "5@x2",
            "xxxl@x2": "5@x2",
            //Double divided sizes
            "tiny@d2": "-2@d2",
            "t@d2": "-2@d2",
            "small@d2": "-1@d2",
            "s@d2": "-1@d2",
            "base@d2": "0@d2",
            "b@d2": "0@d2",
            "medium@d2": "1@d2",
            "m@d2": "1@d2",
            "large@d2": "2@d2",
            "l@d2": "2@d2",
            "xlarge@d2": "3@d2",
            "xl@d2": "3@d2",
            "xxlarge@d2": "4@d2",
            "xxl@d2": "4@d2",
            "xxxlarge@d2": "5@d2",
            "xxxl@d2": "5@d2"
        };

        if (settings["font-ratio"] in fontRatio) {

            this.ratio = fontRatio[settings["font-ratio"]].value;
            this.desc = fontRatio[settings["font-ratio"]].desc;
        } else {

            this.ratio = parseFloat(settings["font-ratio"]);
            this.desc = "Custom font ratio";
        }

        // BaseFontSize
        this.baseSize = parseInt(settings["font-size"]);

        // making fontsize collection
        if (this.ratio > 0 && this.baseSize > 0) {
            // font Collection
            this.fontSizes = {};
            for (var i = -2; i <= 5; i++) {
                // Make size from -2 to 5
                this.fontSizes[i] = this.genSize(i);
                // Make double size from -2 to 5
                this.fontSizes[i + "@x2"] = this.genSize(i, 2);
                // Make double divided size from -2 to 5
                this.fontSizes[i + "@d2"] = this.genSize(i, 0.5);
            }
        }
        //console.log(JSON.stringify(this.fontSizes, null, 2));
    }

    /**
     * Generate font sizes for relative proportional size.
     * 
     * @memberOf module:FontSizes
     * 
     * @param {number} size - Proportional size like -2, 0, 1, 3 etc.
     * @param {number} scale - scale base font size.
     * 
     * @returns {{}} - HashMap. px: value in pixels, rel: relative value
     */


    FontSizes.prototype.genSize = function genSize(size) {
        var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


        var value = {};

        var baseFontSize = this.baseSize;

        if (scale > 0) {
            baseFontSize = baseFontSize * scale;
        }

        if (!this.ratio || !baseFontSize) {
            return value;
        }

        if (size >= 0) {

            value.rel = Math.pow(this.ratio, size);
            value.px = baseFontSize * value.rel;
        } else {

            value.rel = 1 / Math.pow(this.ratio, Math.abs(size));
            value.px = baseFontSize * value.rel;
        }

        if (scale > 0) {
            value.rel = value.rel * scale;
        }

        return value;
    };

    /**
     * Get font size by name.
     * 
     * @memberOf module:FontSizes
     * 
     * @param {string} size - font size name.
     * 
     * @returns {{}} - HashMap. px: value in pixels, rel: relative value
     */


    FontSizes.prototype.getSize = function getSize(size) {

        // Check size is alias?
        if (size in this.aliases) {
            size = this.aliases[size];
        }

        var result = 0;

        if (size in this.fontSizes) {
            result = this.fontSizes[size];
        } else {
            if (size.match(/^\-*[0-9]+$/)) {
                result = this.genSize(size);
            }
        }
        //console.log(size + ": " + JSON.stringify(result, null , 2) + " " + (size in this.fontSizes).toString());
        return result;
    };

    /**
     * Set font size to name.
     * 
     * @memberOf module:FontSizes
     * 
     * @param {string} size - font size name.
     * @param value - HashMap. px: value in pixels, rel: relative value
     */


    FontSizes.prototype.setSize = function setSize(size, value) {
        // Check size is alias?
        if (size in this.aliases) {
            size = this.aliases[size];
        }
        this.fontSizes[size] = value;
    };

    /**
     * Add Font Sizes to Font Size Collection.
     * 
     * @memberOf module:FontSizes
     * 
     * @param {string} sizes - string like "name1 21px 1.5, name2 18px, name3 1.5". format: name pixelSize relativeSize.
     * Separator for font sizes is ",".
     * If pixel or relative size it's present then it can be generated.
     * @param rhythmCalculator - instance of VerticalRhythm Class.
     */


    FontSizes.prototype.addFontSizes = function addFontSizes(sizes, rhythmCalculator) {

        var fontSizesInfo = sizes.split(/\s*\,\s*/);
        var size = fontSizesInfo.length - 1;
        while (size >= 0) {

            var fontSizeInfo = fontSizesInfo[size].split(/\s+/);
            if (fontSizeInfo.length >= 2) {
                var fontSize = {};
                if ((0, _Helpers.isHas)(fontSizeInfo[1], "px")) {
                    fontSize.rel = fontSizeInfo.length == 2 ? rhythmCalculator.convert(fontSizeInfo[1], _Helpers.UNIT.EM) : fontSizeInfo[2];
                    fontSize.px = parseInt(fontSizeInfo[1]);
                } else {
                    fontSize.rel = parseFloat(fontSizeInfo[1]);
                    fontSize.px = rhythmCalculator.convert(fontSizeInfo[1], _Helpers.UNIT.PX);
                }
                this.setSize(fontSizeInfo[0], fontSize);
            }
            size--;
        }
    };

    return FontSizes;
}();
/**
 * Export FontSizes Class.
 */


exports.default = FontSizes;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZvbnRTaXplcy5lczYiXSwibmFtZXMiOlsiRm9udFNpemVzIiwic2V0dGluZ3MiLCJmb250UmF0aW8iLCJhbGlhc2VzIiwicmF0aW8iLCJ2YWx1ZSIsImRlc2MiLCJwYXJzZUZsb2F0IiwiYmFzZVNpemUiLCJwYXJzZUludCIsImZvbnRTaXplcyIsImkiLCJnZW5TaXplIiwic2l6ZSIsInNjYWxlIiwiYmFzZUZvbnRTaXplIiwicmVsIiwiTWF0aCIsInBvdyIsInB4IiwiYWJzIiwiZ2V0U2l6ZSIsInJlc3VsdCIsIm1hdGNoIiwic2V0U2l6ZSIsImFkZEZvbnRTaXplcyIsInNpemVzIiwicmh5dGhtQ2FsY3VsYXRvciIsImZvbnRTaXplc0luZm8iLCJzcGxpdCIsImxlbmd0aCIsImZvbnRTaXplSW5mbyIsImZvbnRTaXplIiwiY29udmVydCIsIkVNIiwiUFgiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUtBOzs7Ozs7Ozs7OztJQVdNQSxTO0FBQ0Y7Ozs7Ozs7Ozs7QUFVQSx1QkFBWUMsUUFBWixFQUFzQjtBQUFBOztBQUVsQixZQUFJQyxZQUFZO0FBQ1osc0JBQVU7QUFDTix3QkFBUSxTQURGO0FBRU4seUJBQVM7QUFGSCxhQURFO0FBS1osNkJBQWlCO0FBQ2Isd0JBQVEsS0FESztBQUViLHlCQUFTO0FBRkksYUFMTDtBQVNaLDZCQUFpQjtBQUNiLHdCQUFRLEtBREs7QUFFYix5QkFBUztBQUZJLGFBVEw7QUFhWiw4QkFBa0I7QUFDZCx3QkFBUSxLQURNO0FBRWQseUJBQVM7QUFGSyxhQWJOO0FBaUJaLDJCQUFlO0FBQ1gsd0JBQVEsS0FERztBQUVYLHlCQUFTO0FBRkUsYUFqQkg7QUFxQlosc0JBQVU7QUFDTix3QkFBUSxLQURGO0FBRU4seUJBQVM7QUFGSCxhQXJCRTtBQXlCWiw2QkFBaUI7QUFDYix3QkFBUSxNQURLO0FBRWIseUJBQVM7QUFGSSxhQXpCTDtBQTZCWiw2QkFBaUI7QUFDYix3QkFBUSxNQURLO0FBRWIseUJBQVM7QUFGSSxhQTdC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LEVBQXVCLElBQXZCLENBQUosRUFBa0M7QUFDOUJDLDZCQUFTaEIsR0FBVCxHQUFnQmUsYUFBYUQsTUFBYixJQUF1QixDQUF4QixHQUE2QkgsaUJBQWlCTSxPQUFqQixDQUF5QkYsYUFBYSxDQUFiLENBQXpCLEVBQTBDLGNBQUtHLEVBQS9DLENBQTdCLEdBQWtGSCxhQUFhLENBQWIsQ0FBakc7QUFDQUMsNkJBQVNiLEVBQVQsR0FBY1YsU0FBU3NCLGFBQWEsQ0FBYixDQUFULENBQWQ7QUFDSCxpQkFIRCxNQUdPO0FBQ0hDLDZCQUFTaEIsR0FBVCxHQUFlVCxXQUFXd0IsYUFBYSxDQUFiLENBQVgsQ0FBZjtBQUNBQyw2QkFBU2IsRUFBVCxHQUFjUSxpQkFBaUJNLE9BQWpCLENBQXlCRixhQUFhLENBQWIsQ0FBekIsRUFBMEMsY0FBS0ksRUFBL0MsQ0FBZDtBQUNIO0FBQ0QscUJBQUtYLE9BQUwsQ0FBYU8sYUFBYSxDQUFiLENBQWIsRUFBOEJDLFFBQTlCO0FBQ0g7QUFDRG5CO0FBQ0g7QUFFSixLOzs7O0FBR0w7Ozs7O2tCQUdlYixTIiwiZmlsZSI6IkZvbnRTaXplcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgICBpc0hhcyxcclxuICAgIFVOSVRcclxufSBmcm9tIFwiLi9IZWxwZXJzXCI7XHJcblxyXG4vKipcclxuICogQG1vZHVsZSBGb250U2l6ZXNcclxuICogXHJcbiAqIEBkZXNjcmlwdGlvbiBGb250IHNpemUgY29sbGVjdGlvbiBtYW5hZ2VyIGFuZCBnZW5lcmF0b3IgcHJvcG9ydGlvbmFsIGZvbnRzIHNpemVzIHdpdGggYWxpYXNlcy5cclxuICpcclxuICogQHZlcnNpb24gMS4wXHJcbiAqIEBhdXRob3IgR3JpZ29yeSBWYXNpbHlldiA8cG9zdGNzcy5oYW1zdGVyQGdtYWlsLmNvbT4gaHR0cHM6Ly9naXRodWIuY29tL2gwdGMwZDNcclxuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMTcsIEdyaWdvcnkgVmFzaWx5ZXZcclxuICogQGxpY2Vuc2UgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wLCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjAgXHJcbiAqIFxyXG4gKi9cclxuY2xhc3MgRm9udFNpemVzIHtcclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3IgZm9yIGZvbnQgc2l6ZSBjb2xsZWN0aW9uIG1hbmFnZXIuXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBtb2R1bGU6Rm9udFNpemVzXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBzZXR0aW5ncyAtIHNldHRpbmdzLlxyXG4gICAgICogXHJcbiAgICAgKiBVc2Ugc2V0dGluZ3NbXCJmb250LXJhdGlvXCJdIC0gZm9udCBzY2FsZSByYXRpbyBhbmQgc2V0dGluZ3NbXCJmb250LXNpemVcIl0gLSBiYXNlIGZvbnQgc2l6ZSh3aWxsIGJlIDAgc2l6ZSkuXHJcbiAgICAgKiBBbGwgc2l6ZXMgd2lsbCBiZSBnZW5lcmF0ZWQgZnJvbSBiYXNlIGZvbnQgc2l6ZSAqIHJhdGlvLlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncykge1xyXG5cclxuICAgICAgICBsZXQgZm9udFJhdGlvID0ge1xyXG4gICAgICAgICAgICBcImdvbGRlblwiOiB7XHJcbiAgICAgICAgICAgICAgICBcImRlc2NcIjogXCIxOjEuNjE4XCIsXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDEuNjE4XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiZG91YmxlLW9jdGF2ZVwiOiB7XHJcbiAgICAgICAgICAgICAgICBcImRlc2NcIjogXCIxOjRcIixcclxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogNFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcIm1ham9yLXR3ZWxmdGhcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJkZXNjXCI6IFwiMTozXCIsXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDNcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJtYWpvci1lbGV2ZW50aFwiOiB7XHJcbiAgICAgICAgICAgICAgICBcImRlc2NcIjogXCIzOjhcIixcclxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMi42NjdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJtYWpvci10ZW50aFwiOiB7XHJcbiAgICAgICAgICAgICAgICBcImRlc2NcIjogXCIyOjVcIixcclxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMi41XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwib2N0YXZlXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiZGVzY1wiOiBcIjE6MlwiLFxyXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAyXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwibWFqb3Itc2V2ZW50aFwiOiB7XHJcbiAgICAgICAgICAgICAgICBcImRlc2NcIjogXCI4OjE1XCIsXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDEuODc1XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwibWlub3Itc2V2ZW50aFwiOiB7XHJcbiAgICAgICAgICAgICAgICBcImRlc2NcIjogXCI5OjE2XCIsXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDEuNzc4XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwibWFqb3Itc2l4dGhcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJkZXNjXCI6IFwiMzo1XCIsXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDEuNjY3XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwibWlub3Itc2l4dGhcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJkZXNjXCI6IFwiNTo4XCIsXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDEuNlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcInBlcmZlY3QtZmlmdGhcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJkZXNjXCI6IFwiMjozXCIsXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDEuNVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImF1Z21lbnRlZC1mb3VydGhcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJkZXNjXCI6IFwiMTriiJoyXCIsXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDEuNDE0XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwicGVyZmVjdC1mb3VydGhcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJkZXNjXCI6IFwiMzo0XCIsXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDEuMzMzXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwibWFqb3ItdGhpcmRcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJkZXNjXCI6IFwiNDo1XCIsXHJcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDEuMjVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJtaW5vci10aGlyZFwiOiB7XHJcbiAgICAgICAgICAgICAgICBcImRlc2NcIjogXCI1OjZcIixcclxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMS4yXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwibWFqb3Itc2Vjb25kXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiZGVzY1wiOiBcIjg6OVwiLFxyXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAxLjEyNVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcIm1pbm9yLXNlY29uZFwiOiB7XHJcbiAgICAgICAgICAgICAgICBcImRlc2NcIjogXCIxNToxNlwiLFxyXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAxLjA2N1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hbGlhc2VzID0ge1xyXG4gICAgICAgICAgICBcInRpbnlcIjogXCItMlwiLFxyXG4gICAgICAgICAgICBcInRcIjogXCItMlwiLFxyXG4gICAgICAgICAgICBcInNtYWxsXCI6IFwiLTFcIixcclxuICAgICAgICAgICAgXCJzXCI6IFwiLTFcIixcclxuICAgICAgICAgICAgXCJiYXNlXCI6IFwiMFwiLFxyXG4gICAgICAgICAgICBcImJcIjogXCIwXCIsXHJcbiAgICAgICAgICAgIFwibWVkaXVtXCI6IFwiMVwiLFxyXG4gICAgICAgICAgICBcIm1cIjogXCIxXCIsXHJcbiAgICAgICAgICAgIFwibGFyZ2VcIjogXCIyXCIsXHJcbiAgICAgICAgICAgIFwibFwiOiBcIjJcIixcclxuICAgICAgICAgICAgXCJ4bGFyZ2VcIjogXCIzXCIsXHJcbiAgICAgICAgICAgIFwieGxcIjogXCIzXCIsXHJcbiAgICAgICAgICAgIFwieHhsYXJnZVwiOiBcIjRcIixcclxuICAgICAgICAgICAgXCJ4eGxcIjogXCI0XCIsXHJcbiAgICAgICAgICAgIFwieHh4bGFyZ2VcIjogXCI1XCIsXHJcbiAgICAgICAgICAgIFwieHh4bFwiOiBcIjVcIixcclxuICAgICAgICAgICAgLy9Eb3VibGUgc2NhbGVkIHNpemVzXHJcbiAgICAgICAgICAgIFwidGlueUB4MlwiOiBcIi0yQHgyXCIsXHJcbiAgICAgICAgICAgIFwidEB4MlwiOiBcIi0yQHgyXCIsXHJcbiAgICAgICAgICAgIFwic21hbGxAeDJcIjogXCItMUB4MlwiLFxyXG4gICAgICAgICAgICBcInNAeDJcIjogXCItMUB4MlwiLFxyXG4gICAgICAgICAgICBcImJhc2VAeDJcIjogXCIwQHgyXCIsXHJcbiAgICAgICAgICAgIFwiYkB4MlwiOiBcIjBAeDJcIixcclxuICAgICAgICAgICAgXCJtZWRpdW1AeDJcIjogXCIxQHgyXCIsXHJcbiAgICAgICAgICAgIFwibUB4MlwiOiBcIjFAeDJcIixcclxuICAgICAgICAgICAgXCJsYXJnZUB4MlwiOiBcIjJAeDJcIixcclxuICAgICAgICAgICAgXCJsQHgyXCI6IFwiMkB4MlwiLFxyXG4gICAgICAgICAgICBcInhsYXJnZUB4MlwiOiBcIjNAeDJcIixcclxuICAgICAgICAgICAgXCJ4bEB4MlwiOiBcIjNAeDJcIixcclxuICAgICAgICAgICAgXCJ4eGxhcmdlQHgyXCI6IFwiNEB4MlwiLFxyXG4gICAgICAgICAgICBcInh4bEB4MlwiOiBcIjRAeDJcIixcclxuICAgICAgICAgICAgXCJ4eHhsYXJnZUB4MlwiOiBcIjVAeDJcIixcclxuICAgICAgICAgICAgXCJ4eHhsQHgyXCI6IFwiNUB4MlwiLFxyXG4gICAgICAgICAgICAvL0RvdWJsZSBkaXZpZGVkIHNpemVzXHJcbiAgICAgICAgICAgIFwidGlueUBkMlwiOiBcIi0yQGQyXCIsXHJcbiAgICAgICAgICAgIFwidEBkMlwiOiBcIi0yQGQyXCIsXHJcbiAgICAgICAgICAgIFwic21hbGxAZDJcIjogXCItMUBkMlwiLFxyXG4gICAgICAgICAgICBcInNAZDJcIjogXCItMUBkMlwiLFxyXG4gICAgICAgICAgICBcImJhc2VAZDJcIjogXCIwQGQyXCIsXHJcbiAgICAgICAgICAgIFwiYkBkMlwiOiBcIjBAZDJcIixcclxuICAgICAgICAgICAgXCJtZWRpdW1AZDJcIjogXCIxQGQyXCIsXHJcbiAgICAgICAgICAgIFwibUBkMlwiOiBcIjFAZDJcIixcclxuICAgICAgICAgICAgXCJsYXJnZUBkMlwiOiBcIjJAZDJcIixcclxuICAgICAgICAgICAgXCJsQGQyXCI6IFwiMkBkMlwiLFxyXG4gICAgICAgICAgICBcInhsYXJnZUBkMlwiOiBcIjNAZDJcIixcclxuICAgICAgICAgICAgXCJ4bEBkMlwiOiBcIjNAZDJcIixcclxuICAgICAgICAgICAgXCJ4eGxhcmdlQGQyXCI6IFwiNEBkMlwiLFxyXG4gICAgICAgICAgICBcInh4bEBkMlwiOiBcIjRAZDJcIixcclxuICAgICAgICAgICAgXCJ4eHhsYXJnZUBkMlwiOiBcIjVAZDJcIixcclxuICAgICAgICAgICAgXCJ4eHhsQGQyXCI6IFwiNUBkMlwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHNldHRpbmdzW1wiZm9udC1yYXRpb1wiXSBpbiBmb250UmF0aW8pIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmF0aW8gPSBmb250UmF0aW9bc2V0dGluZ3NbXCJmb250LXJhdGlvXCJdXS52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5kZXNjID0gZm9udFJhdGlvW3NldHRpbmdzW1wiZm9udC1yYXRpb1wiXV0uZGVzYztcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmF0aW8gPSBwYXJzZUZsb2F0KHNldHRpbmdzW1wiZm9udC1yYXRpb1wiXSk7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzYyA9IFwiQ3VzdG9tIGZvbnQgcmF0aW9cIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBCYXNlRm9udFNpemVcclxuICAgICAgICB0aGlzLmJhc2VTaXplID0gcGFyc2VJbnQoc2V0dGluZ3NbXCJmb250LXNpemVcIl0pO1xyXG5cclxuICAgICAgICAvLyBtYWtpbmcgZm9udHNpemUgY29sbGVjdGlvblxyXG4gICAgICAgIGlmICh0aGlzLnJhdGlvID4gMCAmJiB0aGlzLmJhc2VTaXplID4gMCkge1xyXG4gICAgICAgICAgICAvLyBmb250IENvbGxlY3Rpb25cclxuICAgICAgICAgICAgdGhpcy5mb250U2l6ZXMgPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IC0yOyBpIDw9IDU7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBzaXplIGZyb20gLTIgdG8gNVxyXG4gICAgICAgICAgICAgICAgdGhpcy5mb250U2l6ZXNbaV0gPSB0aGlzLmdlblNpemUoaSk7XHJcbiAgICAgICAgICAgICAgICAvLyBNYWtlIGRvdWJsZSBzaXplIGZyb20gLTIgdG8gNVxyXG4gICAgICAgICAgICAgICAgdGhpcy5mb250U2l6ZXNbaSArIFwiQHgyXCJdID0gdGhpcy5nZW5TaXplKGksIDIpO1xyXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBkb3VibGUgZGl2aWRlZCBzaXplIGZyb20gLTIgdG8gNVxyXG4gICAgICAgICAgICAgICAgdGhpcy5mb250U2l6ZXNbaSArIFwiQGQyXCJdID0gdGhpcy5nZW5TaXplKGksIDAuNSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh0aGlzLmZvbnRTaXplcywgbnVsbCwgMikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2VuZXJhdGUgZm9udCBzaXplcyBmb3IgcmVsYXRpdmUgcHJvcG9ydGlvbmFsIHNpemUuXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBtb2R1bGU6Rm9udFNpemVzXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzaXplIC0gUHJvcG9ydGlvbmFsIHNpemUgbGlrZSAtMiwgMCwgMSwgMyBldGMuXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2NhbGUgLSBzY2FsZSBiYXNlIGZvbnQgc2l6ZS5cclxuICAgICAqIFxyXG4gICAgICogQHJldHVybnMge3t9fSAtIEhhc2hNYXAuIHB4OiB2YWx1ZSBpbiBwaXhlbHMsIHJlbDogcmVsYXRpdmUgdmFsdWVcclxuICAgICAqL1xyXG4gICAgZ2VuU2l6ZShzaXplLCBzY2FsZSA9IDApIHtcclxuXHJcbiAgICAgICAgbGV0IHZhbHVlID0ge307XHJcblxyXG4gICAgICAgIGxldCBiYXNlRm9udFNpemUgPSB0aGlzLmJhc2VTaXplO1xyXG5cclxuICAgICAgICBpZiAoc2NhbGUgPiAwKSB7XHJcbiAgICAgICAgICAgIGJhc2VGb250U2l6ZSA9IGJhc2VGb250U2l6ZSAqIHNjYWxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnJhdGlvIHx8ICFiYXNlRm9udFNpemUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHNpemUgPj0gMCkge1xyXG5cclxuICAgICAgICAgICAgdmFsdWUucmVsID0gTWF0aC5wb3codGhpcy5yYXRpbywgc2l6ZSk7XHJcbiAgICAgICAgICAgIHZhbHVlLnB4ID0gYmFzZUZvbnRTaXplICogdmFsdWUucmVsO1xyXG5cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIHZhbHVlLnJlbCA9IDEgLyBNYXRoLnBvdyh0aGlzLnJhdGlvLCBNYXRoLmFicyhzaXplKSk7XHJcbiAgICAgICAgICAgIHZhbHVlLnB4ID0gYmFzZUZvbnRTaXplICogdmFsdWUucmVsO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzY2FsZSA+IDApIHtcclxuICAgICAgICAgICAgdmFsdWUucmVsID0gdmFsdWUucmVsICogc2NhbGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGZvbnQgc2l6ZSBieSBuYW1lLlxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyT2YgbW9kdWxlOkZvbnRTaXplc1xyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc2l6ZSAtIGZvbnQgc2l6ZSBuYW1lLlxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJucyB7e319IC0gSGFzaE1hcC4gcHg6IHZhbHVlIGluIHBpeGVscywgcmVsOiByZWxhdGl2ZSB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBnZXRTaXplKHNpemUpIHtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgc2l6ZSBpcyBhbGlhcz9cclxuICAgICAgICBpZiAoc2l6ZSBpbiB0aGlzLmFsaWFzZXMpIHtcclxuICAgICAgICAgICAgc2l6ZSA9IHRoaXMuYWxpYXNlc1tzaXplXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByZXN1bHQgPSAwO1xyXG5cclxuICAgICAgICBpZiAoc2l6ZSBpbiB0aGlzLmZvbnRTaXplcykge1xyXG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLmZvbnRTaXplc1tzaXplXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoc2l6ZS5tYXRjaCgvXlxcLSpbMC05XSskLykpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMuZ2VuU2l6ZShzaXplKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2NvbnNvbGUubG9nKHNpemUgKyBcIjogXCIgKyBKU09OLnN0cmluZ2lmeShyZXN1bHQsIG51bGwgLCAyKSArIFwiIFwiICsgKHNpemUgaW4gdGhpcy5mb250U2l6ZXMpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgZm9udCBzaXplIHRvIG5hbWUuXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBtb2R1bGU6Rm9udFNpemVzXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzaXplIC0gZm9udCBzaXplIG5hbWUuXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUgLSBIYXNoTWFwLiBweDogdmFsdWUgaW4gcGl4ZWxzLCByZWw6IHJlbGF0aXZlIHZhbHVlXHJcbiAgICAgKi9cclxuICAgIHNldFNpemUoc2l6ZSwgdmFsdWUpIHtcclxuICAgICAgICAvLyBDaGVjayBzaXplIGlzIGFsaWFzP1xyXG4gICAgICAgIGlmIChzaXplIGluIHRoaXMuYWxpYXNlcykge1xyXG4gICAgICAgICAgICBzaXplID0gdGhpcy5hbGlhc2VzW3NpemVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmZvbnRTaXplc1tzaXplXSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIEZvbnQgU2l6ZXMgdG8gRm9udCBTaXplIENvbGxlY3Rpb24uXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJPZiBtb2R1bGU6Rm9udFNpemVzXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzaXplcyAtIHN0cmluZyBsaWtlIFwibmFtZTEgMjFweCAxLjUsIG5hbWUyIDE4cHgsIG5hbWUzIDEuNVwiLiBmb3JtYXQ6IG5hbWUgcGl4ZWxTaXplIHJlbGF0aXZlU2l6ZS5cclxuICAgICAqIFNlcGFyYXRvciBmb3IgZm9udCBzaXplcyBpcyBcIixcIi5cclxuICAgICAqIElmIHBpeGVsIG9yIHJlbGF0aXZlIHNpemUgaXQncyBwcmVzZW50IHRoZW4gaXQgY2FuIGJlIGdlbmVyYXRlZC5cclxuICAgICAqIEBwYXJhbSByaHl0aG1DYWxjdWxhdG9yIC0gaW5zdGFuY2Ugb2YgVmVydGljYWxSaHl0aG0gQ2xhc3MuXHJcbiAgICAgKi9cclxuICAgIGFkZEZvbnRTaXplcyhzaXplcywgcmh5dGhtQ2FsY3VsYXRvcikge1xyXG5cclxuICAgICAgICBsZXQgZm9udFNpemVzSW5mbyA9IHNpemVzLnNwbGl0KC9cXHMqXFwsXFxzKi8pO1xyXG4gICAgICAgIGxldCBzaXplID0gZm9udFNpemVzSW5mby5sZW5ndGggLSAxO1xyXG4gICAgICAgIHdoaWxlIChzaXplID49IDApIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBmb250U2l6ZUluZm8gPSBmb250U2l6ZXNJbmZvW3NpemVdLnNwbGl0KC9cXHMrLyk7XHJcbiAgICAgICAgICAgIGlmIChmb250U2l6ZUluZm8ubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICAgICAgIGxldCBmb250U2l6ZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzSGFzKGZvbnRTaXplSW5mb1sxXSwgXCJweFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplLnJlbCA9IChmb250U2l6ZUluZm8ubGVuZ3RoID09IDIpID8gcmh5dGhtQ2FsY3VsYXRvci5jb252ZXJ0KGZvbnRTaXplSW5mb1sxXSwgVU5JVC5FTSkgOiBmb250U2l6ZUluZm9bMl07XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemUucHggPSBwYXJzZUludChmb250U2l6ZUluZm9bMV0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZS5yZWwgPSBwYXJzZUZsb2F0KGZvbnRTaXplSW5mb1sxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemUucHggPSByaHl0aG1DYWxjdWxhdG9yLmNvbnZlcnQoZm9udFNpemVJbmZvWzFdLCBVTklULlBYKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U2l6ZShmb250U2l6ZUluZm9bMF0sIGZvbnRTaXplKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzaXplLS07XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn1cclxuLyoqXHJcbiAqIEV4cG9ydCBGb250U2l6ZXMgQ2xhc3MuXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBGb250U2l6ZXM7Il19
