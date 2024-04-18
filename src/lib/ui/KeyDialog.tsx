import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from '@mui/material'
import { DEVTOOLS_Z_INDEX } from '../constants'

export type Props = {
  keyData: KeyData
}

export type KeyData = {
  key: null | string
  defaultValue: undefined | string
  fallbackNamespaces: string[]
  namespace: string
}

export const KeyDialog: RFC<Props> = ({ keyData }) => {
  const [isDialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    window.__isDialogOpen = isDialogOpen
  }, [isDialogOpen])

  useEffect(() => {
    setDialogOpen(true)
  }, [keyData])

  function handleClose(event: any) {
    event.stopPropagation()
    if (event.key === 'Escape') {
      setDialogOpen(false)
    }
  }

  return (
    <Dialog
      disableRestoreFocus
      disableEnforceFocus
      open={isDialogOpen}
      onClose={handleClose}
      fullWidth={true}
      style={{
        zIndex: DEVTOOLS_Z_INDEX,
        visibility: 'visible',
      }}
    >
      <DialogTitle>获取映射信息</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {' '}
          key: {keyData.key || 'undefined'}
        </DialogContentText>
        <DialogContentText>
          {' '}
          namespace: {keyData.namespace || 'undefined'}
        </DialogContentText>
        <DialogContentText>
          defaultValue: {keyData.defaultValue || 'undefined'}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}
