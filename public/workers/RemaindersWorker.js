let todos = [];

self.onmessage = (e) => {
  todos = e.data;
};

const checkTodosDeadline = () => {
  todos.forEach((todo) => {});
};

setInterval(checkTodosDeadline, 500);
