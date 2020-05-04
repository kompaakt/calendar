import React, { useState, useMemo, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Text, Flex, Button } from "rebass";
import { Select } from "@rebass/forms";

import Calendar from "components/calendar";

const CalendarPage = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [viewMode, setViewMode] = useState("year");
  const [monthString, setMonthString] = useState("");

  let history = useHistory();
  const events = useSelector((state) => state.events);

  const years = Array.from(Array(2100).keys()).splice(2000);
  const months = Array.from(Array(12).keys()).splice(0);

  useEffect(() => {
    setMonthString(monthsStrings[month]);
  }, [month]);

  const handleClickCalendarDay = (dateStr) => {
    const date = new Date(dateStr).toLocaleDateString().replace(/\//g, "-");
    history.push(`/events?date=${date}`);
  };

  return (
    <Box width="100%">
      <Flex ml="auto" width="fit-content" mb="30px">
        <Select
          onChange={(e) => {
            setYear(e.target.value);
          }}
          width="80px"
          mr="10px"
          sx={{
            borderRadius: "5px",
            border: "1.5px solid #8f8e94",
            backgroundColor: "white",
            color: "#737373",
          }}
          defaultValue={year}
        >
          {years.map((year) => (
            <option key={year}>{year}</option>
          ))}
        </Select>
        <Select
          width="90px"
          mr="20px"
          sx={{
            borderRadius: "5px",
            border: "1.5px solid #8f8e94",
            backgroundColor: "white",
            color: "#737373",
            opacity: `${viewMode !== "month" && "0.5"}`,
          }}
          onChange={(e) => {
            setMonth(
              monthsStrings.findIndex((month) => month === e.target.value)
            );
          }}
          value={viewMode === "month" ? monthString : "Месяц"}
          disabled={viewMode !== "month"}
        >
          {months.map((month) => {
            const date = new Date();
            date.setMonth(month);
            return <option key={month}>{monthsStrings[month]}</option>;
          })}
        </Select>
        <Flex sx={{}}>
          <Button
            onClick={() => setViewMode("month")}
            sx={{
              borderRadius: "5px 0 0 5px",
              border: `1.5px solid ${
                viewMode === "month" ? "#2FA3FF" : "#737373"
              }`,
              borderRight: `${viewMode === "year" && "1px solid transparent"}`,
              backgroundColor: "white",
              color: "#737373",
            }}
          >
            Месяц
          </Button>
          <Button
            onClick={() => setViewMode("year")}
            sx={{
              borderRadius: "0 5px 5px 0",
              border: `1.5px solid ${
                viewMode === "year" ? "#2FA3FF" : "#737373"
              }`,
              borderLeft: `${viewMode === "month" && "1px solid transparent"}`,
              zIndex: `${viewMode === "year" && "2"}`,
              color: "#737373",
              backgroundColor: "white",
            }}
          >
            Год
          </Button>
        </Flex>
      </Flex>
      <Flex justifyContent="center" alignItems="center" width="100%">
        <RenderCalendar
          events={events}
          handleClickCalendarDay={handleClickCalendarDay}
          year={year}
          month={month}
          viewMode={viewMode}
        />
      </Flex>
    </Box>
  );
};

const RenderCalendar = ({
  events,
  handleClickCalendarDay,
  year,
  month,
  viewMode,
}) => {
  const months = Array.from(Array(12).keys()).splice(0);

  const monthsWithDays = useMemo(() => {
    return months.map((month, index) => {
      return getDaysInMonth(month, year).map((day) => ({
        date: day,
        events:
          events.filter(
            (item) =>
              new Date(item.date).toDateString() ===
              new Date(day).toDateString()
          ) ?? [],
      }));
    });
  }, [months, events]);

  switch (viewMode) {
    case "month":
      return (
        <RenderMonth
          events={monthsWithDays[month]}
          handleClickCalendarDay={handleClickCalendarDay}
        />
      );
    case "year":
      return (
        <RenderYear
          year={year}
          monthsWithDays={monthsWithDays}
          handleClickCalendarDay={handleClickCalendarDay}
        />
      );
    default:
      return null;
  }
};

const RenderYear = ({ monthsWithDays, handleClickCalendarDay }) => {
  return (
    <Box
      width="100%"
      sx={{
        display: "grid",
        gridGap: "8px",
        gridTemplateColumns: "repeat(auto-fit, minmax(660px, 1fr))",
      }}
    >
      {monthsWithDays.map((items, index) => {
        const monthString = new Date(items[0].date).toLocaleDateString(
          "ru-RU",
          {
            month: "long",
          }
        );
        return (
          <Box
            width="600px"
            mr={index % 2 === 0 && "10px"}
            mb="50px"
            key={monthString}
          >
            <Text
              mb="25px"
              sx={{
                fontFamily: "SF Pro Display",
                fontWeight: "bold",
                fontSize: "22px",
                lineHeight: "28px",
                letterSpacing: "0.35px",
                textTransform: "capitalize",
              }}
            >
              {monthString}
            </Text>
            <Calendar
              handleClickCalendarDay={handleClickCalendarDay}
              items={items}
            />
          </Box>
        );
      })}
    </Box>
  );
};

const RenderMonth = ({ events, handleClickCalendarDay }) => {
  return (
    <Box>
      <Text
        mb="25px"
        sx={{
          fontFamily: "SF Pro Display",
          fontWeight: "bold",
          fontSize: "22px",
          lineHeight: "28px",
          letterSpacing: "0.35px",
          textTransform: "capitalize",
        }}
      >
        {new Date(events[0].date).toLocaleDateString("ru-RU", {
          month: "long",
        })}
      </Text>
      <Calendar
        handleClickCalendarDay={handleClickCalendarDay}
        items={events}
      />
    </Box>
  );
};

function getDaysInMonth(month, year) {
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

const monthsStrings = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export default CalendarPage;
