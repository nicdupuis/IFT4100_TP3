import style from '../styles/OwnerCard.module.css'
import { useAppContext } from '../context/context'
import { useState } from 'react'

const OwnerCard = () => {
  //const [lotteryTicketPrice, setLotteryTicketPrice] = useState(0)

  const { lotteryTicketPrice, setTicketPrice, poolIsOpen, userIsOwner, pickWinner, openPool } = useAppContext()

  const handleTicketPriceChange = (event) => {
    setTicketPrice(parseInt(event.target.value))
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
