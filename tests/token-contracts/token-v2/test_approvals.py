import pytest


def test_approving_transfer(chain,
                            web3,
                            token_v2,
                            token_v1_owner,
                            upgraded_token,
                            get_approval_data):
    spender = web3.eth.accounts[3]

    assert token_v2.call().allowance(token_v1_owner, spender) == 0

    approval_txn_hash = token_v2.transact({
        'from': token_v1_owner,
    }).approve(spender)
    chain.wait.for_receipt(approval_txn_hash)

    assert token_v2.call().allowance(token_v1_owner, spender) == 1
    approval_data = get_approval_data(approval_txn_hash)
    assert approval_data['args']['_owner'] == token_v1_owner
    assert approval_data['args']['_spender'] == spender
    assert approval_data['args']['_tokenID'] == upgraded_token


def test_approving_transfer_using_erc20(chain,
                                        web3,
                                        token_v2,
                                        token_v1_owner,
                                        upgraded_token,
                                        get_approval_data,
                                        get_erc20_approval_data):
    spender = web3.eth.accounts[3]

    assert token_v2.call().allowance(token_v1_owner, spender) == 0

    approval_txn_hash = token_v2.transact({
        'from': token_v1_owner,
    }).approve(spender, 1)
    chain.wait.for_receipt(approval_txn_hash)

    assert token_v2.call().allowance(token_v1_owner, spender) == 1
    approval_data = get_approval_data(approval_txn_hash)
    assert approval_data['args']['_owner'] == token_v1_owner
    assert approval_data['args']['_spender'] == spender
    assert approval_data['args']['_tokenID'] == upgraded_token

    erc20_approval_data = get_erc20_approval_data(approval_txn_hash)
    assert erc20_approval_data['args']['_owner'] == token_v1_owner
    assert erc20_approval_data['args']['_spender'] == spender
    assert erc20_approval_data['args']['_value'] == 1


def test_approval_is_reset_when_used(chain,
                                     web3,
                                     token_v2,
                                     token_v1_owner,
                                     upgraded_token,
                                     get_approval_data,
                                     get_erc20_approval_data):
    spender = web3.eth.accounts[3]
    new_owner = web3.eth.accounts[4]

    assert token_v2.call().allowance(token_v1_owner, spender) == 0

    approval_txn_hash = token_v2.transact({
        'from': token_v1_owner,
    }).approve(spender, 1)
    chain.wait.for_receipt(approval_txn_hash)

    assert token_v2.call().isTokenOwner(new_owner) is False
    assert token_v2.call().allowance(token_v1_owner, spender) == 1

    transfer_txn_hash = token_v2.transact({
        'from': spender,
    }).transferFrom(token_v1_owner, new_owner)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token_v2.call().isTokenOwner(new_owner) is True
    assert token_v2.call().allowance(token_v1_owner, spender) == 0


def test_approval_does_not_carry_over_to_new_token(chain,
                                                   web3,
                                                   token_v2,
                                                   token_v1_owner,
                                                   upgraded_token,
                                                   other_token_v1_owner,
                                                   upgraded_other_token,
                                                   get_approval_data,
                                                   get_erc20_approval_data):
    spender = web3.eth.accounts[3]

    assert token_v2.call().allowance(token_v1_owner, spender) == 0

    approval_txn_hash = token_v2.transact({
        'from': token_v1_owner,
    }).approve(spender, 1)
    chain.wait.for_receipt(approval_txn_hash)

    assert token_v2.call().allowance(token_v1_owner, spender) == 1
    assert token_v2.call().isTokenOwner(token_v1_owner) is True

    transfer_txn_hash = token_v2.transact({
        'from': token_v1_owner,
    }).transfer(web3.eth.accounts[4])
    chain.wait.for_receipt(transfer_txn_hash)

    assert token_v2.call().isTokenOwner(token_v1_owner) is False

    next_transfer_txn_hash = token_v2.transact({
        'from': other_token_v1_owner,
    }).transfer(token_v1_owner)
    chain.wait.for_receipt(next_transfer_txn_hash)

    assert token_v2.call().isTokenOwner(token_v1_owner) is True
    assert token_v2.call().tokenId(token_v1_owner) == upgraded_other_token

    # the allowance should not carry over as it was for another token.
    assert token_v2.call().allowance(token_v1_owner, spender) == 0


@pytest.mark.parametrize(
    'value',
    (0, 2),
)
def test_cannot_approve_non_1_values(chain,
                                     web3,
                                     token_v2,
                                     token_v1_owner,
                                     upgraded_token,
                                     get_approval_data,
                                     value):
    spender = web3.eth.accounts[3]

    assert token_v2.call().allowance(token_v1_owner, spender) == 0

    approval_txn_hash = token_v2.transact({
        'from': token_v1_owner,
    }).approve(spender, value)
    chain.wait.for_receipt(approval_txn_hash)

    with pytest.raises(AssertionError):
        get_approval_data(approval_txn_hash)

    assert token_v2.call().allowance(token_v1_owner, spender) == 0


def test_cannot_approve_if_not_a_token_holder(chain,
                                              web3,
                                              token_v2,
                                              get_approval_data):
    non_owner = web3.eth.accounts[3]
    spender = web3.eth.accounts[4]

    assert token_v2.call().allowance(non_owner, spender) == 0

    approval_txn_hash = token_v2.transact({
        'from': non_owner,
    }).approve(spender)
    chain.wait.for_receipt(approval_txn_hash)

    with pytest.raises(AssertionError):
        get_approval_data(approval_txn_hash)

    assert token_v2.call().allowance(non_owner, spender) == 0


def test_cannot_approve_null_address(chain,
                                     web3,
                                     token_v2,
                                     token_v1_owner,
                                     upgraded_token,
                                     get_approval_data,
                                     NULL_ADDRESS):
    assert token_v2.call().allowance(token_v1_owner, NULL_ADDRESS) == 0

    approval_txn_hash = token_v2.transact({
        'from': token_v1_owner,
    }).approve(NULL_ADDRESS)
    chain.wait.for_receipt(approval_txn_hash)

    with pytest.raises(AssertionError):
        get_approval_data(approval_txn_hash)

    assert token_v2.call().allowance(token_v1_owner, NULL_ADDRESS) == 0
