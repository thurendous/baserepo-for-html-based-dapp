// in node js you use `require()`
// in front-end you cannot use require()
// we will use import keyword is better

// const {ethers} = require("ethers")
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fund")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdraw")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

console.log(ethers)

console.log("hi bro")
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({
                method: "eth_requestAccounts",
            })
        } catch (error) {
            console.log(error)
        }
        console.log("connected now")
        connectButton.innerHTML = "Conneted!"
    } else {
        console.log("metamask is not here")

        document.getElementById("Please install metamask!")
    }
}

// fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding with ${ethAmount}...`)
    if (typeof window.ethereum !== undefined) {
        fundButton.innerHTML = "Funded"
        // provider
        // signer / wallet / someone with some gas
        // contract we are interacting with
        // ^ ABI & Address

        // with the above info we can send transacitons to the contract

        // this line is like JsonRpcProvider(alchemy end point)
        //
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner() // this will return the account of the wallet to us
        console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer) // ?
        try {
        const transactionResponse = await contract.fund({
            value: ethers.utils.parseEther(ethAmount),
        })
        // listen for the tx to be mined

        // listen for an event <- we haven't learned about yet
        await listenForTransactionMine(transactionResponse, provider) // this line actually is not asynchronous
        console.log(`222done!`)
        } catch (error) {
            console.log(error, "error deta")
        } 
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}....`)
    return new Promise((resolve, reject) => {
    // create a listener for a blockchain
        provider.once(transactionResponse.hash, (transactionResponse) => {
            console.log(`${transactionResponse.confirmations} is finished`)
            resolve()
        })
    })
}

async function getBalance() {
    if(typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
        document.getElementById("ethBalance").innerHTML = `contract balance is now ${ethers.utils.formatEther(balance)}`
    }
}

// withdraw function
async function withdraw() {
    if(typeof window.ethereum !== "undefined") {
        withdrawButton.innerHTML = "is withdrew"

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner() // this will return the account of the wallet to us
        console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer) // ?
        const currentBalance = await provider.getBalance(contractAddress) 

        document.getElementById('withdrawingBalance').innerHTML = `withdrawing ${currentBalance} ETH`
        
        try {
            const transactionResponse = await contract.withdraw()
            // listen for the tx to be mined
            // listen for an event <- we haven't learned about yet
            await listenForTransactionMine(transactionResponse, provider) // this line actually is not asynchronous
            console.log(`222done!`)
            document.getElementById('withdrawingBalance').innerHTML = `withdrawing finished`
        } catch (error) {
            console.log(error, "error deta")
        } 
    }
}