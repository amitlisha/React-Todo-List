import TextField from "@material-ui/core/TextField";
import EventEmitter from "node:events";
import React, { FunctionComponent, useState } from "react";

interface IProps {
  onSubmit: (todoText: string) => void;
}

const TodoInput: FunctionComponent<IProps> = ({ onSubmit }) => {
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
    <TextField
      label="What needs to be done?"
      value={inputText}
      variant="outlined"
      onChange={handleInputChange}
      onKeyDown={handleInputSubmit}
    />
  );
};

export default TodoInput;
