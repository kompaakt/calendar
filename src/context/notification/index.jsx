import React from "react";
import ReactDOM from "react-dom";
import { Flex } from "rebass";
import { motion, AnimatePresence } from "framer-motion";
import { nanoid } from "nanoid";
import { useSelector, useDispatch } from "react-redux";

import SuccessNotification from "components/notifications/success";
import ReminderNotification from "components/notifications/reminder";

import "./index.css";

const NOTIFICATION_TIMEOUT = 3000;

const NotificationContextActionCreator = React.createContext();

const NotificationWrapper = ({ type, ...props }) => {
  const renderNotification = () => {
    switch (type) {
      case "success": {
        return <SuccessNotification {...props.content} />;
      }
      case "reminder": {
        return <ReminderNotification {...props.content} />;
      }
      default: {
        return null;
      }
    }
  };
  return (
    <Flex
      pt="13px"
      pb="17px"
      px="15px"
      alignItems="center"
      maxWidth="600px"
      sx={{
        zIndex: "999",
        borderRadius: "5px",
        boxShadow: `0 1px 2px rgba(0,0,0,0.07), 
                0 2px 4px rgba(0,0,0,0.07), 
                0 4px 8px rgba(0,0,0,0.07), 
                0 8px 16px rgba(0,0,0,0.07),
                0 16px 32px rgba(0,0,0,0.07), 
                0 32px 64px rgba(0,0,0,0.07)`,
        wordBreak: "break-all",
        backgroundColor: "white",
      }}
      p="20px"
    >
      {renderNotification()}
    </Flex>
  );
};

const NotificationProvider = ({ children }) => {
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  const createNotification = (type, content) => {
    const notificationId = nanoid();
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: { id: notificationId, type, content: content },
    });
    setTimeout(() => {
      dispatch({
        type: "DELETE_NOTIFICATION",
        payload: { id: notificationId },
      });
    }, NOTIFICATION_TIMEOUT);
  };

  return (
    <NotificationContextActionCreator.Provider value={createNotification}>
      <>
        {children}
        {ReactDOM.createPortal(
          <div className="container">
            <ul>
              <AnimatePresence initial={false}>
                {notifications &&
                  notifications.map((notification) => (
                    <motion.li
                      key={notification.id}
                      positionTransition
                      initial={{ opacity: 0, y: 50, scale: 0.3 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{
                        opacity: 0,
                        scale: 0.5,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <NotificationWrapper {...notification} />
                    </motion.li>
                  ))}
              </AnimatePresence>
            </ul>
          </div>,
          document.getElementById("notification-root")
        )}
      </>
    </NotificationContextActionCreator.Provider>
  );
};

export { NotificationProvider, NotificationContextActionCreator };
