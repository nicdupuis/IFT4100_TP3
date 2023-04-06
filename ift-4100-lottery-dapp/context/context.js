import { createContext, useState, useEffect, useContext } from 'react'
import Web3 from 'web3'
import createLotteryContract from '../utils/lottery'
export const appContext = createContext()

export const AppProvider = ({ children }) => {
  const [web3, setWeb3] = useState()
  const [address, setAddress] = useState('')
  const [lotteryContract, setLotteryContract] = useState()
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
  }, [lotteryContract])

  const updateLottery = async () => {
    if (lotteryContract) {
      
      try {
        const pool = await lotteryContract.methods.getPoolBalance().call()

        setLotteryPool(web3.utils.fromWei(pool, 'ether'))

        setPlayers(await lotteryContract.methods.getPlayers().call())

        setLotteryID(await lotteryContract.methods.lotteryID().call())

        setPoolIsOpen(await lotteryContract.methods.IsPoolOpen().call())

        setLotteryTicketPrice(await lotteryContract.methods.getTicketPrice().call())

        setUserIsOwner(await lotteryContract.methods.IsUserOwner().call())

        setUserIsPlayer(await lotteryContract.methods.IsUserPlayer().call())

        setLastWinner(await lotteryContract.methods.getWinners().call())
        console.log([...lastWinner], 'Last Winners')

      } catch (error) {

        console.log(error, 'updateLottery')

      }
    }
  }

  const enterLottery = async (name, numberOfTicketsBought) => {
    try {
      console.log('Entering lottery pool')
      await lotteryContract.methods.enterPool(name, numberOfTicketsBought).send({
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

  const openPool = async () => {
    try {
      console.log('Opening lottery pool')
      let tx = await lotteryContract.methods.openPool().send({
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

  const setTicketPrice = async () => {
    try {
      console.log('Setting lottery ticket price')
      let tx = await lotteryContract.methods.setTicketPrice().send({
        from: address,
        gas: 300000,
        gasPrice: null,
      })

      console.log(tx)
      updateLottery()
    } catch (err) {
      console.log(err, 'setTicketPrice')
    }
  }


  const pickWinner = async () => {
    try {
      let tx = await lotteryContract.methods.pickWinner().send({
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
    /* check if MetaMask is installed */
    if (
      typeof window !== 'undefined' &&
      typeof window.ethereum !== 'undefined'
    ) {
      try {
        /* request wallet connection */
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        /* create web3 instance & set to state */
        const web3 = new Web3(window.ethereum)
        /* set web3 instance in React state */
        setWeb3(web3)
        /* get list of accounts */
        const accounts = await web3.eth.getAccounts((err, accounts) => { setAddress(accounts[0]) })
        /* set account 1 to React state */
        //setAddress(accounts[0])
        setLotteryContract(createLotteryContract(web3))
        window.ethereum.on('accountsChanged', async () => {
          const accounts = await web3.eth.getAccounts()

          /* set account 1 to React state */
          setAddress(accounts[0])
        })
        updateLottery()
      } catch (err) {
        console.log(err, 'connect Wallet')
      }
    } else {
      /* MetaMask is not installed */
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
        setLotteryContract(null)
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
        setTicketPrice,
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
