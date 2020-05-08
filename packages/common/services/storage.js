const setUserInStorage = async (data, storage) => {
  try {
    await storage.setItem('user', JSON.stringify(data))
  } catch (e) {
    console.error(e)
  }
}

const getUserFromStorage = async (storage) => {
  try {
    const user = await storage.getItem('user')
    if (user) {
      return JSON.parse(user)
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}

export {
  setUserInStorage,
  getUserFromStorage,
}