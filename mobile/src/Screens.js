/**
 * Created by thuyenphan on 5/20/17.
 */

import { Navigation } from 'react-native-navigation';

import Home from './containers/Home';
import Scanner from './containers/Scanner';

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  Navigation.registerComponent('Infection.Home', () =>  Home, store, Provider);
  Navigation.registerComponent('Infection.Scanner', () =>  Scanner, store, Provider);
}
