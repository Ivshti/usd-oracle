#!/usr/bin/env node


var fs = require('fs')
var Web3 = require('web3')
var Tx = require('ethereumjs-tx')
var prompt = require('password-prompt')
var keythereum = require('keythereum')
var minimist = require('minimist')

//var HTTP_PROVIDER = 'http://192.168.0.32:8181'
var HTTP_PROVIDER = 'https://mainnet.infura.io/W0a3PCAj1UfQZxo5AIrv'

var web3 = new Web3(new Web3.providers.HttpProvider(HTTP_PROVIDER))

var price = 4299515020 // low price
var gas = 64988

var oracleAddr = '0x4470bb87d77b963a013db939be332f927f2b992e'
var oracleWallet = '0xa3B83839ae676DF0A92788DF1D545c3bB96B5ffC'


var oracleAbi = JSON.parse(fs.readFileSync('./build-contract/oracleTrusted-bundled_sol_trustedOralce.abi').toString())
var oracle = web3.eth.contract(oracleAbi).at(oracleAddr)

console.log(oracleAbi)
return;

// TODO: from keystore file
if (! process.env.PRIVKEY) { console.log('no PRIVKEY'); process.exit(1) } 
var privateKey = new Buffer(process.env.PRIVKEY, 'hex')

function processLine(line, lineIdx, cb) {
	var to = line[iEthAddr]

	var origAmount =parseFloat(line[iADXAmount])
	var amount = Math.floor(( origAmount - (substractList[to] || 0) )*adxMultiplier)

	totalAmount += amount;

	var payloadData = adxToken.transfer.getData(to, amount)

	console.log('['+lineIdx+'] sending '+amount+' to '+to)

	var rawTx = {
		nonce: web3.toHex(nonce),
		gasPrice: web3.toHex(price),
		gasLimit: web3.toHex(gas),
		to: adxSCAddr,
		from: adxBountyWallet,
		value: web3.toHex(0),
		data: payloadData,
	};

	var tx = new Tx(rawTx)
	tx.sign(privateKey)

	var serializedTx = tx.serialize()

	console.log('sending tx:', serializedTx.toString('hex'))
	
	if (process.env.REAL_RUN) web3.eth.sendRawTransaction('0x'+serializedTx.toString('hex'), function (err, hash) {
		if (hash) nonce++;
		cb(err, hash)
	})
	else cb()
}
