# :lollipop: CNDY WALLET :lollipop:

Use [React Native Debugger](https://github.com/jhen0409/react-native-debugger) for debugging.

This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app) and then ejected.


## Credits

Food icons by [Salinee Pimpakun](https://www.shareicon.net/author/salinee-pimpakun).


## Signing Android

[Follow along here](https://facebook.github.io/react-native/docs/signed-apk-android.html).

The keystore file needs to be located at: `android/app/cndy-wallet-dev.keystore`

You need to set the following environment variables.

```
ORG_GRADLE_PROJECT_CNDY_RELEASE_STORE_FILE=cndy-wallet-dev.keystore
ORG_GRADLE_PROJECT_CNDY_RELEASE_KEY_ALIAS=***
ORG_GRADLE_PROJECT_CNDY_RELEASE_STORE_PASSWORD=***
ORG_GRADLE_PROJECT_CNDY_RELEASE_KEY_PASSWORD=***
```
