import { Suspense, useEffect, useState } from 'react'
import { getProviderInstance, type I18nContext } from './context'
import { DEFAULT_REACT_OPTIONS } from './constants'

interface I18nProviderProps extends I18nContext {
  fallback?: React.ReactNode
}

export const I18nProvider: RFC<I18nProviderProps> = ({
  i18n,
  options,
  children,
  fallback,
}) => {
  const [loading, setLoading] = useState(!i18n.isLoaded())
  const I18nContext = getProviderInstance()
  const optionsWithDefault = { ...DEFAULT_REACT_OPTIONS, ...options }

  useEffect(() => {
    i18n
      .run()
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [i18n])

  return (
    <I18nContext.Provider value={{ i18n, options: optionsWithDefault }}>
      {loading ? (
        fallback
      ) : (
        <Suspense fallback={fallback || null}>{children}</Suspense>
      )}
    </I18nContext.Provider>
  )
}

export { TolgeeCore as I18nCore } from '@tolgee/core'
export { InContextTools as DevTools } from './tools'
