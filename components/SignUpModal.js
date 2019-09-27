import React, { PureComponent } from 'react';
import {
  Modal, 
  Text, 
  TouchableHighlight, 
  View, 
  StyleSheet,
  LayoutAnimation,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { httpSignUp } from '../apis/account';
import { Ionicons } from '@expo/vector-icons';
import animation from '../configurations/Animations';
import InputItem from './InputItem';
import { savePersistentData } from '../services/LocalStorage';
import { TOKEN_STORAGE_KEY, SIGNIN_TYPE_REGISTER } from '../configurations/Constants';
import { 
  setSignInStatus, 
  toggleSignUpModal,
  syncAppDataAll,
  setSignInType,
} from "../redux/actions";

const initState = {
  username: '',
  password: '',
  confirmPassword: ''
};

class SignupModal extends PureComponent {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = initState;
  }

  resetState = () => {
    this.setState(initState);
  }

  configLayoutAnimation = () => {
    LayoutAnimation.configureNext(animation(150).layout.easeInEaseOut);
  }

  syncUsername = (value) => {
    this.configLayoutAnimation();
    this.setState({
      username: value
    });
  }

  syncPassword = (value) => {
    this.configLayoutAnimation();
    this.setState({
      password: value
    });
  }

  syncConfirmPassword = (value) => {
    this.configLayoutAnimation();
    this.setState({
      confirmPassword: value
    });
  }

  closeCurrentModal = () => {
    this.props.toggleSignUpModal(false);
  }

  evalUsernameFormat = () => {
    const { username } = this.state;
    if (!username) {
      return false;
    } else {
      return !(/^[a-zA-Z0-9_]{6,16}/.test(username));
    }
  }

  signUpAccount = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to sigu up with this username?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK', 
          onPress: async () => {
            const { username, password } = this.state;
            if (username && password) {
              try {
                const res = (await httpSignUp({ username, password }));
                const { result, token } = res.data.tovdSignUpAccount;
                if (result) {
                  // save token; 
                  await savePersistentData(TOKEN_STORAGE_KEY, token);
                  // change UI accordingly;
                  this.props.setSignInType(SIGNIN_TYPE_REGISTER);
                  this.props.setSignInStatus({ username }); 
                  this.props.syncAppDataAll();
                  this.closeCurrentModal(); 
                } else {
                  Alert.alert(
                    'Error',
                    'The current username is occupied or invalid!',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => {},
                        style: 'cancel',
                      },
                    ],
                    { cancelable: false }, 
                  );
                }
              } catch(e) {
                console.warn(e) 
              }
            }
          }
        },
      ],
      {
        cancelable: false
      },
    );
  }

  render() {
    const { username, password, confirmPassword } = this.state;
    const { signUpModalVisibility } = this.props;
    const isUsernameValid = this.evalUsernameFormat();
    const isPasswordValid = password.length !== 0 && password.length <= 8;
    const isConfirmPasswordValid = (confirmPassword.length !== 0 && (password !== confirmPassword));

    return (
      <Modal
        onDismiss={this.resetState}
        animationType="slide"
        transparent={false}
        visible={signUpModalVisibility}>
        <View style={styles.container}>
          <Text style={styles.titleText}>Sign up a TOVD account</Text>
          <Text style={styles.metaText}>
            * Sign up an account to enjoy more our features and services.
          </Text>
          <View style={styles.formContainer}>
            <InputItem 
              style={styles.inputComp}
              placeholder="Please setup your username."
              label="Enter Username"
              value={username}
              onChangeText={this.syncUsername}
              errorShown={isUsernameValid}
              errorMsg="The username format is incorrect!"
            />
            <InputItem 
              style={styles.inputComp}
              secureTextEntry={true}
              placeholder="Please setup your password."
              label="Enter Password"
              value={password}
              onChangeText={this.syncPassword}
              errorShown={isPasswordValid}
              errorMsg="The password must be longer than 8 characters!"
            />
            <InputItem 
              style={styles.inputComp}
              secureTextEntry={true}
              placeholder="Please confirm your password."
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={this.syncConfirmPassword}
              errorShown={isConfirmPasswordValid}
              errorMsg="The re-typed password is not valid!"
            />
          </View>
          <TouchableHighlight
            style={styles.siginButton}
            underlayColor="rgba(255, 80, 47, .8)"
            onPress={this.signUpAccount}>
            <Text style={styles.siginButtonText}>Sign Up</Text>
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
  return { 
    signUpModalVisibility: state.signUpModalVisibility,
  };
};

const mapDispatchToProps = { 
  toggleSignUpModal, 
  setSignInStatus, 
  syncAppDataAll,
  setSignInType,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  formContainer: {
    minHeight: 290
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
    marginTop: 10
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
  warningText: {
    color: '#f00',
    marginBottom: 5
  }
});
