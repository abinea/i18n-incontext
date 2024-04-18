import type { KeyAndParams } from '@tolgee/core'

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
