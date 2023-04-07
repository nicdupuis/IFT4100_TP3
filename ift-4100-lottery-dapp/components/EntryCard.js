import { useState } from 'react'
import style from '../styles/EntryCard.module.css'
import { useAppContext } from '../context/context'

const EntryCard = () => {
  const { address, userIsOwner, userIsPlayer, enterLottery, poolIsOpen } = useAppContext()
  const [name, setName] = useState('')
  const [numTickets, setNumTickets] = useState(0)

  const handleNameChange = (event) => {
      setName(event.target.value)
  }

  const handleNumberOfTicketsChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (isNaN(newValue) || newValue <= 0) {
      return; // do nothing if the input value is not a number or less than or equal to 0
    }
    setNumTickets(parseInt(newValue))
  }

  const handleEnterLottery = () => {
    enterLottery(name, numTickets)
  }

  return (
    <>
      {address && poolIsOpen && !(userIsPlayer || userIsOwner) ? (
        <div className={style.wrapper}>
          <div className={style.tableHeader}>
            <div className={style.addressTitle}>👨‍🚀 User Name</div>
            <div className={style.amountTitle}>🎫 Number of tickets</div>
          </div>
          <div className={style.inputContainer}>
            <input
              className={style.input}
              type="text"
              placeholder="Name"
              value={name}
              onChange={handleNameChange}
            />
            <input
              className={style.input}
              type="number"
              placeholder="Number of tickets"
              value={numTickets}
              onChange={handleNumberOfTicketsChange}
            />
          </div>
          <button className={style.btn} onClick={handleEnterLottery}   disabled={name === '' || numTickets <= 0} >
            Enter
          </button>
        </div>
      ) : null}
    </>
  )
}

export default EntryCard