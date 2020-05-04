import { nanoid } from "nanoid";

const DELETE_NOTIFICATION_TIMEOUT = 10000;

const scheduleReminderNotification = (action, event) => {
  console.log(action);
  const scheduledTime = new Date(event.dateReminder);
  const CREATE_NOTIFICATION_TIMEOUT = scheduledTime - new Date();

  if (scheduledTime >= new Date() && CREATE_NOTIFICATION_TIMEOUT < 86400000) {
    const notificationId = nanoid();

    const timerId = setTimeout(() => {
      action.asyncDispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: notificationId,
          type: "reminder",
          content: {
            title: "Напоминание",
            text: `У вас запланировано "${event.title}" с ${new Date(
              event.timeFrom
            ).toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            })} до  ${new Date(event.timeTo).toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            })}`,
            event,
          },
        },
      });
      action.asyncDispatch({
        type: "DELETE_TASK",
        payload: {
          id: event.id,
        },
      });
      setTimeout(() => {
        action.asyncDispatch({
          type: "DELETE_NOTIFICATION",
          payload: { id: notificationId },
        });
      }, DELETE_NOTIFICATION_TIMEOUT);
    }, CREATE_NOTIFICATION_TIMEOUT);

    action.asyncDispatch({
      type: "ADD_TASK",
      payload: { timerId, id: event.id, scheduledTime },
    });

    return { timerId, scheduledTime, content: { id: event.id } };
  }
  return {};
};

const events = (state = [], action) => {
  switch (action.type) {
    case "ADD_EVENT": {
      const id = nanoid();

      scheduleReminderNotification(action, { ...action.payload, id });

      return [...state, { id, ...action.payload }];
    }
    case "EDIT_EVENT": {
      action.asyncDispatch({
        type: "DELETE_TASK",
        payload: { id: action.payload.id },
      });

      scheduleReminderNotification(action, action.payload);

      const newState = state.filter(({ id }) => id !== action.payload.id);
      return [...newState, { ...action.payload }];
    }
    case "DELETE_EVENT": {
      const newState = state.filter(({ id }) => id !== action.payload.id);
      action.asyncDispatch({
        type: "DELETE_TASK",
        payload: { id: action.payload.id },
      });
      return [...newState];
    }

    default: {
      return state;
    }
  }
};

const notifications = (state = [], action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION": {
      return [
        ...state,
        {
          ...action.payload,
        },
      ];
    }

    case "DELETE_NOTIFICATION": {
      return [
        ...state.filter(
          (notification) => notification.id !== action.payload.id
        ),
      ];
    }

    default: {
      return state;
    }
  }
};

const scheduledTasks = (state = [], action) => {
  switch (action.type) {
    case "ADD_TASK": {
      return [
        ...state,
        {
          timerId: action.payload.timerId,
          scheduledTime: action.payload.scheduledTime,
          content: { id: action.payload.id },
        },
      ];
    }

    case "DELETE_TASK": {
      const task = state.find((task) => task.content.id === action.payload.id);
      let newTasks = [];
      if (task) {
        clearTimeout(task.timerId);
        newTasks = [...state.filter((t) => t.timerId !== task.timerId)];
      } else {
        newTasks = [...state];
      }

      return newTasks;
    }

    case "persist/REHYDRATE": {
      console.log("rehydre", action.payload);
      if (!action.payload) return state;
      action.payload.events
        .filter((event) => new Date(event.dateReminder) >= new Date())
        .forEach((event) => {
          console.log(event);
          scheduleReminderNotification(action, event);
        });
      return state;
    }
    default: {
      return state;
    }
  }
};

export { notifications, events, scheduledTasks };
