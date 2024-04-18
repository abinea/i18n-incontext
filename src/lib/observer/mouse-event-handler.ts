import { ModifierKey, ObserverOptionsInternal } from '@tolgee/core'
import { DEVTOOLS_ID } from '../constants'
import { ElementStoreType } from './element-store'

const eCapture = {
  capture: true,
}

const ePassive = {
  capture: true,
  passive: true,
}

type Coordinates = {
  x: number
  y: number
}

type Props = {
  highlightKeys: ModifierKey[]
  elementStore: ElementStoreType
  onClick: (el: I18nElement) => void
  options: ObserverOptionsInternal
}

const MODIFIER_MAP = new Map<
  ModifierKey,
  'ctrlKey' | 'altKey' | 'metaKey' | 'shiftKey'
>([
  ['Control', 'ctrlKey'],
  ['Alt', 'altKey'],
  ['Meta', 'metaKey'],
  ['Shift', 'shiftKey'],
])

export function MouseEventHandler({
  highlightKeys,
  elementStore,
  onClick,
  options,
}: Props) {
  const keysDown = new Set<ModifierKey>()
  let highlighted: I18nElement | undefined
  let cursorPosition: Coordinates | undefined
  let subscribedEvents: [
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ][] = []

  const documentOrShadowRoot = (options.targetElement?.getRootNode() ||
    document) as unknown as ShadowRoot

  const targetDocument = options.targetElement?.ownerDocument || document

  function highlight(el: I18nElement | undefined) {
    if (highlighted !== el) {
      unhighlight()
      const meta = elementStore.get(el)
      if (meta) {
        meta.preventClean = true
        meta.highlight?.()
        highlighted = el
      }
    }
  }

  function unhighlight() {
    const meta = elementStore.get(highlighted)
    if (meta) {
      meta.preventClean = false
      meta.unhighlight?.()
      highlighted = undefined
    }
  }

  function updateHighlight() {
    if (window.__isDialogOpen) return

    const position = cursorPosition

    let newHighlighted: I18nElement | undefined
    if (position && areKeysDown()) {
      const elements =
        documentOrShadowRoot.elementsFromPoint(position.x, position.y) || []

      newHighlighted = getClosestI18nElement(elements)
    }
    highlight(newHighlighted)
  }

  function updateCursorPosition(position: Coordinates) {
    cursorPosition = position
    updateHighlight()
  }

  function updateModifiers(e: MouseEvent | KeyboardEvent) {
    for (const [modifier, modifierProperty] of MODIFIER_MAP.entries()) {
      if (keysDown.has(modifier) && !e[modifierProperty]) {
        keysDown.delete(modifier)
      } else if (!keysDown.has(modifier) && e[modifierProperty]) {
        keysDown.add(modifier)
      }
    }
  }

  function blockEvents(e: MouseEvent) {
    updateModifiers(e)
    if (areKeysDown() && !isInUiDialog(e.target as Element)) {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  function onMouseMove(e: MouseEvent) {
    updateModifiers(e)
    updateCursorPosition({ x: e.clientX, y: e.clientY })
  }

  function onKeyDown(e: KeyboardEvent) {
    updateModifiers(e)
    updateHighlight()
  }

  function onKeyUp(e: KeyboardEvent) {
    updateModifiers(e)
    updateHighlight()
  }

  function onScroll() {
    const meta = elementStore.get(highlighted)
    meta?.highlight?.()
  }

  function handleClick(e: MouseEvent) {
    blockEvents(e)
    updateModifiers(e)
    updateCursorPosition({ x: e.clientX, y: e.clientY })
    if (areKeysDown() && highlighted) {
      onClick(highlighted)
      unhighlight()
    }
  }

  function subscribe<K extends keyof DocumentEventMap>(
    type: K,
    listener: (ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ) {
    targetDocument.addEventListener(type, listener, options)
    subscribedEvents.push([type, listener as any, options])
  }

  function initEventListeners() {
    subscribe('keydown', onKeyDown, eCapture)
    subscribe('keyup', onKeyUp, eCapture)
    subscribe('mousemove', onMouseMove, ePassive)

    subscribe('scroll', onScroll, ePassive)
    subscribe('click', handleClick, eCapture)

    subscribe('mouseenter', blockEvents, eCapture)
    subscribe('mouseover', blockEvents, eCapture)
    subscribe('mouseout', blockEvents, eCapture)
    subscribe('mouseleave', blockEvents, eCapture)
    subscribe('mousedown', blockEvents, eCapture)
    subscribe('mouseup', blockEvents, eCapture)
  }

  function removeEventListeners() {
    for (const params of subscribedEvents) {
      targetDocument.removeEventListener(...params)
    }
    subscribedEvents = []
  }

  function isInUiDialog(element: Element) {
    return Boolean(findAncestor(element, (el) => el.id === DEVTOOLS_ID))
  }

  function getClosestI18nElement(
    elements: Element[]
  ): I18nElement | undefined {
    for (const element of elements) {
      const result = findAncestor(element, (el) =>
        elementStore.get(el as I18nElement)
      ) as I18nElement | undefined | null

      if (result !== undefined) {
        return result || undefined
      }
    }
  }

  function findAncestor(
    element: Element,
    func: (el: Element) => any
  ): Element | undefined | null {
    if (element.id === DEVTOOLS_ID) {
      return null
    }
    if (func(element)) {
      return element
    }
    if (element?.parentElement) {
      return findAncestor(element.parentElement, func)
    }
    return undefined
  }

  function areKeysDown() {
    for (const key of highlightKeys) {
      if (!keysDown.has(key)) {
        return false
      }
    }
    return true
  }

  return Object.freeze({
    stop() {
      removeEventListeners()
    },

    run() {
      initEventListeners()
    },
  })
}
