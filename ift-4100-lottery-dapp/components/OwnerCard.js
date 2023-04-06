import style from '../styles/OwnerCard.module.css'
import { useAppContext } from '../context/context'

const OwnerCard = () => {
    const { userIsOwner, pickWinner, openPool, setTicketPrice } = useAppContext()
  
    return (
      <>
        {userIsOwner ? (
          <div className={style.wrapper}>
            <div className={style.title}>Owner Dashboard</div>
            <div className={style.btn} onClick={openPool}>
              Open Pool!
            </div>
            <div className={style.btn} onClick={pickWinner}>
              Draw Winner!
            </div>
          </div>
        ) : null}
      </>
    )
  }
  
  export default OwnerCard
