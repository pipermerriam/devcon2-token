import pytest

from web3.utils.encoding import decode_hex


def test_transfering_token(chain, web3, token, token_id, get_transfer_data, NULL_TOKEN):
    assert token.call().isTokenOwner(web3.eth.coinbase) is True
    assert token.call().isTokenOwner(web3.eth.accounts[1]) is False
    assert token.call().ownedToken(web3.eth.coinbase) == token_id
    assert token.call().ownedToken(web3.eth.accounts[1]) == NULL_TOKEN

    transfer_txn_hash = token.transact().transfer(web3.eth.accounts[1], token_id)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token.call().isTokenOwner(web3.eth.coinbase) is False
    assert token.call().isTokenOwner(web3.eth.accounts[1]) is True
    assert token.call().ownedToken(web3.eth.coinbase) == NULL_TOKEN
    assert token.call().ownedToken(web3.eth.accounts[1]) == token_id

    transfer_data = get_transfer_data(transfer_txn_hash)
    assert transfer_data['args']['_from'] == web3.eth.coinbase
    assert transfer_data['args']['_to'] == web3.eth.accounts[1]
    assert transfer_data['args']['_value'] == token_id


def test_cannot_transfer_token_not_owned_by_you(chain,
                                                web3,
                                                token,
                                                token_id,
                                                get_transfer_data,
                                                NULL_TOKEN):
    assert token.call().isTokenOwner(web3.eth.coinbase) is True
    assert token.call().isTokenOwner(web3.eth.accounts[1]) is False
    assert token.call().ownedToken(web3.eth.coinbase) == token_id
    assert token.call().ownedToken(web3.eth.accounts[1]) == NULL_TOKEN

    transfer_txn_hash = token.transact({'from': web3.eth.accounts[2]}).transfer(web3.eth.accounts[1], token_id)
    chain.wait.for_receipt(transfer_txn_hash)

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)

    assert token.call().isTokenOwner(web3.eth.coinbase) is True
    assert token.call().isTokenOwner(web3.eth.accounts[1]) is False
    assert token.call().ownedToken(web3.eth.coinbase) == token_id
    assert token.call().ownedToken(web3.eth.accounts[1]) == NULL_TOKEN


def test_cannot_transfer_to_other_owner(chain,
                                        web3,
                                        token,
                                        token_id,
                                        other_token_id,
                                        other_token_owner,
                                        get_transfer_data):
    assert token.call().isTokenOwner(web3.eth.coinbase) is True
    assert token.call().isTokenOwner(other_token_owner) is True
    assert token.call().ownedToken(web3.eth.coinbase) == token_id
    assert token.call().ownedToken(other_token_owner) == other_token_id

    transfer_txn_hash = token.transact().transfer(other_token_owner, token_id)
    chain.wait.for_receipt(transfer_txn_hash)

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)

    assert token.call().isTokenOwner(web3.eth.coinbase) is True
    assert token.call().isTokenOwner(other_token_owner) is True
    assert token.call().ownedToken(web3.eth.coinbase) == token_id
    assert token.call().ownedToken(other_token_owner) == other_token_id


def test_cannot_transfer_null_token(chain,
                                    web3,
                                    token,
                                    token_id,
                                    get_transfer_data,
                                    NULL_TOKEN):
    transfer_txn_hash = token.transact().transfer(web3.eth.accounts[1], NULL_TOKEN)
    chain.wait.for_receipt(transfer_txn_hash)

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)

    assert token.call().isTokenOwner(web3.eth.coinbase) is True
    assert token.call().isTokenOwner(web3.eth.accounts[1]) is False
    assert token.call().ownedToken(web3.eth.coinbase) == token_id
    assert token.call().ownedToken(web3.eth.accounts[1]) == NULL_TOKEN


def test_cannot_transfer_unknown_token(chain,
                                       web3,
                                       token,
                                       unknown_token_id,
                                       get_transfer_data):
    transfer_txn_hash = token.transact().transfer(web3.eth.accounts[1], unknown_token_id)
    chain.wait.for_receipt(transfer_txn_hash)

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)

    assert token.call().identityOf(unknown_token_id) == ''
    assert token.call().ownerOf(unknown_token_id) == '0x0000000000000000000000000000000000000000'
