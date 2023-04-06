import { LotteryAddress, lotteryABI } from './constants'

const createLotteryContract = web3 => {
  return new web3.eth.Contract(lotteryABI, LotteryAddress)
}

export default createLotteryContract
