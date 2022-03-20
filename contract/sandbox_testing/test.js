const nearAPI = require("near-api-js");
const BN = require("bn.js");
const BigNumber = require('bignumber.js');
const fs = require("fs").promises;
const assert = require("assert").strict;


function getConfig(env) {
    switch (env) {
        case "sandbox":
        case "local":
            return {
                networkId: "sandbox",
                nodeUrl: "http://localhost:3030",
                masterAccount: "test.near",
                coinContractAccount: "coin.test.near",
                nftContractAccount: "nft.test.near",
                keyPath: "/tmp/near-sandbox/validator_key.json",
            };
    }
}

const coinContractMethods = {
    viewMethods: ["get_contract_state"],
    changeMethods: ["get_credits", "deposit", "retrieve_credits", "play", "retrieve_dev_funds", "retrieve_nft_funds", "update_contract", "new"],
};

const nftContractMethods = {
    viewMethods: ["nft_tokens"],
    changeMethods: ["nft_mint", "new_default_meta"],
};

let config;
let masterAccount;
let masterKey;
let pubKey;
let keyStore;
let near;

async function initNear() {
    config = getConfig(process.env.NEAR_ENV || "sandbox");
    const keyFile = require(config.keyPath);
    masterKey = nearAPI.utils.KeyPair.fromString(
        keyFile.secret_key || keyFile.private_key
    );
    pubKey = masterKey.getPublicKey();
    keyStore = new nearAPI.keyStores.InMemoryKeyStore();
    keyStore.setKey(config.networkId, config.masterAccount, masterKey);
    near = await nearAPI.connect({
        deps: {
            keyStore,
        },
        networkId: config.networkId,
        nodeUrl: config.nodeUrl,
    });
    masterAccount = new nearAPI.Account(near.connection, config.masterAccount);
    console.log("Finish init NEAR");
}

