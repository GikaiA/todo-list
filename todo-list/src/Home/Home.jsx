// src/Home.jsx
import React, { useEffect, useState } from "react";
import "./Home.css";

function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleTodoClick = (todo) => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTodo(null);
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
            <div 
              className="todo-content"
              onClick={() => handleTodoClick(todo)}
            >
              <span className="todo-text">{todo.text}</span>
              <span className="todo-timestamp">{formatDate(todo.created_at)}</span>
            </div>
            <button 
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(todo.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && selectedTodo && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Todo Details</h2>
            <p className="modal-text">{selectedTodo.text}</p>
            <p className="modal-timestamp">Created: {formatDate(selectedTodo.created_at)}</p>
            <button className="modal-close" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
