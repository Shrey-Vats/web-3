import { Button } from './ui/button'

function WalletGenrateFields({ onClick, isLoading}: { onClick?: () => void, isLoading: boolean}) {
  return (
    <div className='w-full flex justify-center items-center mt-6'>
      <Button className={`ml-2 rounded-sm cursor-pointer ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`} disabled={isLoading} onClick={onClick}>Generate</Button>
    </div>
  )
}

export default WalletGenrateFields