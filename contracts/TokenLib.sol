library TokenLib {
    struct Token {
        string identity;
        address owner;
    }

    function id(Token storage self) returns (bytes32) {
        return sha3(self.identity);
    }

    function generateId(string identity) returns (bytes32) {
        return sha3(identity);
    }

    event Transfer(address indexed _from, address indexed _to, bytes32 _value);
    event Approval(address indexed _owner, address indexed _spender, bytes32 _value);

    function logApproval(address _owner, address _spender, bytes32 _value) {
        Approval(_owner, _spender, _value);
    }

    function logTransfer(address _from, address _to, bytes32 _value) {
        Transfer(_from, _to, _value);
    }
}
