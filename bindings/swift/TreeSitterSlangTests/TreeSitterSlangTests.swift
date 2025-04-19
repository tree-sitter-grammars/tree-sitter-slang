import XCTest
import SwiftTreeSitter
import TreeSitterSlang

final class TreeSitterSlangTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_slang())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Slang grammar")
    }
}
