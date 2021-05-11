// TODO: optional properties should come last and shouldn't be mixed with mandatory properties
export default class Todo {
  // TODO: how can id be optional?
  id?: number;
  text!: string;
  // TODO: why is it mandatory? fields like this should have default value.
  // think about the case when you create a new todo, it is not completed by default
  isCompleted!: boolean;
  // TODO: objects that return from the server cannot be anything that is not a "primitive" type liek array, string etc.
  deadlineTime?: Date;

  // TODO: it seems like you don't create an instance using this ctor.
  // if you don't use it, interface is better because typescript can import it as type only and not value which will help typescript engine with optimiazation process
  constructor(todo: Todo) {
    Object.assign(this, todo);
  }
}
