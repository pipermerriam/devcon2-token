import pytest


def pad_to_bytes32(v):
    return v + '\x00' * (32 - len(v))


def test_etc_constructor(chain, token_v1):
    token = token_v1
    etc_survey = chain.get_contract('ETCSurvey', deploy_args=(token.address,))
    assert etc_survey.call().numResponseOptions() == 4
    assert etc_survey.call().responseOptions(0) == pad_to_bytes32("No Answer")
    assert etc_survey.call().responseOptions(1) == pad_to_bytes32("Yes")
    assert etc_survey.call().responseOptions(2) == pad_to_bytes32("No")
    assert etc_survey.call().responseOptions(3) == pad_to_bytes32("Undecided")


def test_survey_data_accessors(survey):
    assert survey.call().question() == 'What is your favorite color?'
    assert survey.call().numResponseOptions() == 8
    assert survey.call().responseOptions(0) == pad_to_bytes32('Red')
    assert survey.call().responseOptions(1) == pad_to_bytes32('Orange')
    assert survey.call().responseOptions(2) == pad_to_bytes32('Yellow')
    assert survey.call().responseOptions(3) == pad_to_bytes32('Green')
    assert survey.call().responseOptions(4) == pad_to_bytes32('Blue')
    assert survey.call().responseOptions(5) == pad_to_bytes32('Purple')
    assert survey.call().responseOptions(6) == pad_to_bytes32('Pink')
    assert survey.call().responseOptions(7) == pad_to_bytes32('Rainbow')


def test_token_holder_can_respond(chain,
                                  survey,
                                  token_id,
                                  token_v1_owner,
                                  get_response_data):
    assert survey.call().numResponses() == 0
    assert survey.call().responseCounts(7) == 0

    response_txn_hash = survey.transact({
        'from': token_v1_owner,
    }).respond(7)
    chain.wait.for_receipt(response_txn_hash)

    assert survey.call().numResponses() == 1
    assert survey.call().responseCounts(7) == 1

    response_data = get_response_data(response_txn_hash)
    assert response_data['args']['tokenId'] == token_id
    assert response_data['args']['responseId'] == 7


def test_token_holder_cannot_respond_twice(chain,
                                           survey,
                                           token_id,
                                           token_v1_owner,
                                           get_response_data):
    assert survey.call().hasResponded(token_id) is False

    response_txn_hash = survey.transact({
        'from': token_v1_owner,
    }).respond(7)
    chain.wait.for_receipt(response_txn_hash)

    assert survey.call().numResponses() == 1
    assert survey.call().hasResponded(token_id) is True

    duplicate_response_txn_hash = survey.transact().respond(7)
    chain.wait.for_receipt(duplicate_response_txn_hash)

    with pytest.raises(AssertionError):
        get_response_data(duplicate_response_txn_hash)

    assert survey.call().numResponses() == 1


def test_token_id_cannot_respond_twice(chain,
                                       web3,
                                       survey,
                                       token_v1,
                                       token_v1_owner,
                                       token_id,
                                       get_response_data):
    token = token_v1
    assert survey.call().hasResponded(token_id) is False

    response_txn_hash = survey.transact({
        'from': token_v1_owner,
    }).respond(7)
    chain.wait.for_receipt(response_txn_hash)

    assert survey.call().numResponses() == 1
    assert survey.call().hasResponded(token_id) is True

    transfer_txn_hash = token.transact({
        'from': token_v1_owner,
    }).transfer(web3.eth.accounts[3], token_id)
    chain.wait.for_receipt(transfer_txn_hash)

    duplicate_response_txn_hash = survey.transact({
        'from': web3.eth.accounts[3],
    }).respond(7)
    chain.wait.for_receipt(duplicate_response_txn_hash)

    with pytest.raises(AssertionError):
        get_response_data(duplicate_response_txn_hash)

    assert survey.call().numResponses() == 1


def test_non_token_holder_cannot_respond(chain,
                                         web3,
                                         token_v1,
                                         survey,
                                         get_response_data):
    token = token_v1
    assert survey.call().numResponses() == 0
    assert not token.call().isTokenOwner(web3.eth.accounts[3])

    response_txn_hash = survey.transact({'from': web3.eth.accounts[3]}).respond(7)
    chain.wait.for_receipt(response_txn_hash)

    assert survey.call().numResponses() == 0

    with pytest.raises(AssertionError):
        get_response_data(response_txn_hash)


def test_cannot_respond_after_survey_close(chain,
                                           web3,
                                           token_id,
                                           token_v1_owner,
                                           survey,
                                           get_response_data,
                                           set_timestamp):
    set_timestamp(survey.call().surveyEndAt())
    assert survey.call().hasResponded(token_id) is False

    response_txn_hash = survey.transact({
        'from': token_v1_owner,
    }).respond(7)
    chain.wait.for_receipt(response_txn_hash)

    assert survey.call().numResponses() == 0
    assert survey.call().hasResponded(token_id) is False

    with pytest.raises(AssertionError):
        get_response_data(response_txn_hash)
