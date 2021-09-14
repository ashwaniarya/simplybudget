/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Image} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import {ha1} from './../globals';

//Icon
import {iTrash} from './../images';
import {TouchableOpacity} from 'react-native-gesture-handler';
class Entry extends React.Component {
  componentDidMount() {
    //console.log(this.props.budget)
  }

  render() {
    return (
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 8,
          backgroundColor: '#131313',
          borderRadius: 8,
          marginBottom: 4,
          borderColor: '#3A3A3A',
          borderWidth: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{marginRight: 10}}>
            <Text style={{fontSize: 18, color: ha1}}>
              ₹ {this.props.amount || 0}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={{color: 'grey', fontSize: 18}}>
              {this.props.description || 'Others'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={this.props.onPressDelete}
            style={{marginLeft: 10}}>
            <Image
              source={iTrash()}
              style={{height: 20, width: 14, tintColor: 'grey'}}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{color: 'grey', fontSize: 12}}>
            {moment(this.props.createdAt || new Date()).fromNow()}
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <View 
            style={{
              borderWidth: 1,
              borderColor: '#3A3A3A',
              paddingHorizontal: 8,
              borderRadius: 8,
            }}>
            <Text style={{color: 'grey', fontSize: 12}}>
              {this.props.category || ''}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default connect(({budget}) => ({budget}))(Entry);
