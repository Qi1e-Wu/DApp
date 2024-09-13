// app.js
window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');

        // Request account access if needed
        await ethereum.request({ method: 'eth_requestAccounts' });
        
        const web3 = new Web3(window.ethereum);

        // Ensure we're connected to Sepolia network
        const networkId = await web3.eth.net.getId();
        if (networkId !== 11155111) { // Sepolia's network ID is 11155111
            alert('Please switch to the Sepolia network in MetaMask.');
            return;
        }

        // Replace with your deployed contract address on Sepolia
        const contractAddress = "0x1351DEcA90dAeE377C39Df14645e3e1F3cD7ad3F"; 

        // Replace with your contract's ABI
        const abi = [
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_loanId",
                        "type": "uint256"
                    }
                ],
                "name": "fundLoan",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "loanId",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "lender",
                        "type": "address"
                    }
                ],
                "name": "LoanFunded",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "loanId",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "borrower",
                        "type": "address"
                    }
                ],
                "name": "LoanRepaid",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "uint256",
                        "name": "loanId",
                        "type": "uint256"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "borrower",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "interestRate",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "duration",
                        "type": "uint256"
                    }
                ],
                "name": "LoanRequested",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_loanId",
                        "type": "uint256"
                    }
                ],
                "name": "repayLoan",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_interestRate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "_duration",
                        "type": "uint256"
                    }
                ],
                "name": "requestLoan",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "withdraw",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "balances",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_loanId",
                        "type": "uint256"
                    }
                ],
                "name": "getLoanDetails",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "borrower",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "interestRate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "duration",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isFunded",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isRepaid",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getLoanRequestsCount",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_borrower",
                        "type": "address"
                    }
                ],
                "name": "getLoansByBorrower",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getUnfundedLoans",
                "outputs": [
                    {
                        "internalType": "uint256[]",
                        "name": "",
                        "type": "uint256[]"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "loanRequests",
                "outputs": [
                    {
                        "internalType": "address payable",
                        "name": "borrower",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "interestRate",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "duration",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isFunded",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isRepaid",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ];

        const contract = new web3.eth.Contract(abi, contractAddress);

        const currentPage = window.location.pathname;

        // 贷款请求功能 (request_a_loan.html)
        if (currentPage.includes("request_a_loan.html")) {
            document.getElementById('loanRequestForm').addEventListener('submit', async (event) => {
                event.preventDefault();
                const amount = document.getElementById('amount').value;
                const interestRate = document.getElementById('interestRate').value;
                const duration = document.getElementById('duration').value;
                console.log(amount + ' ' + interestRate + ' ' + duration)
                const accounts = await web3.eth.getAccounts();
                await contract.methods.requestLoan(
                    web3.utils.toWei(amount, 'ether'), 
                    interestRate, 
                    duration * 24 * 60 * 60 // convert days to seconds
                ).send({ from: accounts[0] });

                alert('Loan Requested!');
            });
        }

        // 资助贷款功能 (fund_a_loan.html)
        if (currentPage.includes("fund_a_loan.html")) {
            async function getUnfundedLoans() {
                const loanIds = await contract.methods.getUnfundedLoans().call();
                console.log('Unfunded Loans:', loanIds);

                const loanList = document.getElementById('unfundedLoanList');
                loanList.innerHTML = '';
                loanIds.forEach(id => {
                    const li = document.createElement('li');
                    li.textContent = `Loan ID: ${id}`;
                    loanList.appendChild(li);
                });
            }

            await getUnfundedLoans();

            document.getElementById('fundLoanForm').addEventListener('submit', async (event) => {
                event.preventDefault();
                const loanId = document.getElementById('loanIdFund').value;
                const fundAmount = document.getElementById('fundAmount').value;

                const accounts = await web3.eth.getAccounts();
                await contract.methods.fundLoan(loanId).send({
                    from: accounts[0],
                    value: web3.utils.toWei(fundAmount, 'ether')
                });

                alert('Loan Funded!');
                await getUnfundedLoans(); // Refresh the list of unfunded loans
            });
        }

        // 还款功能 (repay_a_loan.html)
        if (currentPage.includes("repay_a_loan.html")) {
            async function getBorrowerLoans() {
                const accounts = await web3.eth.getAccounts();
                const loanIds = await contract.methods.getLoansByBorrower(accounts[0]).call();
                console.log('Loans for borrower:', loanIds);

                const loanList = document.getElementById('loanList');
                loanList.innerHTML = '';
                loanIds.forEach(id => {
                    const li = document.createElement('li');
                    li.textContent = `Loan ID: ${id}`;
                    loanList.appendChild(li);
                });
            }

            await getBorrowerLoans();

            document.getElementById('repayLoanForm').addEventListener('submit', async (event) => {
                event.preventDefault();
                const loanId = document.getElementById('loanIdRepay').value;
                const repayAmount = document.getElementById('repayAmount').value;

                const accounts = await web3.eth.getAccounts();
                await contract.methods.repayLoan(loanId).send({
                    from: accounts[0],
                    value: web3.utils.toWei(repayAmount, 'ether')
                });

                alert('Loan Repaid!');
                await getBorrowerLoans(); // Refresh the list of loans
            });
        }
    } else {
        alert('Please install MetaMask!');
    }
});
