// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

contract BlackJack{
   
        uint pool = 1000000;
        address owner = msg.sender;


    function setBet(uint _betValue) public returns(uint){
        pool += _betValue;
        return pool;
    }

    function getCurrentPool() public view returns (uint){
        return pool;
    }
}
