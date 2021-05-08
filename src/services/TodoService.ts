import axios from "axios";
import Todo from "../models/Todo";
import Swal from "sweetalert2";

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

  public static async saveTodo(todoToSave: Todo): Promise<Todo> {
    const { data } = await axios.post(`/todos`, todoToSave);

    return data;
  }

  public static async deleteTodo(todoToDeleteID: number): Promise<void> {
    await axios.delete(`/todos/${todoToDeleteID}`);
  }

  public static async getTodos(): Promise<Array<Todo>> {
    const { data } = await axios.get(`/todos`);

    return data;
  }

  public static async updateTodo(todoToUpdate: Todo): Promise<void> {
    await axios.put(`/todos/${todoToUpdate.id}`, todoToUpdate);
  }
}

TodoService.initalize();
