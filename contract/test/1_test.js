// Specifically request an abstraction for MetaCoin
var Loyalty = artifacts.require("Loyalty");

contract('Loyalty', function(accounts) {
	var instance;
	var firstUserId;
	var secondUserId;
	var testCase = {buy:0.1, toToken:1000, sellToken:200, sendNewUserToken:10, userPassword: 123123, updateUserWithToken:20} //1 ether can buy 10.000 token
	var testCaseConsume = {merchantBuy: 0.01, toToken: 100, use:5}
	var testCase2ndUser = {sendNewUserToken: 5, userPassword:321321, use: 27}

	it("Merchant buy token", function(){
		return Loyalty.deployed().then(function(ins){
			instance=ins;
			return ins.merchantBuyToken({from:web3.eth.accounts[1], to:ins.address, value:web3.toWei(testCase.buy,'ether')});
		}).then(()=>{
			return instance.merchantGetToken({from:web3.eth.accounts[1]});
		}).then((amount)=>{
			assert.equal(parseInt(amount), testCase.toToken, "Wrong Token purchased!");
		});
	});

	it("Merchant redeem token", function(){
		return Loyalty.deployed().then(function(ins){
			instance=ins;
			return ins.merchantRedeemToken(testCase.sellToken, {from:web3.eth.accounts[1]});
		}).then(()=>{
			return instance.merchantGetToken({from:web3.eth.accounts[1]});
		}).then((amount)=>{
			assert.equal(parseInt(amount), testCase.toToken-testCase.sellToken, "Wrong Token Left!");
		});
	});

	it("Merchant create new user", function(){
		return Loyalty.deployed().then(function(ins){
			instance=ins;
			return ins.createUser(testCase.sendNewUserToken, testCase.userPassword, 988776, {from:web3.eth.accounts[1]});
		}).then(()=>{
			return instance.getUsers({from:web3.eth.accounts[0]});
		}).then((data)=>{
			firstUserId = parseInt(data[0][0]);
			assert.equal(data[0].length, 1, "No User Created!");
			return instance.merchantGetToken({from:web3.eth.accounts[1]});
		}).then((amount)=>{
			assert.equal(parseInt(amount), testCase.toToken-testCase.sellToken-testCase.sendNewUserToken, "Wrong Token Left After Sending To User!");
		});
	});

	it("Merchant update user", function(){
		return Loyalty.deployed().then(function(ins){
			instance=ins;
			return instance.updateUser(firstUserId, testCase.updateUserWithToken, {from:web3.eth.accounts[1]});
		}).then(()=>{
			return instance.merchantGetToken({from:web3.eth.accounts[1]});
		}).then((amount)=>{
			assert.equal(parseInt(amount), testCase.toToken-testCase.sellToken-testCase.sendNewUserToken-testCase.updateUserWithToken, "Wrong Token Left After Updating User!");
			return instance.getUsers({from:web3.eth.accounts[0]});
		}).then((data)=>{
			assert.equal(parseInt(data[2][0]), testCase.sendNewUserToken+testCase.updateUserWithToken, "Wrong User Token Amount!");
		});
	});

	it("Merchant 2 buy token", function(){
		return Loyalty.deployed().then(function(ins){
			instance=ins;
			return ins.merchantBuyToken({from:web3.eth.accounts[5], to:ins.address, value:web3.toWei(testCaseConsume.merchantBuy,'ether')});
		}).then(()=>{
			return instance.merchantGetToken({from:web3.eth.accounts[5]});
		}).then((amount)=>{
			assert.equal(parseInt(amount), testCaseConsume.toToken, "Wrong Token purchased by Merchant 2!");
		});
	});

	it("User use token", function(){
		return Loyalty.deployed().then(function(ins){
			instance=ins;
			return instance.useToken([firstUserId], [testCase.userPassword], testCaseConsume.use, {from:web3.eth.accounts[5]});
		}).then(()=>{
			return instance.merchantGetToken({from:web3.eth.accounts[5]});
		}).then((amount)=>{
			// console.log(JSON.stringify(amount));
			assert.equal(parseInt(amount), testCaseConsume.toToken + testCaseConsume.use, "Wrong Token Received!");
			return instance.getUsers({from:web3.eth.accounts[0]});
		}).then((data)=>{
			assert.equal(parseInt(data[2][0]), testCase.sendNewUserToken+testCase.updateUserWithToken-testCaseConsume.use, "Wrong User Token Amount After Spending!");
		});
	});

	it("Merchant create 2nd user", function(){
		return Loyalty.deployed().then(function(ins){
			instance=ins;
			return ins.createUser(testCase2ndUser.sendNewUserToken, testCase2ndUser.userPassword, 66557, {from:web3.eth.accounts[1]});
		}).then(()=>{
			return instance.getUsers({from:web3.eth.accounts[0]});
		}).then((data)=>{
			// console.log(JSON.stringify(data));
			secondUserId = parseInt(data[0][1]);
			assert.equal(data[0].length, 2, "2nd User Not Created!");
			assert.equal(data[2][1], testCase2ndUser.sendNewUserToken, "2nd User Wrong Amount Received");
		});
	});

	it("2 User use token at same time", function(){
		return Loyalty.deployed().then(function(ins){
			instance=ins;
			return instance.useToken([firstUserId, secondUserId], [testCase.userPassword, testCase2ndUser.userPassword], testCase2ndUser.use, {from:web3.eth.accounts[5]});
		}).then(()=>{
			return instance.merchantGetToken({from:web3.eth.accounts[5]});
		}).then((amount)=>{
			assert.equal(parseInt(amount), testCaseConsume.toToken + testCaseConsume.use + testCase2ndUser.use, "Wrong Token Received!!!");
			return instance.getUsers({from:web3.eth.accounts[0]});
		}).then((data)=>{
			assert.equal(parseInt(data[2][0]), 0, "First User must be reset");
			return instance.merchantGetToken({from:web3.eth.accounts[5]});
		}).then((amount)=>{
			assert.equal(parseInt(amount), testCaseConsume.toToken + testCaseConsume.use - testCase2ndUser.sendNewUserToken + testCaseConsume.use + testCase2ndUser.use , "Wrong Token Received!!!!");
		});
	});
});
