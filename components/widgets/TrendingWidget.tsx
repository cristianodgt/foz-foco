/**
 * Legacy shim — TrendingWidget is now an alias of MaisLidas.
 *
 * Plan 01-03 renamed the component to MaisLidas to match the Stitch contract.
 * This re-export preserves backward compatibility for /[slug] and
 * /categoria/[slug] which still import `TrendingWidget`.
 */
export { MaisLidas as TrendingWidget } from './MaisLidas'
