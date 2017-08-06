var fs = require("fs")
var Web3 = require("web3")

var HTTP_PROVIDER = 'https://mainnet.infura.io/W0a3PCAj1UfQZxo5AIrv'

var web3 = new Web3(new Web3.providers.HttpProvider(HTTP_PROVIDER))

var oracleAbi = JSON.parse(fs.readFileSync('./build-contract/oracleTrusted-bundled_sol_trustedOracle.abi').toString())
var contract = web3.eth.contract(oracleAbi);


console.log(contract.new.getData())