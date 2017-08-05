pragma solidity ^0.4.13;

import "../zeppelin-solidity/contracts/ownership/Ownable.sol";

contract trustedOralce is Ownable {
	mapping (uint => uint) pricePoints;
	uint public lastTimestamp;

	function submitPrice(uint _timestamp, uint _weiForCent)
		onlyOwner
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