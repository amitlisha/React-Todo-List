import React, { FunctionComponent, useState } from "react";
import TodoInput from "./TodoInput";
import Paper from "@material-ui/core/Paper";
import { Box } from "@material-ui/core";
import TodoItem from "./TodoItem";
import Todo from "../models/Todo";
import List from "@material-ui/core/List";

interface IProps {}

const TodosCard: FunctionComponent<IProps> = () => {
  const [todos, setTodos] = useState<Array<Todo>>([]);

  const getNumberOfUncompletedTodos = (): number => {
    return todos.filter((todo) => todo.isCompleted).length;
  };

  const handleTodoSubmit = (todoText: string): void => {
    setTodos((oldArray) => [
      ...oldArray,
      new Todo({ text: todoText, isCompleted: false }),
    ]);
  };

  const handleTodoDelete = (todoToDelete: Todo): void => {
    setTodos((oldArray) =>
      oldArray.filter((currTodo) => currTodo != todoToDelete)
    );
  };

  return (
    <div>
      <Box m="auto" width="30%">
        <Paper>
          <TodoInput onSubmit={handleTodoSubmit}></TodoInput>
          <List>
            {todos.map((currTodo) => (
              <TodoItem todo={currTodo} onDelete={handleTodoDelete}></TodoItem>
            ))}
          </List>
        </Paper>
      </Box>
    </div>
  );
};

export default TodosCard;
