import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { 
  KeyboardAvoidingView,
  AppState,
} from 'react-native';
import { 
  syncAppDataAll,
} from "../redux/actions";
import Rate from 'react-native-rate';
import dayjs from 'dayjs';

const showRateUs = (callback = false) => {
  Rate.rate({
    AppleAppID: "1479868644",
    preferInApp: true,
    openAppStoreIfInAppFails: true,
  }, success => {
    // TODO;
    callback && callback(success);
  });
}

export default connect(
  state => ({ 
    enableKeyboardAvoidingView: state.enableKeyboardAvoidingView, 
    hasPopRateUs: state.hasPopRateUs 
  }), { syncAppDataAll })
  (function ReduxConnect(props) {
    let hasPopRateUs = false;
  
    useEffect(() => {
      AppState.addEventListener('change', (nextAppState) => {
        if (nextAppState === 'active') {
          if (!hasPopRateUs && dayjs().date() === 15 && dayjs().hour() === 21) {
            showRateUs(success => {
              hasPopRateUs = true;
            });
          }
          // check app status;
          props.syncAppDataAll();
        }
      });

      if (props.isLoadingComplete) {
        props.syncAppDataAll({ type: 'KEEPALIVE' });
      }
    }, [props.isLoadingComplete]);

    const { children, enableKeyboardAvoidingView, ...otherProps } = props;
    return ( 
      <KeyboardAvoidingView {...otherProps} behavior="padding" enabled={enableKeyboardAvoidingView}>
        { children }
      </KeyboardAvoidingView>
    )
});
