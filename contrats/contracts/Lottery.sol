// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Lottery {
    uint256 public lotteryBalance;
    uint256 public totalTickets;
    uint256 public ticketPrice;
    address public owner;

    struct Player {
        string name;
        string addr;
        uint numberOfTicketsBought;
    }

    mapping(address => Player) public players;

    event PlayerAdded(address indexed playerAddress, string name, uint256 numberOfTicketsBought);
    
    event LotteryWinner(address winner, uint256 prize);

    event LotteryLoser(address loser);

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner{
        require(msg.sender == owner, "Only owner can call");
        _;
    }

     function setLotteryTicketPrice(uint256 _lotteryTicketPrice) public onlyOwner{
        ticketPrice = _lotteryTicketPrice;
    }

    function getTotalTicketsBought() public view returns (uint256) {
        return totalTickets;
    }

    function getLotteryPoolBalance() public view returns (uint256) {
        return totalTickets * (ticketPrice);
    }

    function addPlayer(string memory _name, string memory _addr, uint256 _numberOfTicketsBought) public payable {
        require(_numberOfTicketsBought > 0, "Number of tickets bought should be greater than 0");
        require(msg.value == _numberOfTicketsBought * (ticketPrice), "Insufficient funds to buy tickets");

        Player storage player = players[msg.sender];
        player.name = _name;
        player.addr = _addr;
        player.numberOfTicketsBought = player.numberOfTicketsBought + (_numberOfTicketsBought);

        totalTickets += _numberOfTicketsBought;
        lotteryBalance += msg.value;

        emit PlayerAdded(msg.sender, _name, _numberOfTicketsBought);
    }

    function drawWinner() public onlyOwner{
        require(totalTickets > 0, "No players in the lottery pool");

        // Generate a random number between 0 and totalTicketsBought - 1
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, totalTickets))) % totalTickets;

        address payable winner;
        uint256 winningAmount;

        // Find the player corresponding to the winning ticket
        uint256 count = 0;
        address payable[] memory playerAddresses = new address payable[](totalTickets);
        for (uint256 i = 0; i < totalTickets; i++) {
            Player memory player = players[playerAddresses[i]];
            for (uint256 j = 0; j < player.numberOfTicketsBought; j++) {
                if (count == randomNumber) {
                    winner = payable(playerAddresses[i]);
                    break;
                }
                count++;
            }
            if (winner != address(0)) {
                break;
            }
        }

        // Calculate the winning amount and transfer it to the winner and the owner
        winningAmount = lotteryBalance * 95/100;
        (bool sent, bytes memory data) = winner.call{value: winningAmount}("");
        (bool sent2, bytes memory data2) = owner.call{value: lotteryBalance - winningAmount}("");
        require(sent, "Failed to send Ether to winner");
        require(sent2, "Failed to send Ether to owner");

        // Reset the lottery pool for the next round
        totalTickets = 0;
        lotteryBalance = 0;

        // Emit an event with the winner and the winning amount
        emit LotteryWinner(winner, winningAmount);
    }
}
