import App from 'next/app';
import {TrackingProvider} from '../components/context/Tracking';

class MyApp extends App {
  render() {
    const {Component, pageProps} = this.props;
    return (
        <TrackingProvider isGDPR={true}>
          <Component {...pageProps} />
        </TrackingProvider>
    );
  }
}

export default MyApp;
