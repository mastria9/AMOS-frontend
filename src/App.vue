<script setup>
import { ref, onMounted } from 'vue'

const status = ref('loading')
const payload = ref(null)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/ping/')
    if (!res.ok) throw new Error('HTTP ' + res.status)
    payload.value = await res.json()
    status.value = 'ok'
  } catch (e) {
    error.value = e.message
    status.value = 'error'
  }
})
</script>

<template>
  <h1>Integration check</h1>
  <p v-if="status === 'loading'">Chiamata a /api/ping/ in corso...</p>
  <p v-else-if="status === 'ok'" data-testid="result">
    Backend risponde: {{ payload.message }} ({{ payload.timestamp }})
  </p>
  <p v-else style="color: red">Errore: {{ error }}</p>
</template>
