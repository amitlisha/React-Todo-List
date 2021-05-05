export default class Todo {
  id?: number;
  text!: string;
  isCompleted!: boolean;
  deadlineTime?: Date;

  constructor(todo: Todo) {
    Object.assign(this, todo);
  }
}
