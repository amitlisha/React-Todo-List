import React, {
  FunctionComponent,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
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
    const [completedTodos, unCompletedTodos] = todos.reduce<Todo[][]>(
      (accumulator, todo) => {
        accumulator[todo.isCompleted ? 0 : 1].push(todo);
        return accumulator;
      },
      [[], []]
    );

    // TODO: that's not efficient, you make http requests in loop,
    // what will happen if there are alot of todos?
    // ANSWER: The http requests aren't made in a loop
    // I create the array of promises so I could use Promise.all
    // The http requests are only made when I call Promise.all
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
    // ANSWER: I didn't find a way to do it with O(1) complexity, I can to it with Binary Search
    // and get O(log n) complexity. If the ids had equal jumps between each index
    // than i'll a way to do it in O(1) but when deleting todos, I'll have unused ids.
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
  // ANSWER: I don't what is better "toShowTodo" or "isTodoFiltered"
  const toShowTodo = (todoToFilter: Todo): boolean => {
    return filterTodos === FilterState.ALL
      ? true
      : (todoToFilter.isCompleted
          ? FilterState.COMPLETED
          : FilterState.ACTIVE) === filterTodos;
  };

  const openTimeModal = (todo: Todo) => {
    setTimeModalState(true);
    setTodoToUpdate({ ...todo });
  };

  return (
    <React.Fragment>
      <Box m="auto" width="50%">
        <Card>
          {/* TODO: please read about useCallback and redesign your code accordingly + I would like to ask you afterwards how it improves the performance of our application. */}
          <TodoInput onSubmit={handleTodoSubmit} />
          <List>
            {S.pipe([
              S.filter(toShowTodo),
              S.map((todo: Todo) => (
                // TODO: if you're not familiar with react reconcilation, then please read (https://reactjs.org/docs/reconciliation.html) + read about react diff alogirthm from the same source
                // and explain why we need the `key` prop
                // ANSWER: rendering a list isn't easy for react diff algorithm, if an element is added at the end of the list
                // then it's easy, react diff algo will compare all elements and find out they are the same, but just one element was added to the end.
                // When an element is added at the start of the list, react will have a hard time finding out that the rest of the elements are the same,
                // and finding this out is pretty expensive. So a solution react came up with is binding a key to each element rendered from a list, that way
                // react diff algo will be able to know if elements position just moved, or their state changed.
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDelete={handleTodoDelete}
                  onTodoUpdate={handleTodoUpdate}
                  openTimeModal={openTimeModal}
                />
              )),
            ])(todos)}
          </List>
          <CardFooter
            filterTodos={filterTodos}
            numberOfUncompletedTodos={useMemo(
              () => getNumberOfUncompletedTodos(),
              [todos]
            )}
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
    </React.Fragment>
  );
};

export default TodosCard;
