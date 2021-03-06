import React, { PureComponent } from 'react';
import {
  Modal, 
  Text, 
  TouchableHighlight, 
  View, 
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { STORAGE_DATA_KEY } from '../configurations/Constants';
import { Ionicons } from '@expo/vector-icons';
import { fetchPersistentData, savePersistentData } from '../services/LocalStorage';
import { httpSyncReviewData, } from '../apis/record';
import { 
  toggleReviewModal,
  toggleNeedReviewState,
  syncAppDataToServer,
} from "../redux/actions";

const initState = {
  localData: [],
  reviewData: [],
  changesMapper: {},
  counter: 0,
  tillLast: false,
  showTranslation: false,
};
const DEFAULT_INDEX = 0;

class ReviewModal extends PureComponent {
  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = initState;
  }

  componentDidUpdate = async () => {
    const { reviewData } = this.props;
    if (reviewData && reviewData.length > 0) {
      const localData = await fetchPersistentData(STORAGE_DATA_KEY);
      this.setState({
        localData,
        reviewData: localData.filter(i => reviewData.includes(i.index)),
        reviewDataLength: reviewData.length,
      });
    }
  }

  reviewNext = async () => {
    // change current state;
    const { reviewData, counter, changesMapper } = this.state;

    const now = new Date().getTime();
    changesMapper[reviewData[counter].index] = now;
    reviewData[counter].index = now;
    if (reviewData[counter].rt) {
      reviewData[counter].rt = reviewData[counter].rt + 1;
    } else {
      reviewData[counter].rt = 1;
    }

    // retrieve next;
    const nextCounter = counter + 1;
    if (nextCounter < reviewData.length) {
      this.setState({
        counter: nextCounter,
      });
    } else {
      // save state;
      await this.returnHome();
    }
    if (nextCounter === reviewData.length - 1) { 
      // the last one;
      this.setState({
        tillLast: true,
      });
    }
  }

  returnHome = async (reviewDone = true) => {
    const { reviewData, counter, changesMapper, localData } = this.state;

    if (reviewDone && counter === reviewData.length - 1) {
      this.props.toggleNeedReviewState(false);
    } 
    
    if (counter !== 0) {
      await savePersistentData(STORAGE_DATA_KEY, localData, {
        callback: async () => {
          // sync data;
          const { result } = (await httpSyncReviewData({ data: JSON.stringify(changesMapper) })).data.tovdSyncReviewData;
          if (!result) {
            Alert.alert(
              'Alert',
              'Reviewing data updated filed!',
              {
                cancelable: false
              },
            );
          }
        }
      });
    }

    this.props.toggleReviewModal(false);
  }

  toggleTranslation = (value) => {
    return () => {
      this.setState({
        showTranslation: !!value,
      });
    }
  }

  render() {
    const { reviewModalVisibility } = this.props;
    const { reviewData, counter, tillLast, reviewDataLength, showTranslation } = this.state;
    const data = reviewData && reviewData[counter]; 

    return (
      <Modal
        onDismiss={this.resetState}
        animationType="slide"
        transparent={false}
        visible={reviewModalVisibility}>
        <View style={styles.container}>
         <View style={styles.header}>
           <Text style={styles.headerText}>TOVD Regular Review</Text>
           <TouchableOpacity style={styles.closeModalButton} onPress={() => this.returnHome(false)}>
            <Ionicons
              name='ios-close'
              color='#000'
              size={35}
            />
          </TouchableOpacity>
           <Text style={styles.headerMeta}>{counter + 1}/{reviewDataLength}</Text>
        </View>
         <View style={styles.stage}>
          <Text style={styles.stageTranslation}>{data && data.translation}</Text>
          <Text style={{...styles.stageOriginal, 'opacity': showTranslation ? 1 : 0}}>{data && data.content}</Text>  
         </View>
         <View style={styles.operations}>
          <TouchableHighlight underlayColor="#fff" style={styles.hintButton} 
            onPressIn={this.toggleTranslation(true)}
            onPressOut={this.toggleTranslation(false)}
          >
            <Ionicons
              name='ios-eye'
              color='#000'
              size={27}
            />
          </TouchableHighlight> 
          <TouchableHighlight underlayColor="#222" style={styles.nextButton} onPress={this.reviewNext}>
            <Text style={styles.nextButtonText}>{ tillLast ? 'Done, bravo!' : 'Get it, next!' }</Text>
          </TouchableHighlight> 
         </View>
        </View>
      </Modal> 
    );
  }
}

const mapStateToProps = (state /*, ownProps*/) => {
  return { 
    reviewModalVisibility: state.reviewModalVisibility,
    reviewData: state.reviewData,
  };
};

const mapDispatchToProps = { toggleReviewModal, toggleNeedReviewState, syncAppDataToServer };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  header: {
    width: '100%',
    marginTop: 30,
    paddingBottom: 15,
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.4)',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  },
  headerMeta: {
    position: 'absolute',
    right: 0,
    left: 0,
    textAlign: 'center',
    bottom: -30,
  },
  closeModalButton: {
    position: 'absolute',
    right: 0,
    top: -6,
  },  
  stage: {
    width: '90%',
    alignItems: 'center',
  },  
  stageTranslation: {
    fontSize: 18,
    marginBottom: 10,
  },
  stageOriginal: {
    fontSize: 15,
  },
  operations: {
    maxWidth: '90%',
    flexDirection: 'row',
    marginBottom: 30,
  },
  hintButton: {
    width: 80,
    marginRight: 10,
    backgroundColor: 'white',
    borderRadius: 0,
    borderWidth: 1,
    borderColor: '#333',
    padding: 5, 
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  nextButton: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 0,
    padding: 5, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    height: 40,
    lineHeight: 40,
  }
});
