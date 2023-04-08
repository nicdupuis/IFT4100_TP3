import { createContext, useState, useEffect, useContext } from 'react'
import Web3 from 'web3'
export const appContext = createContext()
import {LotteryContract, LotteryWeb3} from '../utils/lottery'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  useEffect(() => {
    if (address) {
      updateLottery()
    }
  }, [address])

  const updateLottery = async () => {      
      try {
        const pool = await LotteryContract.methods.getPoolBalance().call()

        //LotteryWeb3.utils.fromWei(pool, 'ether')
        setLotteryPool(pool)

        console.log('Pool (in Wei): ', pool, '$')
        console.log('LotteryPool (fromWei): ', lotteryPool, '$')

        setLotteryTicketPrice(await LotteryContract.methods.getTicketPrice().call())

        console.log('TicketPrice: ', lotteryTicketPrice, '$')

        setLotteryID(await LotteryContract.methods.lotteryID().call())

        console.log('LotteryID: ', lotteryID)

        setPoolIsOpen(await LotteryContract.methods.IsPoolOpen().call())

        console.log('IsPoolOpen: ', poolIsOpen)

        setUserIsOwner(await LotteryContract.methods.IsUserOwner().call({ from: address }))

        console.log('IsUserOwner: ', userIsOwner)

        setUserIsPlayer(await LotteryContract.methods.IsUserPlayer().call({ from: address }))

        console.log('IsUserPlayer: ', userIsPlayer)

        setPlayers(await LotteryContract.methods.getPlayers().call())

        console.log('Players: ', lotteryPlayers)

        setLastWinner(await LotteryContract.methods.getWinners().call())
        console.log([...lastWinner], 'Last Winners')

      } catch (error) {

        console.log(error, 'updateLottery')

      }
  }

  const setTicketPrice = (newPrice) => {
    setLotteryTicketPrice(newPrice)
    console.log('Ticket Price: ', newPrice, '$')
  }

  const enterLottery = async (name, numberOfTicketsBought) => {
    try {
      console.log('Entering lottery pool')
      await LotteryContract.methods.enterPool(name, numberOfTicketsBought).send({
        from: address,
        // 0.015 ETH in Wei
        value: '15000000000000000',
        // 0.0003 ETH in Gwei
        gas: 300000,
        gasPrice: null,
      })

      toast.success(name +' just joined the pool with ' + numberOfTicketsBought + 'tickets!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      });

      updateLottery()
    } catch (err) {
      console.log(err, 'enterLottery')

      toast.error('Something went wrong while entering the pool!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      });
    }
  }

  const openPool = async () => {
    try {
      console.log('Opening lottery pool')
      let tx = await LotteryContract.methods.openPool(lotteryTicketPrice).send({
        from: address,
        gas: 300000,
        gasPrice: null,
      })

      console.log(tx)

      toast.success('The pool just opened!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      });

      updateLottery()
    } catch (err) {
      console.log(err, 'openPool')

      toast.error('Something went wrong while opening the pool!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      });
    }
  }

  const pickWinner = async () => {
    try {
      let tx = await LotteryContract.methods.drawWinner().send({
        from: address,
        gas: 300000,
        gasPrice: null,
      })

      console.log(tx)
      setEtherscanUrl('https://ropsten.etherscan.io/tx/' + tx.transactionHash)

      toast.success('The winner just won ' + lotteryPool + 'WEI!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      });

      updateLottery()
    } catch (err) {
      console.log(err, 'draw Winner')

      toast.error('Something went wrong while picking a winner!', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      });
    }
  }

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const web3 = new Web3(window.ethereum)
        setWeb3(web3)
  
        // Get the user's accounts
        const accounts = await web3.eth.getAccounts()
        setAddress(accounts[0])
  
        window.ethereum.on('accountsChanged', async () => {
          const accounts = await web3.eth.getAccounts()
          setAddress(accounts[0])
          toast.success('Connected!', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          });
          updateLottery()
        })
   
        toast.success('Connected!', {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        });

        // Only call updateLottery after getAccounts has completed
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
        updateLottery()
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
        setTicketPrice,
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
