def test_total_supply(token_v1, token_v2, token_v1_owner, other_token_v1_owner):
    assert token_v1.call().totalSupply() == 2
    assert token_v2.call().totalSupply() == 2
