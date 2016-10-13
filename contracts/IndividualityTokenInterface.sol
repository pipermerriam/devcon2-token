pragma solidity ^4.0.0;


contract IndividualityTokenInterface {
    /*
     *  Events
     */
    event Mint(address indexed _to, bytes32 _id);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event Transfer(address indexed _from, address indexed _to, bytes32 _id);
    event Approval(address indexed _owner, address indexed _spender, bytes32 _id);

    /*
     *  Minting
     */
    /// @dev Mints a new token.
    /// @param _to Address of token owner.
    /// @param _identity String for owner identity.
    function mint(address _to) returns (bool success);

    /*
     *  Read and write storage functions
     */

    /// @dev Return the number of tokens
    function totalSupply() returns (uint supply);

    /// @dev Transfers sender token to given address. Returns success.
    /// @param _to Address of new token owner.
    /// @param _value Bytes32 id of the token to transfer.
    function transfer(address _to, uint256 _value) returns (bool success);
    function transfer(address _to) returns (bool success);

    /// @dev Allows allowed third party to transfer tokens from one address to another. Returns success.
    /// @param _from Address of token owner.
    /// @param _to Address of new token owner.
    /// @param _value Bytes32 id of the token to transfer.
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
    function transferFrom(address _from, address _to) returns (bool success);

    /// @dev Sets approval spender to transfer ownership of token. Returns success.
    /// @param _spender Address of spender..
    /// @param _value Bytes32 id of token that can be spend.
    function approve(address _spender, uint256 _value) returns (bool success);
    function approve(address _spender) returns (bool success);

    /*
     * Read storage functions
     */
    /// @dev Returns id of token owned by given address (encoded as an integer).
    /// @param _owner Address of token owner.
    function balanceOf(address _owner) constant returns (uint256 balance);

    /// @dev Returns the token id that may transfer from _owner account by _spender..
    /// @param _owner Address of token owner.
    /// @param _spender Address of token spender.
    function allowance(address _owner, address _spender) constant returns (uint256 remaining);

    /*
     *  Extra non ERC20 functions
     */
    /// @dev Returns whether the address owns a token.
    /// @param _owner Address to check.
    function isTokenOwner(address _owner) constant returns (bool);

    /// @dev Returns the address of the owner of the given token id.
    /// @param _id Bytes32 id of token to lookup.
    function ownerOf(bytes32 _id) constant returns (address owner);

    /// @dev Returns the token ID for the given address or 0x0 if they are not a token owner.
    /// @param _owner Address of the owner to lookup.
    function tokenId(address _owner) constant returns (address owner);
}
