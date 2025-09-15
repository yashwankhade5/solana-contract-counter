use solana_program::{
    account_info::{next_account_info, AccountInfo},entrypoint, entrypoint::{ProgramResult}, msg, program_error::ProgramError, pubkey::Pubkey
};
use borsh::{BorshDeserialize,BorshSerialize};

#[derive(BorshDeserialize,BorshSerialize)]
enum InstructionType {
    Increment(u32),
    Decrement(u32)
    
}

#[derive(BorshDeserialize,BorshSerialize)]
struct Counter {
    counter:u32
}



entrypoint!(counter_contract);

pub fn counter_contract(
    program_id:&Pubkey,
    accounts:&[AccountInfo],
    instruction_data:&[u8]
)-> ProgramResult {
    let acc = next_account_info(&mut accounts.iter()).unwrap();
   let  instruction_type = InstructionType::try_from_slice(instruction_data)?;
   let mut counter_data = Counter::try_from_slice(&acc.data.borrow())?;
   match instruction_type{
    InstructionType::Increment(v)=>{
        counter_data.counter += v
    }
    InstructionType::Decrement(v)=>{
        counter_data.counter -=v
    }
   }

  let n =  counter_data.serialize(&mut *acc.data.borrow_mut())?;

   Ok(())

}
