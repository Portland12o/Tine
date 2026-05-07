<script setup lang="ts">
import { ref } from "vue";
import "./style.css";
import { useTheme } from "./composables/useTheme";
import LoadingScreen from "./components/LoadingScreen.vue";
import CustomCursor from "./components/CustomCursor.vue";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";

const loading = ref(true);
const onComplete = () => { loading.value = false; };

useTheme();
</script>

<template>
  <Transition name="fade" mode="out-in">
    <LoadingScreen v-if="loading" @complete="onComplete" key="loading" />
    <div v-else key="app" class="app-root">
      <CustomCursor />
      <Navbar />
      <main>
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
      <Footer />
    </div>
  </Transition>
</template>

<style>
.app-root {
  width: 100%;
  min-height: 100vh;
  background: var(--bg);
  transition: background 0.35s ease;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(14px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
