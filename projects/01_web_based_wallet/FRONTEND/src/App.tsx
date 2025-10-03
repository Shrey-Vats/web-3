import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import AllWallets from './pages/AllWallets'
import Navbar from './components/Navbar'
import { Buffer } from 'buffer';

function App() {
  return (
    <>
    {window.Buffer = Buffer}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/wallet" element={<AllWallets />} />
      </Routes>
    </>
  )
}

export default App