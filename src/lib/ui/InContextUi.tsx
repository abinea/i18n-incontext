import type { UiKeyOption, UiProps } from '@tolgee/core'
import { Root, createRoot } from 'react-dom/client'
import { getRootElement } from './getRootElement'

import { KeyDialog } from './KeyDialog'
import { KeyContextMenu } from './KeyContextMenu'

export type KeyData = {
  key: null | string
  defaultValue: undefined | string
  fallbackNamespaces: string[]
  namespace: string
}

export const InContextUi = (props: UiProps) => {
  let rootElement: ShadowRoot | undefined
  let modalRoot: Root
  let contextMenuRoot: Root

  function checkInitialization() {
    const newRoot = getRootElement()
    if (rootElement !== newRoot) {
      rootElement = newRoot

      const modalContainer = document.createElement('div')
      rootElement.appendChild(modalContainer)
      modalRoot = createRoot(modalContainer)

      const contextMenuContainer = document.createElement('div')
      rootElement.appendChild(contextMenuContainer)
      contextMenuRoot = createRoot(contextMenuContainer)
    }
  }

  const self = {
    openKeyDialog(keyData: KeyData) {
      checkInitialization()
      modalRoot.render(<KeyDialog uiProps={props} keyData={keyData} />)
    },

    async getKey(props: {
      keys: Map<string, string | undefined>
      target: HTMLElement
    }): Promise<string | undefined> {
      return await new Promise<string | undefined>((resolve) => {
        checkInitialization()
        contextMenuRoot.render(
          <KeyContextMenu
            // reset element state every time
            key={Math.random()}
            initialState={{
              ...props,
              onSelect(key) {
                resolve(key)
              },
            }}
          />
        )
      })
    },

    async handleElementClick(
      keysAndDefaults: UiKeyOption[],
      target: HTMLElement
    ) {
      checkInitialization()
      let key = keysAndDefaults[0].key as string | undefined
      const keysMap = new Map(
        keysAndDefaults.map(({ key, translation, defaultValue }) => [
          key,
          translation || defaultValue,
        ])
      )
      if (keysMap.size > 1) {
        key = await self.getKey({
          keys: keysMap,
          target,
        })
      }
      if (key) {
        const value = keysAndDefaults.find((val) => val.key === key)!
        self.openKeyDialog({
          key,
          namespace: value.namespace,
          defaultValue: value.defaultValue,
          fallbackNamespaces: value.fallbackNamespaces,
        })
      }
    },
  }
  return self
}
