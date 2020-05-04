import React from "react";
import { Text } from "rebass";

const SuccessNotification = ({ text }) => {
  return (
    <Text
      sx={{
        fontSize: "15px",
        color: "#595959",
      }}
    >
      {text}
    </Text>
  );
};

export default SuccessNotification;
