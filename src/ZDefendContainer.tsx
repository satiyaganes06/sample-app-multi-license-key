import React, { useEffect, useState, type FunctionComponent } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Modal } from 'react-native';
import {
  LinkedFunctionEvent,
  ZDefend,
  ZDeviceStatus,
  ZDefendThreat,
  ZDeviceStatusCompressionType,
  ZDeviceStatusJsonRegistration,
  ZDefendLicenseKeyNames,
  ZDefendLicenseKey,
  ZLinkedFunctionRegistration,
  DelayedRulesCompliance,
} from 'zdefend';

import {
  View,
  Text,
  Button,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';

import styles from './Styles';


const mstyles = StyleSheet.create({

  title: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: 20,
  },

  touchableButton: {
    backgroundColor: '#5b7bd3ff',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginHorizontal: 15,
    marginVertical: 4,
    alignItems: 'center',
  },

  touchableButtonSelected: {
    backgroundColor: '#ccd3e6ff',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginHorizontal: 15,
    marginVertical: 4,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFF00',
    fontSize: 10,
    fontWeight: 'bold',
  },

  buttonTextSelected: {
    color: '#000000',
    fontSize: 10,
    fontWeight: 'bold',
  },

});


const licenseKeys: string[] = ZDefendLicenseKeyNames.values();


var Buffer = require('buffer/').Buffer

var labels = ["RISKY_TAPPED", "DEVELOPER_MODE_ON", "DEVICE_PIN", "SIDELOADED_APP", "PDF_PHISING", "FILE_SUSPECTED"];
var registrars: ZLinkedFunctionRegistration[] = [];

var deviceStatusJsonRegistration: ZDeviceStatusJsonRegistration | undefined;
var lastNonce: string | undefined;
var lastDeviceStatus: ZDeviceStatus | undefined;

var deviceStatusMsg: string = "";


