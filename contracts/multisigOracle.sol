pragma solidity ^0.4.13;

import "../zeppelin-solidity/contracts/ownership/Ownable.sol";

contract multisigOracle is Ownable {
	mapping (uint => uint) pricePoints;
	uint public lastTimestamp;

	address delegate;

	modifier onlyDelegate() {
		require(msg.sender == delegate);
		_;
	}

/*	function changeDelegate()
		onlyMultisig
	{

	}
*/
	function multisigOracle() Ownable() {
		delegate = msg.sender;
	}

	function submitPrice(uint _timestamp, uint _weiForCent)
		onlyDelegate
	{
		pricePoints[_timestamp] = _weiForCent;
		if (_timestamp > lastTimestamp) lastTimestamp = _timestamp;
	}

	function getWeiForCent(uint _timestamp)
		public
		constant
		returns (uint)
	{
		uint stamp = _timestamp;
		if (stamp == 0) stamp = lastTimestamp;
		return pricePoints[stamp];
	}
}