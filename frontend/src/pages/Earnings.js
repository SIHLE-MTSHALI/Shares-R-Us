import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Layout from '../components/Layout';
import { getEarningsEvents, getCompanyEarnings } from '../services/api';
import { toast } from 'react-toastify';
import MarketOpeningTimes from '../components/MarketOpeningTimes';
import LoadingSpinner from '../components/LoadingSpinner';

const localizer = momentLocalizer(moment);

const Earnings = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyEarnings, setCompanyEarnings] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getEarningsEvents();
        const formattedEvents = data.map(event => ({
          ...event,
          start: new Date(event.date),
          end: new Date(event.date),
          title: `${event.symbol} - ${event.company}`
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching earnings events:', error);
        toast.error('Error fetching earnings data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectEvent = async (event) => {
    try {
      setIsLoading(true);
      const data = await getCompanyEarnings(event.symbol);
      setSelectedCompany(event);
      setCompanyEarnings(data);
    } catch (error) {
      console.error('Error fetching company earnings:', error);
      toast.error('Error fetching company earnings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Layout><LoadingSpinner /></Layout>;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Earnings Calendar</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card mb-8">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={handleSelectEvent}
          />
        </div>
        <div className="card mb-8">
          {selectedCompany ? (
            <div>
              <h2 className="text-2xl font-semibold mb-2">{selectedCompany.company} ({selectedCompany.symbol})</h2>
              <p>Estimated EPS: ${selectedCompany.estimatedEPS?.toFixed(2) ?? 'N/A'}</p>
              <p>Actual EPS: ${selectedCompany.actualEPS?.toFixed(2) ?? 'N/A'}</p>
              {companyEarnings && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-2">Historical Earnings</h3>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Estimated EPS</th>
                        <th>Actual EPS</th>
                        <th>Surprise %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companyEarnings.quarterlyEarnings.slice(0, 4).map((quarter, index) => (
                        <tr key={index}>
                          <td>{quarter.fiscalDateEnding}</td>
                          <td>${quarter.estimatedEPS}</td>
                          <td>${quarter.reportedEPS}</td>
                          <td>{quarter.surprisePercentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <p>Select a company from the calendar to view earnings details.</p>
          )}
        </div>
      </div>
      <MarketOpeningTimes />
    </Layout>
  );
};

export default Earnings;