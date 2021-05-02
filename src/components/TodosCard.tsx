import React, { FunctionComponent, useState, useEffect } from "react";
import S from "sanctuary";
import TodoInput from "./TodoInput";
import ClearCompleted from "./ClearCompleted";
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
import { FilterState } from "../enums/FilterState";

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

  const clearAllCompleted = (): void => {
    const [completedTodos, unCompletedTodos] = todos.reduce(
      (newArr, todo) => {
        newArr[todo.isCompleted ? 0 : 1].push(todo);
        return newArr;
      },
      [[], []] as Array<Array<Todo>>
    );

    const deleteTodosPromises: Array<Promise<void>> = completedTodos.map(
      (todo) =>
        new Promise((resolve, reject) => {
          TodoService.deleteTodo(todo.id as number);
          resolve();
        })
    );

    setTodos(unCompletedTodos);
    Promise.all(deleteTodosPromises);
  };

  const handleTodoSubmit = async (todoText: string): Promise<void> => {
    const newTodo: Todo = await TodoService.saveTodo({
      text: todoText,
      isCompleted: false,
    });

    setTodos((oldArray) => [...oldArray, newTodo]);
  };

  const handleTodoDelete = async (todoToDeleteID: number): Promise<void> => {
    setTodos((oldArray) =>
      oldArray.filter((currTodo) => currTodo.id !== todoToDeleteID)
    );

    await TodoService.deleteTodo(todoToDeleteID);
  };

  const handleTodoUpdate = async (todoToUpdate: Todo): Promise<void> => {
    setTodos((oldArray) =>
      oldArray.map((todo) =>
        todo.id === todoToUpdate.id ? todoToUpdate : todo
      )
    );

    await TodoService.updateTodo(todoToUpdate);
  };

  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: string
  ) => {
    setFilterTodos(newFilter);
  };

  const filterTodo = (todoToFilter: Todo): boolean => {
    return filterTodos === FilterState.ALL
      ? true
      : (todoToFilter.isCompleted
          ? FilterState.COMPLETED
          : FilterState.ACTIVE) === filterTodos;
  };

  return (
    <div>
      <Box m="auto" width="30%">
        <Card>
          <TodoInput onSubmit={handleTodoSubmit}></TodoInput>
          <List>
            {S.pipe([
              S.filter(filterTodo),
              S.map((todoToMap: Todo) => (
                <TodoItem
                  key={todoToMap.id}
                  todo={todoToMap}
                  onDelete={handleTodoDelete}
                  onTodoUpdate={handleTodoUpdate}
                />
              )),
            ])(todos)}
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
                  <ToggleButton value={FilterState.ALL}>All</ToggleButton>
                  <ToggleButton value={FilterState.ACTIVE}>Active</ToggleButton>
                  <ToggleButton value={FilterState.COMPLETED}>
                    Completed
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={4}>
                <ClearCompleted onClear={clearAllCompleted}></ClearCompleted>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </Box>
    </div>
  );
};

export default TodosCard;
