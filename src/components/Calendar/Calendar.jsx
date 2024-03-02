import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import PropTypes from 'prop-types';

const Cal = ({ onDateClick, entries}) => {
    const [date, setDate] = useState(new Date());


    const handleDateChange = (newDate) => {
      // Convert the selected date to Pacific Standard Time
      const pstDate = new Date(newDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
      console.log('Selected date in PST:', pstDate);
      setDate(newDate);
      // Call a function to handle journal entries for the selected date
      onDateClick(pstDate);
  };

      const tileClassName = ({ date, view }) => {
        // Add a custom class to the calendar tiles
        if (view === 'month') {
          const isCurrentDay = date.getDate() === new Date().getDate();
          const isCurrentMonth = date.getMonth() === new Date().getMonth();
          const isCurrentYear = date.getFullYear() === new Date().getFullYear();
          return isCurrentDay && isCurrentMonth && isCurrentYear ? 'calendar-tile current-day' : 'calendar-tile';
        }
        return null;
      };
      
      const tileContent = ({ date }) => {
        // Check if there is an entry for the date
        const entryForDate = entries.find(entry => {
            const entryDate = new Date(entry.DateCreated).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: '2-digit' });
            const tileDate = date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', year: '2-digit' });
            return entryDate === tileDate;
        });
        // If there is an entry, render a green circle
        return entryForDate ? <div className="entry-badge"></div> : null;
    };
   
    return (
        <div className="calendar-container">
        <Calendar
            onChange={handleDateChange}
            value={date}
            tileClassName={tileClassName}
            tileContent={tileContent}
            prev2ButtonClassName="calendar-button"
            next2ButtonClassName="calendar-button"
        />
        </div>
        );
    };

    Cal.propTypes = {
      onDateClick: PropTypes.func.isRequired,
      entries: PropTypes.array.isRequired,
    };
    
export default Cal;
