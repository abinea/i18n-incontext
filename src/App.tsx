import './App.css'
import { useTranslate } from './mock'
import { Container, Grid } from '@mui/material'

const App: RFC = () => {
  const { t } = useTranslate()

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <div>{t('app-title')}</div>
        </Grid>
        <Grid item xs={4}>
          <div>{t('add-item-input-placeholder')}</div>
        </Grid>
        <Grid item xs={4}>
          <div>{t('share-button')}</div>
        </Grid>
        <Grid item xs={8}>
          <div>{t('send-via-email')}</div>
        </Grid>
      </Grid>
    </Container>
  )
}

export default App
