import pytest

import functools


@pytest.fixture()
def get_mint_data(get_event_data, token_v1):
    token = token_v1
    return functools.partial(get_event_data, 'Mint', token)


@pytest.fixture()
def get_destroy_data(get_event_data, token_v1):
    token = token_v1
    return functools.partial(get_event_data, 'Destroy', token)


@pytest.fixture()
def get_minter_added_data(get_event_data, token_v1):
    token = token_v1
    return functools.partial(get_event_data, 'MinterAdded', token)


@pytest.fixture()
def get_minter_removed_data(get_event_data, token_v1):
    token = token_v1
    return functools.partial(get_event_data, 'MinterRemoved', token)


@pytest.fixture()
def get_transfer_data(get_event_data, TokenLib):
    return functools.partial(get_event_data, 'Transfer', TokenLib)


@pytest.fixture()
def get_approval_data(get_event_data, TokenLib):
    return functools.partial(get_event_data, 'Approval', TokenLib)


@pytest.fixture()
def get_response_data(get_event_data, survey):
    return functools.partial(get_event_data, 'Response', survey)


@pytest.fixture()
def survey(chain, web3, token_v1, token_v1_owner, other_token_v1_owner):
    token = token_v1
    token_owner = token_v1_owner
    other_token_owner = other_token_v1_owner

    survey = chain.get_contract('Survey', deploy_args=(
        token.address,
        60 * 60 * 24 * 7,  # 1 week
        'What is your favorite color?',
        ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink', 'Rainbow'],
    ))

    chain_bytecode = web3.eth.getCode(survey.address)
    assert len(chain_bytecode) >= 10
    return survey
