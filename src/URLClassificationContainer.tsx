import React, {type FunctionComponent} from 'react';

import {
  View,
  Button,
  TextInput,
  SafeAreaView,
  ScrollView,
  Text,
} from 'react-native';

import styles from './Styles';

import {
  ZDefendUrlClassificationResult,
  ZDefendUrlClassification,
} from 'zdefend';

const URLClassificationContainer: FunctionComponent = () => {
  const [url, setURL] = React.useState('');
  const [urlClassificationResultText, setUrlClassificationResultText] =
    React.useState<string | undefined>(undefined);

  function urlClassificationCallback(
    classifyUrlResult: ZDefendUrlClassificationResult,
    error: string,
  ): void {
    var result = 'URL CLASSIFICATION CALLBACK RESULT: ' + '\n\n';
    result += 'isPhishing: ' + classifyUrlResult.isPhishing + '\n';
    result += 'isSafe: ' + classifyUrlResult.isSafe + '\n';
    result += 'url: ' + classifyUrlResult.url + '\n';
    result += 'Content Category: ' + classifyUrlResult.contentCategory + '\n';
    result += 'Error?: ' + error + '\n';
    setURL('');
    classifyUrlResult.getContentInspectionMode().then(mode => {
      result += 'content Inspection Mode: ' + mode + '\n';
      setUrlClassificationResultText(result);
    });
    console.log(classifyUrlResult.debugDescription);
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={url}
        onChangeText={text => setURL(text)}
        placeholder="Enter Full URL"
      />
      <Button
        onPress={() => {
          if (url.length > 0) {
            ZDefendUrlClassification.classifyUrl({
              url: url,
              callback: urlClassificationCallback,
            });
          }
        }}
        title="Classify URL"
      />
      <Button
        onPress={() => {
          ZDefendUrlClassification.mitigateWebThreats();
          setURL('');
          setUrlClassificationResultText('');
        }}
        title="Mitigate Web Threats"
      />
      <Text>{'\n\n'}</Text>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text>{urlClassificationResultText ?? ''}</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default URLClassificationContainer;
