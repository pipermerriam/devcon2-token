def test_supply_tracking(chain, web3, token):
    assert token.call().totalSupply() == 0

    mint_0_txn_hash = token.transact().mint(web3.eth.accounts[1], 'Token-0')
    chain.wait.for_receipt(mint_0_txn_hash)

    assert token.call().totalSupply() == 1

    mint_1_txn_hash = token.transact().mint(web3.eth.accounts[2], 'Token-1')
    chain.wait.for_receipt(mint_1_txn_hash)

    assert token.call().totalSupply() == 2

    mint_2_txn_hash = token.transact().mint(web3.eth.accounts[3], 'Token-2')
    chain.wait.for_receipt(mint_2_txn_hash)

    assert token.call().totalSupply() == 3


def test_supply_tracking_with_destruction(chain, web3, token, get_mint_data):
    assert token.call().totalSupply() == 0

    mint_0_txn_hash = token.transact().mint(web3.eth.accounts[1], 'Token-0')
    chain.wait.for_receipt(mint_0_txn_hash)

    assert token.call().totalSupply() == 1

    mint_1_txn_hash = token.transact().mint(web3.eth.accounts[2], 'Token-1')
    chain.wait.for_receipt(mint_1_txn_hash)

    assert token.call().totalSupply() == 2

    mint_1_data = get_mint_data(mint_1_txn_hash)
    mint_1_token_id = mint_1_data['args']['_id']

    destroy_txn_hash = token.transact().destroy(mint_1_token_id)
    chain.wait.for_receipt(destroy_txn_hash)

    assert token.call().totalSupply() == 1

    mint_2_txn_hash = token.transact().mint(web3.eth.accounts[3], 'Token-2')
    chain.wait.for_receipt(mint_2_txn_hash)

    assert token.call().totalSupply() == 2
