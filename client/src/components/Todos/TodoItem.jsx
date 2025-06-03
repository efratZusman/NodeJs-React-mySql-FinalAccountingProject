import React, { useState } from 'react';
import styles from './Todo.module.css';
import ApiService from '../ApiSevice';


function TodoItem({ todo, index, todos, setTodos }) {
    const [editingId, setEditingId] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const apiService = new ApiService();


    const handleToggleComplete = async () => {
        const updatedTodo = { ...todo, IsCompleted: !todo.IsCompleted };
        try {
            console.log(updatedTodo);
            const DataBaseTodo = await apiService.put(`http://localhost:3000/todos/${todo.TodoID}`, updatedTodo);
            const updatedTodos = [...todos];
            updatedTodos[index] = DataBaseTodo;
            setTodos(updatedTodos);
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const handleEditTodo = () => {
        setEditingId(todo.TodoID);
        setEditingValue(todo.Title);
    };

    const handleSaveTodo = async () => {
        const updatedTodo = { ...todo, Title: editingValue };
        try {
            console.log(todo);
            
            const response = await apiService.put(`http://localhost:3000/todos/${todo.TodoID}`, updatedTodo);
            const updatedTodos = [...todos];
            updatedTodos[index] = response;
            setTodos(updatedTodos);
            setEditingId(null);
            setEditingValue('');

        } catch (error) {
            console.error('Error saving todo:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingValue('');
    };

    const handleDeleteTodo = async () => {
        try {
              console.log(todo);
            await apiService.delete(`http://localhost:3000/todos/${todo.TodoID}`);
            const updatedTodos = [...todos];
            updatedTodos.splice(index, 1);
            setTodos(updatedTodos);
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };
    return (
        <div className={styles.todoItem}>
            <input
                className={styles.checkbox}
                type="checkbox"
                checked={todo.IsCompleted}
                onChange={handleToggleComplete}
            />
            <strong className={styles.todoId}>{todo.id}</strong>
            {editingId === todo.TodoID ? (
                <div className={styles.editingSection}>
                    <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className={styles.editInput}
                    />
                    <button onClick={handleSaveTodo} className={styles.saveButton}>
                        Save
                    </button>
                    <button onClick={handleCancelEdit} className={styles.cancelButton}>
                        Cancel
                    </button>
                </div>
            ) : (
                <>
                    <span className={styles.todoTitle}>{todo.Title}</span>
                    <span
                        className={styles.editIcon}
                        onClick={handleEditTodo}
                    ></span>
                </>
            )}
            <span
                className={styles.deleteIcon}
                onClick={handleDeleteTodo}
            ></span>
        </div>
    );
}

export default TodoItem;
