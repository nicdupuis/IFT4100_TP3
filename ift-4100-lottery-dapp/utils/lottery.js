import { LotteryAddress, LotteryABI } from './constants'
import Web3 from 'web3'

const LotteryProvider = new Web3.providers.HttpProvider("http://localhost:7545")

const LotteryWeb3 = new Web3(LotteryProvider)

const LotteryContract = new LotteryWeb3.eth.Contract(LotteryABI, LotteryAddress)

export {LotteryContract, LotteryWeb3}
