let todos = [];

self.onmessage = (e) => {
  todos = e.data;
};

const checkTodosDeadline = () => {
  nowDate = new Date();
  nowDate.setMilliseconds(0);
  nowDate.setSeconds(0);

  todos.forEach((todo) => {
    if (todo.deadlineTime) {
      if (
        todo.deadlineTime.getSeconds() !== 0 ||
        todo.deadlineTime.getMilliseconds() !== 0
      ) {
        todo.deadlineTime.setSeconds(0);
        todo.deadlineTime.setMilliseconds(0);
      }

      if (nowDate.getTime() === todo.deadlineTime.getTime()) {
        self.postMessage(todo.id);
      }
    }
  });
};

checkTodosDeadline();
setInterval(checkTodosDeadline, 60000);
