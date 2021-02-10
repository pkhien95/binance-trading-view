import datafeedJs from './datafeed';
import streamingJs from './streaming';

const tradingViewJs = `
${streamingJs}

const lastBarsCache = new Map();

const channelToSubscription = new Map();

const configurationData = {
  supported_resolutions: ['1D', '1W', '1M'],
  exchanges: [
    {
      value: 'Binance',
      name: 'Binance',
      desc: 'Binance',
    },
    {
      // \`exchange\` argument for the \`searchSymbols\` method, if a user selects this exchange
      value: 'Kraken',

      // filter name
      name: 'Kraken',

      // full exchange name displayed in the filter popup
      desc: 'Kraken bitcoin exchange',
    },
  ],
  symbols_types: [
    {
      name: 'crypto',

      // \`symbolType\` argument for the \`searchSymbols\` method, if a user selects this symbol type
      value: 'crypto',
    },
    // ...
  ],
};

function getParameterByName(name) {
  name = name.replace(/[\\[]/, '\\\\[').replace(/[\\]]/, '\\\\]');
  var regex = new RegExp('[\\\\?&]' + name + '=([^&#]*)'),
    results = regex.exec(location.search);
  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(/\\+/g, ' '));
}

async function makeApiRequest(path) {
  try {
    const response = await fetch(\`https://min-api.cryptocompare.com/\${path}\`);
    
    return response.json();
  } catch (error) {
    throw new Error(\`CryptoCompare request error: \${error.status}\`);
  }
}

// Generate a symbol ID from a pair of the coins
function generateSymbol(exchange, fromSymbol, toSymbol) {
  const short = \`\${fromSymbol}/\${toSymbol}\`;
  return {
    short,
    full: \`\${exchange}:\${short}\`,
  };
}

async function getAllSymbols() {
  const data = await makeApiRequest('data/v3/all/exchanges');
  let allSymbols = [];

  for (const exchange of configurationData.exchanges) {
    const pairs = data.Data[exchange.value].pairs;
    for (const leftPairPart of Object.keys(pairs)) {
      const symbols = pairs[leftPairPart].map((rightPairPart) => {
        const symbol = generateSymbol(
          exchange.value,
          leftPairPart,
          rightPairPart,
        );
        return {
          symbol: symbol.short,
          full_name: symbol.full,
          description: symbol.short,
          exchange: exchange.value,
          type: 'crypto',
        };
      });
      allSymbols = [...allSymbols, ...symbols];
    }
  }
  return allSymbols;
}

function parseFullSymbol(fullSymbol) {
  const match = fullSymbol.match(/^(\\w+):(\\w+)\\/(\\w+)$/);
  if (!match) {
    return null;
  }

  return {exchange: match[1], fromSymbol: match[2], toSymbol: match[3]};
}

function initOnReady() {
  var widget = (window.tvWidget = new TradingView.widget({
    debug: true, // uncomment this line to see Library errors and warnings in the console
    fullscreen: true,
    symbol: 'Binance:BTC/USDT',
    interval: '1D',
    container_id: 'tv_chart_container',

    //\tBEWARE: no trailing slash is expected in feed URL
    datafeed: ${datafeedJs},
    library_path: 'charting_library/',
    locale: getParameterByName('lang') || 'en',

    disabled_features: ['use_localstorage_for_settings'],
    enabled_features: ['study_templates'],
    charts_storage_url: 'https://saveload.tradingview.com',
    charts_storage_api_version: '1.1',
    client_id: 'tradingview.com',
    user_id: 'public_user_id',
    theme: getParameterByName('theme'),
  }));
}

initOnReady()
`;

export default tradingViewJs;
