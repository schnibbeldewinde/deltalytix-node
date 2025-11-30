import { useTheme } from '@/context/theme-provider'
import { useI18n } from '@/locales/client'

export default function Partners() {
    const { effectiveTheme } = useTheme()
    const t = useI18n()
    
    return (
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        {t('landing.partners.title')}
                    </h2>
                    <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed">
                        {t('landing.partners.description')}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center justify-items-center w-full mt-8">
                    <a className="relative w-full h-[60px] flex items-center justify-center" href="https://account.ninjatrader.com/register?introducingPartner=deltalytix" target="_blank" rel="noopener noreferrer">
                        <img
                            src="/logos/ninjatrader-ob.svg"
                            alt="NinjaTrader"
                            className="object-contain max-h-[60px] filter dark:brightness-0 dark:invert"
                            loading="lazy"
                        />
                    </a>
                    <a className="relative w-full h-[60px] flex items-center justify-center">
                        <img
                            src={effectiveTheme !== 'dark' ? '/logos/etp-b.png' : '/logos/etp-w.png'}
                            alt="Trade Copier by ETP"
                            className="object-contain max-h-[60px]"
                            loading="lazy"
                        />
                    </a>
                    <a className="relative w-full h-[60px] flex items-center justify-center">
                        <img
                            src={effectiveTheme === 'dark' ? '/logos/rithmic-logo-white.png' : '/logos/rithmic-logo-black.png'}
                            alt="Rithmic"
                            className="object-contain max-h-[60px]"
                            loading="lazy"
                        />
                    </a>
                </div>
            </div>
        </div>
    )
} 
