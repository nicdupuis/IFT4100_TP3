import style from '../styles/Header.module.css'
import truncateEthAddress from 'truncate-eth-address'

const UserCard = ({ disconnectWallet, address }) => {
  return (
    <div>
      <div
        className={`${style.welcome} ${style.loginBtn}`}
        onClick={disconnectWallet}
      >
        👋 Welcome,{' '}
        <span className={style.accentColor}>{truncateEthAddress(address)}</span>
      </div>
    </div>
  )
}

export default UserCard
