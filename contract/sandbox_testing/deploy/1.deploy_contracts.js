const nearAPI = require("near-api-js");
const BN = require("bn.js");
const BigNumber = require('bignumber.js');
const fs = require("fs").promises;
const assert = require("assert").strict;


function getConfig(env) {
    switch (env) {
        case 'testnet':
            return {
                networkId: 'default',
                nodeUrl: 'https://rpc.testnet.near.org',
                masterAccount: "conflip.testnet",
                nftContract: "nft.conflip.testnet",
                coinContract: "coin.conflip.testnet",
                coinContractAccount: "coin3-contract.conflip.testnet",
                nftContractAccount: "nft3-contract.conflip.testnet",
                consumer1Account: "consumer1.conflip.testnet",
                consumer2Account: "consumer2.conflip.testnet",
                consumer3Account: "consumer3.conflip.testnet",
                walletUrl: 'https://wallet.testnet.near.org',
                helperUrl: 'https://helper.testnet.near.org',
                keyPath: "/home/jveiga/.near-credentials/testnet/conflip.testnet.json",
                keyPathCoin: "/home/jveiga/.near-credentials/testnet/coin.conflip.testnet.json",
                keyPathNft: "/home/jveiga/.near-credentials/testnet/nft.conflip.testnet.json",
                keyPath1: "/home/jveiga/.near-credentials/testnet/consumer1.conflip.testnet.json",
                keyPath2: "/home/jveiga/.near-credentials/testnet/consumer2.conflip.testnet.json",
                keyPath3: "/home/jveiga/.near-credentials/testnet/consumer3.conflip.testnet.json"
            };

    }
}

let config;
let masterAccount;
let coinAccount;
let nftAccount;
let consumer1Account;
let consumer2Account;
let consumer3Account;
let masterKey;
let pubKeymaster;
let keyStore = new nearAPI.keyStores.InMemoryKeyStore();
let near;

async function fetchAccount(keyPathString) {
    const keyFile = require(keyPathString);
    masterKey = nearAPI.utils.KeyPair.fromString(
        keyFile.secret_key || keyFile.private_key
    );
    return new nearAPI.Account(near.connection, config.masterAccount);
}

async function initNear() {
    config = getConfig(process.env.NEAR_ENV || "testnet");

    const keyFile = require(config.keyPath);
    masterKey = nearAPI.utils.KeyPair.fromString(
        keyFile.secret_key || keyFile.private_key
    );
    pubKeymaster = masterKey.getPublicKey();
    keyStore.setKey(config.networkId, config.masterAccount, masterKey);
    near = await nearAPI.connect({
        deps: {
            keyStore
        },
        networkId: config.networkId,
        nodeUrl: config.nodeUrl,
    });

    masterAccount = await fetchAccount(config.keyPath);
    coinAccount = await fetchAccount(config.keyPathCoin);
    nftAccount = await fetchAccount(config.keyPathNft);
    consumer1Account = await fetchAccount(config.keyPath1);
    consumer2Account = await fetchAccount(config.keyPath2);
    consumer3Account = await fetchAccount(config.keyPath3);
    console.log("Finish init NEAR");
}

async function createContractUser(
    account,
    contractAccountId,
    contractMethods
) {
    const accountUseContract = new nearAPI.Contract(
        account,
        contractAccountId,
        contractMethods
    );
    return accountUseContract;
}

const coinContractMethods = {
    viewMethods: ["get_credits", "get_contract_state"],
    changeMethods: ["deposit", "retrieve_credits", "play", "retrieve_dev_funds", "retrieve_nft_funds", "update_contract", "new"],
};

const nftContractMethods = {
    viewMethods: ["nft_tokens"],
    changeMethods: ["nft_mint", "new_default_meta"],
};

async function deployContracts() {

    await initNear();

    const coinContractBinary = await fs.readFile("../../coin_flip_contract/target/wasm32-unknown-unknown/release/classy_kangaroo_coin_flip.wasm");
    const _coinContractAccount = await masterAccount.createAndDeployContract(
        config.coinContractAccount,
        pubKeymaster,
        coinContractBinary,
        new BN(10).pow(new BN(25))
    );
    console.log("deploy coin");

    const nftContractBinary = await fs.readFile("../../nep_171/target/wasm32-unknown-unknown/release/non_fungible_token.wasm");
    const _nftContractAccount = await masterAccount.createAndDeployContract(
        config.nftContractAccount,
        pubKeymaster,
        nftContractBinary,
        new BN(10).pow(new BN(25))
    );
    console.log("deploy nft");

    let masterNftUser = await createContractUser(masterAccount, config.nftContractAccount, nftContractMethods);
    let masterCoinUser = await createContractUser(masterAccount, config.coinContractAccount, coinContractMethods);

    await masterNftUser.new_default_meta({ args: { owner_id: masterAccount.accountId } });
    let nft_fee = "4000";
    let dev_fee = "500";
    let house_fee = "500";
    let win_multiplier = "200000";
    await masterCoinUser.new({
        args: {
            owner_id: masterAccount.accountId,
            nft_id: config.nftContract,
            nft_fee: nft_fee,
            dev_fee: dev_fee,
            house_fee: house_fee,
            win_multiplier: win_multiplier,
            base_gas: "100000000"
        }
    });

    await masterNftUser.nft_mint({ args: { token_id: "1", receiver_id: consumer1Account.accountId, token_metadata: {} }, amount: "15350000000000000000000" });
    await masterNftUser.nft_mint({ args: { token_id: "2", receiver_id: consumer2Account.accountId, token_metadata: {} }, amount: "15350000000000000000000" });
    await masterNftUser.nft_mint({ args: { token_id: "3", receiver_id: consumer3Account.accountId, token_metadata: {} }, amount: "15350000000000000000000" });
}

deployContracts();