import {
  LayoutAnimation,
} from 'react-native';

export default (time = 200) => ({
  layout: {
    easeInEaseOut: {
      duration: time,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
      }
    },
  }
});
