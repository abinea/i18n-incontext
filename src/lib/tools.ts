import { type TolgeePlugin } from '@tolgee/core'
import { ContextUi } from './ui'
import { ObserverPlugin } from './observer'

export const InContextTools = (): TolgeePlugin => (i18n, tools) => {
  if (!tools.hasUi()) {
    i18n.addPlugin(ContextUi())
  }
  if (!tools.hasObserver()) {
    i18n.addPlugin(ObserverPlugin())
  }
  return i18n
}
