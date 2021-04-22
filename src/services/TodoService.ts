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

  public static async getTodos(): Promise<Array<Todo>> {
    const { data } = await axios.get(`/todos`);

    return data;
  }

  public static async updateTodo(todoToUpdate: Todo): Promise<void> {
    await axios.put(`/todos/${todoToUpdate.id}`, todoToUpdate);
  }
}

TodoService.initalize();
