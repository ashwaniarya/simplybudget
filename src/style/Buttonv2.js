/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {primaryColor, h7d} from './../globals';
export default class Button extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress || null}
        style={[
          {
            backgroundColor: this.props.bgColor || 'black',
            borderWidth: 1,
            paddingVertical: 8,
            paddingHorizontal: 8,
            borderColor: primaryColor,
            borderRadius: 8,
            flex: this.props.flex || 1,
          },
          {...this.props.style},
        ]}>
        <Text
          style={{
            color: h7d,
            textAlign: 'center',
            fontSize: this.props.textSize || 14,
          }}>
          {this.props.text || ''}
        </Text>
      </TouchableOpacity>
    );
  }
}
