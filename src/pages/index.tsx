import styles from '@/styles/Home.module.css'
import { Button } from 'react-bootstrap'


export default function Home() {
  return (
      <div className={`${styles.main}`}>
        Helo home page!
        <Button>I am a button boi!</Button>

      </div>
  )
}
