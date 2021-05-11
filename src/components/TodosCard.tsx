import React, { FunctionComponent, useState, useEffect, useMemo } from "react";
import S from "sanctuary";
import TodoInput from "./TodoInput";
import Modals from "./Modals";
import CardFooter from "./CardFooter";
import Card from "@material-ui/core/Card";
import { Box } from "@material-ui/core";
import TodoItem from "./TodoItem";
import Todo from "../models/Todo";
import List from "@material-ui/core/List";

import TodoService from "../services/TodoService";
import { FilterState } from "../enums/FilterState";

// TODO: this convention of starting with I[interface_name] is not in use any more,
// if you want to read more about it, it's called hungarian notation (https://developer.okta.com/blog/2019/06/25/iinterface-considered-harmful)
interface IProps {}

const TodosCard: FunctionComponent<IProps> = () => {
  const [todos, setTodos] = useState<Array<Todo>>([]);
  // TODO: why not using FilterState enum?
  const [filterTodos, setFilterTodos] = useState<string>("all");
  // TODO: please think of better names than currentTodoDeadline and this.
  // does the word current really add any information?
  const [currentTodoToUpdate, setCurrentTodoToUpdate] = useState<Todo>();
  const [currentTodoDeadline, setCurrentTodoDeadline] = useState<Todo>();
  // TODO: follow the naming convention, if you've named it `isTimeModalOpen`, then the setter should be called accordingly
  // TODO: please let typescript infer the types it can by itself. for example, you pass false as default value - typescript knows it's a boolean, there's no need to usd it explicitly
  const [isTimeModalOpen, setTimeModal] = useState<boolean>(false);
  const [isDeadlineModalOpen, setDeadlineModal] = useState<boolean>(false);
  const remaindersWorker = useMemo(
    () => new Worker("/workers/RemaindersWorker.js"),
    []
  );

  remaindersWorker.onmessage = (event: MessageEvent) => {
    // TODO: please notice that the method (and it's variable) are called todoDeadline which implies on time type, whereas you actually excpect a todo object.
    // this is a pitfall for confusion and not readable.
    setCurrentTodoDeadline(todos.find((todo: Todo) => todo.id === event.data));
    setDeadlineModal(true);
  };

  // TODO: please think about what could happen if the component will unmount before the response is returned from the server
  // implement this solution (important)
  useEffect(() => {
    const fetchTodos = async () => {
      // TODO: remove all types that are not necessary, for example Array<Todo> can be inferred by typescript.
      // implement it in all files please
      // TODO: why using the words `FromServer`?
      const todosFromServer: Array<Todo> = await TodoService.getTodos();
      setTodos(
        // TODO: todosFromServer.map(todo => { - no need for explicit type
        todosFromServer.map((todo: Todo) => {
          return {
            ...todo,
            // TODO: this is not a solution, it is error prone and is not used as needed
            // if the type really is date or undefined (which should not be if you look at the comment in the Todo.ts file), then I would expect something like this:
            // deadlineTime: todo.deadlineTime,
            deadlineTime: new Date((todo.deadlineTime as unknown) as string),
          };
        })
      );
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    remaindersWorker.postMessage(todos);
  }, [todos, remaindersWorker]);

  // TODO: remove return type
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
      <Box m="auto" width="50%">
        <Card>
          <TodoInput onSubmit={handleTodoSubmit} />
          <List>
            {S.pipe([
              S.filter(filterTodo),
              S.map((todoToMap: Todo) => (
                <TodoItem
                  key={todoToMap.id}
                  todo={todoToMap}
                  onDelete={handleTodoDelete}
                  onTodoUpdate={handleTodoUpdate}
                  openTimeModal={() => {
                    setTimeModal(true);
                    setCurrentTodoToUpdate({ ...todoToMap });
                  }}
                />
              )),
            ])(todos)}
          </List>
          <CardFooter
            filterTodos={filterTodos}
            numberOfUncompletedTodos={getNumberOfUncompletedTodos()}
            handleFilterChange={handleFilterChange}
            clearAllCompleted={clearAllCompleted}
          />
        </Card>
      </Box>
      <Modals
        isTimeModalOpen={isTimeModalOpen}
        isDeadlineModalOpen={isDeadlineModalOpen}
        currentTodoDeadline={currentTodoDeadline as Todo}
        currentTodoToUpdate={currentTodoToUpdate as Todo}
        handleTodoUpdate={handleTodoUpdate}
        onTimeModalClose={() => setTimeModal(false)}
        onDeadlineModalClose={() => setDeadlineModal(false)}
      />
    </div>
  );
};

export default TodosCard;
