import pytest

from secp256k1 import (
    PrivateKey,
    ALL_FLAGS,
    PublicKey,
)

from sha3 import sha3_256

from bitcoin import encode_pubkey

from web3.utils.types import (
    is_string,
)
from web3.utils.formatting import (
    add_0x_prefix,
)
from web3.utils.encoding import (
    decode_hex,
    encode_hex,
)
from web3.utils.string import (
    force_bytes,
    force_text,
    coerce_args_to_bytes,
    coerce_return_to_text,
    coerce_return_to_bytes,
)

from ethereum import tester


@coerce_return_to_bytes
def sha3(s):
    return add_0x_prefix(sha3_256(s).hexdigest())


@coerce_args_to_bytes
@coerce_return_to_text
def extract_ecdsa_signer(msg_hash, signature):
    msg_hash_bytes = decode_hex(msg_hash) if msg_hash.startswith(b'0x') else msg_hash
    signature_bytes = decode_hex(signature) if signature.startswith(b'0x') else signature

    pk = PublicKey(flags=ALL_FLAGS)
    rec_id = signature_bytes[64]
    if is_string(rec_id):
        rec_id = ord(rec_id)
    pk.public_key = pk.ecdsa_recover(
        msg_hash_bytes,
        pk.ecdsa_recoverable_deserialize(
            signature_bytes[:64], rec_id,
        ),
        raw=True,
    )
    pk_serialized = pk.serialize(compressed=False)
    address = add_0x_prefix(sha3(encode_pubkey(pk_serialized, 'bin')[1:])[-40:])
    return address


@pytest.fixture()
def eth_sign(web3):
    def _inner_sign(account, data_to_sign):
        signature_hash_hex = web3.sha3(encode_hex(data_to_sign))
        signature_hash_bytes = decode_hex(signature_hash_hex)

        private_key = tester.keys[tester.accounts.index(decode_hex(account))]
        priv_key = PrivateKey(flags=ALL_FLAGS)
        priv_key.set_raw_privkey(private_key)

        signature_raw = priv_key.ecdsa_sign_recoverable(
            signature_hash_bytes,
            raw=True,
            digest=sha3_256,
        )
        signature_bytes, rec_id = priv_key.ecdsa_recoverable_serialize(signature_raw)
        signature = signature_bytes + force_bytes(chr(rec_id))

        # Sanity check that the signature is valid.
        signer_address = force_text(extract_ecdsa_signer(
            signature_hash_bytes,
            signature,
        ))

        assert signer_address == account
        return signature
    return _inner_sign


def test_proxy_upgrade_same_owner(chain,
                                  web3,
                                  token_v2,
                                  token_v1_owner,
                                  token_id,
                                  get_mint_data,
                                  eth_sign):
    assert token_v2.call().balanceOf(token_v1_owner) == 1
    assert token_v2.call().upgradeCount() == 0
    assert token_v2.call().isTokenUpgraded(token_id) is False

    signature_data = b''.join((
        decode_hex(token_v2.address),
        decode_hex(token_v1_owner),
        decode_hex(token_v1_owner),
    ))
    signature = eth_sign(token_v1_owner, signature_data)

    upgrade_txn_hash = token_v2.transact({
        'from': web3.eth.coinbase,
    }).proxyUpgrade(token_v1_owner, token_v1_owner, signature)
    chain.wait.for_receipt(upgrade_txn_hash)

    mint_data = get_mint_data(upgrade_txn_hash)

    assert token_v2.call().upgradeCount() == 1
    assert token_v2.call().isTokenUpgraded(token_id) is True
    assert mint_data['args']['_owner'] == token_v1_owner
    assert mint_data['args']['_tokenID'] == token_id
    assert mint_data['address'] == token_v2.address


def test_proxy_upgrade_new_owner(chain,
                                 web3,
                                 token_v2,
                                 token_v1_owner,
                                 token_id,
                                 get_mint_data,
                                 eth_sign):
    assert token_v2.call().balanceOf(token_v1_owner) == 1
    assert token_v2.call().upgradeCount() == 0
    assert token_v2.call().isTokenUpgraded(token_id) is False

    new_owner = web3.eth.accounts[3]

    signature_data = b''.join((
        decode_hex(token_v2.address),
        decode_hex(token_v1_owner),
        decode_hex(new_owner),
    ))
    signature = eth_sign(token_v1_owner, signature_data)

    upgrade_txn_hash = token_v2.transact({
        'from': web3.eth.coinbase,
    }).proxyUpgrade(token_v1_owner, new_owner, signature)
    chain.wait.for_receipt(upgrade_txn_hash)

    mint_data = get_mint_data(upgrade_txn_hash)

    assert token_v2.call().upgradeCount() == 1
    assert token_v2.call().isTokenUpgraded(token_id) is True
    assert mint_data['args']['_owner'] == new_owner
    assert mint_data['args']['_tokenID'] == token_id
    assert mint_data['address'] == token_v2.address


