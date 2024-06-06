// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
contract Assess{
    address payable public Owner;
    uint public Balance;
    
    event Deposit(uint amount);
    event Withdraw(uint amount);

    constructor(uint initial_Balance) payable {
        Owner = payable(msg.sender);
        Balance = initial_Balance;
    }
function getBalance() public view returns(uint){
        return Balance;
    }

    function deposit(uint _amount) public payable {
        uint _previous_Balance = Balance;
        require(msg.sender == Owner, "we are extreamlly sorry to say that You are not the owner of this account");
        Balance = Balance + _amount;
        assert(Balance == _previous_Balance + _amount);
        emit Deposit(_amount);
    }

    error InsufficientBalance(uint balance, uint withdraw_Amount);

    function withdraw(uint _withdraw_Amount) public {
        require(msg.sender == Owner, "we are extreamlly sorry to say that You are not the owner of this account");
        uint _previous_Balance = Balance;
        if (Balance < _withdraw_Amount) {
            revert InsufficientBalance({
                balance: Balance,
                withdraw_Amount: _withdraw_Amount
            });
        }
        Balance = Balance - _withdraw_Amount;
        assert(Balance == (_previous_Balance - _withdraw_Amount));
        emit Withdraw(_withdraw_Amount);
    }
}

