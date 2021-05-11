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
    // TODO: remove unused parentheses
    return todos.filter((todo) => !todo.isCompleted).length;
  };

  const clearAllCompleted = (): void => {
    // TODO: please notice the changes using the types:
    // const [completedTodos, unCompletedTodos] = todos.reduce<Todo[][]>(
    //   (newArr, todo) => {
    //     newArr[todo.isCompleted ? 0 : 1].push(todo);
    //     return newArr;
    //   },
    //   [[], []]
    // );|
    const [completedTodos, unCompletedTodos] = todos.reduce(
      // TODO: the convention is to call it `accumulator` instead of `newArr`.
      // in general, the type of the collection/variable should not be included in the name itself.
      (newArr, todo) => {
        newArr[todo.isCompleted ? 0 : 1].push(todo);
        return newArr;
      },
      [[], []] as Array<Array<Todo>>
    );

    // TODO: that's not efficient, you make http requests in loop,
    // what will happen if there are alot of todos?
    const deleteTodosPromises: Array<Promise<void>> = completedTodos.map(
      (todo) =>
        new Promise((resolve, reject) => {
          TodoService.deleteTodo(todo.id as number);
          resolve();
        })
    );

    setTodos(unCompletedTodos);
    // Good job using Promise.all
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
    // TODO: what happens if the deleteTodo request fails? you still delete it in the UI and will make your application inconsistent with the db
    setTodos((oldArray) =>
      oldArray.filter((currTodo) => currTodo.id !== todoToDeleteID)
    );

    await TodoService.deleteTodo(todoToDeleteID);
  };

  const handleTodoUpdate = async (todoToUpdate: Todo): Promise<void> => {
    // TODO: your application is based on todos list, which can turn out to be huge.
    // each update you do, requires O(n) time complexity, think of a more efficient way to implement it.
    // hint: you can do the replacement in O(1)
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
    // TODO: 
    setFilterTodos(newFilter);
  };

  // TODO: the name doesn't imply boolean result, but a filter action - rename
  const filterTodo = (todoToFilter: Todo): boolean => {
    return filterTodos === FilterState.ALL
      ? true
      : (todoToFilter.isCompleted
          ? FilterState.COMPLETED
          : FilterState.ACTIVE) === filterTodos;
  };

  return (
    // TODO: read about react fragment
    <div>
      <Box m="auto" width="50%">
        <Card>
          {/* TODO: please read about useCallback and redesign your code accordingly + I would like to ask you afterwards how it improves the performance of our application. */}
          <TodoInput onSubmit={handleTodoSubmit} />
          <List>
            {S.pipe([
              S.filter(filterTodo),
              S.map((todoToMap: Todo) => (
                // TODO: if you're not familiar with react reconcilation, then please read (https://reactjs.org/docs/reconciliation.html) + read about react diff alogirthm from the same source
                // and explain why we need the `key` prop
                <TodoItem
                  key={todoToMap.id}
                  todo={todoToMap}
                  onDelete={handleTodoDelete}
                  onTodoUpdate={handleTodoUpdate}
                  // TODO: is there a reason why this one is anonymous?
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
            // TODO: use useMemo hook to prevent unnecessary rendering
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
