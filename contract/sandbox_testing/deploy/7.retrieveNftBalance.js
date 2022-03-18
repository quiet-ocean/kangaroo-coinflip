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

    let masterCoinUser = await createContractUser(masterAccount, config.coinContractAccount, coinContractMethods);

    let contractState = await masterCoinUser.get_contract_state({ args: {} });
    console.log(contractState);

    let consume1iniBal = await consumer1Account.getAccountBalance();
    let consume2iniBal = await consumer2Account.getAccountBalance();
    let consume3iniBal = await consumer3Account.getAccountBalance();

    console.log(await masterCoinUser.retrieve_dev_funds({ args: {} }));

    let consume1finalBal = await consumer1Account.getAccountBalance();
    let consume2finalBal = await consumer2Account.getAccountBalance();
    let consume3finalBal = await consumer3Account.getAccountBalance();

    contractState = await masterCoinUser.get_contract_state({ args: {} });
    console.log(contractState);

    console.log(BigNumber(contractState.nft_balance).dividedBy(BigNumber("3")).toString());
    console.log(consume1iniBal.total);
    console.log(consume1finalBal.total);
    console.log(BigNumber(consume1finalBal.total).minus(BigNumber(consume1iniBal.total)).toString());

    console.log(consume2iniBal.total);
    console.log(consume2finalBal.total);
    console.log(BigNumber(consume2finalBal.total).minus(BigNumber(consume2iniBal.total)).toString());

    console.log(consume3iniBal.total);
    console.log(consume3finalBal.total);
    console.log(BigNumber(consume3finalBal.total).minus(BigNumber(consume3iniBal.total)).toString());
}

deployContracts();