'use client'
import { Trade } from '@prisma/client'
import { EtpSync } from '../etp/etp-sync'
import { ThorSync } from '../thor/thor-sync'
import { TradovateSync } from '../tradovate/tradovate-sync'
import { ImportType } from '../import-type-selection'
import { RithmicSyncWrapper } from '../rithmic/sync/rithmic-sync-connection'
import type { ComponentType } from 'react'
import ImportTypeSelection from '../import-type-selection'
import FileUpload from '../file-upload'
import HeaderSelection from '../header-selection'
import AccountSelection from '../account-selection'
import ColumnMapping from '../column-mapping'
import { FormatPreview } from '../components/format-preview'
import TradezellaProcessor from '../tradezella/tradezella-processor'
import TradovateProcessor from '../tradovate/tradovate-processor'
import QuantowerOrderProcessor from '../quantower/quantower-processor'
import TopstepProcessor from '../topstep/topstep-processor'
import NinjaTraderPerformanceProcessor from '../ninjatrader/ninjatrader-performance-processor'
import RithmicPerformanceProcessor from '../rithmic/rithmic-performance-processor'
import RithmicOrderProcessor from '../rithmic/rithmic-order-processor-new'
import PdfUpload from '../ibkr-pdf/pdf-upload'
import PdfProcessing from '../ibkr-pdf/pdf-processing'
import AtasFileUpload from '../atas/atas-file-upload'
import AtasProcessor from '../atas/atas-processor'
import FtmoProcessor from '../ftmo/ftmo-processor'
import { Step } from '../import-button'
import { Sparkles } from 'lucide-react'
import { useTheme } from '@/context/theme-provider'
// Note: use plain <img> for logos to avoid Next Image optimization issues in certain environments

type TranslationKey =
  | 'import.steps.selectPlatform'
  | 'import.steps.selectPlatformDescription'
  | 'import.steps.uploadFile'
  | 'import.steps.uploadFileDescription'
  | 'import.steps.selectHeaders'
  | 'import.steps.selectHeadersDescription'
  | 'import.steps.mapColumns'
  | 'import.steps.mapColumnsDescription'
  | 'import.steps.selectAccount'
  | 'import.steps.selectAccountDescription'
  | 'import.steps.reviewTrades'
  | 'import.steps.reviewTradesDescription'
  | 'import.steps.processTrades'
  | 'import.steps.processTradesDescription'
  | 'import.steps.connectAccount'
  | 'import.steps.connectAccountDescription'
  | 'import.steps.processFile'
  | 'import.steps.processFileDescription'

export interface ProcessedData {
  headers: string[]
  processedData: string[][]
}

// FTMO Logo Component with light/dark mode support
const FtmoLogo = () => {
  const { effectiveTheme } = useTheme()

  return (
    <div className="w-8 h-8 flex items-center justify-center">
      <svg
        width="32"
        height="32"
        viewBox="0 0 3950 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain rounded-lg border border-border/50"
      >
        <path
          d="M1309.81 780.68H1417.27V532.224H1676.62V438.809H1417.27V312.848H1724.34V218.528H1309.81V780.68Z"
          fill={effectiveTheme === 'dark' ? 'white' : 'black'}
        />
        <path
          d="M1806.29 312.823H2000.2V780.655H2107.66V312.823H2301.57V218.503H1806.29V312.823Z"
          fill={effectiveTheme === 'dark' ? 'white' : 'black'}
        />
        <path
          d="M2726.88 500.407L2528.93 220.311L2527.57 218.503H2434.97V780.655H2542.43V408.046L2585.96 475.848L2722.53 671.418L2726.13 676.541L2864.81 476.601C2883.87 449.481 2899.18 426.428 2910.43 408.046V780.504H3017.89V218.503H2925.29L2726.88 500.407Z"
          fill={effectiveTheme === 'dark' ? 'white' : 'black'}
        />
        <path
          d="M3674.28 294.152C3618.3 238.404 3547.62 210.078 3464.17 210.078C3380.58 210.078 3309.89 238.404 3253.91 294.152C3198.08 350.051 3169.71 419.058 3169.71 499.667C3169.71 580.728 3198.08 650.187 3253.91 706.086C3309.74 761.834 3380.58 790.16 3464.17 790.16C3547.77 790.16 3618.45 761.834 3674.28 706.086C3730.11 650.337 3758.48 580.878 3758.48 499.667C3758.48 419.058 3730.11 349.9 3674.28 294.152ZM3594.44 635.27C3559.77 672.637 3516.25 691.47 3465.07 691.47C3413.29 691.47 3369.32 672.486 3334.35 635.27C3299.38 597.904 3281.52 552.251 3281.52 499.516C3281.52 446.932 3299.23 401.43 3334.35 364.214C3369.32 327.149 3413.29 308.315 3465.07 308.315C3516.25 308.315 3559.77 327.149 3594.59 364.063C3629.41 401.128 3646.97 446.631 3646.97 499.366C3646.82 552.251 3629.11 597.904 3594.44 635.27Z"
          fill={effectiveTheme === 'dark' ? 'white' : 'black'}
        />
        <path
          d="M117.066 617.598L497.981 235.197V0L0 500.075L117.066 617.598Z"
          fill={effectiveTheme === 'dark' ? 'white' : 'black'}
        />
        <path
          d="M498.028 999.987V674.388L335.936 837.263L498.028 999.987Z"
          fill={effectiveTheme === 'dark' ? 'white' : 'black'}
        />
        <path
          d="M497.943 334.323L166.405 667.154L286.323 787.54L497.943 575.095V334.323Z"
          fill={effectiveTheme === 'dark' ? 'white' : 'black'}
        />
        <path
          d="M560.322 0V235.197L824.021 499.925L560.322 764.803V1000L1058.3 499.925L560.322 0Z"
          fill={effectiveTheme === 'dark' ? 'white' : 'black'}
        />
        <path
          d="M3852.75 18.1377C3798.27 18.1377 3754.89 60.6268 3754.89 113.512C3754.89 167.603 3798.27 209.941 3852.75 209.941C3907.68 209.941 3950 167.452 3950 113.512C3950 60.4761 3907.83 18.1377 3852.75 18.1377ZM3853.35 189.601C3810.57 189.601 3779.2 155.851 3779.2 113.512C3779.2 71.6257 3810.42 37.4235 3852.75 37.4235C3895.07 37.4235 3925.69 71.7764 3925.69 114.115C3925.69 155.851 3895.07 189.601 3853.35 189.601Z"
          fill={effectiveTheme === 'dark' ? 'white' : 'black'}
        />
        <path
          d="M3874.77 116.241V115.035C3886.32 111.57 3894.43 103.434 3894.43 92.8867C3894.43 83.5452 3890.38 76.0116 3885.12 71.9435C3878.22 67.8754 3870.11 65.0127 3852.1 65.0127C3836.49 65.0127 3824.34 66.2181 3815.63 67.8754V163.25H3837.7V124.829H3848.05C3860.21 124.829 3866.06 129.5 3867.71 139.896C3870.56 150.895 3872.37 159.634 3875.22 163.099H3898.93C3896.68 159.634 3894.88 153.758 3892.03 139.293C3889.17 126.637 3884.07 119.706 3874.77 116.241ZM3848.65 109.159H3838.3V81.8878C3840.55 81.2851 3844.75 80.6824 3850.45 80.6824C3864.41 80.6824 3870.71 86.5586 3870.71 95.1468C3870.71 105.091 3860.81 109.159 3848.65 109.159Z"
          fill={effectiveTheme === 'dark' ? 'white' : 'black'}
        />
      </svg>
    </div>
  )
}

