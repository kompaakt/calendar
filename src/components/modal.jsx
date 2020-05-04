import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Box, Flex } from "rebass";
import useEventListener from "@use-it/event-listener";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";

const Modal = ({ children, handleClose }) => {
  useEventListener("keyup", (e) => {
    if (e.code === "Escape") {
      handleClose && handleClose();
    }
  });

  useEffect(() => {
    disableBodyScroll(document.querySelector("#modal-root"));
    return () => clearAllBodyScrollLocks();
  }, []);

  return ReactDOM.createPortal(
    <Flex
      onClick={handleClose}
      alignItems="center"
      justifyContent="center"
      sx={{
        bg: "rgba(0, 0, 0, 0.7)",
        minHeight: "100vh",
        position: "fixed",
        opacity: "1",
        zIndex: "9999",
        top: "0",
        left: "0",
        width: "100%",
        minWidth: "300px",
        overflowY: "scroll",
        animation: "show .3s ease",
        "@keyframes show": {
          "0%": {
            display: "none",
            opacity: 0,
          },
          "1%": {
            display: "flex",
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
        }}
      >
        <Flex
          onClick={(e) => e.stopPropagation()}
          justifyContent="center"
          flexDirection="column"
        >
          {children}
        </Flex>
      </Box>
    </Flex>,
    document.getElementById("modal-root")
  );
};

export default Modal;
