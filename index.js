// Entry point for Streak75.
//
// 'react-native-gesture-handler' MUST be the very first import in the app entry
// file (before React / App). The draggable task editor and gesture-driven UI
// depend on this side-effect import running first.
import 'react-native-gesture-handler';

import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App)
// and ensures the environment is set up correctly whether running in Expo Go
// or a native build.
registerRootComponent(App);
