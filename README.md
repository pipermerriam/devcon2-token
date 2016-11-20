# Devcon2 Token @ [`0xdd94De9cFE063577051A5eb7465D08317d8808B6`](https://etherscan.io/token/devcon2)

[Token Explorer](http://devcon2-token.com/)

An token issued to each person attending Devcon2.

The tokens are housed in an [ERC20](https://github.com/ethereum/EIPs/issues/20)
compliant contract. 

* Each address may own exactly 1 token.
* Each token is associated with a string value, referred to as the identity.  This
  value is immutable.

The contract is permissioned to allow minting of tokens only through 8AM
on Thursday morning, Shanghai time.  After this period no new tokens will ever
be mintable and the total supply will be forever fixed.


# Projects and Contracts

This is a list of known projects and contracts that leverage the data from this
contract.

* ETC Survey @ [`0xf2602d298541cd9d1fd742d78b2b1cd394d2ce3b`](https://etherscan.io/address/0xf2602d298541cd9d1fd742d78b2b1cd394d2ce3b)


# Why

It's an experiment to see what people do with it and what people build with it.


# How to get your token.

The contract includes a hard cut-off for token minting that closed at 8AM on
September 22nd, 2016 Shanghai time.

Tokens were issued at the Devcon2 conference in Shanghai.


# Source Code Verification

The code was compiled with the following solc:

```
solc, the solidity compiler commandline interface
Version: 0.3.6-0/Release-Darwin/appleclang
```

And linked against TokenLib @ [`0xabf65a51c7adc3bdef0adf8992884be38072c184`](https://etherscan.io/address/0xabf65a51c7adc3bdef0adf8992884be38072c184)


# ERC20 Compliance

The contract is ERC20 compliant with the additional constraint that each
address may only ever be in posession of one token.  This means that you
transferring your token to an account that already has a token will fail.


## Additional Functions

The contract also implements the following functions which mirror their ERC20
functions except they exclude the value parameters since it is always `1`.

* `function transfer(address _to) returns (bool success)`
* `function transferFrom(address _from, address _to) returns (bool success)`
* `function approve(address _spender) returns (bool success)`


And the following events which mirror the ERC events.

* `event Transfer(address indexed _from, address indexed _to, bytes32 _value)`
* `event Approval(address indexed _owner, address indexed _spender, bytes32 _value)`


In addition, these extra functions are available for querying information about
the tokens.


* `function isTokenOwner(address _owner) constant returns (bool)`
* `function ownerOf(bytes32 _id) constant returns (address owner)`
* `function tokenId(address _owner) constant returns (bytes32 tokenID)`
* `function upgrade() public returns (bool success)`
* `function proxyUpgrade(address _owner, address _newOwner, bytes signature) public returns (bool)`
* `function upgradeCount() constant returns (uint256 _amount)`
* `function isTokenUpgraded(bytes32 _tokenID) constant returns (bool isUpgraded)`


# Examples

Examples of how you can build on top of this contract.

> These examples are *not* intended to be an introduction to Solidity.  If you would like to learn more about the Solidity programming language I recommend heading over to the [Solidity Documentation](http://solidity.readthedocs.org/)

## Survey

In this example we will build a contract designed to survey the token holders.

* The contract represents a single question we wish to ask the Devcon2 Token
  holders.
* The survey remains open for responses for a fixed duration of time.
* Each token holder may respond exactly once to the survey.
* Each question has a fixed number of response options.

First we need an interface contract.  For these examples we'll use the
following barebones one, but you should take a look at the
[`TokenInterface.sol'](./contracts/TokenInterface.sol) contract in the
`./contracts/` directory of this repository for a more complete interface.


```javascript
contract Devcon2Interface {
    function isTokenOwner(address _owner) constant returns (bool);
    function ownedToken(address _owner) constant returns (bytes32 tokenId);
}
```

Now lets look at our full Survey contract.


```javascript
contract Survey {
    Devcon2Interface constant devcon2Token = Devcon2Interface(0x0a43edfe106d295e7c1e591a4b04b5598af9474c);

    // Mapping from tokenId to boolean noting whether this token has responded.
    mapping (bytes32 => bool) public hasResponded;
    
    // The timestamp when this survey will end.
    uint public surveyEndAt;

    // The question we wish to ask the token holders.
    string public question;

    // An array of answer options.
    bytes32[] public responseOptions;

    // Helper for accessing the number of options programatically.
    uint public numResponseOptions;

    // Histogram of the responses as a mapping from option index to number of
    // responses for that option.
    mapping (uint => uint) public responseCounts;

    // Total number of responses.
    uint public numResponses;

    // Event for logging response submissions.
    event Response(bytes32 indexed tokenId, uint responseId);

    /// @dev Sets up the survey contract
    /// @param tokenAddress Address of Devcon2 Identity Token contract.
    /// @param duration Integer duration the survey should remain open and accept answers.
    /// @param _question String the survey question.
    /// @param _responseOptions Array of Bytes32 allowed survey response options.
    function Survey(uint duration, string _question, bytes32[] _responseOptions) {
        question = _question;
        numResponseOptions = _responseOptions.length;
        for (uint i=0; i < numResponseOptions; i++) {
            responseOptions.push(_responseOptions[i]);
        }
        surveyEndAt = now + duration;
    }

    /// @dev Respond to the survey
    /// @param responseId Integer index of the response option being submitted.
    function respond(uint responseId) returns (bool) {
        // Check our survey hasn't ended.
        if (now >= surveyEndAt) return false;

        // Only allow token holders
        if (!devcon2Token.isTokenOwner(msg.sender)) return false;

        // Each token has a unique bytes32 identifier.  Since tokens are
        // transferable, we want to use this value instead of the owner address
        // for preventing the same owner from responding multiple times.
        var tokenId = devcon2Token.ownedToken(msg.sender);

        // Sanity check.  The 0x0 token is invalid which means something went
        // wrong.
        if (tokenId == 0x0) throw;

        // verify that this token has not yet responded.
        if (hasResponded[tokenId]) return false;

        // verify the response is valid
        if (responseId >= responseOptions.length) return false;

        responseCounts[responseId] += 1;

        // log the response.
        Response(tokenId, responseId);

        // Mark this token as having responded to the question.
        hasResponded[tokenId] = true;

        // increment the response counter
        numResponses += 1;
    }
}
```

The *important* parts are the following portions of the `respond(...)` function.

```javascript
    function respond(uint responseId) returns (bool) {
        ...
        // Only allow token holders
        if (!devcon2Token.isTokenOwner(msg.sender)) return false;

        // Each token has a unique bytes32 identifier.  Since tokens are
        // transferable, we want to use this value instead of the owner address
        // for preventing the same owner from responding multiple times.
        var tokenId = devcon2Token.ownedToken(msg.sender);

        // Sanity check.  The 0x0 token is invalid which means something went
        // wrong.
        if (tokenId == 0x0) throw;

        // verify that this token has not yet responded.
        if (hasResponded[tokenId]) return false;

        ...

        // Mark this token as having responded to the question.
        hasResponded[tokenId] = true;

        ...
    }
```

When you want to restrict access based on Devcon2 tokens you will want to do so
based on the `TokenId` rather than the address that owns the token.  The reason
for this is that Devcon2 tokens are transferable, and thus, if you restrict
based on address, a token owner could then transfer the token to a new address
and respond a second time.

In the lines above the following things occur.

1. Check whether the current address is a token owner.
2. Retrieve the `tokenId` for the token that address owns.
3. Check that the `tokenId` is not somehow `0x0`.
4. Check that a response has not yet been recorded for this `tokenId`.
4. Record a response for the `tokenId`.

> If you are paying really close attention you may notice that step 2 and 3 are effectively duplicates of step 1.  This my personal style for Solidity development.  I prefer readability over optimization and believe that it produces safer contracts with fewer bugs.

You can query whether a given address is a token holder using the
`isTokenOwner(address _owner)` function which returns `true` or `false`
indicating whether the address owns a Devcon2 Identity token.

You can retrieve the token id for a given address using the
``ownedToken(address _owner)`` function.  It is important to be sure that the
returned value is not `0x0` which will be the case if `_owner` is not a token
holder.
