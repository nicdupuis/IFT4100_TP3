// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

//import "@/SafeMath.sol";

contract Lottery {
    //using SafeMath for uint256;

    // State variables
    address immutable CONTRACT_OWNER;
    address public owner;
    uint256 public ticketPrice;
    uint public lotteryID;
    bool public isPoolOpen;
    bool public isWinnerDrawn;
    uint256 public totalTickets;
    uint256 public poolBalance;
    uint256 public ticketNumber;

    address[] public winners;
    address payable[] public players;
    mapping(address => string) public playerName;
    mapping(address => uint256) public playerTickets;
    mapping(uint256 => address) public ticketToPlayer;

    // Events
    event PoolOpened(uint256 ticketPrice);
    event PlayerAdded(address indexed playerAddress, string name, uint256 numberOfTicketsBought);
    event LotteryWinner(address winner, uint256 prize);
    event LotteryLoser(address loser);

    // Constructor
    constructor(){
        owner = 0x0Aa92C26C95Bc8971ba0dE285862D9Bc7FCd5EC9;
        CONTRACT_OWNER = 0x0Aa92C26C95Bc8971ba0dE285862D9Bc7FCd5EC9;
        lotteryID = 0;
    }

    // Modifier to allow only owner to call certain functions
    modifier onlyOwner{
        require(msg.sender == owner, "Only the contract owner can call this function.");
        _;
    }

    //========== GETTERS ==========//
    function IsPoolOpen() public view returns (bool) {
        return isPoolOpen;
    }

    function IsUserOwner() public view returns (bool) {
        return msg.sender == owner;
    }

    function IsUserPlayer() public view returns (bool) {
        for (uint i = 0; i < players.length; i++) {
            if (players[i] == msg.sender) {
                return true;
            }
        }
        return false;
    }

    // Get the total number of tickets bought by players
    function getTotalTicketsBought() public view returns (uint256) {
        return totalTickets;
    }

    // Get the current balance of the lottery pool
    function getPoolBalance() public view returns (uint256) {
        return totalTickets * (ticketPrice);
    }

    function getTicketPrice() public view returns (uint256) {
        return ticketPrice;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function getLotteryID() public view returns(uint) {
        return lotteryID;
    }

      function getWinners() public view returns (address[] memory){
        return winners;
    }

    
    //========== SETTERS ==========//

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

    //========== METHODS ==========//
    // Add a player to the lottery pool
    function enterPool(string memory _name, uint256 _numberOfTicketsBought) public payable {
        require(isPoolOpen, "Lottery pool is not yet open.");
        require(_numberOfTicketsBought > 0, "Number of tickets bought should be greater than 0");

        players.push(payable(msg.sender));
        playerName[msg.sender] = _name;
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
        winners.push(winner);
        uint256 amountWon = poolBalance * 95 / 100;
        uint256 ownerFee = poolBalance - amountWon;
        
        winner.call{value: amountWon};
        CONTRACT_OWNER.call{value: ownerFee};


        // Reset the lottery pool for the next round
        totalTickets = 0;
        poolBalance = 0;
        lotteryID++;

        players = new address payable[](0);

        // Emit an event with the winner and the winning amount
        emit LotteryWinner(winner, amountWon);
    }
}