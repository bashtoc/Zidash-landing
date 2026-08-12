import { useCallback, useEffect, useRef, useState } from 'react'

export function useRemote(loader, dependencies = []) {
  const requestId = useRef(0)
  const [state, setState] = useState({ data: null, meta: null, loading: true, error: '' })

  const load = useCallback(async () => {
    const id = ++requestId.current
    setState((current) => ({ ...current, loading: true, error: '' }))
    try {
      const response = await loader()
      if (requestId.current !== id) return
      setState({ data: response?.data ?? response, meta: response?.meta || null, loading: false, error: '' })
    } catch (error) {
      if (requestId.current !== id) return
      setState({ data: null, meta: null, loading: false, error: error.message || 'Request failed' })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  useEffect(() => {
    load()
    return () => { requestId.current += 1 }
  }, [load])

  return { ...state, reload: load }
}
