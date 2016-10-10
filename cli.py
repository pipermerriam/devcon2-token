import click
import itertools

import contextlib
from gevent import socket
from web3 import Web3
from populus.utils.wait import Wait
from populus.utils.filesystem import ensure_path_exists


CONTEXT_SETTINGS = dict(
    # Support -h as a shortcut for --help
    help_option_names=['-h', '--help'],
)


@contextlib.contextmanager
def get_ipc_socket(ipc_path, timeout=0.1):
    sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    sock.connect(ipc_path)
    sock.settimeout(timeout)

    yield sock

    sock.close()


def wait_for_ipc(ipc_path):
    try:
        with get_ipc_socket(ipc_path):
            pass
    except socket.error:
        return False
    else:
        return True


@click.group(context_settings=CONTEXT_SETTINGS)
@click.option('--ipc-path')
@click.option('--token-address', default='0x0a43edfe106d295e7c1e591a4b04b5598af9474c')
@click.pass_context
def main(ctx, ipc_path, token_address):
    """
    Main command
    """
    web3 = Web3(Web3.IPCProvider(ipc_path=ipc_path))
    wait = Wait(web3, timeout=600)
    token = web3.eth.contract(
        address=token_address,
        abi=DEVCON2_TOKEN['abi'],
        code=DEVCON2_TOKEN['code'],
        code_runtime=DEVCON2_TOKEN['code_runtime'],
    )
    click.echo("Waiting for ipc connection: {0}".format(web3.currentProvider.ipc_path))
    wait_for_ipc(web3.currentProvider.ipc_path)
    #click.echo("Waiting for account unlock: {0}".format(web3.eth.coinbase))
    #wait.for_unlock()

    ctx.web3 = web3
    ctx.wait = wait
    ctx.token = token


def validate_owner_address(ctx, value):
    token = ctx.token
    web3 = ctx.web3

    if web3.Iban.isValid(value):
        value = web3.Iban(value).address()

    if not web3.isAddress(value):
        raise click.BadParameter('Invalid Address: {0}'.format(value))
    elif token.call().isTokenOwner(value):
        token_id = token.call().ownedToken(value)
        identity = token.call().identityOf(token_id)
        raise click.BadParameter('Already Token Holder: Identity - {0}'.format(identity))

    return value.lower()


def validate_identity(ctx, value):
    token = ctx.token
    web3 = ctx.web3

    if not value:
        raise click.BadParameter("Identity must be non-empty")

    token_id_hex = web3.sha3(web3.fromAscii(value))
    token_id = web3.toAscii(token_id_hex)
    current_owner = token.call().ownerOf(token_id)

    if current_owner != '0x0000000000000000000000000000000000000000':
        raise click.BadParameter("Identity already registered: {0}".format(current_owner))

    return value


@main.command()
@click.pass_context
def repl(ctx):
    parent_ctx = ctx.parent

    web3 = parent_ctx.web3
    token = parent_ctx.token
    wait = parent_ctx.wait

    import pdb; pdb.set_trace()


@main.command()
@click.argument('addr', nargs=1)
@click.pass_context
def lookup(ctx, addr):
    parent_ctx = ctx.parent
    token = parent_ctx.token
    identity = token.call().identityOf(token.call().ownedToken(addr))
    click.echo("Identity: {0}".format(identity))


@main.command()
@click.pass_context
def report(ctx):
    parent_ctx = ctx.parent
    token = parent_ctx.token
    web3 = parent_ctx.web3

    mint_filter = token.pastEvents('Mint', {
        'address': '0x0a43edfe106d295e7c1e591a4b04b5598af9474c',
        'fromBlock': 2100000,
    })
    destroy_filter = token.pastEvents('Destroy', {
        'address': '0x0a43edfe106d295e7c1e591a4b04b5598af9474c',
        'fromBlock': 2100000,
    })

    destroy_log_entries = destroy_filter.get(False)
    destroyed_tokens = {
        entry['args']['_id']
        for entry in destroy_log_entries
    }
    mint_log_entries = mint_filter.get(False)
    minted_tokens = [
        (entry['args']['_to'], web3.fromAscii(entry['args']['_id']))
        for entry in mint_log_entries
        if entry['args']['_id'] not in destroyed_tokens
    ]

    all_transaction_hashes = list(itertools.chain(
        [entry['transactionHash'] for entry in mint_log_entries],
        [entry['transactionHash'] for entry in destroy_log_entries],
    ))
    all_transactions = [
        (web3.eth.getTransaction(txn_hash), web3.eth.getTransactionReceipt(txn_hash))
        for txn_hash in all_transaction_hashes
    ]
    total_gas_cost = sum((
        txn_receipt['gasUsed'] * txn['gasPrice']
        for txn, txn_receipt
        in all_transactions
    ))
    total_gas_cost_in_ether = web3.fromWei(total_gas_cost, 'ether')

    for owner_address, token_id in minted_tokens:
        identity = token.call().identityOf(web3.toAscii(token_id))
        click.echo("{addr} - {identity}".format(addr=owner_address, identity=identity))

    click.echo("Total Gas Costs: {0}".format(total_gas_cost_in_ether))
    click.echo("Addresses Registered: {0}".format(len(minted_tokens)))
    click.echo("Number of Transactions: {0}".format(len(all_transaction_hashes)))


