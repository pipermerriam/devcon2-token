def test_null_token(token, NULL_TOKEN):
    assert token.call().identityOf(NULL_TOKEN) == ''
    assert token.call().ownerOf(NULL_TOKEN) == '0x0000000000000000000000000000000000000000'


def test_owned_token(token, token_owner, token_id):
    assert token.call().identityOf(token_id) == 'Piper Merriam'
    assert token.call().ownerOf(token_id) == token_owner


def test_token_ownership_test(web3, token, token_owner, token_id):
    assert token.call().isTokenOwner(token_owner) is True
    assert token.call().isTokenOwner(web3.eth.accounts[1]) is False
