import pytest


def test_transferring(chain,
                      web3,
                      token_v2,
                      token_v1_owner,
                      upgraded_token,
                      get_transfer_data):
    new_owner = web3.eth.accounts[3]

    assert token_v2.call().isTokenOwner(token_v1_owner) is True
    assert token_v2.call().isTokenOwner(new_owner) is False

    transfer_txn_hash = token_v2.transact({
        'from': token_v1_owner,
    }).transfer(new_owner)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token_v2.call().isTokenOwner(token_v1_owner) is False
    assert token_v2.call().isTokenOwner(new_owner) is True
    assert token_v2.call().tokenId(new_owner) == upgraded_token

    transfer_data = get_transfer_data(transfer_txn_hash)
    assert transfer_data['args']['_from'] == token_v1_owner
    assert transfer_data['args']['_to'] == new_owner
    assert transfer_data['args']['_tokenID'] == upgraded_token


def test_erc20_transferring(chain,
                            web3,
                            token_v2,
                            token_v1_owner,
                            upgraded_token,
                            get_transfer_data,
                            get_erc20_transfer_data):
    new_owner = web3.eth.accounts[3]

    assert token_v2.call().isTokenOwner(token_v1_owner) is True
    assert token_v2.call().isTokenOwner(new_owner) is False

    transfer_txn_hash = token_v2.transact({
        'from': token_v1_owner,
    }).transfer(new_owner, 1)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token_v2.call().isTokenOwner(token_v1_owner) is False
    assert token_v2.call().isTokenOwner(new_owner) is True
    assert token_v2.call().tokenId(new_owner) == upgraded_token

    transfer_data = get_transfer_data(transfer_txn_hash)
    assert transfer_data['args']['_from'] == token_v1_owner
    assert transfer_data['args']['_to'] == new_owner
    assert transfer_data['args']['_tokenID'] == upgraded_token

    erc20_transfer_data = get_erc20_transfer_data(transfer_txn_hash)
    assert erc20_transfer_data['args']['_from'] == token_v1_owner
    assert erc20_transfer_data['args']['_to'] == new_owner
    assert erc20_transfer_data['args']['_value'] == 1


def test_cannot_transfer_to_null_address(chain,
                                         web3,
                                         token_v2,
                                         token_v1_owner,
                                         upgraded_token,
                                         get_transfer_data,
                                         NULL_ADDRESS,
                                         NULL_TOKEN):
    assert token_v2.call().isTokenOwner(token_v1_owner) is True
    assert token_v2.call().isTokenOwner(NULL_ADDRESS) is False

    transfer_txn_hash = token_v2.transact({
        'from': token_v1_owner,
    }).transfer(NULL_ADDRESS)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token_v2.call().isTokenOwner(token_v1_owner) is True
    assert token_v2.call().isTokenOwner(NULL_ADDRESS) is False
    assert token_v2.call().tokenId(NULL_ADDRESS) == NULL_TOKEN

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)


def test_cannot_transfer_if_not_token_owner(chain,
                                            web3,
                                            token_v2,
                                            get_transfer_data):
    non_owner = web3.eth.accounts[3]
    target_owner = web3.eth.accounts[4]

    assert token_v2.call().isTokenOwner(non_owner) is False
    assert token_v2.call().isTokenOwner(target_owner) is False

    transfer_txn_hash = token_v2.transact({
        'from': non_owner,
    }).transfer(target_owner)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token_v2.call().isTokenOwner(non_owner) is False
    assert token_v2.call().isTokenOwner(target_owner) is False

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)


def test_cannot_transfer_to_current_token_owner(chain,
                                                web3,
                                                token_v2,
                                                token_v1_owner,
                                                upgraded_token,
                                                other_token_v1_owner,
                                                upgraded_other_token,
                                                get_transfer_data,
                                                NULL_ADDRESS,
                                                NULL_TOKEN):
    assert token_v2.call().isTokenOwner(token_v1_owner) is True

    transfer_txn_hash = token_v2.transact({
        'from': token_v1_owner,
    }).transfer(other_token_v1_owner)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token_v2.call().isTokenOwner(token_v1_owner) is True

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)


def test_cannot_transfer_to_non_upgraded_owner(chain,
                                               web3,
                                               token_v2,
                                               token_v1_owner,
                                               upgraded_token,
                                               other_token_v1_owner,
                                               other_token_id,
                                               get_transfer_data,
                                               NULL_ADDRESS,
                                               NULL_TOKEN):
    assert token_v2.call().isTokenOwner(token_v1_owner) is True
    assert token_v2.call().isTokenUpgraded(other_token_id) is False

    transfer_txn_hash = token_v2.transact({
        'from': token_v1_owner,
    }).transfer(other_token_v1_owner)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token_v2.call().isTokenOwner(token_v1_owner) is True

    with pytest.raises(AssertionError):
        get_transfer_data(transfer_txn_hash)


def test_can_transfer_to_upgraded_owner(chain,
                                        web3,
                                        token_v1,
                                        token_v2,
                                        token_v1_owner,
                                        upgraded_token,
                                        other_token_v1_owner,
                                        upgraded_other_token,
                                        get_transfer_data,
                                        NULL_ADDRESS,
                                        NULL_TOKEN):
    assert token_v2.call().isTokenOwner(token_v1_owner) is True
    assert token_v2.call().isTokenOwner(other_token_v1_owner) is True

    dump_txn_hash = token_v2.transact({
        'from': other_token_v1_owner,
    }).transfer(web3.eth.accounts[3])

    assert token_v2.call().isTokenOwner(other_token_v1_owner) is False

    transfer_txn_hash = token_v2.transact({
        'from': token_v1_owner,
    }).transfer(other_token_v1_owner)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token_v1.call().isTokenOwner(token_v1_owner) is True
    assert token_v1.call().isTokenOwner(other_token_v1_owner) is True

    assert token_v2.call().isTokenOwner(token_v1_owner) is False
    assert token_v2.call().isTokenOwner(other_token_v1_owner) is True

    assert token_v2.call().tokenId(other_token_v1_owner) == upgraded_token
    assert token_v2.call().tokenId(web3.eth.accounts[3]) == upgraded_other_token
