use near_sdk::{ borsh };
use borsh::{ BorshDeserialize, BorshSerialize };
use near_sdk::{
    env, near_bindgen, AccountId, Balance, Promise, PromiseResult, 
    ext_contract, serde_json,
    collections::{ UnorderedMap },
    json_types::{ U128, U64 },
};
use near_contract_standards::non_fungible_token::{Token};

#[global_allocator]
static ALLOC: near_sdk::wee_alloc::WeeAlloc = near_sdk::wee_alloc::WeeAlloc::INIT;

// const ONE_NEAR: u128 = 1_000_000_000_000_000_000_000_000;
const PROB:u8 = 128;
const FRACTIONAL_BASE: u128 = 100_000;

#[ext_contract(ext_nft)]
trait NftFetch {
    // fn nft_tokens(&self, from_index: Option<U128>, limit: Option<u64>) -> Vec<JsonToken>;
    fn nft_tokens(&self) -> Vec<Token>;
}

#[ext_contract(ext_self)]
trait Selfcallback {
    fn callback_nft_owners_fetch(&mut self) -> Vec<Promise>;
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct SlotMachine {
    pub owner_id: AccountId,
    pub nft_id: AccountId,
    pub credits: UnorderedMap<AccountId, Balance>,
    pub nft_fee: u128, // base 10e-5
    pub dev_fee: u128, // base 10e-5
    pub house_fee: u128,
    pub win_multiplier: u128, // base 10e-5
    pub nft_balance: u128,
    pub dev_balance: u128,
    pub base_gas: u64
}

impl Default for SlotMachine {
    fn default() -> Self {
        panic!("Should be initialized before usage")
    }
}

#[near_bindgen]
impl SlotMachine {
    #[init]
    pub fn new(owner_id: AccountId, nft_id: AccountId, nft_fee: U128, dev_fee: U128, house_fee: U128, win_multiplier: U128, base_gas: U64) -> Self {
        assert!(env::is_valid_account_id(owner_id.as_bytes()), "Invalid owner account");
        assert!(!env::state_exists(), "Already initialized");
        Self {
            owner_id,
            nft_id,
            credits: UnorderedMap::new(b"credits".to_vec()),
            nft_fee: nft_fee.0, // 4000
            dev_fee: dev_fee.0, // 500
            house_fee: house_fee.0, // 500
            win_multiplier: win_multiplier.0, // 20000
            nft_balance: 0,
            dev_balance: 0,
            base_gas: base_gas.0
        }
    }

    #[payable]
    pub fn deposit(&mut self) {
        let account_id = env::predecessor_account_id();
        let deposit = env::attached_deposit();
        let mut credits = self.credits.get(&account_id).unwrap_or(0);
        credits = credits + deposit;
        self.credits.insert(&account_id, &credits);
    }
    
    pub fn retrieve_credits(&mut self) -> Promise {
        let account_id = env::predecessor_account_id();
        let credits: u128 = self.credits.get(&account_id).unwrap_or(0).into();
        let new_credits: u128 = 0;
        self.credits.insert(&account_id, &new_credits);
        Promise::new(env::predecessor_account_id()).transfer(credits)
    }

    pub fn get_credits(&self, account_id: AccountId) -> U128 {
        self.credits.get(&account_id).unwrap_or(0).into()
    }

    //bet_type heads == true, tails == false
    pub fn play(&mut self, _bet_type: bool, bet_size: U128) -> bool {

        // check that user has credits
        let account_id = env::predecessor_account_id();
        let mut credits = self.credits.get(&account_id).unwrap_or(0);
        assert!(credits > bet_size.0, "no credits to play");

        // charge dev and nft fees
        let mut net_bet: u128 = bet_size.0;
        let nft_cut: u128 = (&net_bet * self.nft_fee) / FRACTIONAL_BASE;
        let dev_cut: u128 = (&net_bet * self.dev_fee) / FRACTIONAL_BASE;
        let house_cut: u128 = (&net_bet * self.house_fee) / FRACTIONAL_BASE;
        
        net_bet = net_bet - &nft_cut - &dev_cut - &house_cut;
        self.nft_balance = self.nft_balance + nft_cut;
        self.dev_balance = self.dev_balance + dev_cut;

        // send off credits
        credits = credits - bet_size.0;
        
        let rand: u8 = *env::random_seed().get(0).unwrap();
        let outcome: bool = rand < PROB;
        if outcome {
            let won_value = (net_bet * self.win_multiplier) / FRACTIONAL_BASE;
            credits = credits + won_value;
        }

        self.credits.insert(&account_id, &credits);
        outcome
    }

