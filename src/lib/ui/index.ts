import type { TolgeePlugin, UiMiddleware } from '@tolgee/core'
import { InContextUi } from './InContextUi'

export const ContextUi = (): TolgeePlugin => (i18n, tools) => {
  const ui: UiMiddleware | undefined = (props) => InContextUi(props)
  tools.setUi(ui)
  return i18n
}
