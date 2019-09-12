import React from 'react';
import { 
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView
} from 'react-native';
import OperationPanel from '../components/OperationPanel';
import { savePersistentData, fetchPersistentData } from '../services/LocalStorage';
import translateLanguages from '../configurations/TranslateLanguages';
import { RadioButton } from 'react-native-paper';

const STORAGE_LANG_KEY = 'TOVD_LANG';
const DEFAULT_INDEX = 0;

export default class LinksScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      lang: 'zh',
      translateLanguages
    }
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
        <Text style={styles.meta}>Enjoy taking conversational notes with TOVD.</Text>
        <Text style={styles.meta}>Version 0.0.1 (alpha)</Text>
        <Text style={styles.meta}>@YHSPY</Text>
        <View style={styles.operationArea}>
          <OperationPanel style={styles.operationPanelView} title="Language Settings">
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

LinksScreen.navigationOptions = {
  title: 'About',
};

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
    fontSize: 13,
    marginTop: 8
  },
  operationArea: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    marginTop: 50,
    padding: 10,
    height: 250,
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
    marginTop: 20
  }
});
