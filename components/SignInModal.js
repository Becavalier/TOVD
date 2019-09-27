import React, { PureComponent } from 'react';
import {
  Modal, 
  Text, 
  TouchableHighlight, 
  View, 
  StyleSheet,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { 
  toggleSignInModal,
  setSignInStatus,
  syncAppDataAll,
  setSignInType,
} from "../redux/actions";
import { Ionicons } from '@expo/vector-icons';
import InputItem from './InputItem';
import { httpSignIn } from '../apis/account';
import { TOKEN_STORAGE_KEY, SIGNIN_TYPE_NORMAL } from '../configurations/Constants';
import { savePersistentData } from '../services/LocalStorage';

const initState = {
  username: '',
  password: '',
};

class SigninModal extends PureComponent {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = initState;
  }

  resetState = () => {
    this.setState(initState);
  }

  syncUsername = (value) => {
    this.setState({
      username: value
    });
  }

  syncPassword = (value) => {
    this.setState({
      password: value
    });
  }

  closeCurrentModal = () => {
    this.props.toggleSignInModal(false);
  }

  signinAccount = async () => {
    const { username, password } = this.state;
    if (username && password) {
      try {
        const res = (await httpSignIn({ username, password }));
        const { result, token } = res.data.tovdSignInAccount;
        if (result) {
          // save token;
          await savePersistentData(TOKEN_STORAGE_KEY, token);
          // change UI accordingly;
          this.props.setSignInType(SIGNIN_TYPE_NORMAL);
          this.props.setSignInStatus({ username });
          this.props.syncAppDataAll();
          this.closeCurrentModal(); 
        } else {
          Alert.alert(
            'Alert',
            'Invalid Credential!',
            {
              cancelable: false
            },
          );
        }
      } catch(e) {
        console.warn(e) 
      }
    }
  }

  render() {
    const { username, password } = this.state;

    return (
      <Modal
        onDismiss={this.resetState}
        animationType="slide"
        transparent={false}
        visible={this.props.signInModalVisibility}>
        <View style={styles.container}>
          <Text style={styles.titleText}>Sign in to TOVD</Text>
          <Text style={styles.metaText}>
            * Sign in our service and sync your data to the remote server automatically to keep them safe.
          </Text>
          <InputItem 
            style={styles.inputComp}
            placeholder="Please input your username."
            label="Enter Your Username"
            value={username}
            onChangeText={this.syncUsername}
          />
          <InputItem 
            style={styles.inputComp}
            secureTextEntry={true}
            placeholder="Please input your password."
            label="Enter Your Password"
            value={password}
            onChangeText={this.syncPassword}
          />
          <TouchableHighlight
            style={styles.siginButton}
            underlayColor="rgba(255, 80, 47, .8)"
            onPress={this.signinAccount}
            disabled={!username || !password}>
            <Text style={styles.siginButtonText}>Sign In</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.closeButton}
            underlayColor="#fff"
            onPress={this.closeCurrentModal}>
            <Ionicons
              name='ios-close-circle-outline'
              color='#888'
              size={35}
            />
          </TouchableHighlight>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = (state /*, ownProps*/) => {
  return { signInModalVisibility: state.signInModalVisibility };
};

const mapDispatchToProps = { 
  toggleSignInModal,
  setSignInStatus,
  syncAppDataAll,
  setSignInType,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SigninModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  inputComp: {
    marginBottom: 10
  },  
  titleText: {
    fontSize: 27,
    textAlign: 'center',
    marginBottom: 30,
  },
  metaText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    marginLeft: 20,
    marginRight: 20,
    color: '#666',
    fontStyle: 'italic'
  },
  siginButton: {
    width: "100%",
    height: 50,
    backgroundColor: 'rgba(255, 80, 47, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15
  },
  siginButtonText: {
    color: '#fff',
    fontWeight: "800"
  },
  closeButton: {
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25
  },
});
