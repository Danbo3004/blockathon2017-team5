import React from 'react';
import { connect } from 'react-redux';
import { form, FormGroup, ControlLabel, FormControl, Button, Grid, Row, Col } from 'react-bootstrap';

import QrReader from 'react-qr-reader';

class Redeem extends React.Component {
  constructor(props) {
    super(props);
    this.handleError = this.handleError.bind(this);
    this.handleScan = this.handleScan.bind(this);
    this.state = {
      isProcessing: false,
      token: ''
    };
  }

  handleError(err) {
    console.log(err);
  }

  handleScan(data) {
    console.log(data, this.state.isProcessing);
    if (this.state.isProcessing || !data)
      return;
    this.setState({ isProcessing: true });
    let uids = [], pwds = [];
    data.split(',').forEach((element, index) => {
        if (index % 2 === 0)
          uids.push(parseInt(element));
        else
          pwds.push(parseInt(element));
    });
    this.props.contract.useToken(uids, pwds, parseInt(this.state.token), {
      from: window.web3.settings.defaultAccount,
      to: this.props.contract.address,
      gas: 300000,
    })
    .then((data) => {
      this.setState({ isProcessing: false });
    })
    .catch((err) => {
      console.log(err.message);
      this.setState({ isProcessing: false });
    });
  }

  render() {
    return (
      <div>
        <h1 style={{ fontSize: 30, paddingTop: 50 }}>You currently have {this.props.balance.tokens} Nekoins</h1>
        <form style={{ padding: 20 }}>
        <FormGroup controlId='token'>
          <ControlLabel>Redeem Gift Code From User</ControlLabel>
          <FormControl
            type="text"
            placeholder="Nekoins Value"
            value={this.state.token}
            onChange={e => this.setState({ token: e.target.value.replace(/\D/g, '') })}
          />
        </FormGroup>
      </form>
        <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: '40%', margin: 'auto' }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    balance: state.balance,
    contract: state.contract.contract
  }
};

const mapDispatchToProps = (dispatch) => ({
  updateTokens: (tokens) => dispatch({ type: 'UPDATE_TOKENS', tokens })
});

export default connect(mapStateToProps, mapDispatchToProps)(Redeem);