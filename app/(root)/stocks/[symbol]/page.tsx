import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import { checkIsInWatchlist } from "@/lib/actions/watchlist.actions";
import {
  BASELINE_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
  SYMBOL_INFO_WIDGET_CONFIG,
} from "@/lib/constants";
export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;
  const isInWatchlist = await checkIsInWatchlist(symbol);
  return (
    <section className="grid grid-cols-12 gap-6 py-10">
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="col-span-1 md:col-span-6 xl:col-span-8 flex flex-col justify-between h-full">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
            height={70}
            className="max-md:mb-6"
          />
          <WatchlistButton
            symbol={symbol.toUpperCase()}
            company={symbol.toUpperCase()}
            isInWatchlist={isInWatchlist}
          />
        </div>
        <div className="col-span-1 md:col-span-6 xl:col-span-4 h-fit">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}financials.js`}
            config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
            height={364}
          />
        </div>
      </div>
      <TradingViewWidget
        scriptUrl={`${scriptUrl}advanced-chart.js`}
        config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
        className="col-span-12"
        height={600}
      />
      <TradingViewWidget
        scriptUrl={`${scriptUrl}advanced-chart.js`}
        config={BASELINE_WIDGET_CONFIG(symbol)}
        className="col-span-12"
        height={600}
      />
    </section>
  );
}
