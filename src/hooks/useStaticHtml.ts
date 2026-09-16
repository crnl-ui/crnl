import { useState, useEffect } from 'react'

interface StaticHtmlResult {
  html: string
  loading: boolean
  error: boolean
}

/**
 * Fetches a static .html file, parses it, and returns the innerHTML
 * of the first `.doc-main` element found inside it.
 */
export function useStaticHtml(url: string): StaticHtmlResult {
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then(text => {
        if (cancelled) return
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, 'text/html')
        const main = doc.querySelector('.doc-main')
        setHtml(main ? main.innerHTML : text)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError(true)
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [url])

  return { html, loading, error }
}
