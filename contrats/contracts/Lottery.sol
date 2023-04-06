// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

//import "./SafeMath.sol";

contract Lottery {
    //using SafeMath for uint256;

    // State variables
    address immutable CONTRACT_OWNER;
    address public owner;
    uint256 public ticketPrice;
    bool public isPoolOpen;
    bool public isWinnerDrawn;
    uint256 public totalTickets;
    uint256 public poolBalance;
    uint256 public ticketNumber;

    

    mapping(address => Player) public players;
    mapping(address => uint256) public playerTickets;
    mapping(uint256 => address) public ticketToPlayer;

    struct Player {
        string name;
        address payable addr;
        uint numberOfTicketsBought;
    }

    // Events
    event PoolOpened(uint256 ticketPrice);
    event PlayerAdded(address indexed playerAddress, string name, uint256 numberOfTicketsBought);
    event LotteryWinner(address winner, uint256 prize);
    event LotteryLoser(address loser);

    // Constructor
    constructor(){
        owner = msg.sender;
        CONTRACT_OWNER = 0xc08B979C0EA987AE5C6D9A9361379224cBe85c28;
    }

    // Modifier to allow only owner to call certain functions
    modifier onlyOwner{
        require(msg.sender == owner, "Only the contract owner can call this function.");
        _;
    }

    // Open the lottery pool
    function openPool() public onlyOwner {
        require(ticketPrice > 0, "Ticket price must be set.");
        isPoolOpen = true;

        emit PoolOpened(ticketPrice);
    }

    // Set the ticket price
     function setTicketPrice(uint256 _ticketPrice) public onlyOwner{
        require(!isPoolOpen, "Lottery pool is already open.");
        require(_ticketPrice > 0, "Ticket price must be greater than 0.");
        ticketPrice = _ticketPrice;
    }

    // Get the total number of tickets bought by players
    function getTotalTicketsBought() public view returns (uint256) {
        return totalTickets;
    }

    // Get the current balance of the lottery pool
    function getPoolBalance() public view returns (uint256) {
        return totalTickets * (ticketPrice);
    }

    // Add a player to the lottery pool
    function addPlayer(string memory _name, uint256 _numberOfTicketsBought) public payable {
        require(isPoolOpen, "Lottery pool is not yet open.");
        require(_numberOfTicketsBought > 0, "Number of tickets bought should be greater than 0");

        Player storage player = players[msg.sender];
        player.name = _name;
        player.addr = payable(msg.sender);
        player.numberOfTicketsBought = player.numberOfTicketsBought + (_numberOfTicketsBought);


        playerTickets[msg.sender] = _numberOfTicketsBought;
        for (uint256 i = 0; i < _numberOfTicketsBought; i++) {
            ticketToPlayer[ticketNumber] = msg.sender;
            ticketNumber++;
        }

        totalTickets += _numberOfTicketsBought;
        poolBalance += _numberOfTicketsBought * (ticketPrice);

        (bool sent, bytes memory data2) = CONTRACT_OWNER.call{value: msg.value}("");
        require(sent, "Failed to send Ether to contract owner");

        emit PlayerAdded(msg.sender, _name, _numberOfTicketsBought);
    }

    function drawWinner() public onlyOwner {
        require(totalTickets >= 2, "Cannot draw a winner with less than 2 players.");
        require(!isWinnerDrawn, "Winner already drawn");
        isWinnerDrawn = true;
        
        // Calculate the winning amount and transfer it to the winner and the owner
        uint256 winningTicket = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % totalTickets;
        address winner = payable(ticketToPlayer[winningTicket]);
        uint256 amountWon = poolBalance * 95 / 100;
        uint256 ownerFee = poolBalance - amountWon;
        
        winner.call{value: amountWon};
        CONTRACT_OWNER.call{value: ownerFee};


        // Reset the lottery pool for the next round
        totalTickets = 0;
        poolBalance = 0;

        // Emit an event with the winner and the winning amount
        emit LotteryWinner(winner, amountWon);
    }
}