    //retrieve dev funds function
    pub fn retrieve_dev_funds(&mut self) -> Promise {
        let dev_account_id = self.owner_id.clone();

        let withdrawal_dev_balance = self.dev_balance.clone();

        self.dev_balance = 0;

        Promise::new(dev_account_id).transfer(withdrawal_dev_balance)
    }

    //adapt to cross contract calls
    pub fn retrieve_nft_funds(&mut self) -> Promise {
        let base_gas: u64 = self.base_gas;

        let nft_account_id = self.nft_id.clone();

        //fetch nft holders wallets
        let nft_tokens = ext_nft::nft_tokens(&nft_account_id, 0, base_gas).then(
            ext_self::callback_nft_owners_fetch(
                &env::current_account_id(),
                0,
                base_gas
            ),
        );
        nft_tokens
    }

    #[private]
    pub fn callback_nft_owners_fetch(&mut self) -> Vec<Promise> {
        assert_eq!(env::promise_results_count(), 1, "ERR_TOO_MANY_RESULTS");
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Successful(value) => {

                let mut nft_owner_count = std::collections::HashMap::<AccountId, u128>::new();
                let mut owner_count: u128;
                let mut total_nft_count: u128 = 0;

                let nft_tokens = serde_json::from_slice::<Token>(&value);
                for val in nft_tokens.iter() {
                    owner_count = nft_owner_count.get(&val.owner_id).unwrap_or(&0).clone();
                    nft_owner_count.insert(val.owner_id.clone(), owner_count);
                    total_nft_count = total_nft_count + 1;
                }

                let mut promise_vector: Vec<Promise> = Vec::new();
                let withdrawal_nft_balance = self.nft_balance.clone();
                self.nft_balance = 0;
                let piece_nft_balance = withdrawal_nft_balance / total_nft_count;

                for (key, value) in &nft_owner_count {
                    let promise_var: Promise = Promise::new(key.clone()).transfer(value * piece_nft_balance);
                    promise_vector.push(promise_var)
                }

                promise_vector
            },
            PromiseResult::Failed => env::panic(b"ERR_CALL_FAILED"),
        }
    }

    //update contract initialization vars
    pub fn update_contract(&mut self, nft_fee: U128, dev_fee: U128, house_fee: U128, win_multiplier: U128, base_gas: U64) {
        assert!(env::predecessor_account_id() == self.owner_id, "Only owner can call this function");
        self.nft_fee = nft_fee.0;
        self.dev_fee = dev_fee.0;
        self.house_fee = house_fee.0;
        self.win_multiplier = win_multiplier.0;
        self.base_gas = base_gas.0;
    }

    //return current contract state
    pub fn get_contract_state(&self) -> std::collections::HashMap<String, String> {
        let mut state = std::collections::HashMap::new();
        
        state.insert(String::from("owner_id"), self.owner_id.to_string());
        state.insert(String::from("nft_id"), self.nft_id.to_string());
        state.insert(String::from("nft_fee"), self.nft_fee.to_string());
        state.insert(String::from("dev_fee"), self.dev_fee.to_string());
        state.insert(String::from("house_fee"), self.house_fee.to_string());
        state.insert(String::from("win_multiplier"), self.win_multiplier.to_string());
        state.insert(String::from("nft_balance"), self.nft_balance.to_string());
        state.insert(String::from("dev_balance"), self.dev_balance.to_string());
        state.insert(String::from("base_gas"), self.base_gas.to_string());

        state
    }
}


