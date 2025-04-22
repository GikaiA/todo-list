// src/Home.jsx
import React, { useEffect, useState } from "react";
import "./Home.css";

function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTodo }),
      });

      if (response.ok) {
        const newTodoItem = await response.json();
        setTodos([newTodoItem, ...todos]);
        setNewTodo("");
      }
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      } else {
        console.error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="home">
      <h1>Todo List</h1>
      <div className="todolist-section">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-field"
            placeholder="Enter your to-do list here"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
      <div className="todos-list">
        {todos.map((todo) => (
          <div key={todo.id} className="todo-item">
            <div className="todo-content">
              <span className="todo-text">{todo.text}</span>
              <span className="todo-timestamp">{formatDate(todo.created_at)}</span>
            </div>
            <button 
              className="delete-button"
              onClick={() => handleDelete(todo.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
