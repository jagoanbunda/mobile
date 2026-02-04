import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';

// Only configure in development
if (__DEV__) {
  Reactotron.setAsyncStorageHandler(AsyncStorage)
    .configure({
      name: 'JagoanBunda Mobile',
    })
    .useReactNative({
      asyncStorage: false, // Disable AsyncStorage tracking
      networking: {
        // Filter out Expo dev server noise
        ignoreUrls: /symbolicate|127\.0\.0\.1|localhost:19000|localhost:8081/,
      },
      editor: false,
      errors: { veto: () => false },
      overlay: false,
    })
    .connect();

  // Clear logs on app reload for cleaner debugging
  Reactotron.clear();
}

export default Reactotron;
