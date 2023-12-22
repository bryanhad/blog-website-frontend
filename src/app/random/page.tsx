import { unstable_noStore as noStore } from "next/cache"

export default function page() {
    noStore()
  return (
    <div>
      {Math.random()}
    </div>
  )
}
