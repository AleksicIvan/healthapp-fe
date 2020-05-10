import axios from 'axios'
import { take } from 'ramda'
import React, {useState, useEffect} from 'react'

function useJsonPlaceholder () {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(_ => {
    const getTodos = async () => {
      const jsons = await axios.get("https://jsonplaceholder.typicode.com/todos")
      setData(take(10, jsons.data))
      setIsLoading(false)
    }
    getTodos()
  }, [])


  return [isLoading, data]
}

export {
  useJsonPlaceholder
}