let todos = [];

self.onmessage = (e) => {
  todos = e.data;
  console.log(todos);
};

const checkTodosDeadline = () => {
  nowDate = new Date(new Date().setSeconds(0)).setMilliseconds(0);
  todos.forEach((todo) => {
    if (todo.deadlineTime && nowDate === todo.deadlineTime.setMilliseconds(0)) {
      self.postMessage(todo);
      console.log("it is");
    }
  });
};

checkTodosDeadline();
setInterval(checkTodosDeadline, 60000);
