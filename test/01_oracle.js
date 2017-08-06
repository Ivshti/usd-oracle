var trustedOracle = artifacts.require("./trustedOracle.sol")
var Promise = require('bluebird')

contract('trustedOracle', function(accounts) {
	var accOne = web3.eth.accounts[0]

	it("initialize contract", function() {
		return trustedOracle.new().then(function(_oracle) {
			console.log(_oracle)
		})
	});

})
