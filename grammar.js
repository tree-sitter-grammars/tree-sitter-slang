const C = require('tree-sitter-c/grammar');
const HLSL = require("tree-sitter-hlsl/grammar")

const PREC = Object.assign(C.PREC, {
    IS: C.PREC.RELATIONAL + 1,
    AS: C.PREC.RELATIONAL + 1,
});

module.exports = grammar(HLSL, {
    name: 'slang',

    conflicts: ($, original) => original.filter((s) => {
        if (s.length === 2) {
            const [l, r] = s;
            if (l.name === $.parameter_list.name && r.name === $.argument_list.name) {
                return false;
            }
        }
        return true;
    }).concat([
        [$._top_level_statement, $._empty_declaration],
        [$._declarator, $.type_hinted_declarator],
        [$.type_specifier, $.compound_literal_expression],
        [$.type_specifier, $._class_name],
        [$._declaration_specifiers, $.declaration_list],
        [$._declaration_specifiers, $._top_level_statement],
        [$.declaration_list, $._empty_declaration],
    ]),

    rules: {
        _top_level_item: (_, original) => original,
        _top_level_statement: ($, original) => choice(original, $.import_statement, $.type_specifier),

        placeholder_type_specifier: $ => prec(1, seq(
            field('constraint', optional($.type_specifier)),
            choice("var", "let", "This"),
        )),

        init_declarator: $ => seq(
            field('declarator', choice($._declarator, $.type_hinted_declarator)),
            '=',
            field('value', choice($.initializer_list, $.expression)),
        ),

        declaration: $ => seq(
            $._declaration_specifiers,
            commaSep1(field('declarator', choice(
                // type hint has ambiguity with semantics in struct declarations
                seq(choice($._declarator, $.type_hinted_declarator), optional(alias(seq(':', $.expression), $.semantics))),
                $.init_declarator
            ))),
            ';'
        ),

        //compound_statement: $ => seq(
        //'{',
        //repeat(choice($._block_item, $.type_specifier)),
        //'}',
        //),
        declaration_list: $ => seq(
            '{',
            repeat(choice($._block_item, $.type_specifier)),
            '}',
        ),

        type_hinted_declarator: $ => seq($.identifier, $.type_hint),
        type_hint: $ => seq(":", $._type_declarator),

        interface_specifier: $ => seq(
            choice('interface', 'dyn', 'some', seq('dyn', 'interface'), seq('some', 'interface')),
            $._class_declaration,
        ),

        extension_specifier: $ => seq(
            'extension',
            $._class_declaration,
        ),

        type_specifier: ($, original) => choice(original, $.interface_specifier, $.extension_specifier, $.associatedtype_specifier),

        template_argument_list: $ => seq(
            '<',
            commaSep(choice(
                prec.dynamic(4, seq("let", $.identifier, optional($.interface_requirements), optional(seq("=", $.expression)))),
                prec.dynamic(3, seq($.type_descriptor, optional($.interface_requirements), optional(seq("=", $.type_descriptor)))),
                prec.dynamic(2, alias($.type_parameter_pack_expansion, $.parameter_pack_expansion)),
                prec.dynamic(1, $.expression),
            )),
            alias(token(prec(1, '>')), '>'),
        ),
        interface_requirements: $ => prec.left(seq(":", andSep1($.identifier))),

        _function_declarator_seq: ($, original) => seq(original, optional($.where_clause)),
        where_clause: ($, original) => prec.right(seq("where", commaSep1(seq($.type_descriptor, optional($.interface_requirements), optional(seq("=", $.type_descriptor)))))),

        binary_expression: ($, original) => {
            const table = [
                ['is', PREC.IS],
                ['as', PREC.AS],
            ];

            return choice(
                ...original.members,
                ...table.map(([operator, precedence]) => {
                    return prec.left(precedence, seq(
                        field('left', $.expression),
                        // @ts-ignore
                        field('operator', operator),
                        field('right', $.expression),
                    ));
                }));
        },

        import_statement: $ => prec(2, seq(optional("__exported"), "import", dotSep1($.identifier), ";")),

        _field_declaration_list_item: ($, original) => choice(original, $.property_declaration, $.subscript_declaration, $.init_declaration, $.associatedtype_declaration),
        init_declaration: $ => seq("__init", $.parameter_list, $.compound_statement),
        subscript_declaration: $ => seq("__subscript", $.parameter_list, optional($.trailing_return_type), alias(seq("{", repeat(choice($.property_get, $.property_set)), "}"), $.compound_statement)),
        property_declaration: $ => seq("property",
            choice(seq($.identifier, ":", $.type_descriptor),
                seq($.type_descriptor, $.identifier)),
            alias(seq("{", repeat(choice($.property_get, $.property_set)), "}"), $.compound_statement)),
        property_get: $ => seq("get", choice($.compound_statement, ";")),
        property_set: $ => seq("set", choice($.compound_statement, ";")),
        associatedtype_declaration: $ => seq("associatedtype", $._type_identifier, optional($.base_class_clause), ";"),
        associatedtype_specifier: $ => prec.right(seq($.type_specifier, ".", $.type_specifier))
    },
});

function commaSep(rule) {
    return optional(commaSep1(rule));
}

function commaSep1(rule) {
    return seq(rule, repeat(seq(',', rule)))
}

function dotSep1(rule) {
    return seq(rule, repeat(seq('.', rule)))
}

function andSep1(rule) {
    return seq(rule, repeat(seq('&', rule)))
}
