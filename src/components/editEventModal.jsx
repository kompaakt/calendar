import React, { useState, useEffect } from "react";
import { Box, Text, Button, Flex } from "rebass";
import { Input } from "@rebass/forms";
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import "./pickerStyles.css";
import moment from "moment";

import Modal from "components/modal";

const format = "HH:mm";

moment.locale("ru");

const EditEventModal = ({
  handleClose,
  handleCreateEvent,
  handleEditEvent,
  event,
}) => {
  const now = moment().second(0).millisecond(0);
  const [timeFrom, setTimeFrom] = useState(
    event?.timeFrom ? moment(event.timeFrom) : now
  );
  const [timeTo, setTimeTo] = useState(
    event?.timeTo
      ? moment(event.timeTo)
      : moment()
          .hour(new Date(now).getHours)
          .minute(new Date(now).getMinutes() + 30)
  );
  const [timeReminder, setTimeReminder] = useState(
    event?.timeReminder
      ? moment(event.timeReminder)
      : moment().hour(0).minute(0).second(0).millisecond(0)
  );

  const [title, setTitle] = useState(event?.title ?? "");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (title.length > 0 && timeTo > timeFrom) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [timeTo, timeFrom, title]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (event?.id) {
      handleEditEvent({
        id: event.id,
        title,
        timeFrom: timeFrom.second(0).millisecond(0),
        timeTo: timeTo.second(0).millisecond(0),
        timeReminder: timeReminder.second(0).millisecond(0),
      });
    } else {
      handleCreateEvent({
        title,
        timeFrom: timeFrom.second(0).millisecond(0),
        timeTo: timeTo.second(0).millisecond(0),
        timeReminder: timeReminder.second(0).millisecond(0),
      });
    }

    handleClose();
  };

  return (
    <Modal handleClose={handleClose}>
      <Box
        backgroundColor="white"
        width="500px"
        p="30px"
        sx={{
          borderRadius: "5px",
        }}
      >
        <Box as="form" onSubmit={handleSubmit} id="eventEditForm" noValidate>
          <Input
            type="text"
            placeholder="Новая задача"
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            mb="15px"
            sx={{
              border: "1.5px solid #999494",
              borderRadius: "5px",
              color: "#595959",
            }}
          />
          <Box
            sx={{
              color: "#595959",
            }}
          >
            <Flex mb="15px" alignItems="center">
              <Text mr="10px" width="120px">
                С:
              </Text>
              <TimePicker
                showSecond={false}
                defaultValue={timeFrom}
                className="xxx"
                format={format}
                minuteStep={1}
                inputReadOnly
                onChange={setTimeFrom}
              />
            </Flex>
            <Flex mb="15px" alignItems="center">
              <Text mr="10px" width="120px">
                До:
              </Text>
              <TimePicker
                showSecond={false}
                defaultValue={timeTo}
                className="xxx"
                format={format}
                minuteStep={1}
                inputReadOnly
                onChange={setTimeTo}
              />
            </Flex>
            <Flex mb="15px" alignItems="center">
              <Text mr="10px" width="120px">
                Напомнить за:
              </Text>
              <TimePicker
                showSecond={false}
                defaultValue={timeReminder}
                className="xxx"
                format={format}
                minuteStep={1}
                inputReadOnly
                onChange={setTimeReminder}
              />
            </Flex>
          </Box>
          <Button
            type="submit"
            sx={{
              backgroundColor: isValid ? "#008EFF" : "#595959",
              color: "white",
              opacity: isValid ? 1 : 0.5,
            }}
            disabled={!isValid}
          >
            Сохранить
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditEventModal;
