import type { TolgeeInstance as I18nInstance } from '@tolgee/core'
import { createContext, type Context } from 'react'

export interface ReactOptions {
  useSuspense: boolean
}

export interface I18nContext {
  i18n: I18nInstance
  options?: ReactOptions
}

let I18Context: Context<I18nContext | null>
export const getProviderInstance = () => {
  if (!I18Context) {
    I18Context = createContext<I18nContext | null>(null)
  }
  return I18Context
}
