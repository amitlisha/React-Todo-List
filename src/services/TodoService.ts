import { axiosInstance } from "./AxiosInstance";
import Todo from "../models/Todo";
import Swal from "sweetalert2";

// TODO: there's no need to change it but I want you to read about why it's not recommended using expot default
// ANSWER: I read, and I what I understood is that naming the imported entity everytime causes some problems, like refactoring
// ore auto complete by IDE. Another problem is exporting big objects instead of dividing to smaller exports.

export default class TodoService {
  // TODO: please separate the initialization and configuration of axios from this TodoService.
  // it is considered as a side effect, read about axios.create method and export it as `axiosInstance` that will be shared in the app.

  // TODO: no need to call the param `todoToSave` and or `saveTodo` method name,
  // we're already in save method in TodoService class.
  // keep in mind that naming conventions are important, don't add words that do not make the code clearer
  // I'll repeat this comment in a few more places but not all of them only to make sure you understand
  // my intention
  public static async saveTodo(todoToSave: Todo): Promise<Todo> {
    const { data } = await axiosInstance.post(`/todos`, todoToSave);

    return data;
  }

  // TODO: please notice that delete of multiple todos at once is not supported.
  // no need to implement as long as you're aware of the problem with the UX.
  // TODO: name the method `delete`, and the param `id` because it's obvious you want to delete a todo
  public static async deleteTodo(todoToDeleteID: number): Promise<void> {
    await axiosInstance.delete(`/todos/${todoToDeleteID}`);
  }

  // TODO: there's no need to use await in this case, anyway you return a promise and the user uses await or .then
  // TODO: please use `noImplicitAny` in tsconfig.json file and look at the errors. in this case you don't use the type safety TS provides.
  public static async getTodos(): Promise<Array<Todo>> {
    // TODO: no need to use `` format if you don't use params, make your conventions consistent all across the application.
    const { data } = await axiosInstance.get(`/todos`);

    return data;
  }

  public static async updateTodo(todoToUpdate: Todo): Promise<void> {
    await axiosInstance.put(`/todos/${todoToUpdate.id}`, todoToUpdate);
  }
}
