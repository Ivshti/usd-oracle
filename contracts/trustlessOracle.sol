pragma solidity ^0.4.13;

import "../zeppelin-solidity/contracts/ownership/Ownable.sol";

// Not used currently because the design/idea sux
// There is more economic incentive in paying the average eth tx fee to submit false price points to manipulate the system, rather than not to do so
// so it needs more game theory work


contract USDOracleTrustless is Ownable {
	struct PricePoint {
		mapping (uint => uint) priceWeights; // price -> votes 
		uint[] prices;
	}

	mapping (uint => PricePoint) pricepoints; // timestamp -> pricepoint

	function submitPrice()
		onlyOwner
	{
	}
}
