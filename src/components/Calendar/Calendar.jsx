import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

const Cal = () => {
    const [date, setDate] = useState(new Date());


    const handleDateChange = (newDate) => {
        setDate(newDate);
        // Call a function to handle journal entries for the selected date
        handleJournalEntries(newDate);
      };


      const handleJournalEntries = (selectedDate) => {
        // Implement your logic to handle journal entries for the selected date
        console.log('Selected date:', selectedDate);
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
   
   
    return (
        <div className="calendar-container">
        <Calendar
            onChange={handleDateChange}
            value={date}
            tileClassName={tileClassName}
            prev2ButtonClassName="calendar-button"
            next2ButtonClassName="calendar-button"
        />
        </div>
        );
    };




export default Cal;
