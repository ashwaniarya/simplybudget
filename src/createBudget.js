/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
} from 'react-native';
import moment from 'moment';
import Button from './style/Button';
import {iClose} from './images';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createBudget} from './configStore';
import {primaryColor, h7d} from './globals';
import DateTimePicker from '@react-native-community/datetimepicker';

class CreateBudget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      amountError: '',
      days: 30,
      fromDate: null,
      endDate: null,
      dateError: '',
      show: null,
      selectionKey: '',
    };
  }
  componentDidMount() {
    TouchableNativeFeedback.Ripple('blue');
  }

  onPressSubmit = () => {
    let error = false;
    if (this.state.amount === '') {
      this.setState({amountError: "Budget amount can't be empty"});
      error = true;
    }
    if (!this.state.fromDate && !this.state.fromDate) {
      this.setState({dateError: 'Please select a from and end date'});
      error = true;
    } else if (!this.state.fromDate) {
      this.setState({dateError: 'Please select a from date'});
      error = true;
    } else if (!this.state.endDate) {
      this.setState({dateError: 'Please select a end date'});
      error = true;
    }
    if (!error) {
      this.onPressCreate();
    }
  };

  onPressCreate = () => {
    this.props.createBudget({
      amount: this.state.amount,
      fromDate: this.state.fromDate,
      endDate: this.state.endDate,
    });
    this.props.navigation.navigate('Init');
  };
  onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    this.setState({
      [this.state.selectionKey]: currentDate,
      selectedDate: '',
      show: false,
      dateError: null,
    });
  };
  showDatepicker = selectionKey => {
    this.setState({show: true, selectionKey});
  };
  render() {
    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior="height"
        enabled>
        {this.state.show && (
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={new Date()}
            maximumDate={this.state.endDate}
            minimumDate={this.state.fromDate}
            mode={'date'}
            is24Hour={true}
            display="default"
            onChange={this.onChange}
          />
        )}
        <View
          style={{
            justifyContent: 'center',
            flex: 1,
            backgroundColor: '#000',
          }}>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 24,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View>
              <Text
                style={{
                  fontSize: 32,
                  color: '#919191',
                  marginBottom: -12,
                }}>
                ADD
              </Text>
              <Text
                style={{
                  fontSize: 48,
                  marginBottom: 18,
                  fontWeight: 'bold',
                  color: '#168696',
                }}>
                BUDGET
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: '#1A1A1A',
              paddingHorizontal: 24,
              paddingVertical: 24,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderWidth: 2,
              borderColor: '#4F167B',
            }}>
            <View
              style={{
                marginBottom: 24,
              }}>
              {this.props.isClose && (
                <View
                  style={{
                    left: -5,
                    top: -5,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity onPress={this.props.close}>
                    <Image source={iClose()} />
                  </TouchableOpacity>
                </View>
              )}
              <Text
                style={{
                  color: h7d,
                }}>
                BUDGET AMOUNT
              </Text>
              <TextInput
                value={this.state.amount}
                onChangeText={text => {
                  this.setState({amount: text, amountError: null});
                }}
                placeholder="Enter Amount"
                underlineColorAndroid={
                  this.state.amountError ? 'red' : primaryColor
                }
                placeholderTextColor={'#3A3A3A'}
                keyboardType="number-pad"
                style={{
                  paddingVertical: 20,
                  fontSize: 24,
                  color: h7d,
                }}
              />
              <Text
                style={{
                  textAlign: 'right',
                  color: 'red',
                }}>
                {this.state.amountError}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: h7d,
                }}>
                BUDGET DURATION
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 18,
                }}>
                <Text style={{color: h7d, flex: 1}}>FROM</Text>
                <Button
                  onPress={() => this.showDatepicker('fromDate')}
                  flex={2}
                  text={
                    this.state.fromDate
                      ? moment(this.state.fromDate).format('DD MMM YYYY')
                      : '--/---/---'
                  }
                />
                <Text style={{color: h7d, flex: 1, textAlign: 'center'}}>
                  TO
                </Text>
                <Button
                  onPress={() => this.showDatepicker('endDate')}
                  flex={2}
                  text={
                    this.state.endDate
                      ? moment(this.state.endDate).format('DD MMM YYYY')
                      : '--/---/---'
                  }
                />
              </View>
              <Text
                style={{
                  textAlign: 'right',
                  color: 'red',
                }}>
                {this.state.dateError}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            height: 60,
          }}>
          <TouchableNativeFeedback onPress={this.onPressSubmit}>
            <View
              style={{
                backgroundColor: '#4F167B',
                height: 60,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: '#fff',
                }}>
                DONE
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(
  null,
  dispatch => bindActionCreators({createBudget}, dispatch),
)(CreateBudget);
