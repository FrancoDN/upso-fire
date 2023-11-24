<template>
  <div class="container mt-5">
    <h2 class="mb-4">Lista de Tareas</h2>

    <ul class="list-group">
      <li
        v-for="task in tasks"
        :key="task._id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        {{ task.title }} - {{ task.completed ? "Completada" : "Pendiente" }}
        <div>
          <button
            @click="editTask(task._id)"
            class="btn btn-primary btn-sm mr-2"
          >
            Editar
          </button>
          <button @click="confirmDelete(task._id)" class="btn btn-danger btn-sm">
            Eliminar
          </button>
        </div>
      </li>
    </ul>

    <div v-if="editingTask" class="mt-4">
      <h3>Editar Tarea</h3>
      <div class="form-group">
        <label for="editedTaskTitle">Título:</label>
        <input
          v-model="editedTask.title"
          id="editedTaskTitle"
          class="form-control"
        />
      </div>
      <div class="form-group form-check">
        <input
          type="checkbox"
          v-model="editedTask.completed"
          class="form-check-input"
          id="completedCheckbox"
        />
        <label class="form-check-label" for="completedCheckbox"
          >Completada</label
        >
      </div>
      <button @click="updateTask" class="btn btn-success">
        Guardar cambios
      </button>
      <button
        @click="cancelEditing(editedTask.title)"
        class="btn btn-secondary ml-2"
      >
        Cancelar
      </button>
    </div>

    <div class="mt-4">
      <h3>Nueva Tarea</h3>
      <div class="form-group">
        <label for="newTaskTitle">Título:</label>
        <input
          v-model="newTask.title"
          @keyup.enter="createTask"
          id="newTaskTitle"
          class="form-control"
        />
      </div>
      <button @click="createTask" class="btn btn-primary">Crear Tarea</button>
    </div>
    <button @click="signOut" class="btn btn-danger mt-3">Cerrar Sesión</button>
  </div>
</template>
  
  <script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import { auth } from "../firebaseConfig";
import Swal from "sweetalert2";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

@Component
export default class TaskList extends Vue {
  tasks: Task[] = [];
  editingTask: string | null = null;
  editedTask: Task = { _id: "", title: "", completed: false };
  newTask: { title: string } = { title: "" };

  mounted() {
    this.fetchTasks();
  }

  signOut() {
    auth
      .signOut()
      .then(() => {
        // Cerrar sesión correctamente, redirigir a la página de inicio de sesión
        this.$router.push("/");
      })
      .catch((error) => {
        // Manejar errores si es necesario
        console.error("Error al cerrar sesión:", error);
      });
  }

  async fetchTasks() {
    try {
      const response = await axios.get("http://localhost:3000/api/tasks");
      this.tasks = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  editTask(id: string) {
    this.editingTask = id;
    this.editedTask = { ...this.tasks.find((task) => task._id === id) } as Task;
  }

  async updateTask() {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/tasks/${this.editedTask._id}`,
        this.editedTask
      );

      const updatedTaskIndex = this.tasks.findIndex(
        (task) => task._id === this.editedTask._id
      );
      this.$set(this.tasks, updatedTaskIndex, response.data);
      console.log(this.editedTask.title);
      Swal.fire({
        title: "Tarea actualizada",
        text: "La tarea se actualizó correctamente",
        icon: "success",
      });
      this.editingTask = null;
      this.editedTask = { _id: "", title: "", completed: false };
    } catch (error) {
      console.error(error);
    }
  }

  async createTask() {
    try {
      if (this.newTask.title === "") {
        Swal.fire({
          title: "Error",
          text: "Por favor, llená el campo de título",
          icon: "error",
        });
      } else {
        const response = await axios.post(
          "http://localhost:3000/api/tasks",
          this.newTask
        );
        this.tasks.push(response.data);
        this.newTask.title = "";
      }
    } catch (error) {
      console.error(error);
    }
  }

  async deleteTask(id: string) {
    try {
      this.editingTask = null;
      this.editedTask = { _id: "", title: "", completed: false };
      await axios.delete(`http://localhost:3000/api/tasks/${id}`);
      this.tasks = this.tasks.filter((task) => task._id !== id);
    } catch (error) {
      console.error(error);
    }
  }

  confirmDelete(id: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Estás seguro?",
        text: "No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Borrar",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.deleteTask(id);
          swalWithBootstrapButtons.fire({
            title: "Eliminado!",
            text: `La tarea ${this.editedTask.title} fue eliminada`,
            icon: "success",
          });
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelado",
            text: "Tranqui, que no se borro nada",
            icon: "error",
          });
        }
      });
  }

  cancelEditing(titulo: string): void {
    Swal.fire({
      title: "No se actualizo la tarea",
      text: `La tarea ${titulo} no se actualizó`,
      icon: "success",
    });

    this.editingTask = null;
    this.editedTask = { _id: "", title: "", completed: false };
  }
}
</script>
  
  <style scoped>
/* Estilos opcionales */
</style>
  