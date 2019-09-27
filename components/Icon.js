import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../configurations/Colors';
import { 
  StyleSheet
} from 'react-native';

export default function Icon(props) {
  return (
    <Ionicons
     {...props}
      name={props.name}
      size={props.size || 26}
      style={styles.icon}
      color={props.color || (props.focused ? Colors.tabIconSelected : Colors.tabIconDefault)}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: -1
  }
});
