#!/usr/bin/env bash

mkdir -p build-contract
./bundle.sh ./contracts/trustedOracle.sol > oracleTrusted-bundled.sol
solcjs --optimize --bin -o build-contract oracleTrusted-bundled.sol
solcjs --optimize --abi -o build-contract oracleTrusted-bundled.sol
