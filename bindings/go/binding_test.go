package tree_sitter_slang_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-slang"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_slang.Language())
	if language == nil {
		t.Errorf("Error loading Slang grammar")
	}
}
