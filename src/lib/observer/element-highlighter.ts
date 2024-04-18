import { I18N_HIGHLIGHTER_CLASS } from '../constants'
import { elementClickable } from './helper'

const HIGHLIGHTER_BASE_STYLE: Partial<CSSStyleDeclaration> = {
  position: 'fixed',
  boxSizing: 'content-box',
  zIndex: String(Number.MAX_SAFE_INTEGER),
  contain: 'layout',
  display: 'block',
  borderStyle: 'solid',
  borderRadius: '4px',
}

type Props = {
  highlightColor: string
  highlightWidth: number
}

export function ElementHighlighter({ highlightColor, highlightWidth }: Props) {
  function initHighlightFunction(
    element: I18nElement,
    elementMeta: ElementMeta
  ) {
    elementMeta.highlight = () => {
      if (!element.isConnected) {
        return
      }
      const clickable = elementClickable(element)
      let highlightEl = elementMeta.highlightEl
      if (!highlightEl) {
        highlightEl = document.createElement('div')
        highlightEl.classList.add(I18N_HIGHLIGHTER_CLASS)
        Object.entries(HIGHLIGHTER_BASE_STYLE).forEach(([key, value]) => {
          // @ts-expect-error - style[key] is a valid assignment
          highlightEl!.style[key] = value
        })
        highlightEl.style.borderColor = highlightColor

        elementMeta.highlightEl = highlightEl
        document.body.appendChild(highlightEl)
      }

      const shape = element.getBoundingClientRect()

      highlightEl.style.pointerEvents = clickable ? 'none' : 'auto'
      highlightEl.style.borderWidth = highlightWidth + 'px'
      highlightEl.style.top = shape.top - highlightWidth + 'px'
      highlightEl.style.left = shape.left - highlightWidth + 'px'
      highlightEl.style.width = shape.width + 'px'
      highlightEl.style.height = shape.height + 'px'
    }
  }

  function initUnhighlightFunction(
    element: I18nElement,
    elementMeta: ElementMeta
  ) {
    elementMeta.unhighlight = () => {
      elementMeta.highlightEl?.remove()
      elementMeta.highlightEl = undefined
    }
  }

  return Object.freeze({
    initHighlighter(element: I18nElement, elementMeta: ElementMeta) {
      initHighlightFunction(element, elementMeta)
      initUnhighlightFunction(element, elementMeta)
    },
  })
}
