import React from 'react';
import { connect } from 'react-redux';
import { form, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

class Topup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
    };
  }

  render() {
    return (
      <div>
        <h1 style={{ fontSize: 30, paddingTop: 50 }}>You currently have {this.props.balance.tokens} Nekoins</h1>
        <form style={{ padding: 20 }}>
          <FormGroup controlId='token'>
            <ControlLabel>Buy Nekoins for your Loyalty Program</ControlLabel>
            <FormControl
              type="text"
              placeholder="Nekoins"
              value={this.state.token}
              onChange={e => this.setState({ token: e.target.value.replace(/\D/g, '') })}
              style={{ fontSize: '2em' }}
            />
          </FormGroup>
          <Button onClick={() => {
            window.web3.eth.sendTransaction(
              {to: this.props.contract.address, value: window.web3.toWei(this.state.token / 10000, "ether") }, 
              (err, transactionHash) => {
                console.log(transactionHash);
              }
            ); 
          }}>
            Buy Now!
          </Button>
        </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(Topup);