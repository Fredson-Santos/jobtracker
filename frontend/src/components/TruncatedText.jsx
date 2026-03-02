import { useState, useRef, useEffect } from 'react'

/**
 * Exibe o texto truncado. Em desktop, um title nativo
 * já mostra o texto completo no hover. Em mobile (sem hover),
 * ao clicar/tocar no elemento, exibe um tooltip flutuante
 * com o conteúdo completo. Fecha ao clicar fora.
 */
export default function TruncatedText({ text, className = '' }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const isTruncated = useRef(false)

    useEffect(() => {
        function handleOutsideClick(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleOutsideClick)
            document.addEventListener('touchstart', handleOutsideClick)
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
            document.removeEventListener('touchstart', handleOutsideClick)
        }
    }, [open])

    function handleClick(e) {
        const el = e.currentTarget
        // Só abre o tooltip se o texto realmente está truncado
        if (el.scrollWidth > el.clientWidth) {
            e.stopPropagation()
            setOpen((prev) => !prev)
        }
    }

    return (
        <span ref={ref} className="relative min-w-0 flex-1">
            <span
                className={`block truncate cursor-pointer select-none ${className}`}
                title={text}
                onClick={handleClick}
            >
                {text}
            </span>

            {/* Tooltip flutuante (aparece ao toque no mobile) */}
            {open && (
                <span
                    className="
            absolute left-0 top-full mt-1.5 z-50
            block w-max max-w-[240px]
            px-3 py-2 rounded-lg shadow-xl
            bg-gray-900 dark:bg-gray-700
            text-white text-xs leading-snug
            border border-gray-700 dark:border-gray-600
            pointer-events-none
          "
                    style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                >
                    {text}
                </span>
            )}
        </span>
    )
}
