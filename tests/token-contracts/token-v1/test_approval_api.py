import pytest


def test_setting_approval(chain,
                          web3,
                          token_v1,
                          token_id,
                          token_v1_owner,
                          get_approval_data,
                          NULL_TOKEN,
                          convert_uint_to_token_id):
    token = token_v1
    token_owner = token_v1_owner
    assert convert_uint_to_token_id(token.call().allowance(token_owner, web3.eth.accounts[1])) == NULL_TOKEN

    approve_txn_hash = token.transact({
        'from': token_v1_owner,
    }).approve(web3.eth.accounts[3], token_id)
    chain.wait.for_receipt(approve_txn_hash)

    assert convert_uint_to_token_id(token.call().allowance(token_owner, web3.eth.accounts[3])) == token_id

    approve_data = get_approval_data(approve_txn_hash)
    assert approve_data['args']['_owner'] == token_owner
    assert approve_data['args']['_spender'] == web3.eth.accounts[3]
    assert approve_data['args']['_value'] == token_id


def test_cannot_approve_null_token(chain,
                                   web3,
                                   token_v1,
                                   token_v1_owner,
                                   get_approval_data,
                                   NULL_TOKEN,
                                   convert_uint_to_token_id):
    token = token_v1
    approve_txn_hash = token.transact({
        'from': token_v1_owner,
    }).approve(web3.eth.accounts[3], NULL_TOKEN)
    chain.wait.for_receipt(approve_txn_hash)

    with pytest.raises(AssertionError):
        get_approval_data(approve_txn_hash)


def test_cannot_approve_unknown_token(chain,
                                      web3,
                                      token_v1,
                                   token_v1_owner,
                                      get_approval_data,
                                      unknown_token_id,
                                      convert_uint_to_token_id):
    token = token_v1
    approve_txn_hash = token.transact({
        'from': token_v1_owner,
    }).approve(web3.eth.accounts[3], unknown_token_id)
    chain.wait.for_receipt(approve_txn_hash)

    with pytest.raises(AssertionError):
        get_approval_data(approve_txn_hash)


def test_cannot_approve_token_you_do_not_own(chain,
                                             web3,
                                             token_v1,
                                             token_v1_owner,
                                             other_token_id,
                                             get_approval_data,
                                             unknown_token_id,
                                             convert_uint_to_token_id):
    token = token_v1
    token_owner = token_v1_owner
    approve_txn_hash = token.transact({
        'from': token_v1_owner,
    }).approve(web3.eth.accounts[3], other_token_id)
    chain.wait.for_receipt(approve_txn_hash)

    with pytest.raises(AssertionError):
        get_approval_data(approve_txn_hash)
