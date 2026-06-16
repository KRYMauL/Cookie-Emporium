# Cookie Emporium — Android Build

This folder turns the `cookie-clicker.html` game into a real Android app
(.apk / .aab) using [Capacitor](https://capacitorjs.com/), ready for the
Google Play Store.

The game file is already copied into `www/index.html` — that's the only
file Capacitor needs; it gets bundled straight into the app, so no web
hosting is required.

## Prerequisites (install these on your own machine)

1. **Node.js** v18+ — https://nodejs.org
2. **Android Studio** — https://developer.android.com/studio
   (also installs the Android SDK)
3. A **Java JDK** (Android Studio bundles one — point `JAVA_HOME` at it)

You do **not** need a Mac. This all works on Windows/Linux/macOS.

## One-time setup

```bash
cd cookie-emporium-app
npm install
npx cap add android
```

This generates the `android/` folder — a full native Android Studio
project wrapping your HTML game.

## Local preview in a browser (no Android needed)

```bash
npm start
```

Serves `www/` at **http://localhost:8080** — open that in any browser
to play the game exactly as it'll appear in the app, with hot reloading
of file contents on refresh. Use `npm run dev` to also auto-open your
default browser.

## Live-reload on an Android device/emulator

This points the native app at your local server instead of the bundled
files, so editing `www/index.html` updates the app instantly on reload
— no rebuild needed.

```bash
npm start              # in one terminal, keep this running
npm run dev:android    # in another terminal
```

This uses `capacitor.config.dev.json` (allows plain HTTP + cleartext
traffic to localhost). The production config (`capacitor.config.json`)
is untouched and never points at localhost, so release builds always
bundle the real files — just make sure you build with the default
config, not the dev one.

## Build a debug APK (to test on your phone)

```bash
npm run sync
npm run build:android
```

The APK lands at:
`android/app/build/outputs/apk/debug/app-debug.apk`

Copy it to your phone (or `adb install app-debug.apk`) to test.

## Build a release APK/AAB (for the Play Store)

Play Store submissions require a **signed** build. Steps:

1. Generate a signing key (do this once, keep it forever — losing it
   means you can never update the app again):
   ```bash
   keytool -genkey -v -keystore cookie-emporium.keystore \
     -alias cookie-emporium -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Create `android/keystore.properties` (not committed anywhere public):
   ```
   storeFile=../../cookie-emporium.keystore
   storePassword=YOUR_STORE_PASSWORD
   keyAlias=cookie-emporium
   keyPassword=YOUR_KEY_PASSWORD
   ```
3. Open the project in Android Studio (`npm run open:android`) and use
   **Build > Generate Signed Bundle / APK**, choosing **Android App
   Bundle (.aab)** — this is the format the Play Store wants now.

## Editing the game after this point

Just edit `www/index.html` directly, then run `npm run sync` to push the
changes into the native project before rebuilding.

## App icon & splash screen

Capacitor uses placeholder icons by default. To customize, replace the
images under `android/app/src/main/res/mipmap-*/` or use:
```bash
npx @capacitor/assets generate
```
(after dropping a 1024x1024 `icon.png` and `splash.png` in a `resources/`
folder — see https://github.com/ionic-team/capacitor-assets)

## Play Store checklist

- [ ] Google Play Developer account ($25 one-time)
- [ ] Signed `.aab` build (see above)
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] At least 2 screenshots
- [ ] Short description (80 chars) + full description (4000 chars)
- [ ] Privacy policy URL (required even for simple games — a free
      generator like https://www.freeprivacypolicy.com works)
- [ ] Content rating questionnaire (Play Console walks you through this)
