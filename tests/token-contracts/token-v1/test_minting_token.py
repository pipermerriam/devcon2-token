import pytest


def test_minting_a_token(chain, web3, token_v1, get_mint_data):
    token = token_v1

    assert token.call().isTokenOwner(web3.eth.accounts[1]) is False

    mint_txn_hash = token.transact().mint(web3.eth.accounts[1], 'Piper Merriam')
    chain.wait.for_receipt(mint_txn_hash)

    assert token.call().isTokenOwner(web3.eth.accounts[1]) is True

    mint_data = get_mint_data(mint_txn_hash)
    assert mint_data['args']['_to'] == web3.eth.accounts[1]


def test_cannot_mint_if_not_minter(chain, web3, token_v1, get_mint_data):
    token = token_v1

    assert token.call().minters(web3.eth.accounts[1]) is False

    should_not_mint_txn_hash = token.transact({'from': web3.eth.accounts[1]}).mint(web3.eth.accounts[1], 'Piper Merriam')
    chain.wait.for_receipt(should_not_mint_txn_hash)

    with pytest.raises(AssertionError):
        get_mint_data(should_not_mint_txn_hash)


def test_cannot_mint_after_end(chain, web3, token_v1, set_timestamp):
    token = token_v1

    # fastforward to the end of the window
    set_timestamp(token.call().END_MINTING())

    assert token.call().isTokenOwner(web3.eth.accounts[1]) is False

    with pytest.raises(ValueError):
        token.transact().mint(web3.eth.accounts[1], 'Piper Merriam')

    assert token.call().isTokenOwner(web3.eth.accounts[1]) is False


def test_cannot_mint_second_token_to_same_address(chain, web3, token_v1, get_mint_data):
    token = token_v1

    assert token.call().isTokenOwner(web3.eth.accounts[1]) is False

    mint_txn_hash = token.transact().mint(web3.eth.accounts[1], 'Piper Merriam')
    chain.wait.for_receipt(mint_txn_hash)

    assert token.call().isTokenOwner(web3.eth.accounts[1]) is True

    should_not_mint_txn_hash = token.transact().mint(web3.eth.accounts[1], 'Another Piper Merriam')
    chain.wait.for_receipt(should_not_mint_txn_hash)

    with pytest.raises(AssertionError):
        get_mint_data(should_not_mint_txn_hash)


def test_cannot_mint_identity_twice(chain, web3, token_v1, get_mint_data):
    token = token_v1

    assert token.call().isTokenOwner(web3.eth.accounts[1]) is False
    assert token.call().isTokenOwner(web3.eth.accounts[2]) is False

    mint_txn_hash = token.transact().mint(web3.eth.accounts[1], 'Piper Merriam')
    chain.wait.for_receipt(mint_txn_hash)

    assert token.call().isTokenOwner(web3.eth.accounts[1]) is True

    should_not_mint_txn_hash = token.transact().mint(web3.eth.accounts[2], 'Piper Merriam')
    chain.wait.for_receipt(should_not_mint_txn_hash)

    with pytest.raises(AssertionError):
        get_mint_data(should_not_mint_txn_hash)

    assert token.call().isTokenOwner(web3.eth.accounts[2]) is False
