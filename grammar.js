const CPP = require("tree-sitter-cpp/grammar")
const HLSL = require("tree-sitter-hlsl/grammar")

module.exports = grammar(HLSL, {
    name: 'slang',

    conflicts: ($, original) => original.concat([
    ]),

    rules: {
        _top_level_item: (_, original) => original,

    }
});

function commaSep1(rule) {
    return seq(rule, repeat(seq(',', rule)))
}
