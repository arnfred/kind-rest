define("ace/mode/kind_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var KindHighlightRules = function() {
    var builtinFunctions = ("match");

    var keywords = ("def type module import");

    var buildinConstants = ("");

    var keywordMapper = this.createKeywordMapper({
        "keyword.other": keywords,
        "constant.language": buildinConstants,
        "support.function": builtinFunctions
    }, "identifier", false, " ");

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        "start" : [
            {
                token : "comment.line.number-sign",
                regex : "%.*$"
            }, {
                token : "constant.language", // brackets
                regex : /[\(\)\[\]\{\}]/
            }, {
                token : "keyword.other", // separators
                regex : /[|,.\/:]/
            }, {
                token : "punctuation.operator",
                regex : /[?:,;\/.]/
            }, {
                token : "constant.language",
                regex : "[->]",
            }, {
                token : "string.interpolated", // eval lazy argument
                regex : /`/ // `
            }, {
                token : "constant.numeric", // hex
                regex : "0[xX][0-9a-fA-F]+\\b"
            }, {
                token : "constant.numeric", // float
                regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
            }, {
                token : "string", // single line
                regex : '"',
                next: "string"
            }, {
                token : "keyword.other",
                regex : "module",
                next  : "module-highlight"
            }, {
                token : keywordMapper, // symbol
                regex : /[a-zA-Z_-][a-zA-Z_-\d]+/
            }
        ],
        "module-highlight" :[
            {
                token : "markdown.bold",
                regex : /[a-zA-Z_-][a-zA-Z_-\d\/]*/,
                next  : "start"
            }
            ],
        "string" : [
            {
                token : "constant.language.escape",
                regex : "\\\\.|\\\\$"
            }, {
                token : "string",
                regex : '[^"\\\\]+'
            }, {
                token : "string",
                regex : '"',
                next : "start"
            }
        ]
    };
};

oop.inherits(KindHighlightRules, TextHighlightRules);

exports.KindHighlightRules = KindHighlightRules;
});

define("ace/mode/kind",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/kind_highlight_rules","ace/range"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var KindHighlightRules = require("./kind_highlight_rules").KindHighlightRules;
console.debug(KindHighlightRules);
var Range = require("../range").Range;

var Mode = function() {
    this.HighlightRules = KindHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "%";

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);
        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        var complete_line = line + input;
        if (complete_line.match(/^\s*(begin|end)$/)) {
            return true;
        }

        return false;
    };

    this.autoOutdent = function(state, session, row) {

        var line = session.getLine(row);
        var prevLine = session.getLine(row - 1);
        var prevIndent = this.$getIndent(prevLine).length;
        var indent = this.$getIndent(line).length;
        if (indent <= prevIndent) {
            return;
        }

        session.outdentRows(new Range(row, 0, row + 2, 0));
    };


    this.$id = "ace/mode/kind";
}).call(Mode.prototype);

exports.Mode = Mode;

});                (function() {
                    window.require(["ace/mode/kind"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            
