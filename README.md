tree-sitter-slang
==================

This is a extension of [tree-sitter-cpp](https://github.com/tree-sitter/tree-sitter-cpp) 
and [tree-sitter-hlsl](https://github.com/theHamsta/tree-sitter-hlsl) to support
the syntax of [slang](https://shader-slang.com/slang/user-guide/index.html).

Work in progress...

Limitations/TODOs:

- [ ] ambiguity between HLSL semantics and Slang type hints
- [ ] extensions/interfaces are not accepted without terminating `;`, like for classes/structs in C++, but

        Slang allows for a trailing semicolon (;) on struct declarations, but does not require it.
