import pytest

@pytest.fixture()
def spender(web3):
    return web3.eth.accounts[3]


@pytest.fixture()
def approved_token_transfer(chain,
                            token_v2,
                            token_v1_owner,
                            upgraded_token,
                            get_approval_data,
                            spender):
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


def test_transfer_from(chain,
                       web3,
                       token_v2,
                       token_v1_owner,
                       upgraded_token,
                       spender,
                       approved_token_transfer,
                       get_transfer_data):
    new_owner = web3.eth.accounts[4]

    assert token_v2.call().isTokenOwner(token_v1_owner) is True
    assert token_v2.call().isTokenOwner(new_owner) is False

    transfer_txn_hash = token_v2.transact({
        'from': spender,
    }).transferFrom(token_v1_owner, new_owner)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token_v2.call().isTokenOwner(token_v1_owner) is False
    assert token_v2.call().isTokenOwner(new_owner) is True

    transfer_data = get_transfer_data(transfer_txn_hash)
    assert transfer_data['args']['_from'] == token_v1_owner
    assert transfer_data['args']['_to'] == new_owner
    assert transfer_data['args']['_tokenID'] == upgraded_token


def test_erc20_transfer_from(chain,
                             web3,
                             token_v2,
                             token_v1_owner,
                             upgraded_token,
                             spender,
                             approved_token_transfer,
                             get_transfer_data,
                             get_erc20_transfer_data):
    new_owner = web3.eth.accounts[4]

    assert token_v2.call().isTokenOwner(token_v1_owner) is True
    assert token_v2.call().isTokenOwner(new_owner) is False

    transfer_txn_hash = token_v2.transact({
        'from': spender,
    }).transferFrom(token_v1_owner, new_owner, 1)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token_v2.call().isTokenOwner(token_v1_owner) is False
    assert token_v2.call().isTokenOwner(new_owner) is True

    transfer_data = get_transfer_data(transfer_txn_hash)
    assert transfer_data['args']['_from'] == token_v1_owner
    assert transfer_data['args']['_to'] == new_owner
    assert transfer_data['args']['_tokenID'] == upgraded_token

    erc20_transfer_data = get_erc20_transfer_data(transfer_txn_hash)
    assert erc20_transfer_data['args']['_from'] == token_v1_owner
    assert erc20_transfer_data['args']['_to'] == new_owner
    assert erc20_transfer_data['args']['_value'] == 1


@pytest.mark.parametrize(
    'value', (0, 2),
)
def test_cannot_transfer_non_1_value(chain,
                                     web3,
                                     token_v2,
                                     token_v1_owner,
                                     upgraded_token,
                                     spender,
                                     approved_token_transfer,
                                     get_transfer_data,
                                     value):
    new_owner = web3.eth.accounts[4]

    assert token_v2.call().isTokenOwner(token_v1_owner) is True
    assert token_v2.call().isTokenOwner(new_owner) is False

    transfer_txn_hash = token_v2.transact({
        'from': spender,
    }).transferFrom(token_v1_owner, new_owner, value)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token_v2.call().isTokenOwner(token_v1_owner) is True
    assert token_v2.call().isTokenOwner(new_owner) is False

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)


def test_cannot_transfer_to_null_address(chain,
                                         token_v2,
                                         token_v1_owner,
                                         upgraded_token,
                                         spender,
                                         approved_token_transfer,
                                         get_transfer_data,
                                         NULL_ADDRESS):
    assert token_v2.call().isTokenOwner(token_v1_owner) is True
    assert token_v2.call().isTokenOwner(NULL_ADDRESS) is False

    transfer_txn_hash = token_v2.transact({
        'from': spender,
    }).transferFrom(token_v1_owner, NULL_ADDRESS)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token_v2.call().isTokenOwner(token_v1_owner) is True
    assert token_v2.call().isTokenOwner(NULL_ADDRESS) is False

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)


def test_cannot_transfer_if_ownership_changes(chain,
                                              web3,
                                              token_v2,
                                              token_v1_owner,
                                              upgraded_token,
                                              spender,
                                              approved_token_transfer,
                                              get_transfer_data):
    new_owner = web3.eth.accounts[3]
    target_owner = web3.eth.accounts[4]

    assert token_v2.call().isTokenOwner(token_v1_owner) is True
    assert token_v2.call().isTokenOwner(new_owner) is False
    assert token_v2.call().isTokenOwner(target_owner) is False

    initial_transfer_txn_hash = token_v2.transact({
        'from': token_v1_owner,
    }).transfer(new_owner)
    chain.wait.for_receipt(initial_transfer_txn_hash)

    assert token_v2.call().isTokenOwner(token_v1_owner) is False
    assert token_v2.call().isTokenOwner(new_owner) is True
    assert token_v2.call().isTokenOwner(target_owner) is False

    transfer_txn_hash = token_v2.transact({
        'from': spender,
    }).transferFrom(token_v1_owner, target_owner)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token_v2.call().isTokenOwner(token_v1_owner) is False
    assert token_v2.call().isTokenOwner(new_owner) is True
    assert token_v2.call().isTokenOwner(target_owner) is False

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)


def test_cannot_transfer_to_existing_token_owner(chain,
                                                 token_v2,
                                                 token_v1_owner,
                                                 upgraded_token,
                                                 upgraded_other_token,
                                                 other_token_v1_owner,
                                                 spender,
                                                 approved_token_transfer,
                                                 get_transfer_data,
                                                 NULL_ADDRESS):
    assert token_v2.call().isTokenOwner(token_v1_owner) is True
    assert token_v2.call().isTokenOwner(other_token_v1_owner) is True
    assert token_v2.call().allowance(token_v1_owner, spender) == 1

    transfer_txn_hash = token_v2.transact({
        'from': spender,
    }).transferFrom(token_v1_owner, other_token_v1_owner)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token_v2.call().isTokenOwner(token_v1_owner) is True
    assert token_v2.call().isTokenOwner(other_token_v1_owner) is True
    assert token_v2.call().allowance(token_v1_owner, spender) == 1

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)