const ZDefendContainer: FunctionComponent = () => {
  const [initialScanProgressPercentage, setinitialScanProgressPercentage] = useState<number | undefined>(undefined);
  const [logText, setLogText] = useState<string | undefined>(undefined);

  const [nonce, setNonce] = React.useState('');



  function errorCallback(error: string): void {
    console.log('Received error:', error);
  }

  function deviceStatusCallback(deviceStatus: ZDeviceStatus) {
    deviceStatusMsg = '';
    //console.log("ZDeviceStatusCallback: " + deviceStatus.toString())
    console.log("ZDeviceStatusCallback activeThreats: " + deviceStatus.activeThreats.length);
    console.log("ZDeviceStatusCallback activeNewThreats: " + deviceStatus.activeNewThreats.length);
    console.log("ZDeviceStatusCallback mitigatedNewThreats: " + deviceStatus.mitigatedNewThreats.length);
    var activeThreats = deviceStatus.activeThreats;

    setinitialScanProgressPercentage(
      deviceStatus.initialScanProgressPercentage
    );

    var result = '\n\n' + 'DEVICE STATUS CALLBACK RESULT: ' + '\n\n';
    result += 'Date: ' + deviceStatus.statusDate + '\n';
    result += 'Login Status: ' + deviceStatus.loginStatus + '\n';
    //result += 'Login Last Error: ' + deviceStatus.loginLastError + '\n';

    result += '                                             ' + '\n';
    result += '\n\n' + '=========== NEW ACTIVE THREAT INFO =========== ' + '\n\n';
    for (const threat of activeThreats) {
      result += 'Threat Name: ' + threat.localizedName + '\n';
      result += 'Threat ID: ' + threat.internalThreatID + '\n';
      result += 'Threat UUID: ' + threat.UUID + '\n';
      if(threat.appName) {
        result += 'App: ' + threat.appName + '\n';
      }
      if(threat.packageName) {
        result += 'Package: ' + threat.packageName + '\n';
      }
      result += '                                             ' + '\n';
    }

    result += '                                             ' + '\n';
    result += '\n\n' + '=========== POLICIES INFO =========== ' + '\n\n';
    for (const policies of deviceStatus.devicePolicies) {
      result += 'Date: ' + policies.policyDownloadDate + '\n';
      result += 'Type: ' + policies.policyType + '\n';
      result += 'Hash: ' + policies.policyHash + '\n';
      result += '                                             ' + '\n';
    }
    lastDeviceStatus = deviceStatus;
    deviceStatusMsg += result;
    setLogText(deviceStatusMsg);
  }

  function mitigateLinkedFunc(linkedEvent: LinkedFunctionEvent) {
    console.log('MitigatedLinkFuc: ', linkedEvent.label)
  }

  function linkedFunc(linkedEvent: LinkedFunctionEvent) {
    console.log('LinkedFuc: ', linkedEvent.toString())

  }

  function setupLinkedFunction() {
    for (let label of labels) {
      console.log('Add linked func: ', label);
      var reg = ZDefend.registerLinkedFunctionV2(label, linkedFunc, mitigateLinkedFunc);

      if (reg != null) registrars.push();
    }
  }

  function setSDKNonce(sdkNonce: string) {

    if (deviceStatusJsonRegistration) {
      deviceStatusJsonRegistration.deregister()
      deviceStatusJsonRegistration = undefined;
    }

    lastNonce = sdkNonce;
    console.log("setNonce: ", sdkNonce);
    deviceStatusJsonRegistration = ZDefend.setNonceWithCallback({
      nonceString: sdkNonce,
      deviceStatusJsonCallback: setNonceWithCallback,
    });
  }

  function setNonceWithCallback(deviceStatusJsonBase64: String, base64Signature: String) {
    console.log("Received setNonceWithCallback()");
    const base64DecodedJSON = JSON.parse(Buffer.from(deviceStatusJsonBase64, 'base64').toString('utf-8'));
    let nonceString: String = base64DecodedJSON.nonce ?? '';

    var updatedMessage = '****** nonce deviceStatusJson callback: ******\n';
    updatedMessage += 'nonceString: ' + nonceString + '\n';
    if (nonceString.length > 0 && nonceString == lastNonce) {
      updatedMessage += 'deviceStatus nonce: matches the last session nonce!\n';
    }
    updatedMessage += '************';
    console.log("deviceStatusMsg + updatedMessage", deviceStatusMsg + updatedMessage);
    setLogText(deviceStatusMsg + updatedMessage);
  }

  function hasCompression(): boolean {
    if (lastDeviceStatus != undefined) {
      return lastDeviceStatus?.compressionType != ZDeviceStatusCompressionType.COMPRESSION_TYPE_NONE;
    }
    return false;
  }

  function toggleCompression() {
    if (!hasCompression()) {
      ZDeviceStatus.setExcludePolicyStatus(true);
      ZDeviceStatus.setExcludeThreatText(true);
      ZDeviceStatus.setCompressionType(ZDeviceStatusCompressionType.COMPRESSION_TYPE_DEFLATE);
      setLogText(logText + "\nCompression enabled with policy status and threat text excluded.")
    } else {
      ZDeviceStatus.setExcludePolicyStatus(false);
      ZDeviceStatus.setExcludeThreatText(false);
      ZDeviceStatus.setCompressionType(ZDeviceStatusCompressionType.COMPRESSION_TYPE_NONE);
      setLogText(logText + "\nCompression enabled with policy status and threat text included.")
    }
  }



  var [activeLicenseKey, setActiveLicenseKey] = useState<string>("none");


  useEffect(() => {

    const setupZDefend = async () => {

      ZDefend.activateDelayedRules(DelayedRulesCompliance.POLICY_COMPLIANCE);

      ZDefend.setTrackingIds({
        tag1: 'ReactNativeNewID1',
        tag2: 'ReactNativeNewID2',
        errorCallback: errorCallback,
      });
      ZDefend.addDeviceStatusCallback({ deviceStatusCallback: deviceStatusCallback });
    };

    setupZDefend();
    setupLinkedFunction();

    return () => {
      //
      for (let req of registrars) {
        ZDefend.removeLinkedFunction(req)
      }
    };
  }, []);

  const onLKPress = (item) => {
    setActiveLicenseKey(item);
    if (item !== activeLicenseKey) {
      activeLicenseKey = item;
      let n = ZDefendLicenseKeyNames.fromString(activeLicenseKey);
      console.log("n = " + n);
      ZDefendLicenseKey.selectLicenseKey(n);
    }
    console.log('pressed ' + item);
  }

  return (
    <View style={styles.container}>
      <Text>{'\n\n'}</Text>
      <Text style={styles.boldText}>
        Device Status Scan Progress:{' '}
        <Text style={styles.normalText}>
          {initialScanProgressPercentage?.toString() ?? '0'}
        </Text>
      </Text>

      {licenseKeys.length > 1 && (
        <SafeAreaView style={{ flexGrow: 0 }}>
          <Text style={mstyles.title}>Selected key: {activeLicenseKey}</Text>

          <FlatList
            style={{ flexGrow: 0 }}
            data={licenseKeys}
            keyExtractor={(item) => item}

            renderItem={({ item }) => {

              const isSelected = item === activeLicenseKey;

              return (
                <TouchableOpacity
                  style={[
                    mstyles.touchableButton,
                    isSelected && mstyles.touchableButtonSelected
                  ]}
                  onPress={() => onLKPress(item)}
                >
                  <Text
                    style={[
                      mstyles.buttonText,
                      isSelected && mstyles.buttonTextSelected
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </SafeAreaView>
      )}

      <TextInput
        style={styles.input}
        value={nonce}
        onChangeText={(text) => setNonce(text)}
        placeholder="Enter nonce String"
      />
      <Button
        onPress={() => setSDKNonce(nonce)}
        title="Set Nonce"
      />
      <Button
        onPress={() => {
          ZDefend.checkForUpdates();
        }}
        title="Check for Updates"
      />
      <Button
        onPress={() => toggleCompression()}
        title={hasCompression() ? 'Disable Compression' : 'Enable Compression'}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text>{logText ?? ''}</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ZDefendContainer;
