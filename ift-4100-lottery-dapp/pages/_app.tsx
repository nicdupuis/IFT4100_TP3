import '@/styles/globals.css'
import { AppProvider  } from '@/context/context'
import { AppProps } from 'next/app';

interface MyAppProps extends AppProps {}

export default function App({ Component, pageProps }: MyAppProps) {
  return(
    <AppProvider> 
      <Component {...pageProps} />
    </AppProvider>
  )

}
