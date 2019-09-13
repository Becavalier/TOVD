import React from 'react';
import ContentBubble from '../components/ContentBubble';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  Platform,
  Keyboard,
  UIManager,
  LayoutAnimation,
  InputAccessoryView,
  Button
} from 'react-native';
import Icon from '../components/Icon';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import translate from '../services/Translate';
import { 
  fetchPersistentData, 
  savePersistentData 
} from '../services/LocalStorage';
import animation from '../configurations/Animations';

const STORAGE_DATA_KEY = 'TOVD_RECORDS';
const STORAGE_LANG_KEY = 'TOVD_LANG';
const INPUT_ACCESSORY_VIEW_ID = "INPUT_ACCESSORY_VIEW";

const formatInitData = (data, sortField) => {
  return Array.from(new Set(data.map(i => i[sortField]))).map(key => {
    return {
      title: key,
      data: data.filter(i => i[sortField] === key)
    }
  })
}

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
export default class HomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.sectionListRef = null;
    this.textInputRef = React.createRef();
    this.state = {
      onDataRefreshing: true,
      newItemAddedFlag: false,
      inputText: '',
      storageRawData: [],
      sectionsData: [],
      keyboardOffset: 0,
    };  
  }

  componentDidMount = async () => {
    this.initDataLoading();

    // listeners;
    this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', (event) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      this.setState({
        keyboardOffset: event.endCoordinates.height - 80
      });
    });

    this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      this.setState({
        keyboardOffset: 0
      });
    });
  }

  componentDidUpdate = async () => {
    // nexttick;
    setTimeout(() => {
      this.reachTheBottom(); 
    }, 0);   
  }

  // public methods;
  initDataLoading = () => {
    this.setState({
      onDataRefreshing: true,
    }, async () => {
      const value = await fetchPersistentData(STORAGE_DATA_KEY);
      if (value) {
        this.setState({
          sectionsData: formatInitData(value, 'date'),
          storageRawData: value,
        });
      }
      this.setState({
        onDataRefreshing: false,
      });
    });
  }

  reachTheBottom = () => {
    const { newItemAddedFlag, sectionsData } = this.state;

    if (newItemAddedFlag) {
      const sectionIndex = sectionsData.length - 1;
      const itemIndex = sectionsData[sectionIndex].data.length - 1;

      this.sectionListRef.scrollToLocation({
        itemIndex, 
        sectionIndex,
        animated: false,
      });

      this.setState({
        newItemAddedFlag: false,
        inputText: ''
      });      
    }
  }

  deleteItem = (data) => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this item from local database?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK', 
          onPress: async () => {
            const { item } = data;
            const { storageRawData } = this.state;
            
            // remove element;
            const rawDataUpdated = storageRawData.filter(i => i.index !== item.index);

            LayoutAnimation.configureNext(animation.layout.easeInEaseOut);
            this.setState({
              sectionsData: formatInitData(rawDataUpdated, 'date'),
              storageRawData: rawDataUpdated,
            });

            // update;
            await savePersistentData(STORAGE_DATA_KEY, rawDataUpdated); 
          }
        },
      ],
      {
        cancelable: false
      },
    );
  }

  syncTextMessage(inputText) {
    this.setState({
      inputText
    });
  }

  submitNewItem = async () => {
    const { inputText, storageRawData } = this.state;
    
    if (!inputText) {
      return;
    }
    
    const rawDataUpdated = [].concat(storageRawData,  {
      content: inputText,
      translation: await translate(inputText, {
        lang: await fetchPersistentData(STORAGE_LANG_KEY)
      }),
      date: dayjs().format('YYYY-MM-DD'),
      type: 'normal',
      index: new Date().getTime()
    });

    LayoutAnimation.configureNext(animation.layout.easeInEaseOut);
    this.setState({ 
      newItemAddedFlag: true,
      storageRawData: rawDataUpdated,
      sectionsData: formatInitData(rawDataUpdated, 'date')
    }); 

    Keyboard.dismiss();
    this.textInputRef.current.clear();

    // update;
    await savePersistentData(STORAGE_DATA_KEY, rawDataUpdated); 
  }

  resetInputArea = () => {
    this.setState({
      inputText: ''
    });
  }

  handleScrollFailed = (e) => {}

  render() {
    const { sectionsData, inputText, keyboardOffset, onDataRefreshing } = this.state;

    return (
      <View style={styles.container}>
        { sectionsData.length > 0 ? <SwipeListView 
          style={styles.swipeListView}
          onScrollToIndexFailed={this.handleScrollFailed}
          listViewRef={ref => this.sectionListRef = ref}
          refreshing={onDataRefreshing}
          onRefresh={this.initDataLoading}
          recalculateHiddenLayout={true}
          ListFooterComponent={() => 
            <View style={styles.footerComponent}>
              <Text style={styles.footerTextComponent}>- End -</Text>
            </View>}
          useSectionList
          renderItem={
            ({item, index, section}) => (<SwipeRow
              rightOpenValue={-75}
            >
              <View><Text></Text></View>
              <ContentBubble content={ item.content } translation={ item.translation } /></SwipeRow>) }
          renderSectionHeader={
            ({section: { title }}) => (<Text style={styles.sectionHeader}>{title}</Text>)}
          sections={sectionsData}
          renderHiddenItem={(data, rowMap) => (
            <View style={styles.operationsArea}>
              <TouchableOpacity style={styles.deleteButtonView} onPress={() => this.deleteItem(data)}>
                <Ionicons
                  name='ios-trash'
                  color='#fff'
                  size={35}
                />
              </TouchableOpacity>
            </View>   
          )}
          rightOpenValue={-75}
          keyExtractor={(item, index) => item + index}
          /> : <View style={styles.emptyContainer}><Icon
                size={50}
                name={
                  Platform.OS === 'ios'
                    ? 'ios-infinite'
                    : 'md-infinite'
                }
              /></View>}
        <View style={{...styles.inputArea, bottom: keyboardOffset}}>
          <TextInput
            ref={this.textInputRef}
            style={styles.inputBox}
            multiline
            value={inputText}
            inputAccessoryViewID={INPUT_ACCESSORY_VIEW_ID}
            onChangeText={text => this.syncTextMessage(text)}
          />
          <TouchableOpacity style={styles.submitButtonView} onPress={this.submitNewItem}>
            <Ionicons
              name='ios-add-circle-outline'
              color='#fff'
              style={{ marginBottom: -3 }}
              size={25}
            />
          </TouchableOpacity>
        </View>
        <InputAccessoryView 
          nativeID={INPUT_ACCESSORY_VIEW_ID}
          backgroundColor="#eee"
          style={styles.inputAccessoryView}>
            <Button title="Clear Text" onPress={this.resetInputArea}></Button>
        </InputAccessoryView>
      </View>
    );
  }
};

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 45,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  footerComponent: {
    height: 90,
    flex: 1,
    alignItems: 'center',
  },
  footerTextComponent: {
    fontWeight: '200',
    color: '#777'
  },
  swipeListView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    
  },  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionHeader: {
    backgroundColor: '#102E37',
    padding: 5,
    color: '#fff'
  },
  operationsArea: {
    flex: 1,
    alignItems: 'flex-end',
    color: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
  },
  deleteButtonView: {
    width: 75,
    backgroundColor: '#E8222D',
    padding: 15,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  inputArea: {
    shadowColor: 'rgba(0, 0, 0, .2)',
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowOpacity: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
    height: 50, 
  },
  inputBox: {
    flex: 1,
    height: 50, 
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: 'rgba(0, 0, 0, .2)', 
    borderWidth: 1,
  },
  submitButtonView: {
    width: 70,
    backgroundColor: '#222831',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputAccessoryView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }, 
});
