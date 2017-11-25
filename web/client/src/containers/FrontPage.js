import React from 'react';
import { connect } from 'react-redux';

import { form, FormGroup, ControlLabel, FormControl, Button, Grid, Row, Col } from 'react-bootstrap';

import QrReader from 'react-qr-reader';
import QRCode  from 'qrcode.react';

class FrontPage extends React.Component {

  constructor(props) {
    super(props);
    this.handleError = this.handleError.bind(this);
    this.handleScan = this.handleScan.bind(this);
    this.state = {
      token: '',
      scanningId: '',
      generatedId: '',
    };
  }

  handleError(err) {
    console.log(err);
  }

  handleScan(data) {
    if (!data)
      return;
    let uids = [], pwds = [];
    data.split(',').forEach((element, index) => {
        if (index % 2 === 0)
          uids.push(parseInt(element));
        else
          pwds.push(parseInt(element));
    });
    this.setState({ scanningId: uids[0] });
  }

  render() {
    return (
      <div style={{ paddingLeft: 50, paddingRight: 50 }}>
        <h1 style={{ fontSize: 30, paddingTop: 50 }}>You currently have {this.props.balance.tokens} Nekoins</h1>
        <form style={{ padding: 20 }}>
          <FormGroup controlId='token'>
            <ControlLabel>Nekoins as Gift offered to Customers</ControlLabel>
            <FormControl
              type="phone"
              placeholder="Nekoins"
              style={{ fontSize: '2em' }}
              value={this.state.token}
              onChange={e => this.setState({ token: e.target.value.replace(/\D/g, '') })} />
          </FormGroup>
        </form>
        <Grid>
          <Row style={{ position: 'relative' }}>
            <Col md={6} xs={6} style={{ textAlign: 'center' }}>
              <h3>Return customer</h3>
              <QrReader
                delay={300}
                onError={this.handleError}
                onScan={this.handleScan}
                style={{ width: '80%', margin: 'auto' }}
              />
              <div style={{ paddingTop: 10, paddingBottom: 10 }}>User ID: {this.state.scanningId}</div>
              <Button onClick={() => {
                this.props.contract.updateUser(this.state.scanningId, parseInt(this.state.token), {
                  from: window.web3.settings.defaultAccount,
                  to: this.props.contract.address,
                }).then(function(data){
                  console.log(data);
                });
              }}>
                Send {`${this.state.token}`} Nekoins to this account
              </Button>
            </Col>
            <div style={{ position: 'absolute', left: '50%', height: '100%', paddingTop: 100, paddingBottom: 50 }}>
              <div style={{ height: 150, borderLeft: 'dashed 2px black', width: 1 }}></div>
              <div style={{ marginTop: 20, marginBottom: 20 }}>
                <div style={{ position: 'relative', left: -5 }}>Or</div>
              </div>
              <div style={{ height: 150, borderLeft: 'dashed 2px black', width: 1  }}></div>
            </div>
            <Col md={6} xs={6} style={{ textAlign: 'center' }}>
              <h3>Create new customer</h3>
              {this.state.generatedId ? 
                <QRCode value={`${this.state.generatedId}`} size={444}/>:
                <div style={{ width: 444, height: 444 }}/>
              }
              <FormControl
                type="password"
                placeholder="Customer's password"
                onChange={e => this.setState({ password: e.target.value })}
                style={{ marginBottom: 10, margin: '0px 20px' }}
              />
              <Button onClick={() => {
                this.props.contract.createUser(
                  parseInt(this.state.token),
                  parseInt(this.state.password),
                  Math.round(Math.random()*100000),
                  {
                  from: window.web3.settings.defaultAccount,
                    to: this.props.contract.address,
                  }
                ).
                  then((data) => {
                    console.log(parseInt(data.logs[0].args.uid));
                    this.setState({ generatedId: parseInt(data.logs[0].args.uid) });
                  });   
              }}>
                Create new customer with {`${this.state.token}`} Nekoins
              </Button>
            </Col>
          </Row>
        </Grid>
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

export default connect(mapStateToProps, mapDispatchToProps)(FrontPage);