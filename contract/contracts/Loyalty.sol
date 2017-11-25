pragma solidity ^0.4.14;

interface iLoyalty {
	//merchant functions, 1 Token = 1/10.000 ether = $ 0.0449 // 1 ether = 10.000 token
	function merchantBuyToken() payable public;//merchant sends ether to get token
	function merchantRedeemToken(uint _amount) public /* merchantExist */ returns (uint);//merchant redeem token back to ether
	function merchantGetToken() constant public /* merchantExist */ returns (uint);//get token amount of merchant
	//send tokens to user
	function createUser(uint _amount, uint _password, uint _randomNumber) public /* merchantExist */;//create a new user with _amount token
	function getUsers() constant public /* isOwner */ returns (uint[], uint[], uint[]);//get user info
	function getMerchants() constant public /* isOwner */ returns (address[], uint[]);//get list merchant
	function updateUser(uint _userId, uint _amountAdded) public /* merchantExist */;//update a user with added _amount token
	function useToken(uint[] _userIds, uint[] _userPasswords, uint _tokenUsed) public /* merchantExist */;//spend token
}

contract Loyalty is iLoyalty{
	//Libraries
	using SafeMath for uint;

	uint public weiToToken = 100000000000000;
	uint constant private merchantKeep = 80;//percentage

	//variables
	address owner;
	//merchants
	address[] merchant;
	uint[] merchantToken;
	//users
	uint[] userId;
	uint[] userPasword;
	uint[] userToken;
	//mapping
	struct findIndex {
		uint index;
		bool isSet;
	}
	mapping (uint => findIndex) findUserIndex;
	mapping (address => findIndex) findMerchantIndex;
	//make sure only merchant registered can continue
	modifier merchantExist() { 
		require(findMerchantIndex[msg.sender].isSet == true);
		_; 
	}
	modifier isOwner() { 
		require(msg.sender == owner);
		_; 
	}
	

	//construction
	function Loyalty () {
		owner = msg.sender;
	}
	
	//fallback function 
	function () payable {
		merchantBuyToken();
	}

	//
	function merchantBuyToken() payable public{
		uint value = msg.value.div(weiToToken);
		if(findMerchantIndex[msg.sender].isSet){
			uint index = findMerchantIndex[msg.sender].index;
			merchantToken[index] = merchantToken[index].add(value);
		}else{
			findMerchantIndex[msg.sender] = findIndex(merchantToken.length,true);
			merchant.push(msg.sender);
			merchantToken.push(value);
		}
	}

	function merchantRedeemToken(uint _amount) public merchantExist returns (uint){
	    uint amountToWeiAfterFee = _amount.mul(10**18).div(10000).mul(merchantKeep).div(100);
		uint i = findMerchantIndex[msg.sender].index;
		if(merchantToken[i] >= _amount && address(this).balance >= amountToWeiAfterFee){
			address(merchant[i]).transfer(amountToWeiAfterFee);
			merchantToken[i] = merchantToken[i].sub(_amount);
			return amountToWeiAfterFee;
		}
		return 0;
	}

	function merchantGetToken() constant public merchantExist returns (uint){
		return merchantToken[findMerchantIndex[msg.sender].index];
	}

	event newUserLog(uint uid);//used for printing qr in js
	function createUser(uint _amount, uint _password, uint _randomNumber) public merchantExist{
		uint i = findMerchantIndex[msg.sender].index;
		if(merchantToken[i] >= _amount){
			uint uid = block.timestamp.add( userId.length.add(_randomNumber).mul(10000000000) ) ;
			//
			findUserIndex[uid] = findIndex(userId.length,true);
			userId.push(uid);
			userPasword.push(_password);
			userToken.push(_amount);
			//
			merchantToken[i] = merchantToken[i].sub(_amount);
			//
			newUserLog(uid);
			updateValueChanged(uid);
		}
	}

	function getUsers() constant public isOwner returns (uint[], uint[], uint[]){
		return (userId, userPasword, userToken);
	}

	function getMerchants() constant public isOwner returns (address[], uint[]){
		return (merchant, merchantToken);
	}

	function updateUser(uint _userId, uint _amountAdded) public merchantExist{
		uint i = findMerchantIndex[msg.sender].index;
		if(merchantToken[i] >= _amountAdded && findUserIndex[_userId].isSet){
			uint j = findUserIndex[_userId].index;
			userToken[j] = userToken[j].add(_amountAdded);
			merchantToken[i] = merchantToken[i].sub(_amountAdded);
			//
			updateValueChanged(_userId);
		}
	}

	function useToken(uint[] _userIds, uint[] _userPasswords, uint _tokenUsed) public merchantExist{
		uint i = findMerchantIndex[msg.sender].index;

		//find user id
		for(uint j=0;j<_userIds.length;j++){

			if(findUserIndex[_userIds[j]].isSet){
				uint k = findUserIndex[_userIds[j]].index;
				if(_userPasswords[j] == userPasword[k]){
					//check logic
					if(userToken[k] <= _tokenUsed){//partly

						_tokenUsed = _tokenUsed.sub(userToken[k]);
						merchantToken[i] = merchantToken[i].add(userToken[k]);
						userToken[k] = 0;

						updateValueChanged(_userIds[j]);
					}else{

						merchantToken[i] = merchantToken[i].add(_tokenUsed);
						userToken[k] = userToken[k].sub(_tokenUsed);
						_tokenUsed = 0;
						
						updateValueChanged(_userIds[j]);
					}
					
				}
			}
		}

		require(_tokenUsed==0);//reverse if user doesn't have enough token
	}

	event valueChanged(uint uid, uint crrAmount);
	function updateValueChanged(uint uid){
		if(findUserIndex[uid].isSet){
			valueChanged(uid, userToken[findUserIndex[uid].index]);
		}
	}

}

//Libraries==============================
library SafeMath {
  function mul(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }
  function div(uint256 a, uint256 b) internal constant returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }
  function sub(uint256 a, uint256 b) internal constant returns (uint256) {
    assert(b <= a);
    return a - b;
  }
  function add(uint256 a, uint256 b) internal constant returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}