<script setup>
import Card from 'primevue/card';
defineProps({
  officer: Object,
});
</script>
<template>
  <Card style="width: 25rem; overflow: hidden" class="card">
    <template #header>
      <img
        alt="user header"
        src="https://avatars.mds.yandex.net/i?id=98e1bdcbfbcd518b6e6660534d14ad72_l-2436415-images-thumbs&n=13"
        class="img-card"
      />
    </template>
    <template #title>{{ officer.name }}</template>
    <template #subtitle>{{ officer.post }}</template>

    <template #content>
      <p class="m-0">
        {{ officer.podr }}
      </p>
      <p class="m-0">День рождения: {{ officer.birthday }}</p>
    </template>
  </Card>
</template>

<style>
.img-card {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card {
  max-width: 22%;

  cursor: pointer;
  flex-wrap: wrap;
  transition: 0.3s;
}

.card:hover {
  max-width: 22.5%;

  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}

.title {
  font-weight: 2rem;
}
</style>