async function createUser(accountPrefix) {
    let accountId = accountPrefix + "." + config.masterAccount;
    await masterAccount.createAccount(
        accountId,
        pubKey,
        new BN(10).pow(new BN(25))
    );
    keyStore.setKey(config.networkId, accountId, masterKey);
    const account = new nearAPI.Account(near.connection, accountId);
    return account;
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

async function initTest() {
    const coinContractBinary = await fs.readFile("../coin_flip_contract/target/wasm32-unknown-unknown/release/classy_kangaroo_coin_flip.wasm");
    const _coinContractAccount = await masterAccount.createAndDeployContract(
        config.coinContractAccount,
        pubKey,
        coinContractBinary,
        new BN(10).pow(new BN(25))
    );

    const nftContractBinary = await fs.readFile("../nep_171/target/wasm32-unknown-unknown/release/non_fungible_token.wasm");
    const _nftContractAccount = await masterAccount.createAndDeployContract(
        config.nftContractAccount,
        pubKey,
        nftContractBinary,
        new BN(10).pow(new BN(25))
    );

    const devUser = await createUser("dev");

    const hodler1 = await createUser("hodler1");
    const hodler2 = await createUser("hodler2");
    const hodler3 = await createUser("hodler3");

    const devNftUser = await createContractUser(devUser, config.nftContractAccount, nftContractMethods);
    const devCoinUser = await createContractUser(devUser, config.coinContractAccount, coinContractMethods);

    const hodler1NftUser = await createContractUser(hodler1, config.nftContractAccount, nftContractMethods);
    const hodler1CoinUser = await createContractUser(hodler1, config.coinContractAccount, coinContractMethods);

    const hodler2NftUser = await createContractUser(hodler2, config.nftContractAccount, nftContractMethods);
    const hodler2CoinUser = await createContractUser(hodler2, config.coinContractAccount, coinContractMethods);

    const hodler3NftUser = await createContractUser(hodler3, config.nftContractAccount, nftContractMethods);
    const hodler3CoinUser = await createContractUser(hodler3, config.coinContractAccount, coinContractMethods);

    console.log("Finish deploy contracts and create test accounts");
    return {
        devUser,
        hodler1,
        hodler2,
        hodler3,
        devNftUser,
        devCoinUser,
        hodler1NftUser,
        hodler1CoinUser,
        hodler2NftUser,
        hodler2CoinUser,
        hodler3NftUser,
        hodler3CoinUser
    };
}

async function test() {
    // 1. Creates testing accounts and deploys a contract
    await initNear();
    const {
        devUser,
        hodler1,
        hodler2,
        hodler3,
        devNftUser,
        devCoinUser,
        hodler1NftUser,
        hodler1CoinUser,
        hodler2NftUser,
        hodler2CoinUser,
        hodler3NftUser,
        hodler3CoinUser
    } = await initTest();

    // 2. initialize deployed contracts
    await hodler1NftUser.new_default_meta({ args: { owner_id: hodler1.accountId } });

    let nft_fee = "4000";
    let dev_fee = "500";
    let house_fee = "500";
    let win_multiplier = "20000";
    await devCoinUser.new({
        args: {
            owner_id: config.coinContractAccount,
            nft_id: config.nftContractAccount,
            nft_fee: nft_fee,
            dev_fee: dev_fee,
            house_fee: house_fee,
            win_multiplier: win_multiplier,
            base_gas: 10
        }
    });

    console.log("1");

    // 2. mints 1 nft for each account
    await hodler1NftUser.nft_mint({ args: { token_id: "1", receiver_id: hodler1.accountId, token_metadata: {} }, amount: "15350000000000000000000" });
    await hodler1NftUser.nft_mint({ args: { token_id: "2", receiver_id: hodler2.accountId, token_metadata: {} }, amount: "15350000000000000000000" });
    await hodler1NftUser.nft_mint({ args: { token_id: "3", receiver_id: hodler3.accountId, token_metadata: {} }, amount: "15350000000000000000000" });

    let nftsBlob = await hodler1NftUser.nft_tokens({ args: {} });

    assert.equal(nftsBlob[0].owner_id, hodler1.accountId);
    assert.equal(nftsBlob[1].owner_id, hodler2.accountId);
    assert.equal(nftsBlob[2].owner_id, hodler3.accountId);

    console.log("2");

    // 3. check initial balance for dev accounts and hodler accounts
    let devBalance0 = await devUser.getAccountBalance();
    let hodler1Balance0 = await hodler1.getAccountBalance();
    let hodler2Balance0 = await hodler2.getAccountBalance();
    let hodler3Balance0 = await hodler3.getAccountBalance();

    devBalance0 = devBalance0.total;
    hodler1Balance0 = hodler1Balance0.total;
    hodler2Balance0 = hodler2Balance0.total;
    hodler3Balance0 = hodler3Balance0.total;

    console.log("3");

    // 4. test deposit function
    let depositAmount = nearAPI.utils.format.parseNearAmount("1");
    await hodler1CoinUser.deposit({
        args: {},
        amount: depositAmount
    });
    await hodler2CoinUser.deposit({
        args: {},
        amount: depositAmount
    });
    await hodler3CoinUser.deposit({
        args: {},
        amount: depositAmount
    });

    // let hodler1GameBalance0 = await hodler1CoinUser.get_credits({ args: { account_id: "AAA" } });
    // let hodler2GameBalance0 = await hodler1CoinUser.get_credits({ args: { account_id: hodler2.accountId } });
    // let hodler3GameBalance0 = await hodler1CoinUser.get_credits({ args: { account_id: hodler3.accountId } });
    // let devUserGameBalance0 = await hodler1CoinUser.get_credits({ args: { account_id: devUser.accountId } });

    // assert.equal(hodler1GameBalance0, depositAmount);
    // assert.equal(hodler2GameBalance0, depositAmount);
    // assert.equal(hodler3GameBalance0, depositAmount);
    // assert.equal(devUserGameBalance0, "0");

    console.log("4");

    // 5. play games and check that balance was added to dev and nft holders in game
    let betSize = 1000;
    await hodler1CoinUser.play({ args: { _bet_type: true, bet_size: betSize } })
    await hodler2CoinUser.play({ args: { _bet_type: true, bet_size: betSize } })
    await hodler3CoinUser.play({ args: { _bet_type: true, bet_size: betSize } })

    let contractState = await hodler1CoinUser.get_contract_state({ args: {} });
    //change to BigNumber
    assert.equal(parseFloat(contractState.dev_balance), 3 * betSize * dev_fee / 100000);
    assert.equal(parseFloat(contractState.nft_balance), 3 * betSize * nft_fee / 100000);

    // 6. test dev distribution
    let devBalance1 = contractState.dev_balance;
    let devNearBalance1 = await devUser.getAccountBalance();

    let promiseTransfer = await hodler1CoinUser.retrieve_dev_funds({ args: {} });
    console.log(promiseTransfer);
    await hodler1CoinUser.play({ args: { _bet_type: true, bet_size: betSize } })

    let contractState2 = await hodler1CoinUser.get_contract_state({ args: {} });
    let devBalance2 = contractState2.dev_balance;
    let devNearBalance2 = await devUser.getAccountBalance();

    console.log(devBalance1);
    console.log(devBalance2);
    console.log(devNearBalance1);
    console.log(devNearBalance2);

    assert.equal(devBalance2, "0");
    assert.equal(BigNumber(devNearBalance1.total).plus(BigNumber(devBalance1)).comparedTo(BigNumber(devNearBalance2.total)), 0);

    // 7. test nft holders distribution
    let nftBalance1 = contractState.nft_balance;

    // 8. test withdrawal function

    // 9. test state changing function
}

test();