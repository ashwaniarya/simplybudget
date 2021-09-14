import React from 'react';
import {Provider} from 'react-redux';
import {store, persistor} from './src/configStore';
import RootRouter from './src/route';
import {PersistGate} from 'redux-persist/integration/react';
import {StatusBar} from 'react-native'

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        <RootRouter />
      </PersistGate>
    </Provider>
  );
}
