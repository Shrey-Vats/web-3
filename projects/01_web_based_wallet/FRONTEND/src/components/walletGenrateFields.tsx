import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

function WalletGenrateFields({input, setInput, onClick, isLoading}: {input: string, setInput: React.Dispatch<React.SetStateAction<string>> , onClick?: () => void, isLoading: boolean}) {
  return (
    <div className='w-full flex justify-center items-center mt-6'>
      <Input placeholder='Enter your secret or (leave it blank to generate)' className='border border-white/20 rounded-sm text-white' value={input} onChange={(e) => setInput(e.target.value)} />
      <Button className={`ml-2 rounded-sm cursor-pointer ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`} disabled={isLoading} onClick={onClick}>Generate</Button>
    </div>
  )
}

export default WalletGenrateFields