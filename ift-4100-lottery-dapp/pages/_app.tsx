import '@/styles/globals.css'
import { AppProvider  } from '@/context/context'
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface MyAppProps extends AppProps {}

export default function App({ Component, pageProps }: MyAppProps) {
  return(
    <AppProvider> 
      <Component {...pageProps} />
      <ToastContainer />
    </AppProvider>
  )

}