// ATAS Logo Component with proper aspect ratio handling
const AtasLogo = () => (
  <div className="w-8 h-8 flex items-center justify-center">
    <img
      src="/logos/atas.png"
      alt="ATAS Logo"
      width={32}
      height={32}
      className="object-contain rounded-lg border border-border/50 dark:invert"
      style={{ width: 'auto', height: '32px', maxWidth: '32px' }}
      loading="lazy"
    />
  </div>
)

type StepComponent =
  | typeof ImportTypeSelection
  | typeof FileUpload
  | typeof HeaderSelection
  | typeof AccountSelection
  | typeof ColumnMapping
  | typeof FormatPreview
  | typeof TradezellaProcessor
  | typeof TradovateProcessor
  | typeof QuantowerOrderProcessor
  | typeof TopstepProcessor
  | typeof NinjaTraderPerformanceProcessor
  | typeof RithmicPerformanceProcessor
  | typeof RithmicOrderProcessor
  | typeof RithmicSyncWrapper
  | typeof EtpSync
  | typeof ThorSync
  | typeof TradovateSync
  | typeof PdfUpload
  | typeof PdfProcessing
  | typeof AtasFileUpload
  | typeof AtasProcessor
  | typeof FtmoProcessor


export interface PlatformProcessorProps {
  csvData: string[][]
  headers: string[]
  processedTrades: Partial<Trade>[]
  setProcessedTrades: React.Dispatch<React.SetStateAction<Partial<Trade>[]>>
  accountNumbers?: string[]
}

export interface PlatformConfig {
  platformName: string
  type: string
  name: string
  description: string
  category: 'Direct Account Sync' | 'Intelligent Import' | 'Platform CSV Import'
  videoUrl?: string
  details: string
  logo: {
    path?: string
    alt?: string
    component?: ComponentType<{}>
  }
  isDisabled?: boolean
  isComingSoon?: boolean
  isRithmic?: boolean
  skipHeaderSelection?: boolean
  requiresAccountSelection?: boolean
  processFile?: (data: string[][]) => ProcessedData
  customComponent?: ComponentType<{ setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }>
  processorComponent?: ComponentType<PlatformProcessorProps>
  tutorialLink?: string
  disableAiFormatting?: boolean
  steps: {
    id: Step
    title: TranslationKey
    description: TranslationKey
    component: StepComponent
    isLastStep?: boolean
  }[]
}

// Platform-specific processing functions
const processRithmicPerformance = (data: string[][]): ProcessedData => {
  const processedData: string[][] = [];
  let currentAccountNumber = '';
  let currentInstrument = '';
  let headers: string[] = [];

  const isAccountNumber = (value: string) => {
    return value.length > 8 &&
      !/^[A-Z]{3}\d$/.test(value) &&
      !/^\d+$/.test(value) &&
      value !== 'Account' &&
      value !== 'Entry Order Number';
  };

  const isInstrument = (value: string) => {
    // Match common futures instrument patterns:
    // - 2-4 uppercase letters followed by 1-2 digits (e.g. ESZ4, MESZ4, ZNH3)
    // - Optionally prefixed with 'M' for micro contracts
    return /^[A-Z]{2,4}\d{1,2}$/.test(value);
  };

  data.forEach((row) => {
    if (row[0] && isAccountNumber(row[0])) {
      currentAccountNumber = row[0];
    } else if (row[0] && isInstrument(row[0])) {
      currentInstrument = row[0];
    } else if (row[0] === 'Entry Order Number') {
      headers = ['AccountNumber', 'Instrument', ...row];
    } else if (headers.length > 0 && row[0] && row[0] !== 'Entry Order Number' && row[0] !== 'Account') {
      processedData.push([currentAccountNumber, currentInstrument, ...row]);
    }
  });

  return { headers, processedData };
};

const processRithmicOrders = (data: string[][]): ProcessedData => {
  const headerRowIndex = data.findIndex(row => row[0] === 'Completed Orders') + 1
  const headers = data[headerRowIndex].filter(header => header && header.trim() !== '')
  const processedData = data.slice(headerRowIndex + 1)
  return { headers, processedData };
};

const processQuantower = (data: string[][]): ProcessedData => {
  const headers = data[0].filter(header => header && header.trim() !== '')
  const processedData = data.slice(1)
  return { headers, processedData };
};

