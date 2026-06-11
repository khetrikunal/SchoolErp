import { ChevronLeft, ChevronRight } from 'lucide-react'
export default function Pagination({ page, pages, total, perPage, onPage }) {
  if (pages <= 1) return null
  const start = (page - 1) * perPage + 1
  const end = Math.min(page * perPage, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-1 border-t border-gray-100 dark:border-gray-700">
      <span className="text-xs text-gray-400 whitespace-nowrap">Showing {start}–{end} of {total}</span>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={15} />
        </button>

        {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-7 h-7 rounded-lg text-xs font-semibold transition ${
              p === page
                ? 'bg-primary-600 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === pages}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}

