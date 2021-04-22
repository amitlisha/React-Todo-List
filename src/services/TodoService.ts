import axios from "axios";
import Todo from "../models/Todo";

export default class TodoService {
  static initalize() {
    axios.defaults.baseURL = "http://localhost:9000/";
  }

  public static async saveTodo(todoToSave: Todo): Promise<Todo> {
    const { data } = await axios.post(`/todos`, todoToSave);

    return data;
  }

  public static async deleteTodo(todoToDelete: Todo): Promise<void> {
    await axios.delete(`/todos/${todoToDelete.id}`);
  }
}

TodoService.initalize();
