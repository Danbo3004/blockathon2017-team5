import React from 'react';
import { connect } from 'react-redux';
import { Route, Link, Switch, withRouter } from 'react-router-dom';
import { Nav, NavItem } from 'react-bootstrap';

import FrontPage from './containers/FrontPage';
import Redeem from './containers/Redeem';
import Topup from './containers/Topup';
import Exchange from './containers/Exchange';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.state = {
      activeKey: 1,
    };
  }

  componentWillReceiveProps(nextProps) {
    switch (nextProps.location.pathname) {
      case '/merchant':
        this.setState({ activeKey: 1 });
        break;
      case '/merchant/exchange':
        this.setState({ activeKey: 2 });
        break;
      case '/merchant/redeem':
        this.setState({ activeKey: 3 });
        break;
      case '/merchant/topup':
        this.setState({ activeKey: 4 });
        break;
    }
  }

  componentDidMount() {
    let web3Provider;
    if (typeof web3 !== 'undefined') {
      web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fallback to the tesstRPC
      web3Provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/NLQOqKfqFUx5isRRyS4k');
    }

    window.web3 = new Web3(web3Provider);
    
    fetch('/Loyalty.json', {
      method: 'GET',
      headers: new Headers(),
      mode: 'cors',
      cache: 'default'
    }).then((res) => res.json())
    .then(async json => {
      const contract = TruffleContract(json);
      contract.setProvider(web3Provider);
      let loyaltyContract = await contract.at(this.props.contract.address);
      this.props.assignContract(loyaltyContract);
      setInterval(() => {
        loyaltyContract.merchantGetToken().then(data => {
          window.web3.eth.getAccounts((error, accounts) => {
            if (error) console.log(error);
            window.web3.eth.getBalance(accounts[0], (err, result) => {
              if (!err) {
                const amount = web3.fromWei(result.toNumber(), "ether");
                this.props.updateBalance({ balance: amount, tokens: parseInt(data) });
                if (!window.web3.settings.defaultAccount)
                  window.web3.settings.defaultAccount = accounts[0];
              }
            });
          });
        }).catch(err => console.log(err));
      }, 1000);
    });
  }

  handleSelect(selectedKey) {
    this.setState({ activeKey: selectedKey });
    switch (selectedKey) {
      case 1:
        this.props.history.push('/merchant');
        break;
      case 2:
        this.props.history.push('/merchant/exchange');
        break;
      case 3:
        this.props.history.push('/merchant/redeem');
        break;
      case 4:
        this.props.history.push('/merchant/topup');
        break;
    }
  }

  render() {
    return (
      <div>
        <img src={'/image/banner.png'}/>
        <div style={{ padding: '100px 50px' }}>
          <Nav bsStyle="pills" activeKey={this.state.activeKey} onSelect={this.handleSelect} style={{ display: 'inline-block' }}>
            <NavItem eventKey={1}>Issue Nekoins to User</NavItem>
            <NavItem eventKey={3}>User Redeem</NavItem>
          </Nav>
          <Nav bsStyle="pills" activeKey={this.state.activeKey} onSelect={this.handleSelect} style={{ float: 'right' }}>
            <NavItem eventKey={4}>Topup Nekoins</NavItem>
            <NavItem eventKey={2}>Exchange to Ethers</NavItem>
          </Nav>
          <Switch>
            <Route exact path="/merchant" component={FrontPage}/>
            <Route path="/merchant/exchange" component={Exchange}/>
            <Route path="/merchant/redeem" component={Redeem}/>
            <Route path="/merchant/topup" component={Topup}/>
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {...state};
}

const mapDispatchToProps = (dispatch) => ({
  assignContract: (contract) => dispatch({ type: 'ASSIGN_CONTRACT', contract }),
  updateBalance: (payload) => dispatch({ type: 'UPDATE_BALANCE', payload }),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));