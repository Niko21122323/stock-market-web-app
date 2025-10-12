import TradingViewWidget from "@/components/TradingViewWidget";
import {
  ADVANCED_CHART_WIDGET_CONFIG,
  HEATMAP_WIDGET_CONFIG,
  MARKET_DATA_WIDGET_CONFIG,
  MARKET_OVERVIEW_WIDGET_CONFIG,
  SYMBOL_OVERVIEW_WIDGET_CONFIG,
  TICKER_TAPE_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
} from "@/lib/constants";

const Home = () => {
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  return (
    <section className="py-10">
      <div className="grid md:grid-cols-12 gap-y-10 gap-x-6 2xl:gap-10">
        <TradingViewWidget
          title="Market Movers"
          scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
          config={TICKER_TAPE_WIDGET_CONFIG}
          className="md:col-span-12"
          height={100}
        />
        <TradingViewWidget
          title="What people say"
          scriptUrl={`${scriptUrl}timeline.js`}
          config={TOP_STORIES_WIDGET_CONFIG}
          className="max-xl:order-last md:col-span-5 xl:col-span-4"
          height={600}
        />
        <TradingViewWidget
          title="Stock Heatmap"
          config={HEATMAP_WIDGET_CONFIG}
          scriptUrl={`${scriptUrl}stock-heatmap.js`}
          className="md:col-span-12 xl:col-span-8"
          height={600}
        />
        <TradingViewWidget
          title="Stock Analysis"
          scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
          config={ADVANCED_CHART_WIDGET_CONFIG}
          className="md:col-span-6 2xl:col-span-8"
          height={600}
        />
        <TradingViewWidget
          title="Multi-Symbol View"
          scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js"
          config={SYMBOL_OVERVIEW_WIDGET_CONFIG}
          className="md:col-span-6 2xl:col-span-4"
          height={600}
        />
        <TradingViewWidget
          title="Market Overview"
          scriptUrl={`${scriptUrl}market-overview.js`}
          config={MARKET_OVERVIEW_WIDGET_CONFIG}
          className="md:col-span-12 xl:col-span-6"
          height={600}
        />
        <TradingViewWidget
          title="Technical Chart"
          config={MARKET_DATA_WIDGET_CONFIG}
          scriptUrl={`${scriptUrl}market-quotes.js`}
          className="md:col-span-7 xl:col-span-6"
          height={600}
        />
      </div>
    </section>
  );
};

export default Home;
