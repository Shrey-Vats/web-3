import { Box } from "lucide-react"
import { Button } from './ui/button'
function Navbar() {
  return (
    <div className="w-full h-16 mt-2  flex items-center py-2 border border-white/20  backdrop-blur-xl justify-between px-5 rounded-b-lg">
        <Box className="h-12 w-12" />
        <div>
            <Button className=" px-4 py-2 rounded">Connect Wallet</Button>
            <Button variant={'secondary'} className=" px-4 py-2 rounded ml-2">Disconnect Wallet</Button>
        </div>
    </div>
  )
}

export default Navbar