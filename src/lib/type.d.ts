type ElementMeta = {
  element: I18nElement
  wrappedWithElementOnlyKey?: string
  wrappedWithElementOnlyDefaultHtml?: string
  nodes: Map<Node, NodeMeta>
  highlightEl?: HTMLDivElement
  highlight?: () => void
  unhighlight?: () => void
  /**
   * Stops removing of element's inactive nodes and
   * unregistering from ElementRegistrar.
   *
   * It's used when user has mouse on the element, so there is
   * potential, that element highlight will be triggered.
   *
   * Triggering highlight needs the metadata stored on element, so
   * we need the ability to prevent clean.
   */
  preventClean?: boolean
}

type NodeMeta = {
  oldTextContent: string
  keys: KeyAndParams[]
  keyAttributeOnly?: boolean
}

interface I18nElement extends HTMLElement {
  _18n?: boolean
}

type RFC<T = object> = React.FC<React.PropsWithChildren<T>>

type KeyDescriptorInternal = {
  key?: string
  ns?: string[] | undefined
}

interface Window {
  __isDialogOpen: boolean
}
