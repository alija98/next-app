import '../styles/globals.css';
import type { AppProps } from 'next/app';
import NavbarLayout from '@/components/NavbarLayout';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  return (
    <Provider store={store}>
      <SessionProvider session={pageProps.session} refetchInterval={5 * 60}>
        <NavbarLayout>
          <Component {...pageProps} />
        </NavbarLayout>
      </SessionProvider>
    </Provider>
  );
}

export default MyApp;
