use std::str::from_utf8;
pub use near_sdk::json_types::{Base64VecU8, ValidAccountId, WrappedDuration, U128, U64};
pub use near_sdk::serde_json::json;
pub use near_sdk_sim::{call, view, deploy, init_simulator, to_yocto, ContractAccount, DEFAULT_GAS};
use std::convert::TryInto;

near_sdk_sim::lazy_static_include::lazy_static_include_bytes! {
    COIN_BYTES => "./target/wasm32-unknown-unknown/release/classy_kangaroo_coin_flip.wasm",
    NFT_BYTES => "../nep_171/target/wasm32-unknown-unknown/release/non_fungible_token.wasm",
}

#[test]
fn simulate_deployment() {

    let root = init_simulator(None);

    let dev_account = root.create_user("dev_account".to_string(), to_yocto("100"));
    
    let consumer1 = root.create_user("consumer1".to_string(), to_yocto("100"));
    let consumer2 = root.create_user("consumer2".to_string(), to_yocto("100"));
    let consumer3 = root.create_user("consumer3".to_string(), to_yocto("100"));

    // //deploy contracts
    let nft_account = root.deploy(
        &NFT_BYTES,
        "nft_contract".to_string(),
        to_yocto("100")
    );
    println!("1");

    let coin_account = root.deploy(
        &COIN_BYTES,
        "coin_contract".to_string(),
        to_yocto("100")
    );
    println!("2");

    root.call(
        nft_account.account_id(), 
        "new_default_meta", 
        &json!({
            "owner_id": dev_account.account_id()
        }).to_string().into_bytes(),
        DEFAULT_GAS, 
        0
    ).assert_success();

    println!("3");

    root.call(
        coin_account.account_id(), 
        "new", 
        &json!({"owner_id": dev_account.account_id(),
                "nft_id": nft_account.account_id(),
                "nft_fee": "4000",
                "dev_fee": "500",
                "house_fee": "500",
                "win_multiplier": "200000",
                "base_gas": DEFAULT_GAS.to_string()
        }).to_string().into_bytes(),
        DEFAULT_GAS, 
        0
    ).assert_success();
    println!("4");


    //user 1 gets 2 NFTs, user 2 gets 1, user 3 gets none
    let nft_mint_token = | account: String, token_id: String | {
        dev_account.call(
            nft_account.account_id(), 
            "nft_mint", 
            &json!({
                "token_id": token_id,
                "receiver_id": account,
                "token_metadata": {}
            }).to_string().into_bytes(),
            DEFAULT_GAS, 
            5870000000000000000000
        ).assert_success();
    };

    nft_mint_token(consumer1.account_id(), "1".to_string());
    nft_mint_token(consumer1.account_id(), "2".to_string());
    nft_mint_token(consumer2.account_id(), "3".to_string());

    println!("5");
    
    ///user 3 will be responsible for playing. (1) deposit test, (2) play test, (3) withdrawal test
    ///besides testing expected state changes, also test if state thet shouldn't mutate has done so
    
    //deposit
    let deposit_amount = to_yocto("10");

    consumer3.call(
        coin_account.account_id(), 
        "deposit", 
        &json!({}).to_string().into_bytes(),
        DEFAULT_GAS, 
        deposit_amount
    ).assert_success();

    println!("6");

    let consumer_balance0: String = consumer3.view(
        coin_account.account_id(), 
        "get_credits", 
        &json!({
            "account_id": consumer3.account_id()
        }).to_string().into_bytes(),
    ).unwrap_json();

    assert_eq!(consumer_balance0, deposit_amount.to_string());

    //play repeatedly and check user balance changes
    //check immutability of other user balances
    //check nft and dev balances

    //withdrawal funds

    //withdrawal nft funds

    //withdrawal dev funds

    //later test with other order (check unintended effects)
    //maybe error was that every Promise called the callback function?
}