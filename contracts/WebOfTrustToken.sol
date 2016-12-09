pragma solidity ^0.4.0;


import {WebOfTrustTokenInterface} from "./WebOfTrustTokenInterface.sol";
import {IndividualityTokenRootInterface} from "./IndividualityTokenRootInterface.sol";


contract WebOfTrustToken is WebOfTrustTokenInterface {
    IndividualityTokenRootInterface parentToken;

    // how many tokens may each original token holder issue?
    uint issuanceAllowance;

    // owner => token
    mapping (address => bytes32) ownerToToken;

    // token => owner
    mapping (bytes32 => address) tokenToOwner;

    // owner => spender => token
    mapping (address => mapping (address => bytes32)) approvals;

    uint tokenCount;

    function WebOfTrustToken(address _parentToken, uint _issuanceAllowance) {
        parentToken = IndividualityTokenRootInterface(_parentToken);
        issuanceAllowance = _issuanceAllowance;
    }

    /*
     *  ERC20 functions
     */


    /*
     *  Web of Trust functions
     */
    function claimToken(bytes32 tokenID) {
    }

    function issueToken(address recipient, string proof) {
    }
}
