********************************************
zDefend React Native SDK Showcase Sample App
********************************************

Overview
========

This is a zDefend SDK sample app for React Native. Its purpose is to demonstrate the main zDefend SDK features, including the following:

* Device status updates

* Linked functions

* Processing of debug information

Requirements
============

Building and running this sample app requires the following:

* Access to zConsole that has the zDefend module

* Java Runtime Environment

* React Native with Android and iOS support

* Android device or emulator

* iOS device or simulator

For more specific information on the zDefend SDK requirements, refer to the "zDefend SDK Developer's Guide".

Building and Running the Sample App
===================================

1. Configure the sample app in zConsole:

   a) Create the app activations:

      * If your zDefend SDK package does not have pre-embedded license keys and bundle IDs, create two app activations with the following bundle IDs:

        * For the Android app: "com.zdefendreactnativeshowcasesample"

        * For the iOS app: "org.reactjs.native.example.zdefendreactnativeshowcasesample"

        Once you have the app activations, save their license keys in a text editor or file for future reference.

      * If your zDefend SDK package has pre-embedded license keys and bundle IDs, create two app activations with the bundle IDs you supplied to the package request form and also make sure you select the "Enable Dev Mode" check box in the app activation settings. This allows running a protected app whose actual bundle ID does not match the one embedded in zDefend SDK, which is the case with this sample app.

   b) Configure policies for the app according to your needs.

      Note: The sample app uses a linked function associated with the label "RISKY_TAPPED". If you want to test this linked function, configure one or several threats in your policy to trigger this label.

   For information on creating app activations, license keys, and policies in zConsole, see the "zDefend Console User Guide" in the zConsole documentation set.

2. If your zDefend SDK package does not have pre-embedded license keys and bundle IDs, manually embed the license keys and bundle IDs into the zDefend React Native SDK:

   a) Create a new directory anywhere on your computer.

   b) Copy the following files from the zDefend SDK package to the new directory you just created:

      * "config_sdk_«version».jar"

        If you do not have this file in your package, it means your zDefend SDK already has the license keys and bundle IDs embedded in the code and you can skip this manual embedding process.

      * "zdefend-react-native-sdk-«version and date».tgz" (located in the "react-native" directory)

   c) For convenience, rename the "zdefend-react-native-sdk-«version and date».tgz" file to "zdefend-react-native-sdk_unlicensed.tgz".

   d) In the directory, execute the following command:

      java -jar config_sdk_«version».jar \
      -s zdefend-react-native-sdk_unlicensed.tgz \
      -o zdefend-react-native-sdk.tgz \
      -ka «Android app's license key» \
      -ki «iOS app's license key» \
      -ba com.zdefendreactnativeshowcasesample \
      -bi org.reactjs.native.example.zdefendreactnativeshowcasesample \
      -v

      Note: The two license keys must be the ones you saved in step 1a.

      If the process is successfully completed, you should see a new file "zdefend-react-native-sdk.tgz" in the directory. This is the configured copy of the original TGZ file, which now contains both license keys and bundle IDs.

3. Add zDefend SDK to the sample app:

   a) Move the "zdefend-react-native-sdk.tgz" file to the parent directory of the directory where the sample app is extracted.

      For example, if you extracted the sample app in the directory "/Users/test/projects/ZDefendReactNativeShowcaseSample", then you must move the "zdefend-react-native-sdk.tgz" file to the "/Users/test/projects" directory.

      Note: You do not have to extract the "zdefend-react-native-sdk.tgz" archive.

   b) Navigate to the sample app's root directory and execute the following command:

      yarn add ../zdefend-react-native-sdk.tgz

   c) To ensure the zDefend SDK Android library is correctly referenced, open the "android/app/build.gradle" file, locate the "dependencies" section, and verify the "implementation files" entry correctly points to the "zdefend.aar" file.

      By default, the path is "../../node_modules/zdefend/android/libs/zdefend.aar", which should be correct if you followed the preceding steps exactly.

4. Build and run the app using React Native as usual.


5. Troubleshooting

If you have issues starting the app, mentioning index.android.bundle should be packaged correctly, run this command from the root of your application (the folder where index.js is located):

mkdir -p android/app/src/main/assets 
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

Then rerun / rebuild the app.


Additional Information
======================

For more information on zDefend SDK, refer to the official documentation here:

https://devportal.zimperium.com/doc/en/zdefend/
