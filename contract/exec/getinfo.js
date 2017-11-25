// Specifically request an abstraction for MetaCoin
var Loyalty = artifacts.require("Loyalty");

module.exports = function(callback) {

	Loyalty.deployed().then(function(ins){

		var event = ins.valueChanged({fromBlock: 0, toBlock: 'latest'});
	    event.watch(function(error, response)
	    {
	       	console.log("valueChanged "+JSON.stringify(response.args));
	       	//
			var fs = require('fs');
			var stream = fs.createWriteStream("src/data/"+response.args.uid+".txt");
				stream.once('open', function(fd) {
				stream.write(response.args.crrAmount+"");
				stream.end();
			});
	    });
	});

}//end module