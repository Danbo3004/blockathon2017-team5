var Loyalty = artifacts.require("./Loyalty.sol");

module.exports = function(deployer, network) {

	if(network == "live"){
		//todo:
	}else if(network == "develop"){

	}else{
		// throw "No config for this network";
	}

	deployer.deploy(Loyalty).then(()=>{
		let ins = Loyalty.at(Loyalty.address);
		console.log("Deployed: "+ins.address);
	});
//*/
};
