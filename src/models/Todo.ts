export default interface Todo {
  // TODO: how can id be optional?
  // ANSWER: You're right, but I did it because I had a situation where I have a Todo without id
  // before I send it to the server. but I found a better way to do it with Omit
  id: number;
  text: string;
  // TODO: why is it mandatory? fields like this should have default value.
  // think about the case when you create a new todo, it is not completed by default
  // ANSWER: so you're saying, make it optional and if it doesn't have a value then it is not completed
  // I know they are both falsey but isn't false preferable than undefined?
  isCompleted: boolean;
  deadlineTime?: number;
}
