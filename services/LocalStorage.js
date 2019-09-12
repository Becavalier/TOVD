import {
  AsyncStorage
} from 'react-native';

export const fetchPersistentData = async (key) => {
  try {
    const value = JSON.parse(await AsyncStorage.getItem(key));
    return value.data;
  } catch (e) {
    return false;
  }
}

export const savePersistentData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify({
      type: typeof data,
      data
    }));
  } catch (e) {
    return false;
  }
}
