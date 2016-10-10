import pytest


def test_destroying_token(chain, token, token_id, token_owner, get_destroy_data, NULL_TOKEN):
    assert token.call().identityOf(token_id) == 'Piper Merriam'
    assert token.call().ownerOf(token_id) == token_owner
    assert token.call().isTokenOwner(token_owner) is True
    assert token.call().ownedToken(token_owner) == token_id

    destroy_txn_hash = token.transact().destroy(token_id)
    chain.wait.for_receipt(destroy_txn_hash)

    assert token.call().identityOf(token_id) == ''
    assert token.call().ownerOf(token_id) == '0x0000000000000000000000000000000000000000'
    assert token.call().isTokenOwner(token_owner) is False
    assert token.call().ownedToken(token_owner) == NULL_TOKEN

    destroy_data = get_destroy_data(destroy_txn_hash)
    assert destroy_data['args']['_id'] == token_id


def test_cannot_destroy_after_window(chain,
                                     token,
                                     token_id,
                                     token_owner,
                                     get_destroy_data,
                                     set_timestamp):
    # fastforward to the end of the window
    set_timestamp(token.call().END_MINTING())

    assert token.call().identityOf(token_id) == 'Piper Merriam'
    assert token.call().ownerOf(token_id) == token_owner
    assert token.call().isTokenOwner(token_owner) is True
    assert token.call().ownedToken(token_owner) == token_id

    with pytest.raises(ValueError):
        txn_hash = token.transact().destroy(token_id)

    assert token.call().identityOf(token_id) == 'Piper Merriam'
    assert token.call().ownerOf(token_id) == token_owner
    assert token.call().isTokenOwner(token_owner) is True
    assert token.call().ownedToken(token_owner) == token_id


def test_cannot_destroy_if_not_minter(chain,
                                      web3,
                                      token,
                                      token_id,
                                      token_owner,
                                      get_destroy_data,
                                      set_timestamp):
    # fastforward to the end of the window
    set_timestamp(token.call().END_MINTING())

    assert token.call().identityOf(token_id) == 'Piper Merriam'
    assert token.call().ownerOf(token_id) == token_owner
    assert token.call().isTokenOwner(token_owner) is True
    assert token.call().ownedToken(token_owner) == token_id

    assert token.call().minters(web3.eth.accounts[1]) is False

    with pytest.raises(ValueError):
        token.transact({'from': web3.eth.accounts[1]}).destroy(token_id)

    assert token.call().identityOf(token_id) == 'Piper Merriam'
    assert token.call().ownerOf(token_id) == token_owner
    assert token.call().isTokenOwner(token_owner) is True
    assert token.call().ownedToken(token_owner) == token_id
