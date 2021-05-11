let todos = [];
let timeoutIDs = [];

clearTimeouts = (timeoutIDs) => {
  timeoutIDs.forEach((timeoutID) => {
    clearTimeout(timeoutID);
  });
};

self.onmessage = (e) => {
  todos = e.data;
  // TODO: you clear all timeouts even for things you should keep 
  // and then set them again.
  // think of a more efficient way to implement it in a way that you'd clear the timeout only for those who needs.
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
