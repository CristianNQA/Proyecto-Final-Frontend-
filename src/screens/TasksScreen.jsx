import React, { useState, useEffect } from "react";
import fetchData from "../fetching/fetchData.js";
import "../styles/TasksScreen.css"

const TasksScreen = () => {
  const [tasks, setTasks] = useState([]); //Guarda la lista de tareas
  const [newTask, setNewTask] = useState({ title: "", description: "" });//Función para actualizar la lista de tareas
  const [editingTask, setEditingTask] = useState(null); // Para editar tareas. Si es null, estamos creando una nueva tarea. Si tiene un valor, significa que estamos editando una tarea existente

  // Cargar tareas con useEffect
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetchData("tasks", "GET");
        console.log("Tareas cargadas:", response);

        if (Array.isArray(response)) {
          setTasks(response);
        } else {
          console.warn("La API no devolvió un array. Se establece un array vacío.");
          setTasks([]);
        }
      } catch (error) {
        console.error("Error cargando tareas:", error);
        setTasks([]);
      }
    };
    loadTasks();
  }, []);

  // Manejar cambios en los inputs
  const handleChange = (params) => {
    setNewTask({ ...newTask, [params.target.name]: params.target.value });
  };

  // Guardar o actualizar una tarea
  const handleSubmit = async (params) => {
    params.preventDefault();
    try {
      if (editingTask) {
        const response = await fetchData(`tasks/${editingTask.id}`, "PUT", newTask);
        
        // Asegurar que la respuesta tiene el mismo ID
        const updatedTask = { ...editingTask, ...response };
      
        setTasks(tasks.map((task) => (task.id === editingTask.id ? updatedTask : task)));
        setEditingTask(null);
      }
      else {
        // si agregamos una tarea nueva
        const response = await fetchData("tasks", "POST", newTask);
        if (response && response.id) {
          setTasks([...tasks, response]);
        } else {
          console.error("Error: la respuesta del backend no contiene una tarea válida.");
        }
      }
      setNewTask({ title: "", description: "" });
    } catch (error) {
      console.error("Error al guardar tarea:", error);
    }
  };

  // Cargar tarea en el formulario para poder editarla
  const handleEdit = (task) => {
    setNewTask({ title: task.title, description: task.description });
    setEditingTask(task);
  };

  // Eliminar tarea
  const handleDelete = async (id) => {
    try {
      await fetchData(`tasks/${id}`, "DELETE");
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  return (
    <div className="tasks-container">
      <h1 className="tasks-title">Gestor de Tareas</h1>

      {/* Formulario para agregar o editar tareas */}
      <form className="tasks-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={newTask.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={newTask.description}
          onChange={handleChange}
          required
        />
        <button className="tasks-btn" type="submit">
          {editingTask ? "Actualizar Tarea" : "Agregar Tarea"}
        </button>
        {editingTask && (
          <button
            className="tasks-btn tasks-btn-cancel"
            type="button"
            onClick={() => setEditingTask(null)}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Lista de tareas */}
      {tasks.length > 0 ? (
        <ul className="tasks-list">
          {tasks.map((task) => (
            <li className="task-item" key={task.id}>
              <div>
                <strong className="task-title">{task.title}</strong> - {task.description}
              </div>
              <div className="task-actions">
                <button className="task-edit" onClick={() => handleEdit(task)}>✏️ Editar</button>
                <button className="task-delete" onClick={() => handleDelete(task.id)}>🗑️ Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-tasks-message">No hay tareas disponibles. ¡Crea una nueva!</p>
      )}
    </div>
  );
};

export default TasksScreen;