const processStandardCsv = (data: string[][]): ProcessedData => {
  if (data.length === 0) {
    throw new Error("The CSV file appears to be empty or invalid.")
  }
  const headers = data[0].filter(header => header && header.trim() !== '')
  return { headers, processedData: data.slice(1) };
};

// --- Sierra Chart Trade Activity Log (tab-separated) ---
const sierraMultiplier = (symbol: string) => {
  const base = symbol.toUpperCase()
  if (base.startsWith('MES')) return 5
  if (base.startsWith('ES')) return 50
  if (base.startsWith('MNQ')) return 2
  if (base.startsWith('NQ')) return 20
  if (base.startsWith('MCL') || base.startsWith('MCLE')) return 100
  if (base.startsWith('QM')) return 50
  if (base.startsWith('CL')) return 1000
  return 1
}

const processSierra = (data: string[][]): ProcessedData => {
  if (data.length < 2) throw new Error('The Sierra file appears empty.')

  const header = data[0].map(h => (h || '').trim())
  const idx = (name: string) => header.findIndex(h => h.toLowerCase() === name.toLowerCase())

  const iDateTime = idx('DateTime')
  const iTransDateTime = idx('TransDateTime')
  const iSymbol = idx('Symbol')
  const iInternalOrderId = idx('InternalOrderID')
  const iParentId = idx('ParentInternalOrderID')
  const iQuantity = idx('Quantity')
  const iBuySell = idx('BuySell')
  const iFillPrice = idx('FillPrice')
  const iTradeAccount = idx('TradeAccount')
  const iOpenClose = idx('OpenClose')
  const iActivityType = idx('ActivityType')

  const parseDate = (val: string) => {
    if (!val) return null
    const clean = val.replace(/\s+/g, ' ').trim()
    if (!clean) return null
    const parts = clean.split(' ')
    if (parts.length < 2) return null
    const [datePart, timePartRaw] = [parts[0], parts[1]]
    const [timeMain, micro = '000'] = timePartRaw.split('.')
    const ms = (micro || '').slice(0, 3).padEnd(3, '0')
    const iso = `${datePart}T${timeMain}.${ms}Z`
    const d = new Date(iso)
    return isNaN(d.getTime()) ? null : d.toISOString()
  }

  const stateByKey: Record<string, {
    opens: { qty: number, price: number, ts: string }[]
    pos: number
    side: 'long' | 'short' | null
    entryTs: string | null
    entryValue: number
    entryQty: number
    closeValue: number
    closeQty: number
    pnl: number
  }> = {}
  const processed: string[][] = []

  const getVal = (row: string[], i: number) => (i >= 0 && i < row.length ? (row[i] ?? '').toString().trim() : '')

  const normalizeSymbol = (raw: string) => {
    const withoutPrefix = raw.replace(/^F\.US\./i, '')
    const withoutExchange = withoutPrefix.split('.')[0] || withoutPrefix
    return withoutExchange
  }

  const instrumentForDisplay = (sym: string) => {
    // Keep contract month/year but drop exchange suffix
    return sym || ''
  }

  const specMap: Record<string, { tickSize: number; tickValue: number }> = {
    // Equity Index (USD)
    MES: { tickSize: 0.25, tickValue: 1.25 },
    ES: { tickSize: 0.25, tickValue: 12.5 },
    MNQ: { tickSize: 0.25, tickValue: 0.5 },
    NQ: { tickSize: 0.25, tickValue: 5 },
    MYM: { tickSize: 1, tickValue: 0.5 },
    YM: { tickSize: 1, tickValue: 5 },
    M2K: { tickSize: 0.1, tickValue: 0.5 },
    RTY: { tickSize: 0.1, tickValue: 10 },
    // Energies (USD)
    CL: { tickSize: 0.01, tickValue: 10 },
    QM: { tickSize: 0.025, tickValue: 12.5 },
    MCL: { tickSize: 0.01, tickValue: 1 },
    NG: { tickSize: 0.001, tickValue: 10 },
    MNG: { tickSize: 0.001, tickValue: 1 },
    RB: { tickSize: 0.0001, tickValue: 4.2 },
    HO: { tickSize: 0.0001, tickValue: 4.2 },
    // Metals (USD)
    GC: { tickSize: 0.1, tickValue: 10 },
    MGC: { tickSize: 0.1, tickValue: 1 },
    SI: { tickSize: 0.005, tickValue: 25 },
    SIL: { tickSize: 0.005, tickValue: 2.5 },
    HG: { tickSize: 0.0005, tickValue: 12.5 },
    MHG: { tickSize: 0.0005, tickValue: 1.25 },
    PL: { tickSize: 0.1, tickValue: 5 },
    // Financials (USD)
    ZB: { tickSize: 1 / 32, tickValue: 31.25 },
    ZN: { tickSize: 1 / 128, tickValue: 15.625 },
    ZF: { tickSize: 1 / 128, tickValue: 7.8125 },
    ZT: { tickSize: 1 / 128, tickValue: 15.625 },
    UB: { tickSize: 1 / 32, tickValue: 31.25 },
    SR3: { tickSize: 0.0025, tickValue: 6.25 },
    // Grains / Softs (USD)
    ZC: { tickSize: 0.25, tickValue: 12.5 },
    ZW: { tickSize: 0.25, tickValue: 12.5 },
    ZS: { tickSize: 0.25, tickValue: 12.5 },
    ZM: { tickSize: 0.1, tickValue: 10 },
    ZL: { tickSize: 0.0001, tickValue: 6 },
    ZO: { tickSize: 0.25, tickValue: 12.5 },
    ZR: { tickSize: 0.005, tickValue: 10 },
    CC: { tickSize: 1, tickValue: 10 },
    KC: { tickSize: 0.05, tickValue: 18.75 },
    CT: { tickSize: 0.01, tickValue: 5 },
    SB: { tickSize: 0.01, tickValue: 11.2 },
    OJ: { tickSize: 0.05, tickValue: 7.5 },
    LE: { tickSize: 0.025, tickValue: 10 },
    GF: { tickSize: 0.025, tickValue: 12.5 },
    HE: { tickSize: 0.025, tickValue: 10 },
    // FX (USD margined)
    '6E': { tickSize: 0.00005, tickValue: 6.25 }, // Euro FX (EUR/USD) min tick 0.00005 -> $6.25
    '6B': { tickSize: 0.0001, tickValue: 6.25 }, // GBP
    '6A': { tickSize: 0.0001, tickValue: 10 },   // AUD
    '6C': { tickSize: 0.0001, tickValue: 10 },   // CAD
    '6S': { tickSize: 0.0001, tickValue: 12.5 }, // CHF
    '6J': { tickSize: 0.000001, tickValue: 12.5 }, // JPY (USD settled)
    // Micros FX
    M6E: { tickSize: 0.0001, tickValue: 1.25 },
    M6A: { tickSize: 0.0001, tickValue: 1 },
    M6B: { tickSize: 0.0001, tickValue: 0.625 },
    // EUR-denominated indexes/rates
    FDAX: { tickSize: 0.5, tickValue: 12.5 },    // €12.5
    FESX: { tickSize: 1, tickValue: 10 },        // €10
    FGBL: { tickSize: 0.01, tickValue: 10 },     // €10
    FGBM: { tickSize: 0.01, tickValue: 10 },     // €10
    FGBS: { tickSize: 0.005, tickValue: 5 },     // €5
    FGBX: { tickSize: 0.02, tickValue: 20 },     // €20
    FBTP: { tickSize: 0.01, tickValue: 10 },     // €10
    FBTS: { tickSize: 0.01, tickValue: 10 },     // €10
    FOAT: { tickSize: 0.01, tickValue: 10 },     // €10
  }

  const getSpec = (symbol: string) => {
    const upper = symbol.toUpperCase()
    const base = upper.replace(/([FGHJKMNQUVXZ])\d{1,2}$/i, '')
    if (specMap[base]) return specMap[base]
    return { tickSize: 0.25, tickValue: 1.25 }
  }

  data.slice(1).forEach(row => {
    const activity = getVal(row, iActivityType).toLowerCase()
    if (activity && activity !== 'fills') return

    const openClose = getVal(row, iOpenClose).toLowerCase()
    const internalId = getVal(row, iInternalOrderId)
    const parentId = getVal(row, iParentId)
    const symbolRaw = getVal(row, iSymbol)
    const symbolBaseRaw = normalizeSymbol(symbolRaw)
    const symbolDisplay = instrumentForDisplay(symbolBaseRaw)
    const qty = parseInt(getVal(row, iQuantity) || '0', 10) || 0
    const sideRaw = getVal(row, iBuySell).toLowerCase()
    const side = sideRaw === 'buy' ? 'long' : 'short'
    const fillPrice = parseFloat(getVal(row, iFillPrice) || '0') || 0
    const ts = parseDate(getVal(row, iDateTime)) || parseDate(getVal(row, iTransDateTime))
    if (!ts) return
    const account = getVal(row, iTradeAccount)
    const key = `${account || ''}|${symbolBaseRaw}`
    const spec = getSpec(symbolDisplay)

    if (!stateByKey[key]) {
      stateByKey[key] = {
        opens: [],
        pos: 0,
        side: null,
        entryTs: null,
        entryValue: 0,
        entryQty: 0,
        closeValue: 0,
        closeQty: 0,
        pnl: 0
      }
    }
    const st = stateByKey[key]

    const sideSign = side === 'long' ? 1 : -1
    const posAfter = st.pos + sideSign * qty

    // If position goes from flat to non-flat, reset aggregates
    if (st.pos === 0) {
      st.entryTs = ts
      st.entryValue = 0
      st.entryQty = 0
      st.closeValue = 0
      st.closeQty = 0
      st.pnl = 0
      st.side = side
    }

    if (sideSign === Math.sign(st.pos) || st.pos === 0) {
      // Opening more in same direction
      st.opens.push({ qty, price: fillPrice, ts })
      st.entryValue += fillPrice * qty
      st.entryQty += qty
      st.pos = posAfter
    } else {
      // Closing some/all
      let remaining = qty
      while (remaining > 0 && st.opens.length > 0) {
        const openFill = st.opens[0]
        const matchQty = Math.min(openFill.qty, remaining)
        const priceDiff = fillPrice - openFill.price
        const ticks = priceDiff / spec.tickSize
        st.pnl += ticks * spec.tickValue * matchQty
        st.closeValue += fillPrice * matchQty
        st.closeQty += matchQty
        openFill.qty -= matchQty
        remaining -= matchQty
        if (openFill.qty <= 0) {
          st.opens.shift()
        } else {
          st.opens[0] = openFill
        }
      }
      st.pos = posAfter

      // If we flipped past flat, treat leftover as new position in opposite direction
      if (st.pos === 0 && remaining > 0) {
        st.opens = [{ qty: remaining, price: fillPrice, ts }]
        st.entryTs = ts
        st.entryValue = fillPrice * remaining
        st.entryQty = remaining
        st.closeValue = 0
        st.closeQty = 0
        st.pnl = 0
        st.side = side
        st.pos = remaining * sideSign
      }

      // If flat now, emit a trade
      if (st.pos === 0 && st.closeQty > 0) {
        const totalQty = st.closeQty
        const avgEntry = st.entryQty ? st.entryValue / st.entryQty : 0
        const avgExit = st.closeQty ? st.closeValue / st.closeQty : 0
        const timeInPos = (new Date(ts).getTime() - new Date(st.entryTs || ts).getTime()) / 1000
        processed.push([
          account,
          symbolDisplay,
          '', // entryId not tracked in aggregated mode
          '', // closeId
          String(totalQty),
          avgEntry.toString(),
          avgExit.toString(),
          st.entryTs || ts,
          ts,
          st.pnl.toFixed(2),
          timeInPos.toString(),
          st.side || side,
          '0',
        ])
        // reset state after closing
        st.entryTs = null
        st.entryValue = 0
        st.entryQty = 0
        st.closeValue = 0
        st.closeQty = 0
        st.pnl = 0
        st.side = null
        st.opens = []
      }
    }
  })

  const headers = [
    'accountNumber',
    'instrument',
    'entryId',
    'closeId',
    'quantity',
    'entryPrice',
    'closePrice',
    'entryDate',
    'closeDate',
    'pnl',
    'timeInPosition',
    'side',
    'commission',
  ]

  // Fallback: if no pairs found, treat each fill as a separate trade with zero PnL/time
  if (!processed.length) {
    data.slice(1).forEach(row => {
      const activity = getVal(row, iActivityType).toLowerCase()
      if (activity && activity !== 'fills') return
      const symbolRaw = getVal(row, iSymbol)
      const symbolBase = instrumentForDisplay(normalizeSymbol(symbolRaw))
      const qty = parseInt(getVal(row, iQuantity) || '0', 10) || 0
      const sideRaw = getVal(row, iBuySell).toLowerCase()
      const side = sideRaw === 'buy' ? 'long' : 'short'
      const fillPrice = parseFloat(getVal(row, iFillPrice) || '0') || 0
      const ts = parseDate(getVal(row, iDateTime)) || parseDate(getVal(row, iTransDateTime))
      if (!ts) return
      const account = getVal(row, iTradeAccount)
      const multiplier = sierraMultiplier(symbolBase)
      const pnl = parseFloat(((0) * multiplier).toFixed(2))
      processed.push([
        account,
        symbolBase,
        getVal(row, iInternalOrderId),
        getVal(row, iParentId) || getVal(row, iInternalOrderId),
        String(qty || 1),
        fillPrice.toString(),
        fillPrice.toString(),
        ts,
        ts,
        pnl.toString(),
        '0',
        side,
        '0',
      ])
    })
  }

  return { headers, processedData: processed }
}

