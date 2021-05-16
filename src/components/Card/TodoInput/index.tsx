import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import React, { FunctionComponent, useState } from "react";

interface Props {
  onSubmit: (todoText: string) => void;
}

const TodoInput: FunctionComponent<Props> = ({ onSubmit }) => {
  const [inputText, setInputText] = useState<string>("");

  const handleInputSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmit(inputText);
      setInputText("");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  return (
    <Box mt={2}>
      <TextField
        label="What needs to be done?"
        value={inputText}
        variant="outlined"
        onChange={handleInputChange}
        onKeyDown={handleInputSubmit}
      />
    </Box>
  );
};

export default React.memo(TodoInput);
