pragma solidity ^0.4.0;


contract WebOfTrustTokenInterface {
    event Mint(address indexed _owner, bytes32 _tokenID);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}
