<template>
  <div id="app">
    <header>
      <h1>MyVault App</h1>
    </header>

    <main>
      <router-view />
    </main>

    <footer>
      <small>© 2025 Sunny</small>
    </footer>
  </div>
</template>

<script setup>
</script>

<style>
#app {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
