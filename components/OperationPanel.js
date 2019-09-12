import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

export default class OperationPanel extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{this.props.title}</Text>
        </View>
        <View style={{...styles.body, ...this.props.style}}>
          {this.props.children}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    marginBottom: 20,
  },
  header: {
    padding: 10,
    backgroundColor: '#555',
  },
  headerText: {
    color: "#fff",
  },
  body: {
    margin: 10
  },
});
