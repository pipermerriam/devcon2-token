import functools
import pytest


@pytest.fixture()
def token_v2(chain, web3, token_v1):
    token = chain.get_contract(
        'IndividualityTokenRoot',
        deploy_args=(token_v1.address,),
    )
    chain_code = web3.eth.getCode(token.address)
    assert len(chain_code) > 10

    assert token.call().devcon2Token() == token_v1.address
    return token


@pytest.fixture()
def token_event_lib(chain, web3):
    token_event_lib = chain.get_contract('TokenEventLib')
    chain_code = web3.eth.getCode(token_event_lib.address)
    assert len(chain_code) > 10
    return token_event_lib


@pytest.fixture()
def TokenEventLib(token_event_lib):
    return type(token_event_lib)


@pytest.fixture()
def get_approval_data(get_event_data, TokenEventLib):
    token = token_v2
    return functools.partial(get_event_data, 'Approval', TokenEventLib)


@pytest.fixture()
def get_erc20_approval_data(get_event_data, token_v2):
    return functools.partial(get_event_data, 'Approval', token_v2)


@pytest.fixture()
def get_transfer_data(get_event_data, TokenEventLib):
    return functools.partial(get_event_data, 'Transfer', TokenEventLib)


@pytest.fixture()
def get_erc20_transfer_data(get_event_data, token_v2):
    return functools.partial(get_event_data, 'Transfer', token_v2)


@pytest.fixture()
def get_mint_data(get_event_data, token_v2):
    token = token_v2
    return functools.partial(get_event_data, 'Mint', token)


@pytest.fixture()
def upgraded_token(chain, token_v2, token_v1_owner, token_id, get_mint_data):
    upgrade_txn_hash = token_v2.transact({
        'from': token_v1_owner,
    }).upgrade()
    chain.wait.for_receipt(upgrade_txn_hash)

    mint_data = get_mint_data(upgrade_txn_hash)
    assert mint_data['args']['_tokenID'] == token_id
    assert token_v2.call().isTokenUpgraded(token_id) is True

    return token_id


@pytest.fixture()
def upgraded_other_token(chain,
                         token_v2,
                         other_token_v1_owner,
                         other_token_id,
                         get_mint_data):
    upgrade_txn_hash = token_v2.transact({
        'from': other_token_v1_owner,
    }).upgrade()
    chain.wait.for_receipt(upgrade_txn_hash)

    mint_data = get_mint_data(upgrade_txn_hash)
    assert mint_data['args']['_tokenID'] == other_token_id
    assert token_v2.call().isTokenUpgraded(other_token_id) is True

    return other_token_id
