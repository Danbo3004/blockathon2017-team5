import React from 'react';
import {
  View,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode';

class Home extends React.Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  render() {
    return (
      <View style={{ backgroundColor: '#262626', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.removeUsers();
            }}
          >
            <Image source={require('../commons/logo.png')} style={{ width: 50, height: 50 }}/>
          </TouchableWithoutFeedback>
          <Text style={{ color: 'white', fontSize: 50 }}> Nekoins Wallet </Text>
        </View>
        {
          (this.props.users.ids.length > 0) &&
          <View style={{ backgroundColor: 'white', padding: 20 }}>
            <QRCode
              value={this.props.users.ids.reduce((accumulatedString, id, index) => {
                return accumulatedString + id + `,${this.props.users.passwords[index]},`;
              }, '')}
              size={300}
            />
          </View>
        }
        <TouchableOpacity
          onPress={() => {
            this.props.navigator.push({
              screen: 'Infection.Scanner'
            });
          }}
          style={{ backgroundColor: '#F15C30', paddingHorizontal: 32, paddingVertical: 15, borderRadius: 20 }}
        >
          <Text style={{ color: 'white', fontSize: 20 }}>
            ADD NEKOINS
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  removeUsers: () => dispatch({ type: 'REMOVE_IDS' })
});

export default connect(state => ({ ...state }), mapDispatchToProps)(Home);