// use the attribute below for unit tests
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    const CONTRACT_ACCOUNT: &str = "contract.testnet";
    const SIGNER_ACCOUNT: &str = "signer.testnet";
    const OWNER_ACCOUNT: &str = "owner.testnet";
    const NFT_ACCOUNT: &str = "nft.testnet";

    fn get_context(input: Vec<u8>, is_view: bool, attached_deposit: u128, account_balance: u128) -> VMContext {
        VMContext {
            current_account_id: CONTRACT_ACCOUNT.to_string(),
            signer_account_id:  SIGNER_ACCOUNT.to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id:  SIGNER_ACCOUNT.to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    #[test]
    fn test_deposit_function() {
        // set up the mock context into the testing environment
        const BASE_DEPOSIT: u128 = 10_000_000;
        let context = get_context(vec![], false, BASE_DEPOSIT.clone(), 0);
        testing_env!(context);
        // instantiate a contract variable with the counter at zero
        let mut contract =  SlotMachine {
            owner_id: OWNER_ACCOUNT.to_string(),
            nft_id: NFT_ACCOUNT.to_string(),
            credits: UnorderedMap::new(b"credits".to_vec()),
            nft_fee: 400, // base 10e-5
            dev_fee: 10, // base 10e-5
            house_fee: 10,
            win_multiplier: 200000u128, // base 10e-5
            nft_balance: 0,
            dev_balance: 0,
            base_gas: 0
        };
        let user_balance1: u128 = contract.credits.get(&"signer.testnet".to_string()).unwrap_or(0);
        println!("Value before deposit: {}", &user_balance1);
        contract.deposit();
        let user_balance2: u128 = contract.credits.get(&"signer.testnet".to_string()).unwrap_or(0);
        println!("Value after deposit: {}", &user_balance2);
        // confirm that we received 1 when calling get_num
        assert_eq!(BASE_DEPOSIT, user_balance2);
    }

    #[test]
    fn test_withdrawal_function() {
        // set up the mock context into the testing environment
        const BASE_DEPOSIT: u128 = 48_000;
        const CONTRACT_BALANCE: u128 = 1_000_000_000_000_000;
        const WITHDRAWAL_AMOUNT: u128 = 48_000;
        let context = get_context(vec![], false, BASE_DEPOSIT.clone(), CONTRACT_BALANCE.clone());
        testing_env!(context);
        // instantiate a contract variable with the counter at zero
        let mut contract =  SlotMachine {
            owner_id: OWNER_ACCOUNT.to_string(),
            nft_id: NFT_ACCOUNT.to_string(),
            credits: UnorderedMap::new(b"credits".to_vec()),
            nft_fee: 400, // base 10e-5
            dev_fee: 10, // base 10e-5
            house_fee: 10,
            win_multiplier: 200000, // base 10e-5
            nft_balance: 0,
            dev_balance: 0,
            base_gas: 0
        };
    
        contract.credits.insert(&SIGNER_ACCOUNT.to_string(), &WITHDRAWAL_AMOUNT);
        let user_balance1: u128 = contract.credits.get(&"signer.testnet".to_string()).unwrap_or(0);
        println!("Value before withdrawal: {}", &user_balance1);
        contract.retrieve_credits();
        let user_balance2: u128 = contract.credits.get(&"signer.testnet".to_string()).unwrap_or(0);
        println!("Value after withdrawal: {}", &user_balance2);
        // confirm that we received 1 when calling get_num
        assert_eq!(WITHDRAWAL_AMOUNT, user_balance1);
        assert_eq!(0, user_balance2);
    }

    #[test]
    fn test_get_credits_function() {
        // set up the mock context into the testing environment
        const BASE_DEPOSIT: u128 = 0;
        const CONTRACT_BALANCE: u128 = 0;
        let context = get_context(vec![], false, BASE_DEPOSIT.clone(), CONTRACT_BALANCE.clone());
        testing_env!(context);
        // instantiate a contract variable with the counter at zero
        let mut contract =  SlotMachine {
            owner_id: OWNER_ACCOUNT.to_string(),
            nft_id: NFT_ACCOUNT.to_string(),
            credits: UnorderedMap::new(b"credits".to_vec()),
            nft_fee: 400, // base 10e-5
            dev_fee: 10, // base 10e-5
            house_fee: 10,
            win_multiplier: 200000, // base 10e-5
            nft_balance: 0,
            dev_balance: 0,
            base_gas: 0
        };
        
        const BALANCE_AMOUNT: u128 = 48_000;
        contract.credits.insert(&SIGNER_ACCOUNT.to_string(), &BALANCE_AMOUNT);
        let user_balance: u128 =  contract.get_credits(SIGNER_ACCOUNT.clone().to_string()).into();

        assert_eq!(BALANCE_AMOUNT, user_balance);
    }

    #[test]
    fn test_get_credits_function_assert_view() {
        // set up the mock context into the testing environment
        const BASE_DEPOSIT: u128 = 0;
        const CONTRACT_BALANCE: u128 = 0;
        let context = get_context(vec![], true, BASE_DEPOSIT.clone(), CONTRACT_BALANCE.clone());
        testing_env!(context);
        // instantiate a contract variable with the counter at zero
        let contract =  SlotMachine {
            owner_id: OWNER_ACCOUNT.to_string(),
            nft_id: NFT_ACCOUNT.to_string(),
            credits: UnorderedMap::new(b"credits".to_vec()),
            nft_fee: 400, // base 10e-5
            dev_fee: 10, // base 10e-5
            house_fee: 10,
            win_multiplier: 200000, // base 10e-5
            nft_balance: 0,
            dev_balance: 0,
            base_gas: 0
        };
        
        let user_balance: u128 =  contract.get_credits(SIGNER_ACCOUNT.clone().to_string()).into();

        assert_eq!(0, user_balance);
    }

    //missing:
    // play

    #[test]
    fn test_play_function() {
        // set up the mock context into the testing environment
        const BASE_DEPOSIT: u128 = 0;
        const CONTRACT_BALANCE: u128 = 0;
        let context = get_context(vec![], false, BASE_DEPOSIT.clone(), CONTRACT_BALANCE.clone());
        testing_env!(context);
        // instantiate a contract variable with the counter at zero
        let mut contract =  SlotMachine {
            owner_id: OWNER_ACCOUNT.to_string(),
            nft_id: NFT_ACCOUNT.to_string(),
            credits: UnorderedMap::new(b"credits".to_vec()),
            nft_fee: 4000, // base 10e-5
            dev_fee: 500, // base 10e-5
            house_fee: 500,
            win_multiplier: 20000, // base 10e-5
            nft_balance: 0,
            dev_balance: 0,
            base_gas: 0
        };
        println!("Game won: {}", 20000 / FRACTIONAL_BASE);
        const BALANCE_AMOUNT: u128 = 10_000;
        contract.credits.insert(&SIGNER_ACCOUNT.to_string(), &BALANCE_AMOUNT);

        const BET_AMOUNT: u128 = 100;

        let mut start_balance: u128;
        let mut end_balance: u128;
        let mut game_won: bool;

        let dev_fee: u128 = (&BET_AMOUNT * contract.dev_fee) / FRACTIONAL_BASE;
        let nft_fee: u128 = (&BET_AMOUNT * contract.nft_fee) / FRACTIONAL_BASE;
        let house_fee: u128 = (&BET_AMOUNT * contract.house_fee) / FRACTIONAL_BASE;
        let net_bet: u128 = BET_AMOUNT.clone() - dev_fee - nft_fee - house_fee;
        let net_won: u128 = (net_bet * contract.win_multiplier) / FRACTIONAL_BASE ;

        let total_count: u128 = 30;
        let mut loop_counter: u128 = 0;
        while loop_counter < total_count {

            start_balance = contract.get_credits(SIGNER_ACCOUNT.clone().to_string()).into();
            game_won = contract.play(true, U128(BET_AMOUNT));
            end_balance = contract.get_credits(SIGNER_ACCOUNT.clone().to_string()).into();
                
            if game_won {
                assert_eq!(start_balance - BET_AMOUNT + net_won, end_balance, "user balance doesn't match play result");
            } else {
                assert_eq!(start_balance - BET_AMOUNT, end_balance, "user balance doesn't match play result");
            }
            loop_counter = loop_counter + 1;
        }
        
        assert_eq!(contract.nft_balance, nft_fee * total_count, "nft_fee failure");
        assert_eq!(contract.dev_balance, dev_fee * total_count, "dev_fee failure");
    }

    // update contract
    // assert panic when no owner calls
    // assert change when owner calls
    #[test]
    #[should_panic]
    fn test_update_contract_function_assert_panic_no_owner() {
        // set up the mock context into the testing environment
        const BASE_DEPOSIT: u128 = 0;
        const CONTRACT_BALANCE: u128 = 0;
        let context = get_context(vec![], false, BASE_DEPOSIT.clone(), CONTRACT_BALANCE.clone());
        testing_env!(context);
        // instantiate a contract variable with the counter at zero
        let mut contract =  SlotMachine {
            owner_id: OWNER_ACCOUNT.to_string(),
            nft_id: NFT_ACCOUNT.to_string(),
            credits: UnorderedMap::new(b"credits".to_vec()),
            nft_fee: 4000, // base 10e-5
            dev_fee: 500, // base 10e-5
            house_fee: 500,
            win_multiplier: 20000, // base 10e-5
            nft_balance: 0,
            dev_balance: 0,
            base_gas: 0
        };
        
        contract.update_contract(U128(10), U128(10), U128(10), U128(10), U64(10));
    }

    #[test]
    fn test_update_contract_function() {
        // set up the mock context into the testing environment
        const BASE_DEPOSIT: u128 = 0;
        const CONTRACT_BALANCE: u128 = 0;
        let context = get_context(vec![], false, BASE_DEPOSIT.clone(), CONTRACT_BALANCE.clone());
        testing_env!(context);
        // instantiate a contract variable with the counter at zero
        let mut contract =  SlotMachine {
            owner_id: SIGNER_ACCOUNT.to_string(),
            nft_id: NFT_ACCOUNT.to_string(),
            credits: UnorderedMap::new(b"credits".to_vec()),
            nft_fee: 4000, // base 10e-5
            dev_fee: 500, // base 10e-5
            house_fee: 500,
            win_multiplier: 20000, // base 10e-5
            nft_balance: 0,
            dev_balance: 0,
            base_gas: 0
        };
        
        contract.update_contract(U128(10), U128(10), U128(10), U128(10), U64(10));

        assert_eq!(contract.nft_fee, 10, "nft_fee");
        assert_eq!(contract.dev_fee, 10, "dev_fee");
        assert_eq!(contract.house_fee, 10, "house_fee");
        assert_eq!(contract.win_multiplier, 10, "win_multiplier");
        assert_eq!(contract.base_gas, 10, "base_gas");
    }

    #[test]
    fn test_get_contract_state() {
        // set up the mock context into the testing environment
        const BASE_DEPOSIT: u128 = 0;
        const CONTRACT_BALANCE: u128 = 0;
        let context = get_context(vec![], false, BASE_DEPOSIT.clone(), CONTRACT_BALANCE.clone());
        testing_env!(context);
        // instantiate a contract variable with the counter at zero
        let contract =  SlotMachine {
            owner_id: OWNER_ACCOUNT.to_string(),
            nft_id: NFT_ACCOUNT.to_string(),
            credits: UnorderedMap::new(b"credits".to_vec()),
            nft_fee: 400, // base 10e-5
            dev_fee: 10, // base 10e-5
            house_fee: 10,
            win_multiplier: 200000, // base 10e-5
            nft_balance: 0,
            dev_balance: 0,
            base_gas: 0
        };
        
        let contract_copy: std::collections::HashMap<String, String> =  contract.get_contract_state();

        assert_eq!(contract_copy.get("owner_id").unwrap().clone(), contract.owner_id.to_string());
        assert_eq!(contract_copy.get("nft_id").unwrap().clone(), contract.nft_id.to_string());

        assert_eq!(contract_copy.get("nft_fee").unwrap().clone(), contract.nft_fee.to_string());
        assert_eq!(contract_copy.get("dev_fee").unwrap().clone(), contract.dev_fee.to_string());
        assert_eq!(contract_copy.get("house_fee").unwrap().clone(), contract.house_fee.to_string());
        assert_eq!(contract_copy.get("win_multiplier").unwrap().clone(), contract.win_multiplier.to_string());
        assert_eq!(contract_copy.get("nft_balance").unwrap().clone(), contract.nft_balance.to_string());
        assert_eq!(contract_copy.get("dev_balance").unwrap().clone(), contract.dev_balance.to_string());
        assert_eq!(contract_copy.get("base_gas").unwrap().clone(), contract.base_gas.to_string());
    }

    // dev funds
    //how to test transfers to multiple wallets and cross contract calls
}