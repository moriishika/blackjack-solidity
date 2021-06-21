// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

contract BlackJack{
    uint pot = 1000000;
    address dealer;

    mapping(address => uint256) players;
}