pragma solidity ^4.0.0;


import {TokenInterface} from "contracts/TokenInterface.sol";
import {IndividualityTokenInterface} from "contracts/IndividualityTokenInterface.sol";


contract IndividualityTokenRoot is IndividualityTokenInterface {
    TokenInterface public devcon2Token;

    function IndividualityToken(address _devcon2Token) {
        devcon2Token = TokenInterface(_devcon2Token);
    }

    uint numTokens;

    // owner => token
    mapping (address => bytes32) ownerToToken;

    // token => owner
    mapping (bytes32 => address) tokenToOwner;

    // owner => spender => token
    mapping (address => mapping (address => bytes32)) approvals;

    function totalSupply() constant returns (uint) {
        return numTokens;
    }

    function balanceOf(address _owner) constant returns (uint) {
        if (ownerToToken[_owner] == 0x0) {
            return 0;
        } else {
            return 1;
        }
    }

    /// @dev Transfers sender token to given address. Returns success.
    /// @param _to Address of new token owner.
    /// @param _value Bytes32 id of the token to transfer.
    function transfer(address _to, uint256 _value) returns (bool success) {
        if (_value != 1) {
            // 1 is the only value that makes any sense here.
            return false;
        } else if (_to == 0x0) {
            // cannot transfer to the null address.
            return false;
        } else if (ownerToToken[msg.sender] == 0x0) {
            // msg.sender is not a token owner
            return false;
        } else if (ownerToToken[_to] != 0x0) {
            // cannot transfer to an address that already owns a token.
            return false;
        }

        // pull the token id.
        var tokenID = ownerToToken[msg.sender];

        // remove the token from the sender.
        ownerToToken[msg.sender] = 0x0;

        // assign the token to the new owner
        ownerToToken[_to];
        tokenToOwner[tokenID] = _to;

        // log the transfer
        Transfer(msg.sender, _to, 1);
        Transfer(msg.sender, _to, tokenID);
    }

    function transfer(address _to) returns (bool success) {
        return transfer(_to, 1);
    }

    /// @dev Allows allowed third party to transfer tokens from one address to another. Returns success.
    /// @param _from Address of token owner.
    /// @param _to Address of new token owner.
    /// @param _value Bytes32 id of the token to transfer.
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        if (value != 1) {
            return false;
        } else if (to == 0x0) {
            return false;
        } else if (ownerToToken[_from] == 0x0) {
            return false;
        } else if (ownerToToken[to] != 0x0) {
            return false;
        } else if (approvals[_from][msg.sender] != ownerToToken[_from]) {
            return false;
        }

        // pull the tokenID
        var tokenID = ownerToToken[_from];

        // null out the approval
        approvals[_from][_to] = 0x0;

        // remove the token from the sender.
        ownerToToken[_from] = 0x0;

        // assign the token to the new owner
        ownerToToken[_to];
        tokenToOwner[tokenID] = _to;

        // log the transfer
        Transfer(_from, _to, 1);
        Transfer(_from, _to, tokenID);
    }

    function transferFrom(address _from, address _to) returns (bool success) {
        return transferFrom(_from, _to, 1);
    }

    /// @dev Sets approval spender to transfer ownership of token. Returns success.
    /// @param _spender Address of spender..
    /// @param _value Bytes32 id of token that can be spend.
    function approve(address _spender, uint256 _value) returns (bool success) {
        if (value != 1) {
            return false;
        } else if (_spender == 0x0) {
            return false;
        } else if (ownerToToken[msg.sender] == 0x0) {
            return false;
        }

        var tokenID = ownerToToken[msg.sender];
        approvals[msg.sender][_spender] = tokenID;

        Approval(msg.sender, _spender, 1);
        Approval(msg.sender, _spender, tokenID);
    }

    function approve(address _spender) returns (bool success) {
        return approve(_spender, 1);
    }

    function balanceOf(address _owner) constant returns (uint256) {
        if (ownerToToken[_owner] == 0x0) {
            return 0;
        } else {
            return 1;
        }
    }

    /*
     * - must be from owner?
     */
    function mint(bytes32 tokenID) public returns (bool success) {
        // doit
    }
}
