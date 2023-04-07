import { createContext, useState, useEffect, useContext } from 'react'
import Web3 from 'web3'
export const appContext = createContext()
import {myContract, w3} from '../utils/lottery'

export const AppProvider = ({ children }) => {
  const [web3, setWeb3] = useState()
  const [address, setAddress] = useState(null)
  const [lotteryPool, setLotteryPool] = useState()
  const [lotteryTicketPrice, setLotteryTicketPrice] = useState()
  const [lotteryPlayers, setPlayers] = useState([])
  const [lastWinner, setLastWinner] = useState([])
  const [lotteryID, setLotteryID] = useState()
  const [poolIsOpen, setPoolIsOpen] = useState()
  const [userIsOwner, setUserIsOwner] = useState()
  const [userIsPlayer, setUserIsPlayer] = useState()
  const [etherscanUrl, setEtherscanUrl] = useState()


  useEffect(() => {
    updateLottery()
  }, [])
  
  const updateLottery = async () => {      
      try {
        const pool = await myContract.methods.getPoolBalance().call()

        setLotteryPool(w3.utils.fromWei(pool, 'ether'))

        setPlayers(await myContract.methods.getPlayers().call())

        setLotteryID(await myContract.methods.lotteryID().call())

        setPoolIsOpen(await myContract.methods.IsPoolOpen().call())

        setLotteryTicketPrice(await myContract.methods.getTicketPrice().call())

        setUserIsOwner(await myContract.methods.IsUserOwner().call())

        setUserIsPlayer(await myContract.methods.IsUserPlayer().call())

        setLastWinner(await myContract.methods.getWinners().call())
        console.log([...lastWinner], 'Last Winners')

      } catch (error) {

        console.log(error, 'updateLottery')

      }
  }

  const enterLottery = async (name, numberOfTicketsBought) => {
    try {
      console.log('Entering lottery pool')
      console.log(myContract !== null)
      await myContract.methods.enterPool(name, numberOfTicketsBought).send({
        from: address,
        // 0.015 ETH in Wei
        value: '15000000000000000',
        // 0.0003 ETH in Gwei
        gas: 300000,
        gasPrice: null,
      })
      updateLottery()
    } catch (err) {
      console.log(err, 'enterLottery')
    }
  }

  const openPool = async (price) => {
    try {
      console.log('Opening lottery pool')
      let tx = await myContract.methods.openPool(price).send({
        from: address,
        gas: 300000,
        gasPrice: null,
      })

      console.log(tx)
      updateLottery()
    } catch (err) {
      console.log(err, 'openPool')
    }
  }

  const pickWinner = async () => {
    try {
      let tx = await myContract.methods.drawWinner().send({
        from: address,
        gas: 300000,
        gasPrice: null,
      })

      console.log(tx)
      setEtherscanUrl('https://ropsten.etherscan.io/tx/' + tx.transactionHash)
      updateLottery()
    } catch (err) {
      console.log(err, 'draw Winner')
    }
  }

  const connectWallet = async () => {
    if (
      typeof window !== 'undefined' &&
      typeof window.ethereum !== 'undefined'
    ) {
      try {

        await window.ethereum.request({ method: 'eth_requestAccounts' })

        const web3 = new Web3(window.ethereum)

        setWeb3(web3)

        await web3.eth.getAccounts((err, accounts) => { setAddress(accounts[0]) })

        window.ethereum.on('accountsChanged', async () => {
          await web3.eth.getAccounts((err, accounts) => { setAddress(accounts[0]) })
          updateLottery()
        })

        updateLottery()
      } catch (err) {
        console.log(err, 'connect Wallet')
      }
    } else {

      console.log('Please install MetaMask')
    }
  }

  const disconnectWallet = async () => {
    try {
      /* check if MetaMask is installed */
      if (
        typeof window !== 'undefined' &&
        typeof window.ethereum !== 'undefined'
      ) {
        /* disconnect the wallet */
        await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] })
        /* clear the web3 instance from state */
        setWeb3(null)
        /* clear the address from state */
        setAddress(null)
        /* clear the lottery contract from state */
      }
    } catch (err) {
      console.log(err, 'disconnect Wallet')
    }
  }

  return (
    <appContext.Provider
      value={{
        address,
        connectWallet,
        disconnectWallet,
        lotteryPool,
        lotteryTicketPrice,
        lotteryPlayers,
        enterLottery,
        pickWinner,
        lotteryID,
        lastWinner,
        etherscanUrl,
        openPool,
        poolIsOpen,
        userIsOwner,
        userIsPlayer
      }}
    >
      {children}
    </appContext.Provider>
  )
}

export const useAppContext = () => {
  return useContext(appContext)
}
