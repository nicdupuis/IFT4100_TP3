import { useState } from 'react'
import style from '../styles/EntryCard.module.css'
import { useAppContext } from '../context/context'

const EntryCard = () => {
  const { userIsPlayer, enterLottery } = useAppContext()
  const [name, setName] = useState('')
  const [numTickets, setNumTickets] = useState(0)

  const handleNameChange = (event) => {
      setName(event.target.value)
  }

  const handleNumberOfTicketsChange = (event) => {
    setNumTickets(parseInt(event.target.value))
  }

  const handleEnterLottery = () => {
    enterLottery(name, numTickets)
  }

  return (
    <>
      {!userIsPlayer ? (
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
          <div className={style.btn} onClick={handleEnterLottery}>
            Enter
          </div>
        </div>
      ) : null}
    </>
  )
}

export default EntryCard