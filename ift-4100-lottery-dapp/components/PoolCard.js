import style from '../styles/PoolCard.module.css'
import truncateEthAddress from 'truncate-eth-address'
import { useAppContext } from '../context/context'
const PoolCard = () => {
  const { lotteryID, lastWinner, lotteryPool, lotteryTicketPrice, poolIsOpen} =
    useAppContext()

  return (
    <div className={style.wrapper}>
      <div className={style.title}>
        Lottery{' '}
        <span className={style.textAccent}>#{lotteryID ? lotteryID : '1'}</span>
      </div>
      {poolIsOpen ? (
          <div className={style.pool}>
            Pool 🍯: <span className={style.goldAccent}>{lotteryPool} ETH</span>
          </div>
      ) : (
        <div className={style.winner}>Pool not open yet!</div>
      )}

      {poolIsOpen ? (
        <div className={style.pool}>
          Ticket price💲: <span className={style.goldAccent}>{lotteryTicketPrice} ETH</span>
        </div>
      ) :  null }


      <div className={style.recentWinnerTitle}>🏆Last Winners🏆</div>
      {!lastWinner.length ? (
        <div className={style.winner}>No winner yet</div>
      ) : (
        lastWinner.length > 0 && (
          <div className={style.winner}>
            {truncateEthAddress(lastWinner[lastWinner.length - 1])}
          </div>
        )
      )}
    </div>
  )
}
export default PoolCard
