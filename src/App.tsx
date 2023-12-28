import Navbar from "./components/Custom/Navbar"
import './App.css'
import { Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react"
import { Dictionary } from "./models/types"
import LongestWord from "./components/LongestWord/LongestWord"
import MyNumber from "./components/MyNumber/MyNumber"
import Error from "./components/Custom/Error"
import Loading from "./components/Custom/Loading"
import './App.css'
import "../src/components/Custom/custom.css"
import Home from "./components/Custom/Home"

function App() {
  const [dictionary, setDictionary] = useState<Dictionary>({} as Dictionary)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadDictionary = async (): Promise<void> => {
      try {
        const response: Response = await fetch("./dictionary.json")
        const data: Dictionary = await response.json()
        setDictionary(data)
      }
      catch (err: unknown) {
        console.log(err)
      }
    }
    setIsLoading(false)
    loadDictionary()
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route index element={<Home />} />
        {/*Treba da se doda index ruta za pocetnu stranicu kako bi se i tu nalazio neki sadrzaj */}
        < Route path="/longestword" element={<LongestWord dictionary={dictionary} />} />
        <Route path="/mynumber" element={<MyNumber />} />
      </Route>

      <Route path="*" element={<Error />} />
    </Routes>
  )
}

export default App