@main.command()
@click.argument('owner_address', nargs=1)
@click.argument('identity', nargs=1)
@click.pass_context
def issue(ctx, owner_address, identity):
    parent_ctx = ctx.parent

    validate_identity(parent_ctx, identity)
    owner_address = validate_owner_address(parent_ctx, owner_address)

    web3 = parent_ctx.web3
    token = parent_ctx.token
    wait = parent_ctx.wait

    txn_hash = token.transact().mint(owner_address, identity)
    click.echo("Minted new token via txn: {0}".format(txn_hash))
    click.echo("Waiting for txn to be mined ...", nl=False)
    txn_receipt = wait.for_receipt(txn_hash)
    txn = web3.eth.getTransaction(txn_hash)
    click.echo("MINED")

    token_id = token.call().ownedToken(owner_address)
    token_id_hex = web3.fromAscii(token_id)
    identity = token.call().identityOf(token_id)

    token_details = (
        "\n"
        "Token Details:\n"
        "------------\n"
        "owner: {owner}\n"
        "identity: {identity}\n"
        "token_id: {token_id_hex}\n"
        "minted in txn: {txn_hash}\n"
        "blockNumber: {blockNumber}\n"
        "gas: {gasUsed} / {gas}\n"
        "".format(
            owner=owner_address,
            identity=identity,
            token_id_hex=token_id_hex,
            txn_hash=txn_hash,
            blockNumber=txn_receipt['blockNumber'],
            gas=txn['gas'],
            gasUsed=txn_receipt['gasUsed'],
        )
    )
    click.echo(token_details)
    ensure_path_exists('./token-logs')
    log_file_path = './token-logs/{owner}.txt'.format(owner=owner_address)
    with open(log_file_path, 'w') as log_file:
        log_file.write(token_details)
    click.echo("Wrote log to: {0}".format(log_file_path))


