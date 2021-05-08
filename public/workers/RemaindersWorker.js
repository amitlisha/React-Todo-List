let todos = [];
let timeoutIDs = [];

clearTimeouts = (timeoutIDs) => {
  timeoutIDs.forEach((timeoutID) => {
    clearTimeout(timeoutID);
  });
};

self.onmessage = (e) => {
  todos = e.data;
  clearTimeouts(timeoutIDs);
  timeoutIDs = setTimeouts();
};

const setTimeouts = () => {
  newTimeoutIDs = [];
  nowTime = new Date().getTime();

  todos.forEach((todo) => {
    todosTime = todo.deadlineTime.getTime();
    console.log(todosTime - nowTime);

    if (todosTime > nowTime) {
      newTimeoutIDs.push(
        setTimeout(() => self.postMessage(todo.id), todosTime - nowTime)
      );
    }
  });

  return newTimeoutIDs;
};
