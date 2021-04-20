import React, { FunctionComponent, useState } from "react";
import TodoInput from "./TodoInput";
import Paper from "@material-ui/core/Paper";
import { Box } from "@material-ui/core";
import TodoItem from "./TodoItem";
import Todo from "../models/Todo";

interface IProps {}

const TodosCard: FunctionComponent<IProps> = () => {
  const [todos, setTodos] = useState<Array<Todo>>([]);

  const handleTodoSubmit = (todoText: string) => {
    setTodos((oldArray) => [
      ...oldArray,
      new Todo({ text: todoText, isCompleted: false }),
    ]);
  };

  return (
    <div>
      <Box m="auto" width="30%">
        <Paper>
          <TodoInput onSubmit={handleTodoSubmit}></TodoInput>
          {todos.map((todo) => (
            <TodoItem todoText={todo.text}></TodoItem>
          ))}
        </Paper>
      </Box>
    </div>
  );
};

export default TodosCard;
