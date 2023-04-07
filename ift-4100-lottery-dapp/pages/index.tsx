import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PotCard from '@/components/PoolCard'
import OwnerCard from '@/components/OwnerCard'
import EntryCard from '@/components/EntryCard'
import Table from '@/components/Table'
import style from '../styles/Home.module.css'

export default function Home() {
  
  return (
    <div className={style.wrapper}>
      <Header />
      <OwnerCard />
      <PotCard />
      <Table />
      <EntryCard />
      <Footer />
    </div>
  )
}