import { 
  TOGGLE_SIGNIN_MODAL, 
  TOGGLE_SIGNUP_MODAL,
  TOGGLE_REVIEW_MODAL,
  TOGGLE_KEYBOARD_AVOIDING_VIEW,
  SET_SIGNIN_STATUS,
  SET_SIGNOUT_STATUS,
  TOGGLE_SYNCING_STATE,
  SET_INITIALIZED_DATA,
  SET_LAST_SYNC_DATE,
  TOGGLE_INITIALIZED_STATE,
  TOGGLE_NEED_REVIEW_FLAG,
  SET_REVIEW_DATA,
  SET_LAST_SIGNIN_USERNAME,
  SET_SIGNIN_TYPE,
  TOGGLE_RATEUS_STATE,
} from "./actionTypes";

const initialState = {
  signInModalVisibility: false,
  signUpModalVisibility: false,
  reviewModalVisibility: false,
  enableKeyboardAvoidingView: true,
  hasSignedIn: false,
  isDataSyncing: false,
  userInfo: {},
  lastSignInUsername: '',
  initializedData: [],
  hasDataInitialized: false,
  needReview: false,
  reviewData: [],
  lastSyncDate: 0,
  // 0 - sign in, 1 - sign up;
  signInType: 0,
  hasPopRateUs: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SIGNIN_MODAL: {
      const { visibility } = action.payload;
      return {
        ...state,
        signInModalVisibility: visibility
      };
    }
    case TOGGLE_SIGNUP_MODAL: {
      const { visibility } = action.payload;
      return {
        ...state,
        signUpModalVisibility: visibility
      };
    }
    case TOGGLE_REVIEW_MODAL: {
      const { visibility } = action.payload;
      return {
        ...state,
        reviewModalVisibility: visibility
      };
    }
    case TOGGLE_KEYBOARD_AVOIDING_VIEW: {
      const { value } = action.payload;
      return {
        ...state,
        enableKeyboardAvoidingView: value
      };
    }
    case TOGGLE_NEED_REVIEW_FLAG: {
      const { value } = action.payload;
      return {
        ...state,
        needReview: value
      };
    }
    case SET_SIGNIN_STATUS: {
      const { value } = action.payload;
      return {
        ...state,
        userInfo: value,
        hasSignedIn: true,
      };
    }
    case SET_SIGNOUT_STATUS: {
      return {
        ...state,
        userInfo: {},
        hasSignedIn: false,
      };
    }
    case TOGGLE_SYNCING_STATE: {
      const { value } = action.payload;
      return {
        ...state,
        isDataSyncing: value,
      };
    }
    case SET_INITIALIZED_DATA: {
      const { value } = action.payload;
      return {
        ...state,
        initializedData: value,
        hasDataInitialized: true,
      };
    }
    case SET_LAST_SIGNIN_USERNAME: {
      const { value } = action.payload;
      return {
        ...state,
        lastSignInUsername: value,
      };
    }
    case SET_LAST_SYNC_DATE: {
      const { value } = action.payload;
      return {
        ...state,
        lastSyncDate: value,
      };
    }
    case SET_REVIEW_DATA: {
      const { value } = action.payload;
      return {
        ...state,
        reviewData: value,
      };
    }
    case SET_SIGNIN_TYPE: {
      const { value } = action.payload;
      return {
        ...state,
        signInType: value,
      };
    }
    case TOGGLE_INITIALIZED_STATE: {
      const { value } = action.payload;
      return {
        ...state,
        hasDataInitialized: value,
      };
    }
    case TOGGLE_RATEUS_STATE: {
      const { value } = action.payload;
      return {
        ...state,
        hasPopRateUs: value,
      };
    }
    default:
      return state;
  }
};
