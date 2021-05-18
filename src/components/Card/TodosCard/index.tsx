import React, {
  FunctionComponent,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import S from "sanctuary";
import TodoInput from "../TodoInput";
import CompleteTodoModal from "../../shared/CompleteTodoModal";
import TimePickModal from "../../shared/TimePickModal";
import CardFooter from "../Footer/CardFooter";
import Card from "@material-ui/core/Card";
import { Box } from "@material-ui/core";
import TodoItem from "../TodoItem";
import Todo from "../../../models/Todo";
import List from "@material-ui/core/List";
import Swal from "sweetalert2";

import TodoService from "../../../services/TodoService";
import { Filter } from "../../../enums/Filter";

const fireSwalError = (text: string) => {
  Swal.fire({
    title: "Something went wrong",
    text,
    icon: "error",
  });
};

interface Props {}

const TodosCard: FunctionComponent<Props> = () => {
  const [todos, setTodos] = useState<Array<Todo>>([]);
  const [todosFilter, setTodosFilter] = useState<string>(Filter.ALL);
  const [todoToUpdate, setTodoToUpdate] = useState<Todo>();
  const [expiredTodo, setExpiredTodo] = useState<Todo>();
  const [isTimeModalOpen, setTimeModalState] = useState(false);
  const [isDeadlineModalOpen, setDeadlineModalState] = useState(false);
  const remaindersWorker = useMemo(
    () => new Worker("/workers/RemaindersWorker.js"),
    []
  );

  remaindersWorker.onmessage = (event: MessageEvent) => {
    setExpiredTodo(todos.find(todo => todo.id === event.data));
    setDeadlineModalState(true);
  };

  // TODO: please think about what could happen if the component will unmount before the response is returned from the server
  // implement this solution (important)
  // I researched and found three solutions to this problem:
  // 1. Managing an isMounted property, that will be set to true when the component is mounted
  // and will be set false in the useEffect return function, https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html - this article
  // says that the deprecated isMounted function is an anti pattern and not recommended to use and they offer managing the isMounted property.
  // 2. Another solution offered in this article is creating a warper for all promises, which makes the promise cancelable.
  // 3. Third option is to move the todos array to Redux and then replacing the setState functions with dispatch.
  // I'm not really sure what the best approach is, and would like your opinion.
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = (await TodoService.getTodos()).data;
        setTodos(todos);
      } catch (error) {
        fireSwalError("The todos couldn't be fetched from the server");
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

  const clearAllCompleted = useCallback(async (): Promise<void> => {
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
          TodoService.delete(todo.id);
          resolve();
        })
    );

    try {
      // Good job using Promise.all
      await Promise.all(deleteTodosPromises);
      setTodos(unCompletedTodos);
    } catch (error) {
      fireSwalError("The todos couldn't be deleted");
    }
  }, [todos]);

  const handleTodoSubmit = useCallback(
    async (todoText: string): Promise<void> => {
      try {
        const newTodo: Todo = (
          await TodoService.save({
            text: todoText,
            isCompleted: false,
          })
        ).data;

        setTodos(oldArray => [...oldArray, newTodo]);
      } catch (error) {
        fireSwalError("The todo couldn't be added");
      }
    },
    []
  );

  const handleTodoDelete = useCallback(
    async (todoToDeleteID: number): Promise<void> => {
      try {
        await TodoService.delete(todoToDeleteID);

        setTodos(oldArray =>
          oldArray.filter(currTodo => currTodo.id !== todoToDeleteID)
        );
      } catch (error) {
        fireSwalError("The todo couldn't be deleted");
      }
    },
    []
  );

  const handleTodoUpdate = useCallback(
    async (todoToUpdate: Todo): Promise<void> => {
      // TODO: your application is based on todos list, which can turn out to be huge.
      // each update you do, requires O(n) time complexity, think of a more efficient way to implement it.
      // hint: you can do the replacement in O(1)
      // ANSWER: Without changing the data structure I can to it with Binary Search and get O(log n) complexity.
      // if I use the Map data structure and set the keys as the ids, I can get O(1) complexity
      // because Map.get is O(1). Is this the solution you intended?
      try {
        await TodoService.update(todoToUpdate);

        setTodos(oldArray =>
          oldArray.map(todo =>
            todo.id === todoToUpdate.id ? todoToUpdate : todo
          )
        );
      } catch (error) {
        fireSwalError("The todo couldn't be updated");
      }
    },
    []
  );

  const handleFilterChange = useCallback(
    (event: React.MouseEvent<HTMLElement>, newFilter: string) => {
      setTodosFilter(newFilter);
    },
    []
  );

  // TODO: the name doesn't imply boolean result, but a filter action - rename
  // ANSWER: I don't what is better "toShowTodo" or "isTodoFiltered"
  const toShowTodo = (todoToFilter: Todo): boolean => {
    return todosFilter === Filter.ALL
      ? true
      : (todoToFilter.isCompleted ? Filter.COMPLETED : Filter.ACTIVE) ===
          todosFilter;
  };

  const openTimeModal = useCallback((todo: Todo) => {
    setTimeModalState(true);
    setTodoToUpdate({ ...todo });
  }, []);

  return (
    <React.Fragment>
      <Box m="auto" width="50%">
        <Card>
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
            todosFilter={todosFilter}
            numberOfUncompletedTodos={useMemo(getNumberOfUncompletedTodos, [
              todos,
            ])}
            handleFilterChange={handleFilterChange}
            clearAllCompleted={clearAllCompleted}
          />
        </Card>
      </Box>
      {/* ANSWER: The pervious solution was wrong because at first it wasn't scalable, adding more modals means adding more props */}
      {/* which in some point will be too much, second, every prop change will cause rerendering of all modals (although could be partially solved with React.memo). */}
      {todoToUpdate && (
        <TimePickModal
          isOpen={isTimeModalOpen}
          handleClose={() => setTimeModalState(false)}
          todo={todoToUpdate}
          updateTodoTime={handleTodoUpdate}
        ></TimePickModal>
      )}
      {expiredTodo && (
        <CompleteTodoModal
          isOpen={isDeadlineModalOpen}
          handleClose={() => setTimeModalState(false)}
          todo={expiredTodo}
          updateTodoState={handleTodoUpdate}
        ></CompleteTodoModal>
      )}
    </React.Fragment>
  );
};

export default TodosCard;
