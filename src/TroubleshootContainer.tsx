import React, { useState, type FunctionComponent } from 'react';

import { View, Button, SafeAreaView, ScrollView, Text } from 'react-native';

import styles from './Styles';

import { ZDefendTroubleshoot, ZLogType } from 'zdefend';

const TroubleshootContainer: FunctionComponent = () => {
  const [logText, setLogText] = useState<string | undefined>(undefined);

  function getZLogWithRequestType(logType: ZLogType) {
    ZDefendTroubleshoot.getZLogWithRequestType({
      callback: (messages: string, requestType: ZLogType) => {
        console.log(`getZLogWithRequestType ${requestType}`);
        setLogText(messages + '\n' + 'Request Type: ' + requestType);
      },
      requestType: logType,
    });
  }

  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          console.log(`ZDefendTroubleshoot.getTroubleshootDetails ${ZDefendTroubleshoot.getTroubleshootDetails}`);
          ZDefendTroubleshoot.getTroubleshootDetails({
            callback: (troubleshootDetails: object) => {
              setLogText(JSON.stringify(troubleshootDetails));
            },
          });
        }}
        title="Get Troubleshoot Details"
      />
      <Button
        onPress={() => {
          ZDefendTroubleshoot.getZLog({
            callback: (messages: string) => {
              setLogText(messages);
            },
          });
        }}
        title="Get ZLog"
      />
      <Text>{'\n'}</Text>
      <Text>Press ZLog With Request Type Below:</Text>
      <Button
        onPress={() => getZLogWithRequestType(ZLogType.NORMAL)}
        title={ZLogType.NORMAL}
      />
      <Button
        onPress={() => getZLogWithRequestType(ZLogType.PHISHING)}
        title={ZLogType.PHISHING}
      />
      <Button
        onPress={() => getZLogWithRequestType(ZLogType.RULE_DOWNLOAD)}
        title={ZLogType.RULE_DOWNLOAD}
      />
      <Button
        onPress={() => getZLogWithRequestType(ZLogType.RULE_RUN)}
        title={ZLogType.RULE_RUN}
      />
      <Button
        onPress={() => getZLogWithRequestType(ZLogType.RULE_STATE)}
        title={ZLogType.RULE_STATE}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text>{logText ?? ''}</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default TroubleshootContainer;
