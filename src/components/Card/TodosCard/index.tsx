import React, { FunctionComponent, useState, useEffect, useMemo } from "react";
import S from "sanctuary";
import TodoInput from "../TodoInput";
import Modals from "../../shared/Modals";
import CardFooter from "../Footer/CardFooter";
import Card from "@material-ui/core/Card";
import { Box } from "@material-ui/core";
import TodoItem from "../TodoItem";
import Todo from "../../../models/Todo";
import List from "@material-ui/core/List";
import Swal from "sweetalert2";

import TodoService from "../../../services/TodoService";
import { FilterState } from "../../../enums/FilterState";

interface Props {}

const TodosCard: FunctionComponent<Props> = () => {
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [filterTodos, setFilterTodos] = useState<string>(FilterState.ALL);
  const [todoToUpdate, setTodoToUpdate] = useState<Todo>();
  const [expiredTodo, setExpiredTodo] = useState<Todo>();
  const [isTimeModalOpen, setTimeModalState] = useState(false);
  const [isDeadlineModalOpen, setDeadlineModalState] = useState(false);
  const remaindersWorker = useMemo(
    () => new Worker("/workers/RemaindersWorker.js"),
    []
  );

  remaindersWorker.onmessage = (event: MessageEvent) => {
    setExpiredTodo(todos.find((todo: Todo) => todo.id === event.data));
    setDeadlineModalState(true);
  };

  // TODO: please think about what could happen if the component will unmount before the response is returned from the server
  // implement this solution (important)
  useEffect(() => {
    const fetchTodos = async () => {
      // TODO: remove all types that are not necessary, for example Array<Todo> can be inferred by typescript.
      // implement it in all files please
      try {
        const todos = (await TodoService.getTodos()).data;
        setTodos(todos);
      } catch (error) {
        Swal.fire({
          title: "Something went wrong",
          text: "The todos couldn't be fetched from the server",
          icon: "error",
        });
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    remaindersWorker.postMessage(todos);
  }, [todos, remaindersWorker]);

  const getNumberOfUncompletedTodos = () => {
    // TODO: remove unused parentheses
    // ANSWER: It's because of my prettier config.. I changed it
    return todos.filter(todo => !todo.isCompleted).length;
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
    // add error handling
    const deleteTodosPromises: Array<Promise<void>> = completedTodos.map(
      todo =>
        new Promise((resolve, reject) => {
          TodoService.delete(todo.id as number);
          resolve();
        })
    );

    setTodos(unCompletedTodos);
    // Good job using Promise.all
    Promise.all(deleteTodosPromises);
  };

  const handleTodoSubmit = async (todoText: string): Promise<void> => {
    try {
      const newTodo: Todo = (
        await TodoService.save({
          text: todoText,
          isCompleted: false,
        })
      ).data;

      setTodos(oldArray => [...oldArray, newTodo]);
    } catch (error) {
      Swal.fire({
        title: "Something went wrong",
        text: "The todo couldn't be added",
        icon: "error",
      });
    }
  };

  const handleTodoDelete = async (todoToDeleteID: number): Promise<void> => {
    try {
      await TodoService.delete(todoToDeleteID);

      setTodos(oldArray =>
        oldArray.filter(currTodo => currTodo.id !== todoToDeleteID)
      );
    } catch (error) {
      Swal.fire({
        title: "Something went wrong",
        text: "The todo couldn't be deleted",
        icon: "error",
      });
    }
  };

  const handleTodoUpdate = async (todoToUpdate: Todo): Promise<void> => {
    // TODO: your application is based on todos list, which can turn out to be huge.
    // each update you do, requires O(n) time complexity, think of a more efficient way to implement it.
    // hint: you can do the replacement in O(1)
    try {
      await TodoService.update(todoToUpdate);

      setTodos(oldArray =>
        oldArray.map(todo =>
          todo.id === todoToUpdate.id ? todoToUpdate : todo
        )
      );
    } catch (error) {
      Swal.fire({
        title: "Something went wrong",
        text: "The todo couldn't be updated",
        icon: "error",
      });
    }
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
                    setTimeModalState(true);
                    setTodoToUpdate({ ...todoToMap });
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
        expiredTodo={expiredTodo as Todo}
        todoToUpdate={todoToUpdate as Todo}
        handleTodoUpdate={handleTodoUpdate}
        onTimeModalClose={() => setTimeModalState(false)}
        onDeadlineModalClose={() => setDeadlineModalState(false)}
      />
    </div>
  );
};

export default TodosCard;
