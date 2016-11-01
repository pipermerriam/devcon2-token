import pytest

from web3.utils.encoding import decode_hex


def test_transfering_token(chain,
                           web3,
                           token_v1,
                           token_v1_owner,
                           token_id,
                           get_transfer_data,
                           NULL_TOKEN):
    token = token_v1
    assert token.call().isTokenOwner(token_v1_owner) is True
    assert token.call().isTokenOwner(web3.eth.accounts[3]) is False
    assert token.call().ownedToken(token_v1_owner) == token_id
    assert token.call().ownedToken(web3.eth.accounts[3]) == NULL_TOKEN

    transfer_txn_hash = token.transact({
        'from': token_v1_owner,
    }).transfer(web3.eth.accounts[3], token_id)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token.call().isTokenOwner(token_v1_owner) is False
    assert token.call().isTokenOwner(web3.eth.accounts[3]) is True
    assert token.call().ownedToken(token_v1_owner) == NULL_TOKEN
    assert token.call().ownedToken(web3.eth.accounts[3]) == token_id

    transfer_data = get_transfer_data(transfer_txn_hash)
    assert transfer_data['args']['_from'] == token_v1_owner
    assert transfer_data['args']['_to'] == web3.eth.accounts[3]
    assert transfer_data['args']['_value'] == token_id


def test_cannot_transfer_token_not_owned_by_you(chain,
                                                web3,
                                                token_v1,
                                                token_v1_owner,
                                                token_id,
                                                get_transfer_data,
                                                NULL_TOKEN):
    token = token_v1
    assert token.call().isTokenOwner(token_v1_owner) is True
    assert token.call().isTokenOwner(web3.eth.accounts[4]) is False
    assert token.call().ownedToken(token_v1_owner) == token_id
    assert token.call().ownedToken(web3.eth.accounts[3]) == NULL_TOKEN

    transfer_txn_hash = token.transact({
        'from': web3.eth.accounts[3],
    }).transfer(web3.eth.accounts[4], token_id)
    chain.wait.for_receipt(transfer_txn_hash)

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)

    assert token.call().isTokenOwner(token_v1_owner) is True
    assert token.call().isTokenOwner(web3.eth.accounts[4]) is False
    assert token.call().ownedToken(token_v1_owner) == token_id
    assert token.call().ownedToken(web3.eth.accounts[3]) == NULL_TOKEN


def test_cannot_transfer_to_other_owner(chain,
                                        web3,
                                        token_v1,
                                        token_v1_owner,
                                        token_id,
                                        other_token_id,
                                        other_token_v1_owner,
                                        get_transfer_data):
    token = token_v1
    other_token_owner = other_token_v1_owner

    assert token.call().isTokenOwner(token_v1_owner) is True
    assert token.call().isTokenOwner(other_token_owner) is True
    assert token.call().ownedToken(token_v1_owner) == token_id
    assert token.call().ownedToken(other_token_owner) == other_token_id

    transfer_txn_hash = token.transact({
        'from': token_v1_owner,
    }).transfer(other_token_owner, token_id)
    chain.wait.for_receipt(transfer_txn_hash)

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)

    assert token.call().isTokenOwner(token_v1_owner) is True
    assert token.call().isTokenOwner(other_token_owner) is True
    assert token.call().ownedToken(token_v1_owner) == token_id
    assert token.call().ownedToken(other_token_owner) == other_token_id


def test_cannot_transfer_null_token(chain,
                                    web3,
                                    token_v1,
                                    token_v1_owner,
                                    token_id,
                                    get_transfer_data,
                                    NULL_TOKEN):
    token = token_v1

    transfer_txn_hash = token.transact({
        'from': token_v1_owner,
    }).transfer(web3.eth.accounts[3], NULL_TOKEN)
    chain.wait.for_receipt(transfer_txn_hash)

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)

    assert token.call().isTokenOwner(token_v1_owner) is True
    assert token.call().isTokenOwner(web3.eth.accounts[3]) is False
    assert token.call().ownedToken(token_v1_owner) == token_id
    assert token.call().ownedToken(web3.eth.accounts[3]) == NULL_TOKEN


def test_cannot_transfer_unknown_token(chain,
                                       web3,
                                       token_v1,
                                       token_v1_owner,
                                       unknown_token_id,
                                       get_transfer_data,
                                       NULL_ADDRESS):
    token = token_v1
    transfer_txn_hash = token.transact({
        'from': token_v1_owner,
    }).transfer(web3.eth.accounts[3], unknown_token_id)
    chain.wait.for_receipt(transfer_txn_hash)

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)

    assert token.call().identityOf(unknown_token_id) == ''
    assert token.call().ownerOf(unknown_token_id) == NULL_ADDRESS
