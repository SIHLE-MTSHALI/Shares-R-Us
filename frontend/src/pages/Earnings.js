import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Layout from '../components/Layout';
import { getEarningsEvents, getRandomAssets } from '../services/api';
import { toast } from 'react-toastify';
import MarketOpeningTimes from '../components/MarketOpeningTimes';

const localizer = momentLocalizer(moment);

const Earnings = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let data = await getEarningsEvents();
        
        // If no events are returned, fetch 5 random assets
        if (data.length === 0) {
          const randomAssets = await getRandomAssets(5);
          data = randomAssets.map(asset => ({
            id: asset.symbol,
            symbol: asset.symbol,
            company: asset.name,
            date: moment().format('YYYY-MM-DD'), // Set to current date
            estimatedEPS: 0, // Default value
            actualEPS: null
          }));
        }
        
        setEvents(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Layout><div>Loading data...</div></Layout>;
  }

  if (events.length === 0) {
    return <Layout><div>No data available at the moment.</div></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Earnings Calendar</h1>
      <div className="card mb-8">
        <Calendar
          localizer={localizer}
          events={events.map(event => ({
            ...event,
            start: new Date(event.date),
            end: new Date(event.date)
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Symbol</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Estimated EPS</th>
              <th className="px-4 py-2">Actual EPS</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td className="border px-4 py-2">{event.company}</td>
                <td className="border px-4 py-2">{event.symbol}</td>
                <td className="border px-4 py-2">{moment(event.date).format('YYYY-MM-DD')}</td>
                <td className="border px-4 py-2">${event.estimatedEPS?.toFixed(2) ?? 'N/A'}</td>
                <td className="border px-4 py-2">${event.actualEPS ? event.actualEPS.toFixed(2) : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MarketOpeningTimes />
    </Layout>
  );
};

export default Earnings;