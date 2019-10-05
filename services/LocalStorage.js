import { AsyncStorage } from 'react-native';

export const fetchPersistentData = async (key, { 
  decodeJSON = true 
  } = {}) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return decodeJSON ? JSON.parse(value).data : value;
  } catch (e) {
    return false;
  }
}

export const savePersistentData = async (key, data, { 
    encodeJSON = true, 
    callback,
  } = {}) => {
  try {
    const value = encodeJSON ? JSON.stringify({
      type: typeof data, data,
    }) : data;
    await AsyncStorage.setItem(key, value);
    // sync with remote;
    callback && callback(value);
  } catch (e) {
    return false;
  }
}
