let todos = [];

self.onmessage = (e) => {
  todos = e.data;
  console.log(todos);
};

const checkTodosDeadline = () => {
  nowDate = new Date();
  nowDate.setMilliseconds(0);
  nowDate.setSeconds(0);

  todos.forEach((todo) => {
    if (
      todo.deadlineTime.getSeconds() !== 0 ||
      todo.deadlineTime.getMilliseconds() !== 0
    ) {
      todo.deadlineTime.setSeconds(0);
      todo.deadlineTime.setMilliseconds(0);
    }

    if (
      todo.deadlineTime &&
      nowDate.getTime() === todo.deadlineTime.getTime()
    ) {
      self.postMessage(todo);
      console.log("it is");
    }
  });
};

checkTodosDeadline();
setInterval(checkTodosDeadline, 60000);
