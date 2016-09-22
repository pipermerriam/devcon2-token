# Devcon2 Token @ [`0x0a43edfe106d295e7c1e591a4b04b5598af9474c`](https://etherscan.io/address/0x0a43edfe106d295e7c1e591a4b04b5598af9474c)

An token issued to each person attending Devcon2.

The tokens are housed in an [ERC20](https://github.com/ethereum/EIPs/issues/20)
compliant contract. 

* Each address may own exactly 1 token.
* Each token is associated with a string value, referred to as the identity.  This
  value is immutable.

The contract is permissioned to allow minting of tokens only through 8AM
on Thursday morning, Shanghai time.  After this period no new tokens will ever
be mintable and the total supply will be forever fixed.


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

The contract is ERC20 compliant, but it somewhat abuses the specification.
Your *balance* is actually the integer representation of the
`sha3(identity_string)`.  If you want to transfer your token to a different
address and you are using something that supports the ERC20 standard then the
`_value` parameter must to your full account balance for the transfer to work.

Each address may only ever be in posession of one token so you cannot send your
token to an account that already has a token.


## Additional Functions

The contract also implements the following functions which mirror their ERC20
functions except they use a `bytes32` for the value.

* `function transfer(address _to, bytes32 _value) returns (bool success)`
* `function transferFrom(address _from, address _to, bytes32 _value) returns (bool success)`
* `function approve(address _spender, bytes32 _value) returns (bool success)`


And the following events which mirror the ERC events.

* `event Transfer(address indexed _from, address indexed _to, bytes32 _value)`
* `event Approval(address indexed _owner, address indexed _spender, bytes32 _value)`


In addition, these extra functions are available for querying information about
the tokens.


* `function isTokenOwner(address _owner) constant returns (bool)`
* `function identityOf(bytes32 _id) constant returns (string identity)`
* `function ownerOf(bytes32 _id) constant returns (address owner)`
