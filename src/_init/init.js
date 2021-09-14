import React from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
class Init extends React.Component {
  componentDidMount() {
    //console.log(this.props.budget)
    if (this.props.budget.amount) {
      this.props.navigation.navigate('MainApp');
    } else {
      this.props.navigation.navigate('CreateBudget');
    }
  }
  render() {
    return (
      <View>
        <Text>This is a Init</Text>
      </View>
    );
  }
}

export default connect(({budget}) => ({budget}))(Init);
