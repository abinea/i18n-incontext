export type MemorizedElementsMap = Map<I18nElement, ElementMeta>

export function ElementStore() {
  const memorizedElements: MemorizedElementsMap = new Map()

  return Object.freeze({
    set(el: I18nElement, meta: ElementMeta) {
      memorizedElements.set(el, meta)
    },

    get(el: I18nElement | undefined) {
      return el && memorizedElements.get(el)
    },

    remove(el: I18nElement) {
      return memorizedElements.delete(el)
    },

    forEachElement(callback: (el: I18nElement, meta: ElementMeta) => void) {
      memorizedElements.forEach((value, key) => callback(key, value))
    },
  })
}

export type ElementStoreType = ReturnType<typeof ElementStore>
