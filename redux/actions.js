import { 
  TOGGLE_SIGNIN_MODAL,
  TOGGLE_SIGNUP_MODAL,
  TOGGLE_REVIEW_MODAL,
  TOGGLE_KEYBOARD_AVOIDING_VIEW,
  SET_SIGNIN_STATUS,
  SET_SIGNOUT_STATUS,
  TOGGLE_SYNCING_STATE,
  SET_INITIALIZED_DATA,
  TOGGLE_INITIALIZED_STATE,
  TOGGLE_NEED_REVIEW_FLAG,
  SET_LAST_SYNC_DATE,
  SET_REVIEW_DATA,
  SET_LAST_SIGNIN_USERNAME,
  SET_SIGNIN_TYPE,
  TOGGLE_RATEUS_STATE,
} from "./actionTypes";
import { httpSyncAppData, httpRetrieveAppData } from '../apis/account';
import { fetchPersistentData, savePersistentData } from '../services/LocalStorage';
import { 
  STORAGE_DATA_KEY, 
  SIGNIN_TYPE_REGISTER, 
  SIGNIN_TYPE_NORMAL, 
} from '../configurations/Constants';


export const toggleSignInModal = (visibility) => ({
  type: TOGGLE_SIGNIN_MODAL,
  payload: {
    visibility: !!visibility
  }
});

export const toggleSignUpModal = (visibility) => ({
  type: TOGGLE_SIGNUP_MODAL,
  payload: {
    visibility: !!visibility
  }
});

export const toggleReviewModal = (visibility) => ({
  type: TOGGLE_REVIEW_MODAL,
  payload: {
    visibility: !!visibility
  }
});

export const toggleKeyboardAvoidingView = (value) => ({
  type: TOGGLE_KEYBOARD_AVOIDING_VIEW,
  payload: {
    value: !!value
  }
});

export const toggleNeedReviewState = (value) => ({
  type: TOGGLE_NEED_REVIEW_FLAG,
  payload: {
    value: !!value
  }
});

export const setInitializedData = (value) => ({
  type: SET_INITIALIZED_DATA,
  payload: {
    value: value || [],
  }
});

export const setSignInStatus = (value) => ({
  type: SET_SIGNIN_STATUS,
  payload: { value }
});

export const setSignOutStatus = () => ({
  type: SET_SIGNOUT_STATUS
});

export const toggleSyncingState = (value) => ({
  type: TOGGLE_SYNCING_STATE,
  payload: {
    value: !!value
  }
});

export const toggleDataInitializedState = (value) => ({
  type: TOGGLE_INITIALIZED_STATE,
  payload: {
    value: !!value
  }
});

export const toggleRateUsState = (value) => ({
  type: TOGGLE_RATEUS_STATE,
  payload: {
    value: !!value
  }
});

export const setLastSyncDate = (value) => ({
  type: SET_LAST_SYNC_DATE,
  payload: {
    value,
  }
});

export const setReviewData = (value) => ({
  type: SET_REVIEW_DATA,
  payload: {
    value,
  }
});

export const setLastSignInUsername = (value) => ({
  type: SET_LAST_SIGNIN_USERNAME,
  payload: {
    value,
  }
});

export const setSignInType = (value) => ({
  type: SET_SIGNIN_TYPE,
  payload: {
    value: Number(value),
  }
});

export const syncAppDataToServer = (data = false) => {
  return async (dispatch) => {
    const payload = data || await fetchPersistentData(STORAGE_DATA_KEY, { decodeJSON: false, });
    if (payload) {
      dispatch(toggleSyncingState(true));
      const res = await httpSyncAppData({ data: payload });
      if (!res.data.tovdSyncAppData.result) {
        dispatch(setSignOutStatus());
      }
      dispatch(toggleSyncingState(false));
    }
  }
}

export const checkReviewState = () => { 
  return async (dispatch, getState) => {
    const { lastSyncDate } = getState(); 
    const now = new Date().getTime();
    const duration = 1000 * 60 * 60 * 24;
    if ((now - lastSyncDate) >= duration) {
      const data = await fetchPersistentData(STORAGE_DATA_KEY);
      const reviewDataIndex = data.filter(i => (((new Date().getTime() - Number(i.index)) >= duration) && (!i.rt || i.rt <= 5))).map(i => i.index);
      if (reviewDataIndex.length > 0) {
        await dispatch(toggleNeedReviewState(true));
        await dispatch(setReviewData(reviewDataIndex));
      } else {
        // otherwise reset; 
        await dispatch(toggleNeedReviewState(false));
        await dispatch(setReviewData([]));
      }
      dispatch(setLastSyncDate(now));
    }
  }
}

export const syncAppDataAll = (callback = false) => {
  return async (dispatch, getState) => {
    await dispatch(toggleSyncingState(true));
    const { lastSignInUsername, userInfo, signInType } = getState();
    if (lastSignInUsername !== userInfo.username) {
      // sign in;
      if (signInType === SIGNIN_TYPE_NORMAL) {
        const res = await httpRetrieveAppData();
        const { data, result = false } = res.data.tovdRetrieveAppData;
        if (result) {  
          // new user sign in;
          const temp = data;
          await savePersistentData(STORAGE_DATA_KEY, temp, {
            encodeJSON: false,
          }); 
          // setup states for UI rendering;
          await dispatch(setInitializedData(JSON.parse(temp).data));
          await dispatch(toggleDataInitializedState(false));
        } else {
          await dispatch(setSignOutStatus());
        }
        // record login name;
        await dispatch(setLastSignInUsername(userInfo.username));
      // sign up;
      } else if (signInType === SIGNIN_TYPE_REGISTER) {
        await dispatch(syncAppDataToServer());
        const data = await fetchPersistentData(STORAGE_DATA_KEY);
        await dispatch(setInitializedData(data));
        await dispatch(toggleDataInitializedState(false));
      }
    }
    await dispatch(checkReviewState());
    await dispatch(toggleSyncingState(false));
    callback && callback();
  } 
}
