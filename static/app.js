// app.js
function getRandomLightColor() {
    const hue = Math.floor(Math.random() * (310 - 200) + 200); // 色调限制在蓝色和紫色范围
    const saturation = Math.floor(Math.random() * 20) + 50; // 饱和度在45%-65%之间
    const lightness = Math.floor(Math.random() * 20) + 55; // 亮度在60%-80%之间
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');

        // Request account access if needed
        await ethereum.request({ method: 'eth_requestAccounts' });
        
        const web3 = new Web3(window.ethereum);

        // Ensure we're connected to Sepolia network
        const networkId = await web3.eth.net.getId();
        console.log(networkId)
        if (networkId !== 11155111 && networkId !== 11155111n) { // Sepolia's network ID is 11155111
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
        if (currentPage.includes("/request_a_loan")) {
            document.getElementById('loanRequestForm').addEventListener('submit', async (event) => {
                event.preventDefault();
                
                // 显示等待动画
                document.getElementById('loadingSpinner').style.display = 'block';
        
                const amount = document.getElementById('amount').value;
                const interestRate = document.getElementById('interestRate').value;
                const duration = document.getElementById('duration').value;
                console.log(amount + ' ' + interestRate + ' ' + duration)
                
                const accounts = await web3.eth.getAccounts();
        
                try {
                    await contract.methods.requestLoan(
                        web3.utils.toWei(amount, 'ether'), 
                        interestRate, 
                        duration * 24 * 60 * 60 // convert days to seconds
                    ).send({ from: accounts[0] });
        
                    alert('Loan Requested!');
                } catch (error) {
                    console.error("Transaction failed", error);
                    alert('Loan request failed.');
                } finally {
                    // 隐藏等待动画
                    document.getElementById('loadingSpinner').style.display = 'none';
                }
            });
        }
        

        // 资助贷款功能 (fund_a_loan.html)
        if (currentPage.includes("/fund_a_loan")) {
            // 显示等待动画
            document.getElementById('loadingSpinner').style.display = 'block';
        
            async function getLoanDetails(loanId) {
                const loanDetails = await contract.methods.getLoanDetails(loanId).call();
                return loanDetails;
            }
        
            try {
                const unFundedList = await contract.methods.getUnfundedLoans().call();
        
                const loanDetailsGrid = document.getElementById('loanDetailsGrid');
                loanDetailsGrid.innerHTML = ''; // 清空现有内容
                unFundedList.forEach(id => {
                    getLoanDetails(id).then(loan => {
                        console.log(loan);
                        const loanCard = document.createElement('div');
                        const color1 = getRandomLightColor();
                        const color2 = getRandomLightColor();
                        const backgroundStyle = `background: linear-gradient(135deg, ${color1}, ${color2});`;
                        loanCard.className = 'col-lg-4 col-md-6 col-sm-12 mb-4';
                        loanCard.innerHTML = `
                            <div class="card">
                                <div class="project-card" style="${backgroundStyle}">
                                    <h5 class="card-title">Loan ID: ${id}</h5>
                                    <p class="card-text"><strong>Borrower:</strong> ${loan.borrower}</p>
                                    <p class="card-text"><strong>Amount (ETH):</strong> ${web3.utils.fromWei(String(loan.amount), 'ether')}</p>
                                    <p class="card-text"><strong>Interest Rate:</strong> ${loan.interestRate}%</p>
                                    <p class="card-text"><strong>Duration (days):</strong> ${loan.duration / (24 * 60 * 60)}</p>
                                    <p class="card-text"><strong>Funded:</strong> ${loan.isFunded ? 'Yes' : 'No'}</p>
                                    <p class="card-text"><strong>Repaid:</strong> ${loan.isRepaid ? 'Yes' : 'No'}</p>
        
                                    <!-- 生成表单 -->
                                    <form id="fundLoanForm-${id}" class="fund-loan-form">
                                        <input type="hidden" id="loanIdFund-${id}" value="${id}">
                                        <input type="text" id="fundAmount-${id}" placeholder="Amount to fund (ETH)">
                                        <input type="submit" value="Fund" class="btn" style="background: linear-gradient(135deg, #6a11cb, #2575fc); color: white; border: 2px solid white; padding: 5px 15px; font-size: 12px; border-radius: 30px; box-shadow: 0 0 8px 2px white; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);">
                                    </form>
                                </div>
                            </div>
                        `;
                        loanDetailsGrid.appendChild(loanCard);
        
                        // 添加提交事件监听器
                        document.getElementById(`fundLoanForm-${id}`).addEventListener('submit', async (event) => {
                            event.preventDefault();
        
                            // 获取输入的 loanId 和 fundAmount
                            const loanId = document.getElementById(`loanIdFund-${id}`).value;
                            const fundAmount = document.getElementById(`fundAmount-${id}`).value;
        
                            const accounts = await web3.eth.getAccounts();
                            await contract.methods.fundLoan(loanId).send({
                                from: accounts[0],
                                value: web3.utils.toWei(fundAmount, 'ether')
                            });
        
                            alert('Loan Funded!');
        
                            // 重新刷新未资助贷款列表
                            await getUnfundedLoans(); 
                        });
                    });
                });
            } catch (error) {
                console.error("Error loading loan details:", error);
            } finally {
                // 隐藏等待动画
                document.getElementById('loadingSpinner').style.display = 'none';
            }
        }
        
        
        // 还款功能 (repay_a_loan.html)
        if (currentPage.includes("/repay_a_loan")) {
            document.getElementById('loadingSpinner').style.display = 'block';

            async function getLoanDetails(loanId) {
                const loanDetails = await contract.methods.getLoanDetails(loanId).call();
                return loanDetails;
            }
            const accounts = await web3.eth.getAccounts();
            try {
                const unFundedList = await contract.methods.getLoansByBorrower(accounts[0]).call();
        
                const loanDetailsGrid = document.getElementById('loanDetailsGrid');
                loanDetailsGrid.innerHTML = ''; // 清空现有内容
                unFundedList.forEach(id => {
                    getLoanDetails(id).then(loan => {
                        console.log(loan);
                        const loanCard = document.createElement('div');
                        const color1 = getRandomLightColor();
                        const color2 = getRandomLightColor();
                        const backgroundStyle = `background: linear-gradient(135deg, ${color1}, ${color2});`;
                        loanCard.className = 'col-lg-4 col-md-6 col-sm-12 mb-4';
                        loanCard.innerHTML = `
                            <div class="card">
                                <div class="project-card" style="${backgroundStyle}">
                                    <h5 class="card-title">Loan ID: ${id}</h5>
                                    <p class="card-text"><strong>Borrower:</strong> ${loan.borrower}</p>
                                    <p class="card-text"><strong>Amount (ETH):</strong> ${web3.utils.fromWei(String(loan.amount), 'ether')}</p>
                                    <p class="card-text"><strong>Interest Rate:</strong> ${loan.interestRate}%</p>
                                    <p class="card-text"><strong>Duration (days):</strong> ${loan.duration / (24 * 60 * 60)}</p>
                                    <p class="card-text"><strong>Funded:</strong> ${loan.isFunded ? 'Yes' : 'No'}</p>
                                    <p class="card-text"><strong>Repaid:</strong> ${loan.isRepaid ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                        `;
                        if (loan.isFunded === true && loan.isRepaid === false) {
                            loanCard.innerHTML += `
                                <form id="fundLoanForm-${id}" class="fund-loan-form">
                                    <input type="hidden" id="loanIdFund-${id}" value="${id}">
                                    <input type="text" id="fundAmount-${id}" placeholder="Amount to fund (ETH)">
                                    <input type="submit" value="Repay" class="btn" style="background: linear-gradient(135deg, #6a11cb, #2575fc); color: white; border: 2px solid white; padding: 5px 15px; font-size: 12px; border-radius: 30px; box-shadow: 0 0 8px 2px white; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);">
                                </form>
                            `;
                        }
        
                        loanDetailsGrid.appendChild(loanCard);
                        if (loan.isFunded === true && loan.isRepaid === false) {
                            document.getElementById(`fundLoanForm-${id}`).addEventListener('submit', async (event) => {
                                event.preventDefault();
        
                                // 获取输入的 loanId 和 fundAmount
                                const loanId = document.getElementById(`loanIdFund-${id}`).value;
                                const fundAmount = document.getElementById(`fundAmount-${id}`).value;
        
                                const accounts = await web3.eth.getAccounts();
                                await contract.methods.repayLoan(loanId).send({
                                    from: accounts[0],
                                    value: web3.utils.toWei(fundAmount, 'ether')
                                });
        
                                alert('Loan Funded!');
    
                            });
                        }

                    });
                });
            } catch (error) {
                console.error("Error loading loan details:", error);
            } finally {
                // 隐藏等待动画
                document.getElementById('loadingSpinner').style.display = 'none';
            }
        }
    } else {
        alert('Please install MetaMask!');
    }
});
