import style from '../styles/Table.module.css'
import TableRow from './TableRow'
import { useAppContext } from '../context/context'
//&& (userIsPlayer || userIsOwner)
const Table = () => {
  const { userIsOwner, userIsPlayer, lotteryPlayers, lotteryTicketPrice, poolIsOpen } = useAppContext()
  return (
      <> 
      {poolIsOpen ? (
        <div className={style.wrapper}>
          <div className={style.tableHeader}>
            <div className={style.addressTitle}>👨‍🚀 User Name</div>
            <div className={style.addressTitle}>💳 User Address</div>
            <div className={style.amountTitle}>💲 Amount</div>
          </div>
          <div className={style.rows}>
            {lotteryPlayers.length > 0 ? (
              lotteryPlayers.map((player, index) => (
                <TableRow key={index} playerName={player.name} playerAddress={player.addr} playerAmount={player.numOfTickets * lotteryTicketPrice} />
              ))
            ) : (
              <div className={style.noPlayers}>No players yet</div>
            )}
      </div>
    </div> ) : null}
    </>
  )
}

export default Table
