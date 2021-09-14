/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import CreateEntry from './createEntry';
import Entry from './entry';
import {deleteEntry} from './../configStore';
import {bindActionCreators} from 'redux';
import {iNut, iBackground} from './../images';

import {primaryColor, secondaryColor, h7d, hb1, hab} from '../globals';
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCreateEntry: false,
    };
  }
  componentDidMount() {}
  componentDidUpdate() {}
  deleteEntry = id => {
    Alert.alert(
      'Delete an Entry',
      'Are you sure you want to delete a entry?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => this.props.deleteEntry({id})},
      ],
      {cancelable: false},
    );
  };
  onPressSetting = () => {
    this.props.navigation.navigate('Setting');
  };
  render() {
    let end = moment(this.props.budget.endDate);
    let start = moment(this.props.budget.fromDate);

    let curr = moment();
    let remainingDays = end.diff(curr, 'days') + 1;
    let currMonthExpense = 0;
    let entries = [];
    Object.keys(this.props.entry).forEach(date => {
      let formatDate = new Date(date);
      if (start < formatDate && curr >= formatDate) {
        entries.push(this.props.entry[date]);
        currMonthExpense += parseInt(this.props.entry[date].amount);
      }
    });

    let remainingBuget = this.props.budget.amount - currMonthExpense;
    remainingBuget = remainingBuget.toFixed(0);

    let canSpendPerDay = parseInt(remainingBuget) / remainingDays;
    canSpendPerDay = canSpendPerDay.toFixed(0);
    console.log('Remaining days:', remainingDays);
    return (
      <View style={{flex: 1, backgroundColor: '#000'}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.isCreateEntry}
          onRequestClose={() => {
            this.setState({isCreateEntry: false});
          }}>
          <CreateEntry
            close={() => {
              this.setState({isCreateEntry: false});
            }}
          />
        </Modal>
        <View style={{flex: 1, paddingHorizontal: 16}}>
          {/* Section one */}
          <View
            style={{
              backgroundColor: '#250E66',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 10,
              marginTop: 16,
              marginBottom: 8,
            }}>
            <Image
              source={iBackground()}
              style={{
                position: 'absolute',
                width: Dimensions.get('screen').width - 32,
                height: '120%',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#005365',
              }}
              resizeMode="cover"
            />
            <Text style={{color: '#fff', opacity: 0.5}}>YOU CAN SPEND</Text>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <View>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 48,
                      fontWeight: 'bold',
                      color: 'white',
                    }}>
                    ₹ {canSpendPerDay}
                  </Text>
                  <Text
                    style={{
                      textAlign: 'right',
                      fontSize: 16,
                      color: 'white',
                      marginBottom: 8,
                      marginTop: -8,
                    }}>
                    PER DAY
                  </Text>
                </View>
              </View>
              <View style={{justifyContent: 'center'}}>
                <TouchableOpacity onPress={this.onPressSetting}>
                  <Image
                    source={iNut()}
                    style={{height: 25, width: 25, tintColor: 'orange'}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Section two */}
          <View
            style={{
              backgroundColor: hb1,
              borderRadius: 8,
              paddingTop: 10,
              paddingHorizontal: 16,
              paddingBottom: 10,
              marginTop: 16,
              marginBottom: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text style={{color: h7d, marginBottom: 8}}>REMAINING FUND</Text>
              <Text
                style={{
                  textAlign: 'left',
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: hab,
                }}>
                ₹ {remainingBuget}
              </Text>
              <Text style={{textAlign: 'left', fontSize: 20, color: h7d}}>
                ₹ {this.props.budget.amount}
              </Text>
            </View>
            <View>
              <Text style={{color: h7d, marginBottom: 8}}>REMAINING DAYS</Text>
              <Text
                style={{
                  textAlign: 'right',
                  fontSize: 30,
                  fontWeight: 'bold',
                  color: hab,
                }}>
                {remainingDays}
              </Text>
              <Text style={{textAlign: 'right', fontSize: 20, color: h7d}}>
                days
              </Text>
            </View>
          </View>
          {/* Section three */}
          <View
            style={{
              backgroundColor: hb1,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 10,
              marginTop: 16,
              marginBottom: 8,
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: h7d}}>FROM</Text>
              <Text style={{color: h7d}}>TO</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{textAlign: 'left', fontSize: 20, color: hab}}>
                {start.format('DD MMM YYYY')}
              </Text>
              <Text style={{textAlign: 'left', fontSize: 20, color: hab}}>
                {end.format('DD MMM YYYY')}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginBottom: 8,
              marginTop: 16,
            }}>
            <Text style={{color: h7d}}>RECORDS</Text>
          </View>
          <FlatList
            data={entries.reverse()}
            keyExtractor={item => item.createdAt.toString()}
            contentContainerStyle={{}}
            renderItem={({item}) => {
              return (
                <Entry
                  amount={item.amount}
                  description={item.description}
                  createdAt={item.createdAt}
                  category={item.category}
                  onPressDelete={() => {
                    this.deleteEntry(item.createdAt);
                  }}
                />
              );
            }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            left: Dimensions.get('screen').width / 2 - 50,
            bottom: 80,
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#4F167B',
              height: 50,
              width: 100,
              justifyContent: 'center',
              borderRadius: 50,
            }}
            onPress={() => {
              this.setState({isCreateEntry: true});
            }}>
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
      </View>
    );
  }
}

export default connect(
  ({budget, entry}) => ({budget, entry}),
  dispatch =>
    bindActionCreators(
      {
        deleteEntry,
      },
      dispatch,
    ),
)(Home);
