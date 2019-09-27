import React from 'react';
import {
  Animated,
  Easing
} from 'react-native';

export default class RotateContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.spinValue = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.loop(Animated.timing(this.spinValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
      }
    )).start();
  }
  
  render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
 
    return (
      <Animated.View 
        style={{transform: [{rotate: spin}] }}               
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
