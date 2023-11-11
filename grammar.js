const HLSL = require("tree-sitter-hlsl/grammar")

module.exports = grammar(HLSL, {
    name: 'slang',

    conflicts: ($, original) => original.concat([
        [$._declarator, $.type_hinted_declarator],
        //[$._scope_resolution]
    ]),

    rules: {
        _top_level_item: (_, original) => original,

        placeholder_type_specifier: $ => prec(1, seq(
            field('constraint', optional($._type_specifier)),
            choice("var", "let"),
        )),

        init_declarator: $ => seq(
            field('declarator', choice($._declarator, $.type_hinted_declarator)),
            '=',
            field('value', choice($.initializer_list, $._expression)),
        ),

        //_declaration_declarator: $ => commaSep1(field('declarator', choice(
        //seq($._declarator, optional($.gnu_asm_expression)),
        //$.init_declarator,
        //))),

        declaration: $ => seq(
            $._declaration_specifiers,
            commaSep1(field('declarator', choice(
                seq(choice($._declarator, $.type_hinted_declarator), optional(alias(seq(':', $._expression), $.semantics))),
                $.init_declarator
            ))),
            ';'
        ),

        //declaration: $ => seq(
        //$._declaration_specifiers,
        //$._declaration_declarator,
        //';'),

        //_declarator: ($, original) => choice(
        //$.type_hinted_declarator,
        //original,
        ////$.structured_binding_declarator,
        //),

        type_hinted_declarator: $ => seq($.identifier, $.type_hint),
        type_hint: $ => seq(":", $._type_declarator)
    }
});

function commaSep1(rule) {
    return seq(rule, repeat(seq(',', rule)))
}
