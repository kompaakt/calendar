import React from "react";
import { Box, Text } from "rebass";

const ReminderNotification = ({ title, text }) => {
  return (
    <Box>
      <Text
        mb="10px"
        sx={{
          fontSize: "15px",
          color: "#595959",
          fontWeight: "bold",
        }}
      >
        {title}
      </Text>
      <Text
        sx={{
          opacity: "0.85",
          color: "#595959",
        }}
      >
        {text}
      </Text>
    </Box>
  );
};

export default ReminderNotification;
