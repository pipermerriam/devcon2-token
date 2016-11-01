import pytest


def test_transfer_from(chain,
                       web3,
                       token_v1,
                       token_id,
                       token_v1_owner,
                       other_token_v1_owner,
                       other_token_id,
                       get_transfer_data,
                       NULL_TOKEN,
                       convert_uint_to_token_id):
    token = token_v1
    token_owner = token_v1_owner
    other_token_owner = other_token_v1_owner

    assert token.call().ownerOf(other_token_id) == other_token_owner
    assert convert_uint_to_token_id(token.call().allowance(other_token_owner, web3.eth.coinbase)) == NULL_TOKEN

    approve_txn_hash = token.transact({
        'from': other_token_owner,
    }).approve(web3.eth.coinbase, other_token_id)
    chain.wait.for_receipt(approve_txn_hash)

    assert convert_uint_to_token_id(token.call().allowance(other_token_owner, web3.eth.coinbase)) == other_token_id

    transfer_txn_hash = token.transact().transferFrom(other_token_owner, web3.eth.accounts[3], other_token_id)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token.call().ownerOf(other_token_id) == web3.eth.accounts[3]
    assert convert_uint_to_token_id(token.call().allowance(other_token_owner, web3.eth.coinbase)) == NULL_TOKEN

    transfer_data = get_transfer_data(transfer_txn_hash)
    assert transfer_data['args']['_from'] == other_token_owner
    assert transfer_data['args']['_to'] == web3.eth.accounts[3]
    assert transfer_data['args']['_value'] == other_token_id


def test_cannot_transfer_without_approval(chain,
                                          web3,
                                          token_v1,
                                          other_token_v1_owner,
                                          other_token_id,
                                          get_transfer_data,
                                          NULL_TOKEN,
                                          convert_uint_to_token_id):
    token = token_v1
    other_token_owner = other_token_v1_owner

    assert token.call().ownerOf(other_token_id) == other_token_owner
    assert convert_uint_to_token_id(token.call().allowance(other_token_owner, web3.eth.coinbase)) == NULL_TOKEN

    transfer_txn_hash = token.transact().transferFrom(web3.eth.coinbase, web3.eth.accounts[3], other_token_id)
    chain.wait.for_receipt(transfer_txn_hash)

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)

    assert token.call().ownerOf(other_token_id) == other_token_owner


def test_cannot_transfer_null_token(chain,
                                    web3,
                                    token_v1,
                                    get_transfer_data,
                                    NULL_TOKEN,
                                    convert_uint_to_token_id):
    token = token_v1
    transfer_txn_hash = token.transact().transferFrom(web3.eth.coinbase, web3.eth.accounts[3], NULL_TOKEN)
    chain.wait.for_receipt(transfer_txn_hash)

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)


def test_cannot_transfer_unknown_token(chain,
                                       web3,
                                       token_v1,
                                       unknown_token_id,
                                       get_transfer_data,
                                       NULL_TOKEN,
                                       convert_uint_to_token_id):
    token = token_v1
    transfer_txn_hash = token.transact().transferFrom(web3.eth.coinbase, web3.eth.accounts[3], unknown_token_id)
    chain.wait.for_receipt(transfer_txn_hash)

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)
