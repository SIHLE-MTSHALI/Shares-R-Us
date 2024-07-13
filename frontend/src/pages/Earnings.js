import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Layout from '../components/Layout';
import { getEarningsEvents } from '../services/api';
import { toast } from 'react-toastify';
import MarketOpeningTimes from '../components/MarketOpeningTimes';

const localizer = momentLocalizer(moment);

const Earnings = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEarningsEvents = async () => {
      try {
        setIsLoading(true);
        const data = await getEarningsEvents();
        const formattedEvents = data.map(event => ({
          ...event,
          start: new Date(event.date),
          end: new Date(event.date),
          title: `${event.company} Earnings Call`,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        toast.error('Failed to fetch earnings events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarningsEvents();
  }, []);

  if (isLoading) {
    return <Layout><div>Loading earnings data...</div></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Earnings Calendar</h1>
      <div className="card mb-8">
        <Calendar
          localizer={localizer}
          events={events}
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