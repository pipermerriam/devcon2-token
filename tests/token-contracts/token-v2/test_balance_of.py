def test_balance_of_proxied_to_original_contract(token_v1,
                                                 token_v2,
                                                 token_v1_owner):
    assert token_v1.call().balanceOf(token_v1_owner) > 0
    assert token_v2.call().balanceOf(token_v1_owner) == 1


def test_balance_of_with_upgraded_token(token_v2,
                                        token_v1_owner,
                                        upgraded_token):
    assert token_v2.call().balanceOf(token_v1_owner) == 1


def test_balance_of_with_no_token(token_v2,
                                  web3):
    assert token_v2.call().balanceOf(web3.eth.coinbase) == 0


def test_balance_of_ignores_already_transfered_tokens(chain,
                                                      token_v1,
                                                      token_v2,
                                                      web3,
                                                      upgraded_token,
                                                      token_v1_owner):
    new_owner = web3.eth.accounts[3]

    assert token_v1.call().isTokenOwner(new_owner) is False
    assert token_v2.call().isTokenOwner(new_owner) is False
    assert token_v2.call().balanceOf(new_owner) == 0

    transfer_txn_hash = token_v1.transact({
        'from': token_v1_owner,
    }).transfer(new_owner, upgraded_token)
    chain.wait.for_receipt(transfer_txn_hash)

    assert token_v1.call().isTokenOwner(new_owner) is True
    assert token_v2.call().isTokenOwner(new_owner) is False
    assert token_v2.call().balanceOf(new_owner) == 0
