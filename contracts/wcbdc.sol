// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WholesaleCBDC {

    // State variables
    address public centralBank;  // Address of the central bank
    mapping(address => uint256) public balances;  // CBDC balances of participant banks

    // Events
    event CBDCIssued(address indexed to, uint256 amount);
    event CBDCTransferred(address indexed from, address indexed to, uint256 amount);

    // Modifiers
    modifier onlyCentralBank() {
        require(msg.sender == centralBank, "Only the central bank can call this function");
        _;
    }

    // Constructor
    constructor() {
        centralBank = msg.sender; // The deploying address becomes the central bank
    }

    // Issuance of CBDC to participant banks by the central bank
    function issueCBDC(address to, uint256 amount) public onlyCentralBank {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than zero");

        balances[to] += amount;
        emit CBDCIssued(to, amount);
    }

    // Transfer CBDC between participant banks
    function transferCBDC(address to, uint256 amount) public {
        require(to != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than zero");
        require(balances[msg.sender] >= amount, "Insufficient CBDC balance");

        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit CBDCTransferred(msg.sender, to, amount);
    }

    // Get the CBDC balance of a participant bank
    function getCBDCBalance(address participant) public view returns (uint256) {
        return balances[participant];
    }

    // Allow the central bank to reclaim CBDC from participant banks (e.g., for regulatory purposes)
    function reclaimCBDC(address from, uint256 amount) public onlyCentralBank {
        require(from != address(0), "Invalid sender address");
        require(amount > 0, "Amount must be greater than zero");
        require(balances[from] >= amount, "Insufficient CBDC balance");

        balances[from] -= amount;
    }

    function convertToUSD(uint cbdcAmount) external {
        // Implement currency conversion to USD
        // This function would interact with an external oracle or exchange to perform the conversion.
        // The exchange rate would be obtained from an off-chain source and used to calculate the USD equivalent.
    }
    
    function convertToCBDC(uint usdAmount) external {
        // Implement currency conversion from USD to CBDC
        // This function would interact with an external oracle or exchange to perform the conversion.
        // The exchange rate would be obtained from an off-chain source and used to calculate the CBDC equivalent.
    }
    
}
