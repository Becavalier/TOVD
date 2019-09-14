import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

export default function ContentBubble(props) {
  return (
    <View style={styles.container}>
      <View style={styles.bubbleContiner}>
        <Text>{props.content}</Text>
        <View style={styles.horizontalLine}></View>
        <Text style={styles.translation}>{props.translation || 'Unknown'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bubbleContiner: {
    padding: 10,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderStyle: 'solid',
    borderColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 8,
  },
  horizontalLine: {
    marginTop: 8,
    marginBottom: 8,
    borderStyle: 'solid',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
  },
  translation: {
    lineHeight: 18
  }
});
