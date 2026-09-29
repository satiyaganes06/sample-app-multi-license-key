# Running a React Native App on the iOS Simulator

## Standard Setup

From the project root, install JavaScript dependencies and CocoaPods:

```sh
cd "/path/to/your/project"
npm install
cd ios
pod install
cd ..
```

Start Metro in one terminal and leave it running:

```sh
npm start
```

In another terminal, open Simulator, list available devices, and run the app:

```sh
open -a Simulator
xcrun simctl list devices available
npx react-native run-ios --simulator="iPhone 17e"
```

Use the exact simulator name reported by `xcrun simctl list devices available` if it differs. `run-ios` builds, installs, and launches the app; Metro serves the JavaScript bundle to a Debug build.

## Troubleshooting

If the app reports `No script URL provided`, make sure Metro is running for this project:

```sh
curl -I http://localhost:8081/status
```

If Metro responds on the Mac but the simulator still reports a null script URL, inspect the simulator's app logs. A PAC proxy can send `localhost` through a proxy and make React Native's Metro check time out. In this project, the Debug `AppDelegate` now points directly to the simulator loopback host `127.0.0.1:8081`; rebuild and relaunch after changing that setting.

If `npm start` reports `EADDRINUSE` for port 8081, another process already owns the Metro port. Check whether it is serving this project before starting another server:

```sh
lsof -nP -iTCP:8081 -sTCP:LISTEN
curl -I http://localhost:8081/status
```

## Notes From This Project

These were environment-specific build issues, not steps required for every React Native app:

- Xcode 26.6 / Apple Clang 21 failed compiling React Native's `fmt` 11.0.2 pod. A Podfile `post_install` setting changed only the `fmt` target's `CLANG_CXX_LANGUAGE_STANDARD` to `c++17`; `pod install` then regenerated the Pods project.
- The machine's PAC proxy caused simulator requests to `localhost:8081` to time out even though Metro was healthy on the Mac. The Debug `AppDelegate` now uses `127.0.0.1:8081` directly; this is a local simulator development setting, not a production bundle URL.
- This project path contains a space (`zDefend SDK`). React Native 0.76 generated shell commands that split paths at spaces. The local workaround quoted script arguments in React Native's Codegen and Xcode bundle scripts. For a new project, prefer a workspace path without spaces or use a React Native version where the script is fixed.
- Changes made directly under `node_modules` can be overwritten by `npm install`. Keep any required workaround in a maintained patch or upgrade rather than relying on an untracked dependency edit.