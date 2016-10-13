import pytest


def test_upgrading_from_v1(chain,
                           token_v1,
                           token_v2,
                           token_v1_owner,
                           token_id,
                           get_mint_data):
    assert token_v2.call().balanceOf(token_v1_owner) == 1
    assert token_v2.call().upgradeCount() == 0
    assert token_v2.call().isTokenUpgraded(token_id) is False

    upgrade_txn_hash = token_v2.transact({'from': token_v1_owner}).upgrade()
    chain.wait.for_receipt(upgrade_txn_hash)

    mint_data = get_mint_data(upgrade_txn_hash)

    assert token_v2.call().upgradeCount() == 1
    assert token_v2.call().isTokenUpgraded(token_id) is True
    assert mint_data['args']['_tokenID'] == token_id
    assert mint_data['address'] == token_v2.address


def test_auto_upgrade_on_transfer(chain,
                                  web3,
                                  token_v1,
                                  token_v2,
                                  token_v1_owner,
                                  token_id,
                                  get_transfer_data,
                                  get_mint_data):
    assert token_v2.call().balanceOf(token_v1_owner) == 1
    assert token_v2.call().upgradeCount() == 0
    assert token_v2.call().isTokenUpgraded(token_id) is False

    transfer_txn_hash = token_v2.transact({
        'from': token_v1_owner,
    }).transfer(web3.eth.accounts[3])
    chain.wait.for_receipt(transfer_txn_hash)

    transfer_data = get_transfer_data(transfer_txn_hash)
    mint_data = get_mint_data(transfer_txn_hash)

    assert token_v2.call().upgradeCount() == 1
    assert token_v2.call().isTokenUpgraded(token_id) is True
    assert mint_data['args']['_tokenID'] == token_id
    assert mint_data['address'] == token_v2.address


def test_auto_upgrade_on_approval(chain,
                                  web3,
                                  token_v1,
                                  token_v2,
                                  token_v1_owner,
                                  token_id,
                                  get_approval_data,
                                  get_mint_data):
    assert token_v2.call().balanceOf(token_v1_owner) == 1
    assert token_v2.call().upgradeCount() == 0
    assert token_v2.call().isTokenUpgraded(token_id) is False

    approval_txn_hash = token_v2.transact({
        'from': token_v1_owner,
    }).approve(web3.eth.accounts[3])
    chain.wait.for_receipt(approval_txn_hash)

    approval_data = get_approval_data(approval_txn_hash)
    mint_data = get_mint_data(approval_txn_hash)

    assert token_v2.call().upgradeCount() == 1
    assert token_v2.call().isTokenUpgraded(token_id) is True
    assert mint_data['args']['_tokenID'] == token_id
    assert mint_data['address'] == token_v2.address


def test_cannot_upgrade_same_token_twice(chain,
                                         web3,
                                         token_v1,
                                         token_v2,
                                         token_v1_owner,
                                         token_id,
                                         get_mint_data):
    assert token_v2.call().balanceOf(token_v1_owner) == 1
    assert token_v2.call().upgradeCount() == 0
    assert token_v2.call().isTokenUpgraded(token_id) is False

    upgrade_txn_hash = token_v2.transact({'from': token_v1_owner}).upgrade()
    chain.wait.for_receipt(upgrade_txn_hash)

    mint_data = get_mint_data(upgrade_txn_hash)

    assert token_v2.call().upgradeCount() == 1
    assert token_v2.call().isTokenUpgraded(token_id) is True
    assert mint_data['args']['_tokenID'] == token_id
    assert mint_data['address'] == token_v2.address

    new_owner = web3.eth.accounts[3]
    assert token_v1.call().isTokenOwner(new_owner) is False

    transfer_txn_hash = token_v1.transact({
        'from': token_v1_owner,
    }).transfer(new_owner, token_id)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token_v1.call().isTokenOwner(new_owner) is True
    assert token_v2.call().isTokenOwner(new_owner) is False

    dup_upgrade_txn_hash = token_v2.transact({'from': new_owner}).upgrade()
    chain.wait.for_receipt(dup_upgrade_txn_hash)

    with pytest.raises(AssertionError):
        get_mint_data(dup_upgrade_txn_hash)

    assert token_v2.call().upgradeCount() == 1

    assert token_v1.call().isTokenOwner(new_owner) is True
    assert token_v2.call().isTokenOwner(new_owner) is False
