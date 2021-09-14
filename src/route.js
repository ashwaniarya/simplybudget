import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
//Components
import Init from './_init/init';
import CreateBudget from './createBudget';
import Setting from './_home/setting';
import Home from './_home/home';
const mainApp = createStackNavigator(
  {
    Home: {
      screen: Home,
    },
    Setting: {
      screen: Setting,
    },
  },
  {
    defaultNavigationOptions: () => {
      return {
        headerShown: false,
      };
    },
  },
);
const initNavigation = createSwitchNavigator(
  {
    Init: {
      screen: Init,
    },
    CreateBudget: {
      screen: CreateBudget,
    },
    MainApp: {
      screen: mainApp,
    },
  },
  {
    initialRouteName: 'Init',
  },
);

export default createAppContainer(initNavigation);
