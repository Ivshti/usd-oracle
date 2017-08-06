var oracleAbi = JSON.parse(fs.readFileSync('./build-contract/oracleTrusted-bundled_sol_trustedOralce.abi').toString())
var contract = web3.eth.contract(abi);
