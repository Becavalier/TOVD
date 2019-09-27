import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { TextInput } from 'react-native-paper';

export default class InputItem extends React.PureComponent {
  static propTypes = {
    errorShown: PropTypes.bool,
    errorMsg: PropTypes.string,
  }

  static defaultProps = {
    errorShown: false,
    errorMsg: '',
  }

  constructor(props) {
    super(props);
  }
  
  render() {
    const { errorShown, errorMsg, ...props } = this.props;

    return (
      <>
        <TextInput
          { ...props }
          clearButtonMode="while-editing"
          autoCapitalize="none"
          mode="outlined"
        />
        {
          errorShown && 
          (<Text style={styles.warningText}>{errorMsg}</Text>)
        }
      </>
    );
  }
}

const styles = StyleSheet.create({
  warningText: {
    color: '#f00',
    marginBottom: 5
  }
});
