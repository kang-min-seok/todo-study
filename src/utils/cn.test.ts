import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn()', () => {
  it('단일 클래스를 그대로 반환한다', () => {
    expect(cn('foo')).toBe('foo')
  })

  it('여러 클래스를 공백으로 합친다', () => {
    expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz')
  })

  it('falsy 값(false, null, undefined)은 무시한다', () => {
    expect(cn('foo', false, null, undefined, 'bar')).toBe('foo bar')
  })

  it('조건부 클래스: 조건이 true이면 포함된다', () => {
    const isActive = true
    expect(cn('btn', isActive && 'btn-active')).toBe('btn btn-active')
  })

  it('조건부 클래스: 조건이 false이면 포함되지 않는다', () => {
    const isActive = false
    expect(cn('btn', isActive && 'btn-active')).toBe('btn')
  })

  it('객체 형태의 조건부 클래스를 처리한다', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })

  it('Tailwind 충돌 클래스는 마지막 클래스가 이긴다', () => {
    // p-2와 p-4가 충돌 → 나중에 온 p-4가 남는다
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('Tailwind 충돌 클래스: 조건부로 덮어쓸 수 있다', () => {
    const isLarge = true
    expect(cn('text-sm', isLarge && 'text-lg')).toBe('text-lg')
  })

  it('배열 형태의 클래스를 처리한다', () => {
    expect(cn(['foo', 'bar', 'baz'])).toBe('foo bar baz')
  })
})
