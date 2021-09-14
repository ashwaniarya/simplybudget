/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {primaryColor, h7d} from './../globals';
import {iClose} from './../images';

export default class CloseBtn extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        style={{
          borderWidth: 1,
          padding: 12,
          borderRadius: this.props.circle ? 50 : 0,
          borderColor: h7d,
        }}>
        <Image source={iClose()} />
      </TouchableOpacity>
    );
  }
}
