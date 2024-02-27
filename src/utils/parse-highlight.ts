import { parse, NodeType } from 'node-html-parser'

import Highlight from 'src/models/highlight'

const parseHighlight = (highlight: string): Highlight[] => {
  const root = parse(highlight)
  const result: Highlight[] = []

  root.childNodes.forEach((childNode) => {
    if (
      childNode.nodeType === NodeType.ELEMENT_NODE &&
      childNode['rawTagName']
    ) {
      const text = childNode.textContent

      result.push({ text, isMatch: true })
    }

    else if (childNode.nodeType === NodeType.TEXT_NODE) {
      const text = childNode.textContent

      if (text !== '') {
        result.push({ text, isMatch: false })
      }
    }
  })

  return result
}

export default parseHighlight
