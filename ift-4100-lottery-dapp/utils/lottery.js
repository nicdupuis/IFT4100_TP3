import { LotteryAddress, lotteryABI } from './constants'
import Web3 from 'web3'

const provider = new Web3.providers.HttpProvider("http://localhost:7545")

const w3 = new Web3("http://localhost:7545")

const myContract = new w3.eth.Contract(lotteryABI, LotteryAddress)

export {myContract, w3}
