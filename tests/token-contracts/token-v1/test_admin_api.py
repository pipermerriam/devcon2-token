import pytest


def test_adding_minter(chain, web3, token_v1, get_minter_added_data):
    token = token_v1
    assert token.call().minters(web3.eth.accounts[1]) is False
    assert token.call().minters(web3.eth.coinbase) is True

    add_txn_hash = token.transact().addMinter(web3.eth.accounts[1])
    chain.wait.for_receipt(add_txn_hash)

    assert token.call().minters(web3.eth.accounts[1]) is True

    minter_added_data = get_minter_added_data(add_txn_hash)
    assert minter_added_data['args']['who'] == web3.eth.accounts[1]


def test_non_minter_cannot_add_minter(chain, web3, token_v1, get_minter_added_data):
    token = token_v1
    assert token.call().minters(web3.eth.accounts[1]) is False

    add_txn_hash = token.transact({'from': web3.eth.accounts[1]}).addMinter(web3.eth.accounts[1])
    chain.wait.for_receipt(add_txn_hash)

    assert token.call().minters(web3.eth.accounts[1]) is False

    with pytest.raises(AssertionError):
        get_minter_added_data(add_txn_hash)


def test_removing_minter(chain, web3, token_v1, get_minter_removed_data):
    token = token_v1
    assert token.call().minters(web3.eth.accounts[1]) is False

    add_txn_hash = token.transact().addMinter(web3.eth.accounts[1])
    chain.wait.for_receipt(add_txn_hash)

    assert token.call().minters(web3.eth.accounts[1]) is True

    remove_txn_hash = token.transact().removeMinter(web3.eth.accounts[1])
    chain.wait.for_receipt(remove_txn_hash)

    assert token.call().minters(web3.eth.accounts[1]) is False

    minter_removed_data = get_minter_removed_data(remove_txn_hash)
    assert minter_removed_data['args']['who'] == web3.eth.accounts[1]


def test_non_minter_cannot_remove_minter(chain, web3, token_v1, get_minter_removed_data):
    token = token_v1
    assert token.call().minters(web3.eth.accounts[1]) is False
    assert token.call().minters(web3.eth.coinbase) is True

    remove_txn_hash = token.transact({'from': web3.eth.accounts[1]}).removeMinter(web3.eth.coinbase)
    chain.wait.for_receipt(remove_txn_hash)

    assert token.call().minters(web3.eth.accounts[1]) is False
    assert token.call().minters(web3.eth.coinbase) is True

    with pytest.raises(AssertionError):
        get_minter_removed_data(remove_txn_hash)
