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
  Modal,
  ToastAndroid,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import Button from './../style/Button';
import CloseBtn from './../style/CloseBtn';
import {bindActionCreators} from 'redux';
//Store Actions
import {
  addEntry,
  addCategory,
  deleteCategory,
  createBudget,
} from './../configStore';
import {iClose, iPlus, iSetting} from './../images';
import {primaryColor, h7d, secondaryColor, hab} from './../globals';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {debounce} from 'lodash';

class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: this.props.budget.amount,
      amountError: null,
      category: '',
      categoryError: null,
      createdAt: new Date(),
      fromDate: new Date(this.props.budget.fromDate),
      endDate: new Date(this.props.budget.endDate),
      dateError: '',
      description: '',
      show: false,
      isKeyboard: false,
      addCategoryModal: false,
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
  editBudget = () => {
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
      this.props.createBudget({
        amount: this.state.amount,
        fromDate: this.state.fromDate,
        endDate: this.state.endDate,
      });
      ToastAndroid.show('Budget updated successfully', ToastAndroid.SHORT);
    }
  };
  debouncedEditBudget = debounce(this.editBudget, 100);
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
  onPressCreateCategory = () => {
    let error = false;
    if (this.state.category === '') {
      this.setState({categoryError: "Category can't be empty"});
      error = true;
    }
    if (!error) {
      this.props.addCategory({
        category: this.state.category.toUpperCase(),
      });
      this.setState({
        addCategoryModal: false,
        category: '',
      });
    }
  };
  onChange = (event, selectedDate) => {
    let currentDate = selectedDate;
    if (typeof currentDate === 'undefined') {
      currentDate = null;
    }
    console.log(currentDate);
    this.setState(
      {
        [this.state.selectionKey]: currentDate,
        selectedDate: '',
        show: false,
        dateError: null,
      },
      () => {
        this.debouncedEditBudget();
      },
    );
  };
  showDatepicker = selectionKey => {
    this.setState({show: true, selectionKey});
  };
  close = () => {
    this.props.navigation.goBack();
  };
  render() {
    let end = moment(this.state.endDate);
    let start = moment(this.state.fromDate);

    let budgetDays = end.diff(start, 'days') + 1;
    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior="pading"
        enabled={true}>
        {this.state.show && (
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={
              this.state[this.state.selectionKey]
                ? this.state[this.state.selectionKey]
                : new Date()
            }
            mode={'date'}
            maximumDate={this.state.endDate}
            minimumDate={this.state.fromDate}
            is24Hour={true}
            display="default"
            onChange={this.onChange}
          />
        )}

        {/* Add Category Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.addCategoryModal}
          onRequestClose={() => {
            this.setState({
              addCategoryModal: false,
            });
          }}>
          <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.8)'}}>
            <View style={{flex: 1}} />
            <View
              style={{
                backgroundColor: '#1A1A1A',
                padding: 24,
              }}>
              <View
                style={{
                  left: -5,
                  top: -5,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      addCategoryModal: false,
                    });
                  }}>
                  <Image source={iClose()} />
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 2}}>
                  <Text
                    style={{
                      color: h7d,
                    }}>
                    NEW CATEGORY
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <TextInput
                      value={this.state.category}
                      onChangeText={text => {
                        this.setState({category: text, categoryError: null});
                      }}
                      placeholder="Enter a new category"
                      underlineColorAndroid={
                        this.state.categoryError ? 'red' : primaryColor
                      }
                      placeholderTextColor={'#3A3A3A'}
                      keyboardType="default"
                      style={{
                        paddingVertical: 14,
                        flex: 1,
                        fontSize: 20,
                        color: h7d,
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      textAlign: 'right',
                      color: 'red',
                    }}>
                    {this.state.categoryError}
                  </Text>
                </View>
              </View>
              {this.state.isKeyboard ? (
                <View
                  style={{
                    height: 50,
                  }}>
                  <TouchableNativeFeedback
                    onPress={this.onPressCreateCategory}
                    disabled={this.state.category === ''}>
                    <View
                      style={{
                        backgroundColor:
                          this.state.category === '' ? '#333' : '#4F167B',
                        height: 50,
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 18,
                          fontWeight: 'bold',
                          color:
                            this.state.category === ''
                              ? '#555'
                              : secondaryColor,
                        }}>
                        ADD
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
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor:
                        this.state.category === '' ? '#333' : '#4F167B',
                      height: 50,
                      width: 100,
                      justifyContent: 'center',
                      borderRadius: 50,
                    }}
                    disabled={this.state.category === ''}
                    onPress={this.onPressCreateCategory}>
                    <Text
                      style={{
                        color:
                          this.state.category === '' ? '#555' : secondaryColor,
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}>
                      ADD
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
        <View
          style={{
            justifyContent: 'center',
            flex: 1,
            backgroundColor: '#000',
          }}>
          <StatusBar backgroundColor="#2e17ad" barStyle="light-content" />
          <Image
            source={iSetting()}
            style={{
              width: Dimensions.get('window').width,
              height: 166,
              backgroundColor: 'transparent',
            }}
            resizeMode="contain"
          />
          <View
            style={{
              flex: 1,
              paddingHorizontal: 24,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* <Text
              style={{
                fontSize: 48,
                marginBottom: 18,
                fontWeight: 'bold',
                color: '#168696',
              }}>
              SETTINGS
            </Text> */}
          </View>
          <View
            style={{
              backgroundColor: '#1A1A1A',
              paddingHorizontal: 24,
              paddingVertical: 24,
              borderTopLeftRadius: 24,
              borderWidth: 2,
              borderTopRightRadius: 24,
              borderColor: '#4F167B',
            }}>
            <View
              style={{
                flexDirection: 'column',
              }}>
              <View
                style={{
                  left: -5,
                  top: -5,
                  alignItems: 'center',
                }}
              />
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 2, marginRight: 16}}>
                  <Text
                    style={{
                      color: h7d,
                    }}>
                    BUDGET AMOUNT
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
                        this.setState({amount: text, amountError: null}, () => {
                          if (this.props.amount !== '') {
                            console.log('Debounce should be called');
                            this.debouncedEditBudget();
                          }
                        });
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
                        fontSize: 20,
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
              </View>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: h7d,
                  }}>
                  BUDGET DURATION
                </Text>
                <Text
                  style={{
                    color: h7d,
                    fontWeight: 'bold',
                  }}>
                  {isNaN(budgetDays) ? '' : budgetDays + ' DAY(S)'}
                </Text>
              </View>
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
            <View style={{marginBottom: 20}}>
              <Text
                style={{
                  color: h7d,
                }}>
                CATEGORY
              </Text>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <FlatList
                  data={Object.values(this.props.category)}
                  keyExtractor={item => item.value}
                  horizontal={true}
                  contentContainerStyle={{
                    paddingTop: 12,
                    paddingBottom: 4,
                    paddingRight: 10,
                  }}
                  style={{
                    marginRight: 10,
                  }}
                  showsHorizontalScrollIndicator={false}
                  keyboardShouldPersistTaps="always"
                  renderItem={({item}) => {
                    return (
                      <View
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          backgroundColor: '#000',
                          marginRight: 5,
                          borderRadius: 10,
                          flexDirection: 'row',
                        }}>
                        <Text style={{color: hab}}>
                          {item.value.toUpperCase()}
                        </Text>
                        {/* <View style={{paddingLeft: 10}}>
                          <TouchableOpacity>
                            <Image
                              source={iClose()}
                              style={{height: 20, width: 20}}
                            />
                          </TouchableOpacity>
                        </View> */}
                      </View>
                    );
                  }}
                />
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    marginLeft: 5,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        addCategoryModal: true,
                      });
                    }}
                    style={{
                      padding: 5,
                      borderRadius: 50,
                      marginTop: 10,
                    }}>
                    <Image source={iPlus()} style={{height: 20, width: 20}} />
                  </TouchableOpacity>
                </View>
              </View>
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
          </View>
        </View>
        {this.state.isKeyboard ? (
          <View
            style={{
              height: 50,
              flexDirection: 'row',
              backgroundColor: '#000',
              justifyContent: 'center'
            }}>
            <CloseBtn onPress={this.close} circle />
          </View>
        ) : (
          <View
            style={{
              paddingBottom: 80,
              paddingTop: 16,
              alignItems: 'center',
              backgroundColor: '#000',
            }}>
            <CloseBtn onPress={this.close} circle />
          </View>
        )}
      </KeyboardAvoidingView>
    );
  }
}

export default connect(
  ({category, budget}) => ({category, budget}),
  dispatch =>
    bindActionCreators(
      {
        addEntry,
        addCategory,
        createBudget,
      },
      dispatch,
    ),
)(Setting);
