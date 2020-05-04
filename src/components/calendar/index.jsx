import React from "react";

import CalendarMonthView from "./monthView";

import "./index.css";

const CalendarWrapper = ({ items, handleClickCalendarDay }) => {
  return (
    <Calendar items={items} handleClickCalendarDay={handleClickCalendarDay} />
  );
};

const Calendar = ({ items, handleClickCalendarDay }) => {
  const selectedDate = new Date();

  return (
    <div className="calendarContainer">
      <div className="calendar">
        <CalendarMonthView
          handleClickCalendarDay={handleClickCalendarDay}
          days={items}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
};

export default CalendarWrapper;
