import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { 
  KeyboardAvoidingView,
  AppState,
} from 'react-native';
import { httpTokenValidation } from '../apis/account';
import { 
  setSignInStatus, 
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
  }), {
    setSignInStatus, syncAppDataAll,
  })
  (function ReduxConnect(props) {
    let hasPopRateUs = false;
    const syncTokenState = async () => {
      const res = await httpTokenValidation();
      const { result, username } = res.data.tovdTokenValidation;
      if (result) {
        props.setSignInStatus({ username });
        props.syncAppDataAll();
      }
    };
  
    useEffect(() => {
      AppState.addEventListener('change', (nextAppState) => {
        if (nextAppState === 'active') {
          if (!hasPopRateUs && dayjs().date() === 15 && dayjs().hour() === 21) {
            showRateUs(success => {
              hasPopRateUs = true;
            });
          }
        }
      });

      if (props.isLoadingComplete) {
        syncTokenState();
      }
    }, [props.isLoadingComplete]);

    const { children, enableKeyboardAvoidingView, ...otherProps } = props;
    return ( 
      <KeyboardAvoidingView {...otherProps} behavior="padding" enabled={enableKeyboardAvoidingView}>
        { children }
      </KeyboardAvoidingView>
    )
});
