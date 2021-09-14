/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
  KeyboardAvoidingView,
  FlatList,
  ScrollView,
  Image,
  Dimensions,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import Button from './../style/Button';
import CloseBtn from './../style/CloseBtn';
import {bindActionCreators} from 'redux';
//Store Actions
import {addEntry} from './../configStore';
import {iClose} from './../images';
import {primaryColor, h7d, secondaryColor} from './../globals';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

class CreateEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      amountError: null,
      category: null,
      categoryError: null,
      createdAt: new Date(),
      description: '',
      show: false,
      isKeyboard: false,
    };
  }
  componentDidMount() {
    TouchableNativeFeedback.Ripple('blue');
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  _keyboardDidShow = () => {
    this.setState({isKeyboard: true});
  };

  _keyboardDidHide = () => {
    this.setState({isKeyboard: false});
  };

  onPressCreate = () => {
    let error = false;
    if (this.state.amount === '') {
      this.setState({amountError: "Amount can't be empty"});
      error = true;
    }
    if (!this.state.category) {
      this.setState({categoryError: 'Please choose a category'});
      error = true;
    }
    if (!error) {
      this.props.addEntry({
        amount: this.state.amount,
        description: this.state.description,
        createdAt: this.state.createdAt,
        category: this.state.category,
      });
      this.props.close();
    }
  };
  onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    this.setState({
      createdAt: currentDate,
      show: false,
      dateError: null,
    });
  };
  showDatepicker = () => {
    this.setState({show: true});
  };
  render() {
    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior="pading"
        enabled>
        {this.state.show && (
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={this.state.createdAt}
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
            <Text
              style={{
                fontSize: 32,
                marginBottom: 18,
                color: '#919191',
                fontWeight: 'bold',
              }}>
              ADD EXPENSE :
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#1A1A1A',
              paddingHorizontal: 24,
              paddingVertical: 24,
              borderTopLeftRadius: 24,
              borderColor: '#4F167B',
              borderWidth: 1,
              borderTopRightRadius: 24,
            }}>
            <View
              style={{
                flexDirection: 'column',
              }}>
              {/* <View
                style={{
                  left: -5,
                  top: -5,
                  marginBottom: 12,
                  alignItems: 'center',
                }}>
                <CloseBtn onPress={this.props.close} />
              </View> */}
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 2, marginRight: 16}}>
                  <Text
                    style={{
                      color: h7d,
                      fontSize: 12,
                    }}>
                    EXPENSE DESCRIPTION
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: h7d,
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}>
                      ₹
                    </Text>
                    <TextInput
                      value={this.state.amount}
                      onChangeText={text => {
                        this.setState({amount: text, amountError: null});
                      }}
                      placeholder="Enter your Amount"
                      underlineColorAndroid={
                        this.state.amountError ? 'red' : primaryColor
                      }
                      placeholderTextColor={'#3A3A3A'}
                      keyboardType="number-pad"
                      style={{
                        paddingVertical: 14,
                        marginLeft: 5,
                        flex: 1,
                        fontSize: 18,
                        color: h7d,
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      textAlign: 'right',
                      color: 'red',
                    }}>
                    {this.state.amountError}
                  </Text>
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: h7d,
                      fontSize: 12,
                    }}>
                    ENTRY DATE
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <Button
                      onPress={() => this.showDatepicker()}
                      style={{
                        justifyContent: 'center',
                      }}
                      textSize={14}
                      text={moment(this.state.createdAt).format('DD MMM YYYY')}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View>
              <Text
                style={{
                  color: h7d,
                  fontSize: 12,
                }}>
                EXPENSE DESCRIPTION
              </Text>
              <TextInput
                value={this.state.description}
                onChangeText={text => {
                  this.setState({description: text});
                }}
                placeholder="Description"
                placeholderTextColor={'#3A3A3A'}
                underlineColorAndroid={primaryColor}
                style={{
                  paddingVertical: 16,
                  fontSize: 18,
                  marginLeft: -5,
                  color: h7d,
                }}
              />
            </View>
            <View>
              <Text
                style={{
                  color: h7d,
                  fontSize: 12,
                }}>
                CATEGORY
              </Text>
              <FlatList
                data={Object.values(this.props.category)}
                keyExtractor={item => item.value}
                horizontal={true}
                contentContainerStyle={{
                  paddingTop: 12,
                  paddingBottom: 4,
                }}
                keyboardShouldPersistTaps="always"
                renderItem={({item}) => {
                  let selected = item.value === this.state.category;
                  return (
                    <Button
                      bgColor={selected ? '#250E66' : 'black'}
                      text={item.value}
                      onPress={() => {
                        this.setState({
                          category: item.value,
                          categoryError: null,
                        });
                      }}
                      style={{marginRight: 8, paddingHorizontal: 16}}
                    />
                  );
                }}
              />
              {this.state.categoryError && (
                <Text
                  style={{
                    textAlign: 'right',
                    color: 'red',
                    marginBottom: 12,
                  }}>
                  {this.state.categoryError}
                </Text>
              )}
            </View>
            {/* <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: h7d,
                    textAlign: 'left',
                    flex: 2,
                    fontSize: 12,
                  }}>
                  ENTRY DATE
                </Text>
                <Button
                  onPress={() => this.showDatepicker()}
                  style={{
                    justifyContent: 'center',
                  }}
                  textSize={14}
                  text={moment(this.state.createdAt).format('DD MMM YYYY')}
                />
              </View>
            </View> */}
          </View>
        </View>
        {this.state.isKeyboard ? (
          <View
            style={{
              height: 50,
              flexDirection: 'row',
              backgroundColor: '#000',
            }}>
            <CloseBtn onPress={this.props.close} />
            <TouchableNativeFeedback
              onPress={this.onPressCreate}
              style={{flex: 1}}>
              <View
                style={{
                  backgroundColor: '#4F167B',
                  height: 50,
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#fff',
                  }}>
                  Add
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        ) : (
          <View
            style={{
              paddingBottom: 80,
              paddingTop: 16,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#000',
              flexDirection: 'row',
            }}>
            <CloseBtn onPress={this.props.close} circle/>
            <TouchableOpacity
              style={{
                backgroundColor: '#4F167B',
                height: 50,
                width: 100,
                justifyContent: 'center',
                borderRadius: 50,
                marginLeft: 16,
              }}
              onPress={this.onPressCreate}>
              <Text
                style={{
                  color: secondaryColor,
                  textAlign: 'center',
                  fontSize: 24,
                  fontWeight: 'bold',
                }}>
                ADD
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    );
  }
}

export default connect(
  ({category}) => ({category}),
  dispatch =>
    bindActionCreators(
      {
        addEntry,
      },
      dispatch,
    ),
)(CreateEntry);
