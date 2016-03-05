import {compose, concat, range, reduce} from 'ramda'
import {getColour} from './colours'

const charCodeRangeToLetters = (from, total) => range(from, from + total).map(n => String.fromCharCode(n))
const concatAll = reduce(concat, [])

const LOWERCASE_LETTERS = charCodeRangeToLetters(97, 26)
const UPPERCASE_LETTERS = charCodeRangeToLetters(65, 26)
const DIGITS = charCodeRangeToLetters(48, 10)
// Tags of elements whose text not to replace
const TAG_BLACKLIST = new Set(['script', 'noscript', 'style'])

// Set of glyphs that this extension colours
const SYNESTHESIFIABLE_GLYPHS = new Set(concatAll([LOWERCASE_LETTERS, UPPERCASE_LETTERS, DIGITS]))

const synesthesifyGlyph = glyph => {
  const element = document.createElement('span')
  element.style.backgroundColor = 'white'
  element.style.color = getColour(glyph)
  element.textContent = glyph
  return element
}

const synesthesifyNode = textNode => {
  const replacedContents = document.createDocumentFragment()
  let unsynesthesifiableBuffer = ''
  // Add punctuation / whitespace / etc as a raw text node
  const addUnsynesthesifiableBufferAsTextNode = () => {
    if (unsynesthesifiableBuffer.length !== 0) {
      replacedContents.appendChild(document.createTextNode(unsynesthesifiableBuffer))
      unsynesthesifiableBuffer = ''
    }
  }
  for (let glyph of textNode.textContent) {
    if (SYNESTHESIFIABLE_GLYPHS.has(glyph)) {
      addUnsynesthesifiableBufferAsTextNode()
      replacedContents.appendChild(synesthesifyGlyph(glyph))
    } else {
      unsynesthesifiableBuffer += glyph
    }
  }
  addUnsynesthesifiableBufferAsTextNode()
  textNode.parentNode.replaceChild(replacedContents, textNode)
}

const walk = rootNode => {
  // Make changes to offline copy of root node so as not to incur wrath of constant DOM reflow
  const copiedRootNode = rootNode.cloneNode(true)
  const walker = document.createTreeWalker(copiedRootNode, NodeFilter.SHOW_TEXT, null, false)
  const nodes = []
  while (walker.nextNode()) {
    if (walker.currentNode.textContent.trim().length === 0) { continue }
    // Make sure we don't touch script / style / etc tags
    if (TAG_BLACKLIST.has(walker.currentNode.parentNode.tagName.toLowerCase())) { continue }
    nodes.push(walker.currentNode)
  }
  for (let node of nodes) {
    synesthesifyNode(node)
  }
  rootNode.parentNode.replaceChild(copiedRootNode, rootNode)
}

walk(document.body)
