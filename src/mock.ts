import { useContext } from 'react'
import { getProviderInstance } from './lib/context'
import enLang from './i18n/en.json'

export const useTranslate = (namespace?: string) => {
  const { i18n } = useContext(getProviderInstance())!
  const t = (key: string) => {
    const translation = (enLang as any)[key]
    const wrapped = i18n.wrap({ key, translation, ns: namespace })!
    return wrapped
  }

  return { t }
}
