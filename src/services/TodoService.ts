import { axiosInstance } from "./AxiosInstance";
import Todo from "../models/Todo";

// TODO: there's no need to change it but I want you to read about why it's not recommended using expot default
// ANSWER: I read, and I what I understood is that naming the imported entity everytime causes some problems, like refactoring
// or auto complete by the IDE. Another problem is exporting big objects instead of dividing to smaller exports.

export default class TodoService {
  public static async save(todo: Todo): Promise<Todo> {
    const { data } = await axiosInstance.post(`/todos`, todo);

    return data;
  }

  // TODO: please notice that delete of multiple todos at once is not supported.
  // no need to implement as long as you're aware of the problem with the UX.
  // ANSWER: yeah i'm aware of this, json-server doesn't support the deletion of multiple rows
  // so I didn't wan't to put the logic of deleting multiple todos in here so I implemented it in the component because I only use it once.
  public static async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/todos/${id}`);
  }

  // TODO: there's no need to use await in this case, anyway you return a promise and the user uses await or .then
  // TODO: please use `noImplicitAny` in tsconfig.json file and look at the errors. in this case you don't use the type safety TS provides.
  public static async getTodos(): Promise<Array<Todo>> {
    // TODO: no need to use `` format if you don't use params, make your conventions consistent all across the application.
    const { data } = await axiosInstance.get(`/todos`);

    return data;
  }

  public static async update(todo: Todo): Promise<void> {
    await axiosInstance.put(`/todos/${todo.id}`, todo);
  }
}