def test_rejects_invalid_signature(chain,
                                   web3,
                                   token_v2,
                                   token_v1_owner,
                                   token_id,
                                   get_mint_data,
                                   eth_sign):
    assert token_v2.call().balanceOf(token_v1_owner) == 1
    assert token_v2.call().upgradeCount() == 0
    assert token_v2.call().isTokenUpgraded(token_id) is False

    new_owner = web3.eth.accounts[3]

    signature_data = b''.join((
        decode_hex(token_v2.address),
        decode_hex(token_v1_owner),
        decode_hex(new_owner),
    ))
    signature = eth_sign(web3.eth.coinbase, signature_data)

    upgrade_txn_hash = token_v2.transact({
        'from': web3.eth.coinbase,
    }).proxyUpgrade(token_v1_owner, new_owner, signature)
    chain.wait.for_receipt(upgrade_txn_hash)

    with pytest.raises(AssertionError):
        get_mint_data(upgrade_txn_hash)

    assert token_v2.call().upgradeCount() == 0
    assert token_v2.call().isTokenUpgraded(token_id) is False


def test_rejects_already_upgraded_token(chain,
                                        web3,
                                        token_v2,
                                        token_v1_owner,
                                        upgraded_token,
                                        get_mint_data,
                                        eth_sign):
    new_owner = web3.eth.accounts[3]

    assert token_v2.call().balanceOf(token_v1_owner) == 1
    assert token_v2.call().isTokenUpgraded(upgraded_token) is True
    assert token_v2.call().isTokenOwner(new_owner) is False

    signature_data = b''.join((
        decode_hex(token_v2.address),
        decode_hex(token_v1_owner),
        decode_hex(new_owner),
    ))
    signature = eth_sign(token_v1_owner, signature_data)

    upgrade_txn_hash = token_v2.transact({
        'from': web3.eth.coinbase,
    }).proxyUpgrade(token_v1_owner, new_owner, signature)
    chain.wait.for_receipt(upgrade_txn_hash)

    with pytest.raises(AssertionError):
        get_mint_data(upgrade_txn_hash)

    assert token_v2.call().isTokenOwner(new_owner) is False


def test_rejects_if_new_owner_already_owns_an_upgraded_token(chain,
                                                             web3,
                                                             token_v2,
                                                             token_v1_owner,
                                                             other_token_v1_owner,
                                                             upgraded_other_token,
                                                             token_id,
                                                             get_mint_data,
                                                             eth_sign):
    assert token_v2.call().isTokenUpgraded(token_id) is False
    assert token_v2.call().isTokenUpgraded(upgraded_other_token) is True

    signature_data = b''.join((
        decode_hex(token_v2.address),
        decode_hex(token_v1_owner),
        decode_hex(other_token_v1_owner),
    ))
    signature = eth_sign(token_v1_owner, signature_data)

    upgrade_txn_hash = token_v2.transact({
        'from': web3.eth.coinbase,
    }).proxyUpgrade(token_v1_owner, other_token_v1_owner, signature)
    chain.wait.for_receipt(upgrade_txn_hash)

    with pytest.raises(AssertionError):
        get_mint_data(upgrade_txn_hash)

    assert token_v2.call().isTokenUpgraded(token_id) is False


def test_rejects_if_new_owner_already_owns_old_token(chain,
                                                     web3,
                                                     token_v2,
                                                     token_v1_owner,
                                                     other_token_v1_owner,
                                                     other_token_id,
                                                     token_id,
                                                     get_mint_data,
                                                     eth_sign):
    assert token_v2.call().isTokenUpgraded(token_id) is False
    assert token_v2.call().isTokenUpgraded(other_token_id) is False

    signature_data = b''.join((
        decode_hex(token_v2.address),
        decode_hex(token_v1_owner),
        decode_hex(other_token_v1_owner),
    ))
    signature = eth_sign(token_v1_owner, signature_data)

    upgrade_txn_hash = token_v2.transact({
        'from': web3.eth.coinbase,
    }).proxyUpgrade(token_v1_owner, other_token_v1_owner, signature)
    chain.wait.for_receipt(upgrade_txn_hash)

    with pytest.raises(AssertionError):
        get_mint_data(upgrade_txn_hash)

    assert token_v2.call().isTokenUpgraded(token_id) is False
    assert token_v2.call().isTokenUpgraded(other_token_id) is False


def test_rejects_if_new_owner_is_null_address(chain,
                                              web3,
                                              token_v2,
                                              token_v1_owner,
                                              token_id,
                                              other_token_v1_owner,
                                              get_mint_data,
                                              NULL_ADDRESS,
                                              eth_sign):
    assert token_v2.call().isTokenUpgraded(token_id) is False

    signature_data = b''.join((
        decode_hex(token_v2.address),
        decode_hex(token_v1_owner),
        decode_hex(NULL_ADDRESS),
    ))
    signature = eth_sign(token_v1_owner, signature_data)

    upgrade_txn_hash = token_v2.transact({
        'from': web3.eth.coinbase,
    }).proxyUpgrade(token_v1_owner, other_token_v1_owner, signature)
    chain.wait.for_receipt(upgrade_txn_hash)

    with pytest.raises(AssertionError):
        get_mint_data(upgrade_txn_hash)

    assert token_v2.call().isTokenUpgraded(token_id) is False
