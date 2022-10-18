import '../styles/globals.css';
import type { AppProps } from 'next/app';
import NavbarLayout from '../components/NavbarLayout';
import { Provider } from 'react-redux';
import { store } from '../store/store';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <NavbarLayout>
        <Component {...pageProps} />
      </NavbarLayout>
    </Provider>
  );
}

export default MyApp;
