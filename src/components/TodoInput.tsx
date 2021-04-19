import TextField from "@material-ui/core/TextField";
import EventEmitter from "node:events";
import React, { FunctionComponent, useState } from "react";

interface IProps {
  onSubmit: (todoText: string) => void;
}

const TodoInput: FunctionComponent<IProps> = ({ onSubmit }) => {
  const [inputText, setInputText] = useState("");

  const handleInputSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      onSubmit(inputText);
      setInputText("");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  return (
    <div>
      <TextField
        label="What needs to be done?"
        value={inputText}
        variant="outlined"
        onChange={handleInputChange}
        onKeyDown={handleInputSubmit}
      />
    </div>
  );
};

export default TodoInput;
