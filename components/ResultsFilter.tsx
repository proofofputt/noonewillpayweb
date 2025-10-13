'use client'

import { BIRTH_DECADES } from '@/lib/constants'

export interface ResultsFilters {
  quizType: 'quick' | 'full' | 'both'
  birthDecade: string
}

interface ResultsFilterProps {
  filters: ResultsFilters
  onFiltersChange: (filters: ResultsFilters) => void
  disabled?: boolean
}

export function ResultsFilter({ filters, onFiltersChange, disabled = false }: ResultsFilterProps) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Filter Results</h2>

      {/* Quiz Type Filter */}
      <div>
        <label className="block text-sm font-medium mb-2 text-white">
          Quiz Completion Status
        </label>
        <select
          value={filters.quizType}
          onChange={(e) => onFiltersChange({ ...filters, quizType: e.target.value as any })}
          disabled={disabled}
          className="w-full px-4 py-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:border-orange focus:outline-none font-semibold cursor-pointer disabled:opacity-50"
        >
          <option value="both">All Participants</option>
          <option value="quick">Quick Quiz Only (3 questions)</option>
          <option value="full">Full Assessment Complete (21 questions)</option>
        </select>
        <p className="text-xs text-gray-400 mt-1">
          Filter by how many questions participants completed
        </p>
      </div>

      {/* Birth Decade Filter */}
      <div>
        <label className="block text-sm font-medium mb-2 text-white">
          Birth Decade / Generation
        </label>
        <select
          value={filters.birthDecade}
          onChange={(e) => onFiltersChange({ ...filters, birthDecade: e.target.value })}
          disabled={disabled}
          className="w-full px-4 py-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:border-orange focus:outline-none font-semibold cursor-pointer disabled:opacity-50"
        >
          <option value="">All Age Groups</option>
          {BIRTH_DECADES.map((decade) => (
            <option key={decade.value} value={decade.value}>
              {decade.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-1">
          Compare results by generation
        </p>
      </div>

      {/* Active Filters Display */}
      {(filters.quizType !== 'both' || filters.birthDecade) && (
        <div className="pt-4 border-t border-gray-700">
          <div className="text-sm font-medium text-white mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {filters.quizType !== 'both' && (
              <div className="px-3 py-1 bg-orange text-black rounded-full text-xs font-bold">
                {filters.quizType === 'quick' ? 'Quick Quiz Only' : 'Full Assessment'}
              </div>
            )}
            {filters.birthDecade && (
              <div className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-bold">
                {BIRTH_DECADES.find(d => d.value === filters.birthDecade)?.label || filters.birthDecade}
              </div>
            )}
            <button
              onClick={() => onFiltersChange({ quizType: 'both', birthDecade: '' })}
              disabled={disabled}
              className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
