import { useState } from 'react'

const useModalParams = () => {
  const [visible, setVisible] = useState(false)
  const onOpen = () => setVisible(true)
  const onClose = () => setVisible(false)
  return {
    visible,
    onOpen,
    onClose,
  }
}

export default useModalParams
