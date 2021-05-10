import axios from "axios";
import Todo from "../models/Todo";
import Swal from "sweetalert2";

// TODO: there's no need to change it but I want you to read about why it's not recommended using expot default
export default class TodoService {
  static initalize() {
    axios.defaults.baseURL = "http://localhost:9000/";
    axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error: Error) {
        Swal.fire({
          title: "Something wrong happened",
          text: error.message + ", The action you just did wasn't saved",
          icon: "error",
        });

        return Promise.reject(error);
      }
    );
  }

  // TODO: no need to call the param `todoToSave` and or `saveTodo` method name,
  // we're already in save method in TodoService class.
  // keep in mind that naming conventions are important, don't add words that do not make the code clearer
  // I'll repeat this comment in a few more places but not all of them only to make sure you understand 
  // my intention
  public static async saveTodo(todoToSave: Todo): Promise<Todo> {
    const { data } = await axios.post(`/todos`, todoToSave);

    return data;
  }

  // TODO: please notice that delete of multiple todos at once is not supported.
  // no need to implement as long as you're aware of the problem with the UX.
  // TODO: name the method `delete`, and the param `id` because it's obvious you want to delete a todo
  public static async deleteTodo(todoToDeleteID: number): Promise<void> {
    await axios.delete(`/todos/${todoToDeleteID}`);
  }

  // TODO: there's no need to use await in this case, anyway you return a promise and the user uses await or .then
  // TODO: please use `noImplicitAny` in tsconfig.json file and look at the errors. in this case you don't use the type safety TS provides.
  public static async getTodos(): Promise<Array<Todo>> {
    // TODO: no need to use `` format if you don't use params, make your conventions consistent all across the application.
    const { data } = await axios.get(`/todos`);

    return data;
  }

  public static async updateTodo(todoToUpdate: Todo): Promise<void> {
    await axios.put(`/todos/${todoToUpdate.id}`, todoToUpdate);
  }
}

TodoService.initalize();
