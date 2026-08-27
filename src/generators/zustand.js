function generateZustand({ fs, options }) {
  if (!options.zustand) return
  const ext = options.typescript ? 'tsx' : 'jsx'
  const storeExt = options.typescript ? 'ts' : 'js'
  const type = options.typescript
    ? `type CounterState = {
  count: number
  increment: () => void
}

`
    : ''
  const generic = options.typescript ? '<CounterState>' : ''

  fs.write(
    `src/features/counter/model/useCounterStore.${storeExt}`,
    `import { create } from 'zustand'

${type}export const useCounterStore = create${generic}((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))`,
  )
  fs.write(
    `src/features/counter/components/Counter.${ext}`,
    `import { useCounterStore } from '../model/useCounterStore'

export function Counter() {
  const count = useCounterStore((state) => state.count)
  const increment = useCounterStore((state) => state.increment)

  return (
    <section aria-labelledby="counter-title">
      <h2 id="counter-title">Contador</h2>
      <p aria-live="polite">Valor: {count}</p>
      <button type="button" onClick={increment}>
        Incrementar
      </button>
    </section>
  )
}`,
  )
}

module.exports = { generateZustand }
