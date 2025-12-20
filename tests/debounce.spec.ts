import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import debounce from '../src/components/utils/debounce'

describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('applies only the newest search arguments', () => {
    const apply = vi.fn()
    const search = debounce(apply, 300)
    search('a')
    vi.advanceTimersByTime(200)
    search('anna')
    vi.advanceTimersByTime(299)
    expect(apply).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(apply.mock.calls).toEqual([['anna']])
  })

  it('cancels pending work and allows a subsequent request', () => {
    const apply = vi.fn()
    const search = debounce(apply, 300)
    search('old')
    search.cancel()
    vi.runAllTimers()
    expect(apply).not.toHaveBeenCalled()
    search('new')
    vi.runAllTimers()
    expect(apply.mock.calls).toEqual([['new']])
  })
})
