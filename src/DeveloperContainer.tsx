import React, { useEffect, type FunctionComponent } from 'react';
import { View, Button, TextInput, Text } from 'react-native';
import styles from './Styles';
import { ZDefendDeveloper, ZDefendRuleLevel, ZLocalNetworkAuthorizationType, ZLocalNetworkPermission } from 'zdefend';
import { Platform } from 'react-native';

const DeveloperContainer: FunctionComponent = () => {
  const [threatID, setThreatID] = React.useState('');

  function setRuleLevel(ruleLevel: ZDefendRuleLevel) {
    ZDefendDeveloper.setRuleLevel({ level: ruleLevel });
  }

  function localNetworkPermission(authorization: ZLocalNetworkAuthorizationType) {
    if (authorization == ZLocalNetworkAuthorizationType.ZLOCALNETWORK_AUTHORIZATION_ALLOWED) {
      console.log("Permission has been granted");
    } else if (authorization == ZLocalNetworkAuthorizationType.ZLOCALNETWORK_AUTHORIZATION_DENIED) {
      console.log("Permission is denied");
    } else if (authorization == ZLocalNetworkAuthorizationType.ZLOCALNETWORK_AUTHORIZATION_NOT_ASKED) {
      console.log("Permission has never been requested");
    } else if (authorization == ZLocalNetworkAuthorizationType.ZLOCALNETWORK_AUTHORIZATION_ERROR) {
      console.log("NSBonjourServices/NSLocalNetworkUsageDescription is missing from the app Info.plist");
    } else {
      console.log("Error unknown");
    }
  }

  useEffect(() => {

  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={threatID}
        onChangeText={(text) => setThreatID(text)}
        placeholder="Simulate Threat by giving threat ID"
      />
      <Button
        onPress={() => {
          let threatId = Number(threatID);
          var forensics = {};
          switch (threatId) {
            case 13: // SERVER_SUSPICIOUS_APK
              forensics = { "Application": "com.montimage.eicar_virus", "Process": "Testing Malware (EICAR virus)" };
              break;
            case 24: // untrusted profile
              forensics = { "server_untrusted_profile_detail": { "profile_name": "simulated_untrusted_profile" } };
              break;
            case 45: // suspicious profile
              forensics = { "server_suspicious_profile_detail": { "profile_name": "simulated_suspicious_profile" } };
              break;
            case 42: // SUSPICIOUS_APP
              forensics = { "server_suspicious_ipa_detail": { "app_name": "Net Analyzer", "filename": "Net Analyzer", "is_blacklisted": true, "is_malicious": false, "package": "com.example.net_analyzer" } };
              break;
            case 93: // OUT_OF_COMPLIANCE_APP
              forensics = { "server_ooc_detail": { "app_name": "simulated_ooc_app_name", "package": "com.example.simulated_ooc_app_name" } };
              break;
          }
          ZDefendDeveloper.simulateTestThreat({
            threatId: threatId,
            forensics: forensics,
          });
        }}
        title="Simulate Threat"
        color="#FF0000"
      />
      <Button
        onPress={() => {
          ZDefendDeveloper.mitigateSimulatedThreats();
        }}
        title="Mitigate Simulated Threat"
        color="#118895"
      />
      <Text>{'\n\n'}</Text>
      <Text>Set Rule Level Below:</Text>
      <Button
        onPress={() => setRuleLevel(ZDefendRuleLevel.BETA)}
        title={ZDefendRuleLevel.BETA}
      />
      <Button
        onPress={() => setRuleLevel(ZDefendRuleLevel.PRODUCTION)}
        title={ZDefendRuleLevel.PRODUCTION}
      />

      {Platform.OS === 'ios' && (
        <>
          <Button
            onPress={() => {
              ZLocalNetworkPermission.checkLocalNetworkAuthorization(localNetworkPermission);
            }}
            title="Check Local Network"
          />
          <Button
            onPress={() => {
              ZLocalNetworkPermission.requestLocalNetworkAuthorization(localNetworkPermission);
            }}
            title="Request Local Network"
          />
        </>
      )}
    </View>
  );
};

export default DeveloperContainer;
