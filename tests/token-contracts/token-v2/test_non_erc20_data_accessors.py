def test_owner_of_for_upgraded_token(token_v2, token_v1_owner, upgraded_token):
    assert token_v2.call().isTokenUpgraded(upgraded_token) is True
    assert token_v2.call().ownerOf(upgraded_token) == token_v1_owner


def test_owner_of_for_not_upgraded(token_v2, token_v1_owner, token_id):
    assert token_v2.call().isTokenUpgraded(token_id) is False
    assert token_v2.call().ownerOf(token_id) == token_v1_owner


def test_owner_of_doesnt_match_upgraded_and_transferred(chain,
                                                        web3,
                                                        token_v2,
                                                        token_v1_owner,
                                                        upgraded_token):
    chain.wait.for_receipt(token_v2.transact({
        'from': token_v1_owner,
    }).transfer(web3.eth.accounts[3]))

    assert token_v2.call().ownerOf(upgraded_token) == web3.eth.accounts[3]


def test_owner_of_null_token_is_null_address(token_v2, NULL_TOKEN, NULL_ADDRESS):
    assert token_v2.call().ownerOf(NULL_TOKEN) == NULL_ADDRESS


def test_token_id_for_null_address_is_null_token(token_v2, NULL_ADDRESS, NULL_TOKEN):
    assert token_v2.call().tokenId(NULL_ADDRESS) == NULL_TOKEN


def test_token_id_for_upgraded_token(token_v2, token_v1_owner, upgraded_token):
    assert token_v2.call().tokenId(token_v1_owner) == upgraded_token


def test_token_id_for_non_upgraded(token_v2, token_v1_owner, token_id):
    assert token_v2.call().tokenId(token_v1_owner) == token_id


def test_token_id_for_upgraded_and_transferred(chain,
                                               web3,
                                               token_v2,
                                               token_v1_owner,
                                               upgraded_token):
    chain.wait.for_receipt(token_v2.transact({
        'from': token_v1_owner,
    }).transfer(web3.eth.accounts[3]))

    assert token_v2.call().tokenId(token_v1_owner) == NULL_TOKEN
    assert token_v2.call().tokenId(web3.eth.accounts[3]) == upgraded_token
