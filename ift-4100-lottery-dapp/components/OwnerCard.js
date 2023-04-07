import style from '../styles/OwnerCard.module.css'
import { useAppContext } from '../context/context'
import { useState } from 'react'

const OwnerCard = () => {
  const { lotteryTicketPrice, setTicketPrice, poolIsOpen, userIsOwner, pickWinner, openPool } = useAppContext()

  const handleTicketPriceChange = (event) => {
    const newValue = parseInt(event.target.value);
    if (isNaN(newValue) || newValue <= 0) {
      return; // do nothing if the input value is not a number or less than or equal to 0
    }
    setTicketPrice(newValue)
  }

  return (
    <>
      {userIsOwner ? (
        <div className={style.wrapper}>
          <div className={style.title}>Owner Dashboard</div>

          {poolIsOpen ? (
            null
          ) : (
            <div className={style.pool}>
              Ticket price💲: <span className={style.goldAccent}></span>
            </div>
          )}
          {poolIsOpen ? (
            null
          ) : (
              <input
                className={style.input}
                type="number"
                placeholder="Tickets price"
                value={lotteryTicketPrice}
                onChange={handleTicketPriceChange}
              />

          )}
          {poolIsOpen ? (
            <div className={style.btn} onClick={pickWinner}>
              Draw Winner!
            </div>
          ) : (
            <div className={style.btn} onClick={openPool}>
              Open Pool!
            </div>
          )}
        </div>
      ) : null}
    </>
  )
}
  
  export default OwnerCard
