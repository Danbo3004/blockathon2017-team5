import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import store, { reHydrate } from './redux/store';
import { registerScreens } from './Screens';

registerScreens(store, Provider);

const startApp = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: 'Infection.Home',
      navigatorStyle: {
        navBarBackgroundColor: '#262626'
      }
    },
  });
};


export default class App {
  constructor() {
    reHydrate(() => {
      startApp();
    });
  }
}
