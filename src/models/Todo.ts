export default class Todo {
  id?: number;
  text!: string;
  isCompleted!: boolean;

  constructor(todo: Todo) {
    Object.assign(this, todo);
  }
}
