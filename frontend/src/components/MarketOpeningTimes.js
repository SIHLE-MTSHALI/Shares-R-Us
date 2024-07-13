import React from 'react';
import moment from 'moment-timezone';

const marketTimes = [
  { name: 'New York Stock Exchange (NYSE)', timezone: 'America/New_York', open: '09:30', close: '16:00' },
  { name: 'NASDAQ', timezone: 'America/New_York', open: '09:30', close: '16:00' },
  { name: 'London Stock Exchange (LSE)', timezone: 'Europe/London', open: '08:00', close: '16:30' },
  { name: 'Tokyo Stock Exchange (TSE)', timezone: 'Asia/Tokyo', open: '09:00', close: '15:00' },
  { name: 'Hong Kong Stock Exchange (HKEX)', timezone: 'Asia/Hong_Kong', open: '09:30', close: '16:00' },
  { name: 'Johannesburg Stock Exchange (JSE)', timezone: 'Africa/Johannesburg', open: '09:00', close: '17:00' },
];

const MarketOpeningTimes = () => {
  const now = moment();

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Stock Market Opening Times</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketTimes.map((market) => {
          const marketNow = now.tz(market.timezone);
          const openTime = moment.tz(`${marketNow.format('YYYY-MM-DD')} ${market.open}`, market.timezone);
          const closeTime = moment.tz(`${marketNow.format('YYYY-MM-DD')} ${market.close}`, market.timezone);
          const isOpen = marketNow.isBetween(openTime, closeTime);

          return (
            <div key={market.name} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">{market.name}</h3>
              <p>Current time: {marketNow.format('HH:mm')}</p>
              <p>Open: {market.open} - Close: {market.close}</p>
              <p className={isOpen ? 'text-green-600' : 'text-red-600'}>
                {isOpen ? 'Open' : 'Closed'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketOpeningTimes;