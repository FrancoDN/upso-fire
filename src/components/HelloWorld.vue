<template>
  <div class="container my-4">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <button class="btn btn-primary mr-2" @click="mostrarLoginForm = true">
          Iniciar Sesión
        </button>
        <button class="btn btn-secondary" @click="mostrarLoginForm = false">
          Registrarse
        </button>

        <form v-if="mostrarLoginForm" @submit.prevent="login" class="mt-4">
          <h2>Inciar Sesión</h2>
          <div class="form-group">
            <label for="emailLogin"> Email</label>
            <input
              type="email"
              class="form-control"
              id="emailLogin"
              v-model="email"
            />
          </div>
          <div class="form-group">
            <label for="passwordLogin"> Contraseña</label>
            <input
              type="password"
              class="form-control"
              id="passwordLogin"
              v-model="password"
            />
          </div>
          <button type="submit" class="btn btn-success">Inciar Sesión</button>
        </form>

        <form v-else class="mt-4" @submit.prevent="register">
          <h2>Registrarse</h2>
          <div class="form-group">
            <label for="emailRegister"> Email</label>
            <input
              type="email"
              class="form-control"
              id="emailRegister"
              v-model="emailSign"
            />
          </div>
          <div class="form-group">
            <label for="passwordRegister"> Contraseña</label>
            <input
              type="password"
              class="form-control"
              id="passwordRegister"
              v-model="passwordSign"
            />
          </div>
          <div class="form-group">
            <label for="passwordRepeat"> Repetir contraseña</label>
            <input
              type="password"
              class="form-control"
              id="passwordRepeat"
              v-model="passwordCompare"
            />
          </div>
          <button type="submit" class="btn btn-success">Registrarse</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { auth } from "../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Swal from "sweetalert2";

@Component
export default class HelloWorld extends Vue {
  mostrarLoginForm: boolean = true;
  email: string = "";
  emailSign: string = "";
  password: string = "";
  passwordSign: string = "";
  passwordCompare: string = "";

  //Creamos los metodos para crear e iniciar sesión
  login() {
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then(() => {
        Swal.fire({
          title: "Iniciaste sesion correctamente",
          text: "Desea ir al home?",
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Aceptar",
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.push("/home");
          }
        });
      })
      .catch((error) => {
        window.alert("Fallo el inicio de sesión");
      });
  }

  register() {
    if (this.passwordSign === this.passwordCompare) {
      createUserWithEmailAndPassword(auth, this.emailSign, this.passwordSign)
        .then(() => {
          this.$router.push("/registro");

          Swal.fire({
            title: "Buenísimo",
            text: "Te registraste correctamente",
            icon: "success",
          });
        })
        .catch((error) => {
          window.alert("Fallo el registro");
        });
    } else {
      Swal.fire({
        title: "Mmmm, le erraste en la contraseña",
        text: "Intenta de nuevo",
        icon: "error",
      });
    }
  }
}
</script>

<style scoped>
</style>
