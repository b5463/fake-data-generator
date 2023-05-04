import '../styles/globals.css'
import type { AppProps } from 'next/app'
import MainTemplate from '../components/templates/MainTemplate'
import { HikariProviders, globalStyles } from 'hikari-ui'

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles()
  return (
    <HikariProviders>
      <MainTemplate>
        <Component {...pageProps} />
      </MainTemplate>
    </HikariProviders>
  )
}

export default MyApp
