import { useEffect } from "react"

const isTextField = (target: EventTarget | null) =>
  target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement

const useBlockCopyEffect = () => {
  useEffect(() => {
    const blockCopy = (e: ClipboardEvent) => {
      if (!isTextField(e.target)) e.preventDefault()
    }

    document.addEventListener("copy", blockCopy)
    document.addEventListener("cut", blockCopy)
    return () => {
      document.removeEventListener("copy", blockCopy)
      document.removeEventListener("cut", blockCopy)
    }
  }, [])
}

export default useBlockCopyEffect
