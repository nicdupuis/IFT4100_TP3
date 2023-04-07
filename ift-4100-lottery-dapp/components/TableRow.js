import style from '../styles/TableRow.module.css'
import truncateEthAddress from 'truncate-eth-address'

const TableRow = ({ playerName, playerAddress, playerAmount }) => {
  return (
    <div className={style.wrapper}>
      <div className={style.address}>{(playerName)}</div>
      <div className={style.address}>{truncateEthAddress(playerAddress)}</div>
      <div className={style.ethAmmount}>
        <span className={style.goldAccent}>{(playerAmount)} ETH</span>
      </div>
    </div>
  )
}
export default TableRow
