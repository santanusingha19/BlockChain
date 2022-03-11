// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    //address public lastWinner;

    function Lottery() public {
        manager = msg.sender;
    }
    function enter() public payable {
        require(msg.value > 0.01 ether);
        players.push(msg.sender);
    }
    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, block.timestamp, players.length));
    }
    function pickWinner() payable public restricted {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        // lastWinner = players[index];
        players = new address[](0);
    }
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    function getPlayers()  public view returns (address[] memory) {
        return players;
    }
}