import React from "react";
import classNames from "classnames";
import { Box, Text, Flex } from "rebass";

import "./monthView.scss";

const RenderBlankDaysBefore = ({ year, month }) => {
  let dateIndex = new Date(year, month, 0);
  const firstDayWeekDay = dateIndex.getDay();
  if (firstDayWeekDay === 0) return [];
  return new Array(firstDayWeekDay)
    .fill(0)
    .map((i, index) => (
      <div
        className={classNames("item__day--blank", "item__day")}
        key={`day_before_${index}`}
      />
    ));
};

const RenderBlankDaysAfter = ({ year, month }) => {
  let dateIndex = new Date(year, month + 1, 0);
  const lastDayWeekDay = dateIndex.getDay();
  if (lastDayWeekDay === 0) return [];
  return new Array(7 - lastDayWeekDay)
    .fill(0)
    .map((i, index) => (
      <div
        className={classNames("item__day--blank", "item__day")}
        key={`day_after_${index}`}
      />
    ));
};

const CalendarMonthView = ({ selectedDate, days, handleClickCalendarDay }) => {
  return (
    <div className="calendarMonth">
      <div className="item__week">
        <div className="item__weekday">ПН</div>
        <div className="item__weekday">ВТ</div>
        <div className="item__weekday">СР</div>
        <div className="item__weekday">ЧТ</div>
        <div className="item__weekday">ПТ</div>
        <div className="item__weekday">СБ</div>
        <div className="item__weekday">ВС</div>
      </div>
      <div className="item__inner">
        {
          <RenderBlankDaysBefore
            year={days[0].date.getFullYear()}
            month={days[0].date.getMonth()}
          />
        }
        {days.map(({ date, events }) => {
          const monthDay = date.getDate();
          const isActive = date.toDateString() === selectedDate.toDateString();
          const isPast =
            new Date(date.toDateString()) < new Date(new Date().toDateString());
          const isFuture =
            new Date(date.toDateString()) >=
            new Date(new Date().toDateString());

          return (
            <div
              onClick={() => {
                handleClickCalendarDay(date);
              }}
              className={classNames(
                "item__day",
                {
                  "item__day--active": isActive,
                },
                {
                  "item__day--past": isPast,
                },
                {
                  "item__day--future": isFuture,
                },
                {
                  "item__day--event": events.length > 0 && !isActive,
                }
              )}
              key={date}
            >
              <Box maxHeight="60px" overflowY="hidden">
                <Text textAlign="end">{monthDay}</Text>
                <Box mt="5px">
                  {events.map((e, index) => {
                    return (
                      <Flex key={e.title + index} alignItems="center">
                        <Box
                          sx={{
                            minWidth: "5px",
                            marginLeft: "5px",
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            backgroundColor: "#00C900",
                          }}
                          mr="3px"
                        />
                        <Text
                          sx={{
                            fontSize: "10px",
                            color: "#737373",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            padding: "5px",
                            overflowX: "hidden",
                          }}
                        >
                          {e.title}
                        </Text>
                      </Flex>
                    );
                  })}
                </Box>
              </Box>
            </div>
          );
        })}
        {
          <RenderBlankDaysAfter
            year={days[0].date.getFullYear()}
            month={days[0].date.getMonth()}
          />
        }
      </div>
    </div>
  );
};

export default CalendarMonthView;
