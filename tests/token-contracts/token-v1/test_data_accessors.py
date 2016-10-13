def test_null_token(token_v1, NULL_TOKEN):
    token = token_v1
    assert token.call().identityOf(NULL_TOKEN) == ''
    assert token.call().ownerOf(NULL_TOKEN) == '0x0000000000000000000000000000000000000000'


def test_owned_token(token_v1, token_v1_owner, token_id):
    token = token_v1
    token_owner = token_v1_owner
    assert token.call().identityOf(token_id) == 'Piper Merriam'
    assert token.call().ownerOf(token_id) == token_owner


def test_token_ownership_test(web3, token_v1, token_v1_owner, token_id):
    token = token_v1
    token_owner = token_v1_owner
    assert token.call().isTokenOwner(token_owner) is True
    assert token.call().isTokenOwner(web3.eth.coinbase) is False
