# Crossroads Mobile Build

The directory contains all the tools and code to build the CrossRoads mobile application on Android and IOS. The initial application was created using [Expo](https://expo.dev) and the command line tool [`create-expo-app`](https://docs.expo.dev/more/create-expo/).


## Prerequisites
You will need either an [Android Studio Emulator](https://docs.expo.dev/workflow/android-studio-emulator/) or an [IOS Simulator](https://docs.expo.dev/workflow/ios-simulator/). 

## Get started
After installing we can run the app.

1. Install dependencies

   ```bash
   yarn install
   ```
   Using Yarn causes less issues when building. Click [here](https://classic.yarnpkg.com/lang/en/docs/install/) for installation instructions.

2. Start the app

   ```bash
    npm run android
   ```
    or 
   ```bash
    npm run ios
   ```

## Common Issues & Fixes  

### 1. `:react-native-reanimated:configureCMakeDebug[arm64-v8a] FAILED` (Android)  

**Issue:** This error occurs in an empty React Native project when building for Android.  

**Possible Causes & Fixes:**  
- **Long or Complex File Path:**  
  - If your project folder has a long name or is deeply nested, it may cause issues with CMake.  
  - **Fix:** Move your project to a shorter, simpler path (e.g., `C:\Projects\MyApp` instead of `C:\Users\YourName\Documents\ReactNative\SomeLongFolderName\MyApp`).  
  - [Reference Issue](https://github.com/software-mansion/react-native-reanimated/issues/4712#issuecomment-1852734366)  

### 2. [Reanimated] Babel plugin exception: TypeError: (0 , types_12.cloneNode) is not a function"

**Issue:** There is an issue with the package and version manager and the package is not recognized. 
**Possible Causes & Fixes:**   
  - **Fix:** Use yarn install instead.  
  - [Reference Issue](https://github.com/software-mansion/react-native-reanimated/issues/6006#issuecomment-2599326800)  


## Additional Resouces

### Using Expo 
[Expo Router – Creating Pages](https://docs.expo.dev/router/create-pages/)  

### UI Customization  
- [Amplify UI for React Native – Getting Started](https://ui.docs.amplify.aws/react-native/getting-started/introduction)  
- [Amplify UI Authenticator Customization](https://ui.docs.amplify.aws/react-native/connected-components/authenticator/customization)  