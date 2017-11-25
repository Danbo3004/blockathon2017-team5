
import React from 'react';
import {
  View,
  Button,
  TextInput,
  Text
} from 'react-native';
import { connect } from 'react-redux';

import QRCodeScanner from 'react-native-qrcode-scanner';

class Scanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  render() {
    if (!this.state.showModal) {
      return (
        <QRCodeScanner
          onRead={e => {
            this.setState({ showModal: true, id: e.data, password: '' });
          }}
          topViewStyle={{
            backgroundColor: '#262626',
          }}
          bottomViewStyle={{
            backgroundColor: '#262626',
          }}
        />
      );
    }
    return (
      <View style={{ backgroundColor: '#262626', flex: 1, alignItems: 'center', alignContent: 'center' }}>
        <Text>Password:</Text>
        <TextInput
          style={{ borderWidth: 1, lineHeight: 20, width: '90%', height: 30 }}
          onChangeText={password => this.setState({ password })}
        />
        <Button
          title="Submit"
          onPress={() => {
            this.props.addNewId(this.state.id, this.state.password);
            this.props.navigator.pop({
              animated: true, // does the pop have transition animation or does it happen immediately (optional)
              animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
            });
          }}
        />
      </View>
    );
  }
}

export default connect(null, (dispatch) => ({
  addNewId: (id, password) => dispatch({ type: 'ADD_NEW_ID', id, password })
}))(Scanner);