import {TokenInterface} from "contracts/TokenInterface.sol";


contract Devcon2TokenAuthorized {
    TokenInterface constant devcon2Token = TokenInterface(0xabf65a51c7adc3bdef0adf8992884be38072c184);

    modifier onlyDevcon2TokenHolder { if(!isTokenOwner(msg.sender)) throw; _; }
}


contract MyAuthorizedContract is Devcon2TokenAuthorized {
    function purchase() onlyDevcon2TokenHolder returns (bool success) {
        ...;
    }
}