DEVCON2_TOKEN = {
    'abi': [
        {
            'constant': False,
            'inputs': [
                {
                    'name': '_spender',
                    'type': 'address',
                },
                {
                    'name': '_value',
                    'type': 'uint256',
                },
            ],
            'name': 'approve',
            'outputs': [
                {
                    'name': 'success',
                    'type': 'bool',
                },
            ],
            'type': 'function',
        },
        {
            'constant': False,
            'inputs': [],
            'name': 'totalSupply',
            'outputs': [
                {
                    'name': 'supply',
                    'type': 'uint256',
                },
            ],
            'type': 'function',
        },
        {
            'constant': False,
            'inputs': [
                {
                    'name': '_from',
                    'type': 'address',
                },
                {
                    'name': '_to',
                    'type': 'address',
                },
                {
                    'name': '_value',
                    'type': 'uint256',
                },
            ],
            'name': 'transferFrom',
            'outputs': [
                {
                    'name': 'success',
                    'type': 'bool',
                },
            ],
            'type': 'function',
        },
        {
            'constant': True,
            'inputs': [],
            'name': 'END_MINTING',
            'outputs': [
                {
                    'name': '',
                    'type': 'uint256',
                },
            ],
            'type': 'function',
        },
        {
            'constant': True,
            'inputs': [
                {
                    'name': '_id',
                    'type': 'bytes32',
                },
            ],
            'name': 'identityOf',
            'outputs': [
                {
                    'name': 'identity',
                    'type': 'string',
                },
            ],
            'type': 'function',
        },
        {
            'constant': False,
            'inputs': [
                {
                    'name': '_spender',
                    'type': 'address',
                },
                {
                    'name': '_value',
                    'type': 'bytes32',
                },
            ],
            'name': 'approve',
            'outputs': [
                {
                    'name': 'success',
                    'type': 'bool',
                },
            ],
            'type': 'function',
        },
        {
            'constant': True,
            'inputs': [
                {
                    'name': '',
                    'type': 'address',
                },
            ],
            'name': 'ownedToken',
            'outputs': [
                {
                    'name': '',
                    'type': 'bytes32',
                },
            ],
            'type': 'function',
        },
        {
            'constant': False,
            'inputs': [
                {
                    'name': '_id',
                    'type': 'bytes32',
                },
            ],
            'name': 'destroy',
            'outputs': [
                {
                    'name': 'success',
                    'type': 'bool',
                },
            ],
            'type': 'function',
        },
        {
            'constant': True,
            'inputs': [
                {
                    'name': '_owner',
                    'type': 'address',
                },
            ],
            'name': 'balanceOf',
            'outputs': [
                {
                    'name': 'balance',
                    'type': 'uint256',
                },
            ],
            'type': 'function',
        },
        {
            'constant': False,
            'inputs': [
                {
                    'name': '_to',
                    'type': 'address',
                },
                {
                    'name': '_value',
                    'type': 'bytes32',
                },
            ],
            'name': 'transfer',
            'outputs': [
                {
                    'name': 'success',
                    'type': 'bool',
                },
            ],
            'type': 'function',
        },
        {
            'constant': True,
            'inputs': [
                {
                    'name': '_id',
                    'type': 'bytes32',
                },
            ],
            'name': 'ownerOf',
            'outputs': [
                {
                    'name': 'owner',
                    'type': 'address',
                },
            ],
            'type': 'function',
        },
        {
            'constant': True,
            'inputs': [
                {
                    'name': '_owner',
                    'type': 'address',
                },
            ],
            'name': 'isTokenOwner',
            'outputs': [
                {
                    'name': '',
                    'type': 'bool',
                },
            ],
            'type': 'function',
        },
        {
            'constant': False,
            'inputs': [
                {
                    'name': '_to',
                    'type': 'address',
                },
                {
                    'name': '_value',
                    'type': 'uint256',
                },
            ],
            'name': 'transfer',
            'outputs': [
                {
                    'name': 'success',
                    'type': 'bool',
                },
            ],
            'type': 'function',
        },
        {
            'constant': False,
            'inputs': [
                {
                    'name': '_from',
                    'type': 'address',
                },
                {
                    'name': '_to',
                    'type': 'address',
                },
                {
                    'name': '_value',
                    'type': 'bytes32',
                },
            ],
            'name': 'transferFrom',
            'outputs': [
                {
                    'name': 'success',
                    'type': 'bool',
                },
            ],
            'type': 'function',
        },
        {
            'constant': False,
            'inputs': [
                {
                    'name': '_to',
                    'type': 'address',
                },
                {
                    'name': '_identity',
                    'type': 'string',
                },
            ],
            'name': 'mint',
            'outputs': [
                {
                    'name': 'success',
                    'type': 'bool',
                },
            ],
            'type': 'function',
        },
        {
            'constant': True,
            'inputs': [
                {
                    'name': '_owner',
                    'type': 'address',
                },
                {
                    'name': '_spender',
                    'type': 'address',
                },
            ],
            'name': 'allowance',
            'outputs': [
                {
                    'name': 'remaining',
                    'type': 'uint256',
                },
            ],
            'type': 'function',
        },
        {
            'constant': True,
            'inputs': [
                {
                    'name': '',
                    'type': 'address',
                },
            ],
            'name': 'minters',
            'outputs': [
                {
                    'name': '',
                    'type': 'bool',
                },
            ],
            'type': 'function',
        },
        {
            'inputs': [],
            'type': 'constructor',
        },
        {
            'anonymous': False,
            'inputs': [
                {
                    'indexed': True,
                    'name': '_to',
                    'type': 'address',
                },
                {
                    'indexed': False,
                    'name': '_id',
                    'type': 'bytes32',
                },
            ],
            'name': 'Mint',
            'type': 'event',
        },
        {
            'anonymous': False,
            'inputs': [
                {
                    'indexed': False,
                    'name': '_id',
                    'type': 'bytes32',
                },
            ],
            'name': 'Destroy',
            'type': 'event',
        },
        {
            'anonymous': False,
            'inputs': [
                {
                    'indexed': True,
                    'name': '_from',
                    'type': 'address',
                },
                {
                    'indexed': True,
                    'name': '_to',
                    'type': 'address',
                },
                {
                    'indexed': False,
                    'name': '_value',
                    'type': 'uint256',
                },
            ],
            'name': 'Transfer',
            'type': 'event',
        },
        {
            'anonymous': False,
            'inputs': [
                {
                    'indexed': True,
                    'name': '_owner',
                    'type': 'address',
                },
                {
                    'indexed': True,
                    'name': '_spender',
                    'type': 'address',
                },
                {
                    'indexed': False,
                    'name': '_value',
                    'type': 'uint256',
                },
            ],
            'name': 'Approval',
            'type': 'event',
        },
    ],
    'code': '0x6060604052600160a060020a0333166000908152602081905260409020805460ff19166001179055610d1c806100356000396000f3606060405236156100cf5760e060020a6000350463095ea7b381146100d157806318160ddd146100e657806323b872dd146100f057806334b7ac9b146101095780634fc9c91a146101165780635cd2f4d31461018c57806369c8b344146101a95780636e0bd282146101c157806370a08231146101da5780637d32e7bd146101ff5780637dd564111461021957806396286cc91461023f578063a9059cbb14610292578063b3c06f50146102a7578063d0def521146102c8578063dd62ed3e14610325578063f46eccc41461035b575b005b61037660043560243560006104278383610196565b61038a6001545b90565b610376600435602435604435600061042e8484846102b4565b61038a6357e31f006100ed565b61039c6004356040805160208181018352600080835284815260028083528451918590208054600181161561010002600019011691909104601f810184900484028301840190955284825292939092918301828280156104615780601f1061043657610100808354040283529160200191610461565b6103766004356024355b6000808281141561046d575b5092915050565b61038a60043560036020526000908152604090205481565b6103766004356000806357e31f00421061062657610002565b61038a600435600160a060020a0381166000908152600360205260409020545b919050565b6103766004356024355b60008082811415610700576101a2565b61040a600435600081815260026020526040902060010154600160a060020a03166101fa565b610376600435600160a060020a038116600090815260036020526040812054811480159061028b575060408082205482526002602052812060010154600160a060020a03908116908316145b90506101fa565b61037660043560243560006104278383610209565b6103766004356024356044355b60008082811415610871575b509392505050565b60408051602060248035600481810135601f81018590048502860185019096528585526103769581359591946044949293909201918190840183828082843750949650505050505050600080806357e31f004210610b0057610002565b61038a600435602435600160a060020a038281166000908152600460209081526040808320938516835292905220545b92915050565b61037660043560006020819052908152604090205460ff1681565b604080519115158252519081900360200190f35b60408051918252519081900360200190f35b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156103fc5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60408051600160a060020a03929092168252519081900360200190f35b9050610355565b949350505050565b820191906000526020600020905b81548152906001019060200180831161044457829003601f168201915b505050505090506101fa565b600083815260026020908152604091829020825160e060020a634f57331d02815260048101919091529151859273__TokenLib______________________________92634f57331d9260248381019382900301818660325a03f4156100025750506040515190911490506104e457600091506101a2565b5060008281526002602052604090206001810154600160a060020a03908116339091161461051557600091506101a2565b33600160a060020a0316600090815260036020526040902054831461053d57600091506101a2565b33600160a060020a03908116600081815260046020908152604080832094891680845294825291829020879055815187815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3604080517fafb95eed00000000000000000000000000000000000000000000000000000000815233600160a060020a0390811660048301528616602482015260448101859052905173__TokenLib______________________________9163afb95eed91606480830192600092919082900301818660325a03f41561000257505050600191506101a2565b506000828152600260208181526040808420600180820154600160a060020a0316865260038452828620869055825180850193849052869052815482875295849020925160ff19168255909485946106a49492821615610100026000190190911604601f01048101905b808211156106fc5760008155600101610690565b5050600181018054600160a060020a03191690556040805184815290517f8535b0d6f3fe3bb87e3f03bc05112b6ceeb7a980eb24403785da9e70a409561d9181900360200190a1505060018054600019018155919050565b5090565b600083815260026020908152604091829020825160e060020a634f57331d02815260048101919091529151859273__TokenLib______________________________92634f57331d9260248381019382900301818660325a03f41561000257505060405151909114905061077757600091506101a2565b600160a060020a0384166000908152600360205260408120541461079e57600091506101a2565b5060008281526002602052604090206001810154600160a060020a0390811633909116146107cf57600091506101a2565b600181018054600160a060020a0319168517905533600160a060020a03908116600081815260036020526040808220829055928716808252838220879055835160e060020a6385d5c9710281526004810193909352602483015260448201869052915173__TokenLib______________________________926385d5c971926064808201939182900301818660325a03f41561000257505050600191506101a2565b600083815260026020908152604091829020825160e060020a634f57331d02815260048101919091529151859273__TokenLib______________________________92634f57331d9260248381019382900301818660325a03f4156100025750506040515190911490506108e857600091506102c0565b600160a060020a0384166000908152600360205260408120541461090f57600091506102c0565b5060008281526002602052604090206001810154600160a060020a039081169086161461093f57600091506102c0565b600160a060020a038516600090815260036020526040902054831461096757600091506102c0565b600160a060020a0385811660009081526004602090815260408083203390941683529290522054831461099d57600091506102c0565b600181018054600160a060020a03191685179055600160a060020a0385811660008181526003602090815260408083208390558885168084528184208990558484526004835281842033909616845294825280832092909255815187815291517fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a36040805160e060020a6385d5c971028152600160a060020a0387811660048301528616602482015260448101859052905173__TokenLib______________________________916385d5c97191606482810192600092919082900301818660325a03f41561000257505050600191506102c0565b5050600160a060020a038516600081815260036020908152604091829020859055815185815291517fd55909a3222b4688b86d9a5ff4d4660b08fc8b66c20c62bba968a42382d275ca9281900390910190a2600180548101815592505b505092915050565b33600160a060020a031660009081526020819052604090205460ff161515610b2b5760009250610af8565b600160a060020a03851660009081526003602052604081205414610b525760009250610af8565b73__TokenLib______________________________6319a9c2f1856040518260e060020a02815260040180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f168015610bd95780820380516001836020036101000a031916815260200191505b50925050506020604051808303818660325a03f4156100025750506040805180516000818152600260209081529084902060e060020a634f57331d02845260048401819052935191965092945073__TokenLib______________________________9350634f57331d9260248381019391929182900301818660325a03f41561000257505050604051805190602001506000191682600019161415610c815760009250610af8565b60018181018054600160a060020a031916871790558451825460008481526020908190208594600290841615610100026000190190931692909204601f9081018290048301939291890190839010610cec57805160ff19168380011785555b50610a9b929150610690565b82800160010185558215610ce0579182015b82811115610ce0578251826000505591602001919060010190610cfe56',
    'code_runtime': '0x606060405236156100cf5760e060020a6000350463095ea7b381146100d157806318160ddd146100e657806323b872dd146100f057806334b7ac9b146101095780634fc9c91a146101165780635cd2f4d31461018c57806369c8b344146101a95780636e0bd282146101c157806370a08231146101da5780637d32e7bd146101ff5780637dd564111461021957806396286cc91461023f578063a9059cbb14610292578063b3c06f50146102a7578063d0def521146102c8578063dd62ed3e14610325578063f46eccc41461035b575b005b61037660043560243560006104278383610196565b61038a6001545b90565b610376600435602435604435600061042e8484846102b4565b61038a6357e31f006100ed565b61039c6004356040805160208181018352600080835284815260028083528451918590208054600181161561010002600019011691909104601f810184900484028301840190955284825292939092918301828280156104615780601f1061043657610100808354040283529160200191610461565b6103766004356024355b6000808281141561046d575b5092915050565b61038a60043560036020526000908152604090205481565b6103766004356000806357e31f00421061062657610002565b61038a600435600160a060020a0381166000908152600360205260409020545b919050565b6103766004356024355b60008082811415610700576101a2565b61040a600435600081815260026020526040902060010154600160a060020a03166101fa565b610376600435600160a060020a038116600090815260036020526040812054811480159061028b575060408082205482526002602052812060010154600160a060020a03908116908316145b90506101fa565b61037660043560243560006104278383610209565b6103766004356024356044355b60008082811415610871575b509392505050565b60408051602060248035600481810135601f81018590048502860185019096528585526103769581359591946044949293909201918190840183828082843750949650505050505050600080806357e31f004210610b0057610002565b61038a600435602435600160a060020a038281166000908152600460209081526040808320938516835292905220545b92915050565b61037660043560006020819052908152604090205460ff1681565b604080519115158252519081900360200190f35b60408051918252519081900360200190f35b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156103fc5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60408051600160a060020a03929092168252519081900360200190f35b9050610355565b949350505050565b820191906000526020600020905b81548152906001019060200180831161044457829003601f168201915b505050505090506101fa565b600083815260026020908152604091829020825160e060020a634f57331d02815260048101919091529151859273__TokenLib______________________________92634f57331d9260248381019382900301818660325a03f4156100025750506040515190911490506104e457600091506101a2565b5060008281526002602052604090206001810154600160a060020a03908116339091161461051557600091506101a2565b33600160a060020a0316600090815260036020526040902054831461053d57600091506101a2565b33600160a060020a03908116600081815260046020908152604080832094891680845294825291829020879055815187815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3604080517fafb95eed00000000000000000000000000000000000000000000000000000000815233600160a060020a0390811660048301528616602482015260448101859052905173__TokenLib______________________________9163afb95eed91606480830192600092919082900301818660325a03f41561000257505050600191506101a2565b506000828152600260208181526040808420600180820154600160a060020a0316865260038452828620869055825180850193849052869052815482875295849020925160ff19168255909485946106a49492821615610100026000190190911604601f01048101905b808211156106fc5760008155600101610690565b5050600181018054600160a060020a03191690556040805184815290517f8535b0d6f3fe3bb87e3f03bc05112b6ceeb7a980eb24403785da9e70a409561d9181900360200190a1505060018054600019018155919050565b5090565b600083815260026020908152604091829020825160e060020a634f57331d02815260048101919091529151859273__TokenLib______________________________92634f57331d9260248381019382900301818660325a03f41561000257505060405151909114905061077757600091506101a2565b600160a060020a0384166000908152600360205260408120541461079e57600091506101a2565b5060008281526002602052604090206001810154600160a060020a0390811633909116146107cf57600091506101a2565b600181018054600160a060020a0319168517905533600160a060020a03908116600081815260036020526040808220829055928716808252838220879055835160e060020a6385d5c9710281526004810193909352602483015260448201869052915173__TokenLib______________________________926385d5c971926064808201939182900301818660325a03f41561000257505050600191506101a2565b600083815260026020908152604091829020825160e060020a634f57331d02815260048101919091529151859273__TokenLib______________________________92634f57331d9260248381019382900301818660325a03f4156100025750506040515190911490506108e857600091506102c0565b600160a060020a0384166000908152600360205260408120541461090f57600091506102c0565b5060008281526002602052604090206001810154600160a060020a039081169086161461093f57600091506102c0565b600160a060020a038516600090815260036020526040902054831461096757600091506102c0565b600160a060020a0385811660009081526004602090815260408083203390941683529290522054831461099d57600091506102c0565b600181018054600160a060020a03191685179055600160a060020a0385811660008181526003602090815260408083208390558885168084528184208990558484526004835281842033909616845294825280832092909255815187815291517fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a36040805160e060020a6385d5c971028152600160a060020a0387811660048301528616602482015260448101859052905173__TokenLib______________________________916385d5c97191606482810192600092919082900301818660325a03f41561000257505050600191506102c0565b5050600160a060020a038516600081815260036020908152604091829020859055815185815291517fd55909a3222b4688b86d9a5ff4d4660b08fc8b66c20c62bba968a42382d275ca9281900390910190a2600180548101815592505b505092915050565b33600160a060020a031660009081526020819052604090205460ff161515610b2b5760009250610af8565b600160a060020a03851660009081526003602052604081205414610b525760009250610af8565b73__TokenLib______________________________6319a9c2f1856040518260e060020a02815260040180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f168015610bd95780820380516001836020036101000a031916815260200191505b50925050506020604051808303818660325a03f4156100025750506040805180516000818152600260209081529084902060e060020a634f57331d02845260048401819052935191965092945073__TokenLib______________________________9350634f57331d9260248381019391929182900301818660325a03f41561000257505050604051805190602001506000191682600019161415610c815760009250610af8565b60018181018054600160a060020a031916871790558451825460008481526020908190208594600290841615610100026000190190931692909204601f9081018290048301939291890190839010610cec57805160ff19168380011785555b50610a9b929150610690565b82800160010185558215610ce0579182015b82811115610ce0578251826000505591602001919060010190610cfe56',
    'meta': {
        'compilerVersion': 'Version: 0.3.6-0/Release-Darwin/appleclang\n',
        'language': 'Solidity',
    },
    'source': None,
}


if __name__ == '__main__':
    main()
