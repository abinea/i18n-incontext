import type { KeyAndParams, ObserverOptions } from '@tolgee/core'

export const isElementNode = (node: Node): node is Element =>
  node.nodeType === Node.ELEMENT_NODE
export const isAttributeNode = (node: Node): node is Element =>
  node.nodeType === Node.ATTRIBUTE_NODE

export function getNodeText(node: Node) {
  return node.textContent
}

export function setNodeText(node: Node, text: string) {
  node.textContent = text
}

export function compareDescriptors(
  descriptor: KeyDescriptorInternal,
  criteria: KeyDescriptorInternal
) {
  const keyMatches =
    descriptor.key === undefined ||
    criteria.key === undefined ||
    criteria.key === descriptor.key
  const nsMatches =
    descriptor.ns === undefined ||
    criteria.ns === undefined ||
    descriptor.ns?.findIndex((ns) => criteria.ns?.includes(ns)) !== -1

  return keyMatches && nsMatches
}

export function elementClickable(el: HTMLElement) {
  while (el) {
    if (el.getAttribute('disabled') !== null) {
      return false
    }
    el = el.parentElement as HTMLElement
  }
  return true
}

export function initElementMeta(element: I18nElement): ElementMeta {
  return {
    element,
    nodes: new Map(),
  }
}

export function initNodeMeta(
  oldTextContent: string,
  keys: KeyAndParams[]
): NodeMeta {
  return {
    oldTextContent,
    keys,
  }
}

export function DomHelper(options: ObserverOptions) {
  function getParentElement(node: Node): Element | undefined {
    if (node.parentElement) {
      return node.parentElement
    }
    if ((node as Attr).ownerElement) {
      return (node as Attr).ownerElement || undefined
    }
  }

  const self = Object.freeze({
    getSuitableParent(node: Node): Element {
      const domParent = getParentElement(node)

      if (domParent === undefined) {
        // eslint-disable-next-line no-console
        console.error(node)
        throw new Error('No suitable parent found for node above.')
      }

      if (!options.passToParent) {
        return domParent
      }

      if (Array.isArray(options.passToParent)) {
        const tagNameEquals = (elementTagName: string) =>
          domParent.tagName.toLowerCase() === elementTagName.toLowerCase()
        if (options.passToParent.findIndex(tagNameEquals) === -1) {
          return domParent
        }
      }

      if (typeof options.passToParent === 'function') {
        if (!options.passToParent(domParent)) {
          return domParent
        }
      }

      return self.getSuitableParent(domParent)
    },
  })

  return self
}
