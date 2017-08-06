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

var args = minimist(process.argv)

var oracleAddr = args.oracle || process.env.ORACLE_ADDR


var oracleAbi = JSON.parse(fs.readFileSync('./build-contract/oracleTrusted-bundled_sol_trustedOracle.abi').toString())
var contract = web3.eth.contract(oracleAbi);



var jsonFile = args._[2]
if (! jsonFile) endWithErr('no json file')

var keyStore
try {
	keyStore = JSON.parse(fs.readFileSync(jsonFile).toString())
} catch(e) { endWithErr(e) }

var addr = '0x'+keyStore.address.toLowerCase()


prompt('keystore password: ', { method: 'hide' })
.then(function(pwd) {
	prepareForSig(keyStore, pwd)
}).catch(endWithErr)


var privateKey
function prepareForSig(keyStore, pwd) {
	privateKey = keythereum.recover(pwd, keyStore)

	console.log('private key decrypted successfully')

	if (oracleAddr) {
		var oracle = contract.at(oracleAddr)
		startSubmitting(oracle)
	}
	else deployOracle()
}

function deployOracle() 
{
	var data = fs.readFileSync('./build-contract/oracleTrusted-bundled_sol_trustedOracle.bin').toString()
	var payloadData = contract.new.getData({ from: addr, data: data })

	var gasToDeploy = web3.eth.estimateGas({data: '0x'+payloadData}) + 20000

	sendTx(payloadData, '0x0000000000000000000000000000000000000000', addr, gasToDeploy, function(err, res) {
		if (err) endWithErr(err)
		console.log('oracle deployed, tx: ', res)
	})

}

function startSubmitting() {
	submitPrice(oracle, function (err, hash) {
		if (err) endWithErr(err)
		else {
			console.log('successfully sent, tx hash: '+hash)
			setTimeout(startSubmitting, 5*60*1000)
		}
	})
}

function submitPrice(oracle, done)
{
	//Math.pow(10,18)/(usdPerEth * 100)

	var payloadData = oracle.submitPrice.getData(37819777626752)
	sendTx(payloadData, oracle.address, addr, gas, done)
}


///
/// HELPERS
///

function sendTx(payload, to, from, gas, cb) {
	var nonce = web3.eth.getTransactionCount(addr)

	var rawTx = {
		nonce: web3.toHex(nonce),
		gasPrice: web3.toHex(price),
		gasLimit: web3.toHex(gas),
		to: to,
		from: from,
		value: web3.toHex(0),
		data: payload,
	};

	var tx = new Tx(rawTx)
	tx.sign(privateKey)

	var serializedTx = tx.serialize()

	console.log('sending tx:', serializedTx.toString('hex'))
		
	web3.eth.sendRawTransaction('0x'+serializedTx.toString('hex'), cb)
}

function endWithErr(err) {
	console.error(err)
	process.exit(1)
}
