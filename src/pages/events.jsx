import React, { useState, useRef, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Text, Flex, Button } from "rebass";
import { useLocation, useHistory, Link } from "react-router-dom";
import moment from "moment";

import EditEventModal from "components/editEventModal";

import { NotificationContextActionCreator } from "context/notification";

const EventsPage = () => {
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const selectedEvent = useRef(null);

  const dateQuery = new URLSearchParams(useLocation().search)?.get("date");
  const history = useHistory();
  const eventsDate = new Date(dateQuery);

  useEffect(() => {
    if (!dateQuery) {
      history.push("/");
    }
  }, []);

  const events = useSelector((state) => state.events).filter(({ date }) => {
    return +new Date(date) === +new Date(eventsDate);
  });

  const dispatch = useDispatch();
  const createNotification = useContext(NotificationContextActionCreator);

  const handleCloseEditEventModal = () => {
    setIsEditEventModalOpen(false);
  };

  const handleOpenEditEventModal = (isEventEdit, eventId) => {
    if (isEventEdit) {
      selectedEvent.current = events.find(({ id }) => id === eventId);
    } else {
      selectedEvent.current = null;
    }

    setIsEditEventModalOpen(true);
  };

  const handleCreateEvent = ({ ...event }) => {
    const rd = new Date(event.timeFrom);
    rd.setFullYear(eventsDate.getFullYear());
    rd.setMonth(eventsDate.getMonth());
    rd.setDate(eventsDate.getDate());

    const dateReminder = moment(rd)
      .subtract(event.timeReminder.hours(), "hours")
      .subtract(event.timeReminder.minutes(), "minutes")
      .seconds(0)
      .milliseconds(0);

    dispatch({
      type: "ADD_EVENT",
      payload: { ...event, date: eventsDate, dateReminder },
    });
    createNotification("success", { text: "Событие добавлено!" });
  };

  const handleEditEvent = ({ ...event }) => {
    const rd = new Date(event.timeFrom);
    rd.setFullYear(eventsDate.getFullYear());
    rd.setMonth(eventsDate.getMonth());
    rd.setDate(eventsDate.getDate());

    const dateReminder = moment(rd)
      .subtract(event.timeReminder.hours(), "hours")
      .subtract(event.timeReminder.minutes(), "minutes")
      .seconds(0)
      .milliseconds(0);

    dispatch({
      type: "EDIT_EVENT",
      payload: { ...event, date: eventsDate, dateReminder },
    });
    createNotification("success", { text: "Событие изменено!" });
  };

  const handleDeleteEvent = (id) => {
    dispatch({ type: "DELETE_EVENT", payload: { id } });
    createNotification("success", { text: "Событие удалено!" });
  };

  return (
    <Box>
      {isEditEventModalOpen && (
        <EditEventModal
          handleClose={handleCloseEditEventModal}
          handleCreateEvent={handleCreateEvent}
          handleEditEvent={handleEditEvent}
          handleDeleteEvent={handleDeleteEvent}
          event={selectedEvent.current}
        />
      )}
      <Box>
        <Box mb="30px">
          <Link to={"/"}>
            <Button
              p="0"
              sx={{
                backgroundColor: "white",
                color: "#008EFF",
              }}
            >
              Назад в календарь
            </Button>
          </Link>
        </Box>
        <Button
          onClick={() => handleOpenEditEventModal(false)}
          sx={{
            backgroundColor: "#008EFF",
            color: "white",
          }}
        >
          Создать событие
        </Button>
        <Box mt="20px" sx={{}} width="100%">
          {events.map((event) => {
            return (
              <Box key={event.id} width="100%" mb="15px">
                <Event
                  {...event}
                  handleClickDeleteButton={() => handleDeleteEvent(event.id)}
                  handleClickEditButton={() =>
                    handleOpenEditEventModal(true, event.id)
                  }
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

const Event = ({
  title,
  timeFrom,
  timeTo,
  handleClickDeleteButton,
  handleClickEditButton,
}) => {
  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Box>
        <Text
          maxWidth="450px"
          mb="5px"
          sx={{
            color: "#595959",
          }}
        >
          {title}
        </Text>
        <Text
          sx={{
            color: "#9A9A9A",
          }}
        >{`с ${new Date(timeFrom).toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        })} до ${new Date(timeTo).toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        })}`}</Text>
      </Box>
      <Flex alignItems="center">
        <Button
          onClick={handleClickEditButton}
          sx={{
            backgroundColor: "white",
            color: "#008EFF",
          }}
        >
          Редактировать
        </Button>
        <Text opacity="0.5">|</Text>
        <Button
          onClick={handleClickDeleteButton}
          sx={{
            backgroundColor: "white",
            color: "#008EFF",
          }}
        >
          Удалить
        </Button>
      </Flex>
    </Flex>
  );
};

export default EventsPage;
