pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract StandardERC20Token is ERC20, ERC20Detailed {

    constructor(string memory name, string memory symbol, uint8 decimals, address initialHolder, uint256 amount)
        ERC20Detailed(name, symbol, decimals) public {
        _mint(initialHolder, amount);
    }
  
}
