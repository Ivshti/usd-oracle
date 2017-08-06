var trustedOracle = artifacts.require("./trustedOracle.sol");

module.exports = function(deployer) {
  deployer.deploy(trustedOracle);
};
