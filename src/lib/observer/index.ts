import {
  ObserverMiddleware,
  ObserverRunProps,
  TolgeePlugin,
} from '@tolgee/core'
import { createObserver } from './observer'
import { InvisibleWrapper } from '../invisible/wrapper'

export const InvisibleObserver = (): ObserverMiddleware => () => {
  const observer = createObserver()

  const self = Object.freeze({
    ...observer,
    run(props: ObserverRunProps) {
      const wrapper = InvisibleWrapper({
        fullKeyEncode: props.options.fullKeyEncode,
      })
      observer.run({ ...props, wrapper })
    },
    retranslate() {},
    outputNotFormattable: false,
  })
  return self
}

export const ObserverPlugin = (): TolgeePlugin => (i18n, tools) => {
  tools.setObserver(InvisibleObserver())
  return i18n
}