// MetaTrader 5 history report (HTML, no AI mapping)
const processMt5 = (data: string[][]): ProcessedData => {
  if (!data.length || !data[0] || !data[0][0]) {
    throw new Error('The MT5 HTML file appears to be empty.')
  }

  const html = data.flat().join('\n').replace(/\u0000/g, '')
  const decode = (s: string) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  const strip = (s: string) => decode(s.replace(/<[^>]+>/g, '')).trim()

  const accountMatch = html.match(/Account:\s*<\/th>\s*<th[^>]*><b>(.*?)<\/b>/i)
  const accountNumber = accountMatch ? strip(accountMatch[1]) : ''

  // Isolate the Positions table block
  const posStart = html.indexOf('<b>Positions</b>')
  const tableStart = posStart >= 0 ? html.lastIndexOf('<table', posStart) : -1
  const tableEnd = tableStart >= 0 ? html.indexOf('</table>', tableStart) : -1
  const block = tableStart >= 0 && tableEnd > tableStart ? html.slice(tableStart, tableEnd) : html

  const normalizeTs = (val: string) => {
    const clean = val.trim()
    if (!clean) return ''
    // MT5 format: 2025.09.02 08:36:55
    return clean.replace(/\./g, '-').replace(' ', 'T') + 'Z'
  }

  // Extract all rows in the block
  const rawRows: string[][] = []
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
  let m: RegExpExecArray | null
  while ((m = rowRegex.exec(block)) !== null) {
    const cells = [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(match => {
      const full = match[0]
      if (/class\s*=\s*["']?hidden/i.test(full)) return null
      return strip(match[1])
    }).filter((v): v is string => v !== null)
    if (cells.length) rawRows.push(cells)
  }

  // Find header row: must contain Time and Symbol (case-insensitive)
  const headerIdx = rawRows.findIndex(r =>
    r.some(c => c.toLowerCase() === 'time') &&
    r.some(c => c.toLowerCase() === 'symbol')
  )
  const bodyRows = headerIdx >= 0 ? rawRows.slice(headerIdx + 1) : rawRows

  const processedData: string[][] = []
  for (const cells of bodyRows) {
    // Expect: Time, Position, Symbol, Type, Volume, Price(open), S/L, T/P, Time(close), Price(close), Commission, Swap, Profit
    if (cells.length < 13) continue
    if (!/^\d{4}\.\d{2}\.\d{2}/.test(cells[0])) continue

    const [
      openTime,
      position,
      symbol,
      type,
      volume,
      openPrice,
      _sl,
      _tp,
      closeTime,
      closePrice,
      commission = '0',
      _swap = '0',
      profit = '0'
    ] = cells

    const qty = parseFloat(volume)
    if (!symbol || isNaN(qty) || qty <= 0) continue

    const side = type.toLowerCase().includes('buy') ? 'long' : 'short'
    const openTs = normalizeTs(openTime)
    const closeTs = normalizeTs(closeTime)
    if (!openTs || !closeTs) continue

    const timeInPos = (new Date(closeTs).getTime() - new Date(openTs).getTime()) / 1000

    processedData.push([
      accountNumber,
      symbol,
      position,
      position,
      qty.toString(),
      openPrice || '',
      closePrice || '',
      openTs,
      closeTs,
      (parseFloat(profit) || 0).toString(),
      timeInPos.toString(),
      side,
      (parseFloat(commission) || 0).toString(),
    ])
  }

  const headers = [
    'accountNumber',
    'instrument',
    'entryId',
    'closeId',
    'quantity',
    'entryPrice',
    'closePrice',
    'entryDate',
    'closeDate',
    'pnl',
    'timeInPosition',
    'side',
    'commission',
  ]

  if (!processedData.length) throw new Error('No trades parsed from MT5 HTML report.')

  return { headers, processedData }
}

export const platforms: PlatformConfig[] = [
  {
    platformName: 'rithmic-sync',
    type: 'rithmic-sync',
    name: 'import.type.rithmicSync.name',
    description: 'import.type.rithmicSync.description',
    category: 'Direct Account Sync',
    videoUrl: '',
    details: 'import.type.rithmicSync.details',
    logo: {
      path: '/logos/rithmic.png',
      alt: 'Rithmic Logo'
    },
    isRithmic: true,
    customComponent: RithmicSyncWrapper,
    steps: [
      {
        id: 'select-import-type',
        title: 'import.steps.selectPlatform',
        description: 'import.steps.selectPlatformDescription',
        component: ImportTypeSelection
      },
      {
        id: 'complete',
        title: 'import.steps.connectAccount',
        description: 'import.steps.connectAccountDescription',
        component: RithmicSyncWrapper,
        isLastStep: true
      }
    ]
  },
  {
    platformName: 'csv-ai',
    type: '',
    name: 'import.type.csvAi.name',
    description: 'import.type.csvAi.description',
    category: 'Intelligent Import',
    videoUrl: '',
    details: '',
    logo: {
      component: () => <Sparkles className="w-4 h-4" />,
    },
    requiresAccountSelection: true,
    processFile: processStandardCsv,
    steps: [
      {
        id: 'select-import-type',
        title: 'import.steps.selectPlatform',
        description: 'import.steps.selectPlatformDescription',
        component: ImportTypeSelection
      },
      {
        id: 'upload-file',
        title: 'import.steps.uploadFile',
        description: 'import.steps.uploadFileDescription',
        component: FileUpload
      },
      {
        id: 'map-columns',
        title: 'import.steps.mapColumns',
        description: 'import.steps.mapColumnsDescription',
        component: ColumnMapping
      },
      {
        id: 'select-account',
        title: 'import.steps.selectAccount',
        description: 'import.steps.selectAccountDescription',
        component: AccountSelection
      },
      {
        id: 'preview-trades',
        title: 'import.steps.reviewTrades',
        description: 'import.steps.reviewTradesDescription',
        component: FormatPreview,
        isLastStep: true
      }
    ]
  },
  {
    platformName: 'tradezella',
    type: 'tradezella',
    name: 'import.type.tradezella.name',
    description: 'import.type.tradezella.description',
    category: 'Platform CSV Import',
    videoUrl: '',
    details: '',
    logo: {
      path: '/logos/tradezella.png',
      alt: 'Tradezella Logo'
    },
    processFile: processStandardCsv,
    processorComponent: TradezellaProcessor,
    tutorialLink: 'https://intercom.help/tradezella-4066d388d93c/en/articles/9725069-how-to-export-data-to-a-csv-file-from-the-trade-log-page',
    steps: [
      {
        id: 'select-import-type',
        title: 'import.steps.selectPlatform',
        description: 'import.steps.selectPlatformDescription',
        component: ImportTypeSelection
      },
      {
        id: 'upload-file',
        title: 'import.steps.uploadFile',
        description: 'import.steps.uploadFileDescription',
        component: FileUpload
      },
      {
        id: 'select-headers',
        title: 'import.steps.selectHeaders',
        description: 'import.steps.selectHeadersDescription',
        component: HeaderSelection
      },
      {
        id: 'preview-trades',
        title: 'import.steps.processTrades',
        description: 'import.steps.processTradesDescription',
        component: TradezellaProcessor,
        isLastStep: true
      }
    ]
  },
  {
    platformName: 'tradovate',
    type: 'tradovate',
    name: 'import.type.tradovate.name',
    description: 'import.type.tradovate.description',
    category: 'Platform CSV Import',
    videoUrl: '',
    details: '',
    logo: {
      path: '/logos/tradovate.png',
      alt: 'Tradovate Logo'
    },
    requiresAccountSelection: true,
    processFile: processStandardCsv,
    processorComponent: TradovateProcessor,
    steps: [
      {
        id: 'select-import-type',
        title: 'import.steps.selectPlatform',
        description: 'import.steps.selectPlatformDescription',
        component: ImportTypeSelection
      },
      {
        id: 'upload-file',
        title: 'import.steps.uploadFile',
        description: 'import.steps.uploadFileDescription',
        component: FileUpload
      },
      {
        id: 'select-account',
        title: 'import.steps.selectAccount',
        description: 'import.steps.selectAccountDescription',
        component: AccountSelection
      },
      {
        id: 'preview-trades',
        title: 'import.steps.processTrades',
        description: 'import.steps.processTradesDescription',
        component: TradovateProcessor,
        isLastStep: true
      }
    ]
  },
  {
    platformName: 'quantower',
    type: 'quantower',
    name: 'import.type.quantower.name',
    description: 'import.type.quantower.description',
    category: 'Platform CSV Import',
    videoUrl: '',
    details: 'import.type.quantower.details',
    logo: {
      path: '/logos/quantower.png',
      alt: 'Quantower Logo'
    },
    skipHeaderSelection: true,
    processFile: processQuantower,
    processorComponent: QuantowerOrderProcessor,
    steps: [
      {
        id: 'select-import-type',
        title: 'import.steps.selectPlatform',
        description: 'import.steps.selectPlatformDescription',
        component: ImportTypeSelection
      },
      {
        id: 'upload-file',
        title: 'import.steps.uploadFile',
        description: 'import.steps.uploadFileDescription',
        component: FileUpload
      },
      {
        id: 'preview-trades',
        title: 'import.steps.processTrades',
        description: 'import.steps.processTradesDescription',
        component: QuantowerOrderProcessor,
        isLastStep: true
      }
    ]
  },
  {
    platformName: 'mt5',
    type: 'mt5',
    name: 'MetaTrader 5',
    description: 'Import MT5 History Report (HTML)',
    category: 'Platform CSV Import',
    details: 'Import your MetaTrader 5 history report (HTML export)',
    logo: {
      path: '/logos/MetaTrader_5.png',
      alt: 'MetaTrader 5'
    },
    skipHeaderSelection: true,
    requiresAccountSelection: false,
    disableAiFormatting: true,
    processFile: processMt5,
    steps: [
      {
        id: 'select-import-type',
        title: 'import.steps.selectPlatform',
        description: 'import.steps.selectPlatformDescription',
        component: ImportTypeSelection
      },
      {
        id: 'upload-file',
        title: 'import.steps.uploadFile',
        description: 'import.steps.uploadFileDescription',
        component: FileUpload
      },
      {
        id: 'preview-trades',
        title: 'import.steps.reviewTrades',
        description: 'import.steps.reviewTradesDescription',
        component: FormatPreview,
        isLastStep: true
      }
    ]
  },
  {
    platformName: 'sierra',
    type: 'sierra',
    name: 'Sierra Chart',
    description: 'Import Sierra Trade Activity Log (TXT/TSV)',
    category: 'Platform CSV Import',
    details: 'Import Sierra Chart TradeActivityLog export',
    logo: {
      path: '/logos/sierra.png',
      alt: 'Sierra Chart'
    },
    skipHeaderSelection: true,
    requiresAccountSelection: false,
    disableAiFormatting: true,
    processFile: processSierra,
    steps: [
      {
        id: 'select-import-type',
        title: 'import.steps.selectPlatform',
        description: 'import.steps.selectPlatformDescription',
        component: ImportTypeSelection
      },
      {
        id: 'upload-file',
        title: 'import.steps.uploadFile',
        description: 'import.steps.uploadFileDescription',
        component: FileUpload
      },
      {
        id: 'preview-trades',
        title: 'import.steps.reviewTrades',
        description: 'import.steps.reviewTradesDescription',
        component: FormatPreview,
        isLastStep: true
      }
    ]
  },
  {
    platformName: 'topstep',
    type: 'topstep',
    name: 'import.type.topstep.name',
    description: 'import.type.topstep.description',
    category: 'Platform CSV Import',
    details: 'import.type.topstep.details',
    logo: {
      path: '/logos/topstep.png',
      alt: 'Topstep Logo'
    },
    requiresAccountSelection: true,
    processFile: processStandardCsv,
    processorComponent: TopstepProcessor,
    tutorialLink: 'https://help.topstep.com/en/articles/9424086-exporting-trades-on-topstepx',
    steps: [
      {
        id: 'select-import-type',
        title: 'import.steps.selectPlatform',
        description: 'import.steps.selectPlatformDescription',
        component: ImportTypeSelection
      },
      {
        id: 'upload-file',
        title: 'import.steps.uploadFile',
        description: 'import.steps.uploadFileDescription',
        component: FileUpload
      },
      {
        id: 'select-headers',
        title: 'import.steps.selectHeaders',
        description: 'import.steps.selectHeadersDescription',
        component: HeaderSelection
      },
      {
        id: 'select-account',
        title: 'import.steps.selectAccount',
        description: 'import.steps.selectAccountDescription',
        component: AccountSelection
      },
      {
        id: 'preview-trades',
        title: 'import.steps.processTrades',
        description: 'import.steps.processTradesDescription',
        component: TopstepProcessor,
        isLastStep: true
      }
    ]
  },
  {
    platformName: 'ninjatrader-performance',
    type: 'ninjatrader-performance',
    name: 'import.type.ninjaTrader.name',
    description: 'import.type.ninjaTrader.description',
    category: 'Platform CSV Import',
    videoUrl: '',
    details: '',
    logo: {
      path: '/logos/ninjatrader.png',
      alt: 'NinjaTrader Logo'
    },
    processFile: processStandardCsv,
    processorComponent: NinjaTraderPerformanceProcessor,
    steps: [
      {
        id: 'select-import-type',
        title: 'import.steps.selectPlatform',
        description: 'import.steps.selectPlatformDescription',
        component: ImportTypeSelection
      },
      {
        id: 'upload-file',
        title: 'import.steps.uploadFile',
        description: 'import.steps.uploadFileDescription',
        component: FileUpload
      },
      // {
      //   id: 'select-headers',
      //   title: 'import.steps.selectHeaders',
      //   description: 'import.steps.selectHeadersDescription',
      //   component: HeaderSelection
      // },
      {
        id: 'preview-trades',
        title: 'import.steps.processTrades',
        description: 'import.steps.processTradesDescription',
        component: NinjaTraderPerformanceProcessor,
        isLastStep: true
      }
    ]
  },
  {
    platformName: 'rithmic-performance',
    type: 'rithmic-performance',
    name: 'import.type.rithmicPerf.name',
    description: 'import.type.rithmicPerf.description',
    category: 'Platform CSV Import',
    videoUrl: '',
    details: 'import.type.rithmicPerf.details',
    logo: {
      path: '/logos/rithmic.png',
      alt: 'Rithmic Logo'
    },
    isRithmic: true,
    skipHeaderSelection: true,
    processFile: processRithmicPerformance,
    processorComponent: RithmicPerformanceProcessor,
    steps: [
      {
        id: 'select-import-type',
        title: 'import.steps.selectPlatform',
        description: 'import.steps.selectPlatformDescription',
        component: ImportTypeSelection
      },
      {
        id: 'upload-file',
        title: 'import.steps.uploadFile',
        description: 'import.steps.uploadFileDescription',
        component: FileUpload
      },
      {
        id: 'preview-trades',
        title: 'import.steps.processTrades',
        description: 'import.steps.processTradesDescription',
        component: RithmicPerformanceProcessor,
        isLastStep: true
      }
    ]
  },
  {
    platformName: 'rithmic-orders',
    type: 'rithmic-orders',
    name: 'import.type.rithmicOrders.name',
    description: 'import.type.rithmicOrders.description',
    category: 'Platform CSV Import',
    videoUrl: '',
    details: 'import.type.rithmicOrders.details',
    logo: {
      path: '/logos/rithmic.png',
      alt: 'Rithmic Logo'
    },
    isRithmic: true,
    skipHeaderSelection: true,
    processFile: processRithmicOrders,
    processorComponent: RithmicOrderProcessor,
    steps: [
      {
        id: 'select-import-type',
        title: 'import.steps.selectPlatform',
        description: 'import.steps.selectPlatformDescription',
        component: ImportTypeSelection
      },
      {
        id: 'upload-file',
        title: 'import.steps.uploadFile',
        description: 'import.steps.uploadFileDescription',
        component: FileUpload
      },
      {
        id: 'preview-trades',
        title: 'import.steps.processTrades',
        description: 'import.steps.processTradesDescription',
        component: RithmicOrderProcessor,
        isLastStep: true
      }
    ]
  },
  {
    platformName: 'etp-sync',
    type: 'etp-sync',
    name: 'import.type.etpSync.name',
    description: 'import.type.etpSync.description',
    category: 'Direct Account Sync',
    videoUrl: '',
    isComingSoon: true,
    details: 'import.type.etpSync.details',
    logo: {
      path: '/logos/etp.png',
      alt: 'ETP Logo'
    },
    // isComingSoon: true,
    customComponent: EtpSync,
    steps: [
      {
        id: 'select-import-type',
        title: 'import.steps.selectPlatform',
        description: 'import.steps.selectPlatformDescription',
        component: ImportTypeSelection
      },
      {
        id: 'complete',
        title: 'import.steps.connectAccount',
        description: 'import.steps.connectAccountDescription',
        component: EtpSync,
        isLastStep: true
      }
    ]
  },
  {
    platformName: 'thor-sync',
    type: 'thor-sync',
    name: 'import.type.thorSync.name',
    description: 'import.type.thorSync.description',
    category: 'Direct Account Sync',
    videoUrl: '',
    details: 'import.type.thorSync.details',
    logo: {
      path: '/logos/thor.png',
      alt: 'Thor Logo'
    },
    customComponent: ThorSync,
    steps: [
      {
        id: 'select-import-type',
        title: 'import.steps.selectPlatform',
        description: 'import.steps.selectPlatformDescription',
        component: ImportTypeSelection
      },
      {
        id: 'complete',
        title: 'import.steps.connectAccount',
        description: 'import.steps.connectAccountDescription',
        component: ThorSync,
        isLastStep: true
      }
    ]
  },
  {
    platformName: 'tradovate-sync',
    type: 'tradovate-sync',
    name: 'import.type.tradovateSync.name',
    description: 'import.type.tradovateSync.description',
    category: 'Direct Account Sync',
    // isComingSoon: true,
    videoUrl: '',
    details: 'import.type.tradovateSync.details',
    logo: {
      path: '/logos/tradovate.png',
      alt: 'Tradovate Logo'
    },
    customComponent: TradovateSync,
    steps: [
      {
        id: 'select-import-type',
        title: 'import.steps.selectPlatform',
        description: 'import.steps.selectPlatformDescription',
        component: ImportTypeSelection
      },
      {
        id: 'complete',
        title: 'import.steps.connectAccount',
        description: 'import.steps.connectAccountDescription',
        component: TradovateSync,
        isLastStep: true
      }
    ]
  },
  {
    platformName: 'ibkr-pdf-import',
    type: 'ibkr-pdf-import',
    name: 'import.type.pdfImport.name',
    description: 'import.type.pdfImport.description',
    category: 'Intelligent Import',
    videoUrl: '',
    details: 'import.type.pdfImport.details',
    logo: {
      path: '/logos/ibkr.png',
      alt: 'IBKR Logo'
    },
    requiresAccountSelection: true,
    steps: [
      {
        id: 'select-import-type',
        title: 'import.steps.selectPlatform',
        description: 'import.steps.selectPlatformDescription',
        component: ImportTypeSelection
      },
      {
        id: 'upload-file',
        title: 'import.steps.uploadFile',
        description: 'import.steps.uploadFileDescription',
        component: PdfUpload
      },
      {
        id: 'process-file',
        title: 'import.steps.processFile',
        description: 'import.steps.processFileDescription',
        component: PdfProcessing
      },
      {
        id: 'select-account',
        title: 'import.steps.selectAccount',
        description: 'import.steps.selectAccountDescription',
        component: AccountSelection
      },
    ]
  },
  {
    platformName: 'atas',
    type: 'atas',
    name: 'import.type.atas.name',
    description: 'import.type.atas.description',
    category: 'Platform CSV Import',
    videoUrl: '',
    details: 'import.type.atas.details',
    logo: {
      component: AtasLogo,
      alt: 'ATAS Logo'
    },
    requiresAccountSelection: true,
    processorComponent: AtasProcessor,
    steps: [
      {
        id: 'select-import-type',
        title: 'import.steps.selectPlatform',
        description: 'import.steps.selectPlatformDescription',
        component: ImportTypeSelection
      },
      {
        id: 'upload-file',
        title: 'import.steps.uploadFile',
        description: 'import.steps.uploadFileDescription',
        component: AtasFileUpload
      },
      {
        id: 'select-account',
        title: 'import.steps.selectAccount',
        description: 'import.steps.selectAccountDescription',
        component: AccountSelection
      },
      {
        id: 'preview-trades',
        title: 'import.steps.processTrades',
        description: 'import.steps.processTradesDescription',
        component: AtasProcessor,
        isLastStep: true
      }
    ]
  },
  {
    platformName: 'ftmo',
    type: 'ftmo',
    name: 'import.type.ftmo.name',
    description: 'import.type.ftmo.description',
    category: 'Platform CSV Import',
    videoUrl: '',
    details: 'import.type.ftmo.details',
    logo: {
      component: FtmoLogo,
      alt: 'FTMO Logo'
    },
    requiresAccountSelection: true,
    skipHeaderSelection: true,
    processFile: processStandardCsv,
    processorComponent: FtmoProcessor,
    steps: [
      {
        id: 'select-import-type',
        title: 'import.steps.selectPlatform',
        description: 'import.steps.selectPlatformDescription',
        component: ImportTypeSelection
      },
      {
        id: 'upload-file',
        title: 'import.steps.uploadFile',
        description: 'import.steps.uploadFileDescription',
        component: FileUpload
      },
      {
        id: 'select-account',
        title: 'import.steps.selectAccount',
        description: 'import.steps.selectAccountDescription',
        component: AccountSelection
      },
      {
        id: 'preview-trades',
        title: 'import.steps.processTrades',
        description: 'import.steps.processTradesDescription',
        component: FtmoProcessor,
        isLastStep: true
      }
    ]
  }
] as const

export type PlatformType = typeof platforms[number]['platformName'] 
