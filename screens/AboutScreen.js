import React from 'react';
import { 
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import Icon from '../components/Icon';
import { connect } from 'react-redux';
import { 
  toggleSignInModal, 
  toggleSignUpModal, 
  setSignOutStatus,
  syncAppDataAll,
} from "../redux/actions";
import OperationPanel from '../components/OperationPanel';
import RotateContainer from '../components/RotateContainer';
import { savePersistentData, fetchPersistentData } from '../services/LocalStorage';
import translateLanguages from '../configurations/TranslateLanguages';
import { RadioButton } from 'react-native-paper';
import { httpSignOut } from '../apis/account';
import { PRIVACY_POLICY_URL } from '../configurations/Constants';

const STORAGE_LANG_KEY = 'TOVD_LANG';
const DEFAULT_INDEX = 0;

const mapStateToProps = (state /*, ownProps*/) => {
  return { 
    hasSignedIn,
    userInfo,
    isDataSyncing,
  } = state;
};

const Navigator = connect(
  mapStateToProps,
  { 
    toggleSignInModal, 
    toggleSignUpModal,
    setSignOutStatus,
    syncAppDataAll,
  }
)(class extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  showSignInModal = () => {
    this.props.toggleSignInModal(true);
  }

  showSignUpModal = () => {
    this.props.toggleSignUpModal(true);
  }

  signOut = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to sign out the current account?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK', 
          onPress: async () => {
            // logout;
            this.props.syncAppDataAll({
              type: 'SIGNOUT',
              callback: async () => {
                const res = await httpSignOut();
                const { result } = res.data.tovdSignOutAccount; 
                if (result) {
                  this.props.setSignOutStatus();
                }
              },
            });
          }
        },
      ],
      {
        cancelable: false
      },
    );
  }

  showPrivacyPolicy = async () => {
    Linking.openURL(PRIVACY_POLICY_URL);
  }

  showOtherSettings = () => {
    const { hasSignedIn } = this.props;

    if (hasSignedIn) {
      Alert.alert(
        'Actions',
        'Some other application operations, feel free to use :)',
        [
          { text: 'Privacy Policy', onPress: this.showPrivacyPolicy },
          { text: 'Sign Out', onPress: this.signOut },
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
        ],
        { cancelable: false },
      );
    }
  }
  
  render() {
    const { hasSignedIn, userInfo, isDataSyncing } = this.props;

    return (
      <View style={styles.navigationBar}>
  
        {
          hasSignedIn ||
          (<TouchableOpacity onPress={this.showSignUpModal}>
            <Text style={styles.navigationBarBtn}>Sign up</Text>
          </TouchableOpacity>)
        }
        <View>
          <TouchableOpacity onPress={this.showOtherSettings}>
            <Text style={styles.navigationBarTitle}>{hasSignedIn ? `ID: ${userInfo.username || 'Anonymous'}` : "Settings"}</Text>
          </TouchableOpacity>
          {
            hasSignedIn && (isDataSyncing ? (  
              <View style={styles.navigationBarMeta}>
                <Text style={styles.navigationBarMetaText}>Syncing ...</Text>
                <RotateContainer>
                  <Icon
                    size={15}
                    color='#000'
                    name={
                      Platform.OS === 'ios'
                        ? 'ios-sync'
                        : 'md-sync'
                    }/>
                </RotateContainer>
              </View>
            ) : (
              <View style={styles.navigationBarMeta}>
                <Text style={styles.navigationBarMetaText}>Data Synced</Text>
                <Icon
                  size={15}
                  color='#000'
                  name={
                    Platform.OS === 'ios'
                      ? 'ios-checkmark-circle-outline'
                      : 'md-checkmark-circle-outline'
                  }/>
              </View>
            ))
          }
        </View>
        {
          hasSignedIn ||
          (<TouchableOpacity onPress={this.showSignInModal}>
            <Text style={styles.navigationBarBtn}>Sign in</Text>
          </TouchableOpacity>)
        }
      </View>
    );
  }
});


export default class LinksScreen extends React.PureComponent {
  static navigationOptions = {
    // headerTitle instead of title;
    headerTitle: (<Navigator />),
  };

  constructor(props) {
    super(props);

    this.state = {
      lang: 'zh',
      translateLanguages,
    };
  }

  async componentDidMount() {
    this.syncLangSetting((await fetchPersistentData(STORAGE_LANG_KEY)) || 'zh');
  }

  changeLangSettingValue = async (lang) => {
    // change global setting;
    await savePersistentData(STORAGE_LANG_KEY, lang);

    // re-render;
    this.syncLangSetting(lang);
  }

  syncLangSetting = (lang) => {
    this.setState({ lang });
  }
  
  render() {
    const { lang, translateLanguages } = this.state;

    return (
      <View style={styles.container}>
        <Image
          style={styles.imageContainer}
          source={require('../assets/images/icon.png')}
        />
        <Text style={styles.title}>TOVD</Text>
        <Text style={styles.meta}>"Enjoy practicing oral interpretation from your native language to English. "</Text>
        <Text style={styles.meta}>Recording & Recalling</Text>
        <Text style={styles.meta}>Version 1.0.2</Text>
        <Text style={styles.meta}>@YHSPY</Text>
        <View style={styles.operationArea}>
          <OperationPanel style={styles.operationPanelView} title="Native Language">
            <ScrollView>
              <RadioButton.Group
                onValueChange={this.changeLangSettingValue}
                value={lang}
              >
                {translateLanguages.map(i => (
                  <View style={styles.radioItem} key={i.key}>
                    <Text>{i.title}</Text>
                    <RadioButton value={i.key} />
                  </View>
                ))}
              </RadioButton.Group>
            </ScrollView>
          </OperationPanel>
        </View>
        <Text style={styles.langIndicator}>
          {translateLanguages.filter(i => i.key === lang)[DEFAULT_INDEX].title}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageContainer: {
    width: 80, 
    height: 80
  },
  title: {
    fontSize: 45,
    marginTop: 30
  },
  meta: {
    maxWidth: '80%',
    textAlign: 'center',
    fontSize: 13,
    marginTop: 8
  },
  operationArea: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    marginTop: 50,
    padding: 10,
    height: 240,
    overflow: 'scroll'
  },
  operationPanelView: {
    height: 150
  },
  radioItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  langIndicator: {
    marginTop: 25,
    marginBottom: 15,
  },
  navigationBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    fontSize: 12
  },
  navigationBarTitle: {
    fontSize: 18,
    fontWeight: '600',
    includeFontPadding: false,
    lineHeight: 20,
    textAlign: 'center'
  },
  navigationBarMeta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  navigationBarMetaText: {
    fontSize: 11,
    fontWeight: '200',
    marginRight: 5
  },
  navigationBarBtn: {
    color: '#007AFF',
    fontSize: 16,
  }
});
