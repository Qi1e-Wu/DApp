// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract P2PLending {
    struct LoanRequest {
        address payable borrower;
        uint256 amount;
        uint256 interestRate; // annual interest rate as percentage
        uint256 duration; // loan duration in seconds
        bool isFunded;
        bool isRepaid;
    }

    LoanRequest[] public loanRequests;

    mapping(address => uint256) public balances;

    event LoanRequested(uint256 indexed loanId, address indexed borrower, uint256 amount, uint256 interestRate, uint256 duration);
    event LoanFunded(uint256 indexed loanId, address indexed lender);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower);

    function requestLoan(uint256 _amount, uint256 _interestRate, uint256 _duration) external {
        require(_amount > 0, "Loan amount must be greater than zero.");
        require(_interestRate > 0, "Interest rate must be greater than zero.");
        require(_duration > 0, "Loan duration must be greater than zero.");

        loanRequests.push(LoanRequest({
            borrower: payable(msg.sender),
            amount: _amount,
            interestRate: _interestRate,
            duration: _duration,
            isFunded: false,
            isRepaid: false
        }));

        emit LoanRequested(loanRequests.length - 1, msg.sender, _amount, _interestRate, _duration);
    }

    function fundLoan(uint256 _loanId) external payable {
        require(_loanId < loanRequests.length, "Loan ID does not exist.");
        LoanRequest storage loan = loanRequests[_loanId];
        require(!loan.isFunded, "Loan is already funded.");
        require(msg.value == loan.amount, "Incorrect loan amount.");

        loan.isFunded = true;
        loan.borrower.transfer(msg.value);

        emit LoanFunded(_loanId, msg.sender);
    }

    function repayLoan(uint256 _loanId) external payable {
        require(_loanId < loanRequests.length, "Loan ID does not exist.");
        LoanRequest storage loan = loanRequests[_loanId];
        require(loan.isFunded, "Loan is not funded.");
        require(!loan.isRepaid, "Loan is already repaid.");
        require(msg.sender == loan.borrower, "Only the borrower can repay the loan.");

        uint256 repaymentAmount = loan.amount + (loan.amount * loan.duration * loan.interestRate) / (365 days * 100);
        require(msg.value == repaymentAmount, "Incorrect repayment amount.");

        balances[msg.sender] += msg.value;
        loan.isRepaid = true;

        emit LoanRepaid(_loanId, loan.borrower);
    }

    function getLoansByBorrower(address _borrower) external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < loanRequests.length; i++) {
            if (loanRequests[i].borrower == _borrower) {
                count++;
            }
        }

        uint256[] memory borrowerLoans = new uint256[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < loanRequests.length; i++) {
            if (loanRequests[i].borrower == _borrower) {
                borrowerLoans[index] = i;
                index++;
            }
        }

        return borrowerLoans;
    }

    function getUnfundedLoans() external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < loanRequests.length; i++) {
            if (!loanRequests[i].isFunded) {
                count++;
            }
        }

        uint256[] memory unfundedLoans = new uint256[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < loanRequests.length; i++) {
            if (!loanRequests[i].isFunded) {
                unfundedLoans[index] = i;
                index++;
            }
        }

        return unfundedLoans;
    }

    function withdraw() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No funds to withdraw.");
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function getLoanRequestsCount() external view returns (uint256) {
        return loanRequests.length;
    }

    function getLoanDetails(uint256 _loanId) external view returns (
        address borrower,
        uint256 amount,
        uint256 interestRate,
        uint256 duration,
        bool isFunded,
        bool isRepaid
    ) {
        require(_loanId < loanRequests.length, "Loan ID does not exist.");
        LoanRequest storage loan = loanRequests[_loanId];
        return (loan.borrower, loan.amount, loan.interestRate, loan.duration, loan.isFunded, loan.isRepaid);
    }
}

