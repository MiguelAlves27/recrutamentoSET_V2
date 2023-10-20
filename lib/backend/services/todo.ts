import express from 'express';
import bodyParser from 'body-parser';

class Todo {
  todos: Array<string>;

  constructor() {
    this.todos = new Array();
  }

  addTodo(todo: string) {
    this.todos.push(todo);
  }

  getTodos() {
    return this.todos;
  }

  updateTodo(index: number, newTodo: string) {
    if (index >= 0 && index < this.todos.length) {
      this.todos[index] = newTodo;
      return true;
    }
    return false;
  }

  deleteTodo(index: number) {
    if (index >= 0 && index < this.todos.length) {
      this.todos.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Todo Service lifecycle management
const todo = global.todo || new Todo();
if (process.env.NODE_ENV !== "production") global.todo = todo;

export { Todo, todo as TodoService };

const app = express();
app.use(bodyParser.json());

const todoService = new Todo();

app.post('/todo', (req, res) => {
  const todo = req.body.todo;
  todoService.addTodo(todo);
  res.status(201).json(todo);
});

app.get('/todo', (req, res) => {
  const todos = todoService.getTodos();
  res.json(todos);
});

app.put('/todo/:index', (req, res) => {
  const index = parseInt(req.params.index);
  const newTodo = req.body.todo;
  if (todoService.updateTodo(index, newTodo)) {
    res.status(200).json(newTodo);
  } else {
    res.status(404).json({ error: 'Indice invalido ou tarefa não encontrada.' });
  }
});

app.delete('/todo/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (todoService.deleteTodo(index)) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Indice invalido ou tarefa não encontrada.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Local:  http://localhost:${PORT}`);
});
