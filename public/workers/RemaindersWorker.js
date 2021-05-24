let timeoutIDs = new Map();

self.onmessage = e => {
  switch (e.data.type) {
    case "add":
      setTimeouts(e.data.data);
      break;
    case "update":
      const todo = e.data.data;
      const nowTime = new Date().getTime();
      clearTimeout(timeoutIDs.get(todo.id));
      timeoutIDs.set(
        todo.id,
        setTimeout(() => postTodo(todo, nowTime), todo.deadlineTime - nowTime)
      );
      break;
    case "delete":
      const todosIDs = e.data.data;
      todosIDs.forEach(todoID => {
        clearTimeout(timeoutIDs.get(todoID));
        timeoutIDs.delete(todoID);
      });
      break;
  }
};

const setTimeouts = todos => {
  const nowTime = new Date().getTime();
  todos.forEach(todo => {
    if (todo.deadlineTime > nowTime) {
      timeoutIDs.set(
        todo.id,
        setTimeout(() => postTodo(todo, nowTime), todo.deadlineTime - nowTime)
      );
    }
  });
};

const postTodo = (todo, nowTime) => {
  self.postMessage(todo.id);
  timeoutIDs.delete(todo.id);
};
