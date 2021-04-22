import React, { FunctionComponent, useState, useEffect } from "react";
import S from "sanctuary";
import TodoInput from "./TodoInput";
import Card from "@material-ui/core/Card";
import { Box } from "@material-ui/core";
import TodoItem from "./TodoItem";
import Todo from "../models/Todo";
import List from "@material-ui/core/List";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import TodoService from "../services/TodoService";

interface IProps {}

const TodosCard: FunctionComponent<IProps> = () => {
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [filterTodos, setFilterTodos] = useState<string>("all");

  useEffect(() => {
    const fetchTodos = async () => {
      setTodos(await TodoService.getTodos());
    };

    fetchTodos();
  }, []);

  const getNumberOfUncompletedTodos = (): number => {
    return todos.filter((todo) => !todo.isCompleted).length;
  };

  const handleTodoSubmit = async (todoText: string): Promise<void> => {
    const newTodo: Todo = await TodoService.saveTodo({
      text: todoText,
      isCompleted: false,
    });

    setTodos((oldArray) => [...oldArray, newTodo]);
  };

  const handleTodoDelete = async (todoToDelete: Todo): Promise<void> => {
    setTodos((oldArray) =>
      oldArray.filter((currTodo) => currTodo.id !== todoToDelete.id)
    );

    await TodoService.deleteTodo(todoToDelete);
  };

  const handleTodoUpdate = async (todoToUpdate: Todo): Promise<void> => {
    const todoToUpdateIndex: number = todos.findIndex(
      (todo: Todo) => todo.id === todoToUpdate.id
    );

    console.log(todoToUpdate);

    setTodos((oldArray) => [
      ...oldArray.slice(0, todoToUpdateIndex),
      { ...todoToUpdate },
      ...oldArray.slice(todoToUpdateIndex + 1),
    ]);

    await TodoService.updateTodo(todoToUpdate);
  };

  const handleFilterChange = (event: React.MouseEvent<HTMLElement>) => {
    setFilterTodos(event.currentTarget.getAttribute("value") || "");
  };

  const showTodo = (todoToFilter: Todo): boolean => {
    return filterTodos === "all"
      ? true
      : (todoToFilter.isCompleted ? "completed" : "active") === filterTodos;
  };

  const mapTodoToComponent = (todoToMap: Todo) => (
    <TodoItem
      key={todoToMap.id}
      todo={todoToMap}
      onDelete={handleTodoDelete}
      onTodoUpdate={handleTodoUpdate}
    ></TodoItem>
  );

  return (
    <div>
      <Box m="auto" width="30%">
        <Card>
          <TodoInput onSubmit={handleTodoSubmit}></TodoInput>
          <List>
            {S.pipe([S.filter(showTodo), S.map(mapTodoToComponent)])(todos)}
          </List>
          <CardActions>
            <Grid container alignItems="center">
              <Grid item xs={4}>
                {getNumberOfUncompletedTodos()} item left
              </Grid>
              <Grid item xs={4}>
                <ToggleButtonGroup
                  size="small"
                  exclusive
                  value={filterTodos}
                  onChange={handleFilterChange}
                >
                  <ToggleButton value="all">All</ToggleButton>
                  <ToggleButton value="active">Active</ToggleButton>
                  <ToggleButton value="completed">Completed</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={4}></Grid>
            </Grid>
          </CardActions>
        </Card>
      </Box>
    </div>
  );
};

export default TodosCard;
