<script setup>
import { ref, computed } from 'vue';
import ContextMenu from 'primevue/contextmenu';
import Dialog from 'primevue/dialog';
import SelectButton from 'primevue/selectbutton';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const props = defineProps({
  model: Object,
  parent: Object,
});

const emit = defineEmits(['setOfficers']);

const itemsItem = ref([
  {
    label: 'Добавить узел',
    icon: 'pi pi-copy',
    command: () => {
      visibleModal.value = !visibleModal.value;
    },
  },
  {
    label: 'Переименовать узел',
    icon: 'pi pi-pencil',
    command: renameNode,
  },
  {
    label: 'Удалить узел',
    icon: 'pi pi-trash',
    command: deleteChild,
  },
]);
const isOpen = ref(false);
const menuItem = ref();
const isFolder = computed(() => {
  return props.model.children && props.model.children.length;
});

function toggle() {
  isOpen.value = !isOpen.value;
}

function addChild() {
  props.model.children.push({ name: 'новый узел' });
}

function showOfficers() {
  const allOfficers = getAllOfficers(props.model);
  emit('setOfficers', allOfficers);
}

function deleteChild() {
  if (props.parent) {
    const index = props.parent.children.findIndex(
      (child) => child.key === props.model.key
    );
    if (index !== -1) {
      props.parent.children.splice(index, 1);
    }
  }
}

const onItemRightClick = (event) => {
  menuItem.value.show(event);
  console.log(event);
};

function renameNode() {
  const newName = prompt('Введите новое название узла:', props.model.name);
  if (newName !== null && newName.trim() !== '') {
    props.model.name = newName.trim();
  }
}

const options = ref(['Сотрудник', 'Подразделение']);
const visibleModal = ref(false);
const newNodeType = ref('Сотрудник');
const newNodeName = ref('');
const newNodeOfficer = ref({
  name: '',
  podr: '',
  post: '',
  birthday: '',
  startWork: '',
});

function addNewNode() {
  if (newNodeType.value === 'Сотрудник') {
    props.model.officers.push({
      id: Date.now(),
      name: newNodeOfficer.value.name,
      podr: newNodeOfficer.value.podr,
      post: newNodeOfficer.value.post,
      birthday: newNodeOfficer.value.birthday,
      startWork: newNodeOfficer.value.startWork,
    });
  } else if (newNodeType.value === 'Подразделение') {
    props.model.children.push({
      key: Date.now(),
      id: Date.now(),
      name: newNodeName.value,
      officers: [],
      children: [],
    });
  }
  visibleModal.value = false;
  newNodeName.value = '';
  newNodeOfficer.value = {
    name: '',
    podr: '',
    post: '',
    birthday: '',
    startWork: '',
  };
}

function getAllOfficers(node) {
  let officers = [];
  if (node.officers) {
    officers = officers.concat(node.officers);
  }
  if (node.children) {
    for (let child of node.children) {
      officers = officers.concat(getAllOfficers(child));
    }
  }
  return officers;
}
</script>

<template>
  <Dialog
    v-model:visible="visibleModal"
    modal
    header="Добавить узел"
    :style="{ width: '28rem' }"
    class="dialog"
  >
    <div class="dialog-body">
      <span class="text-surface-500 dark:text-surface-400 block mb-8"
        >Выберите тип узла и заполните необходимые поля.</span
      >
      <SelectButton v-model="newNodeType" :options="options" />

      <div v-if="newNodeType === 'Подразделение'" class="dialog-item">
        <label for="nodeName">Название</label>
        <InputText
          id="nodeName"
          v-model="newNodeName"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div v-if="newNodeType === 'Сотрудник'" class="dialog-item">
        <label for="officerName" class="font-semibold w-24">ФИО</label>
        <InputText
          id="officerName"
          v-model="newNodeOfficer.name"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div v-if="newNodeType === 'Сотрудник'" class="dialog-item">
        <label for="officerPodr" class="font-semibold w-24"
          >Подразделение</label
        >
        <InputText
          id="officerPodr"
          v-model="newNodeOfficer.podr"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div v-if="newNodeType === 'Сотрудник'" class="dialog-item">
        <label for="officerPost" class="font-semibold w-24">Должность</label>
        <InputText
          id="officerPost"
          v-model="newNodeOfficer.post"
          class="flex-auto"
          autocomplete="off"
        />
      </div>
      <div v-if="newNodeType === 'Сотрудник'" class="dialog-item">
        <label for="officerBirthday" class="font-semibold w-24"
          >Дата рождения</label
        >
        <InputText
          id="officerBirthday"
          v-model="newNodeOfficer.birthday"
          class="flex-auto"
          autocomplete="off"
          v-keyfilter.num
        />
      </div>
      <div v-if="newNodeType === 'Сотрудник'" class="dialog-item">
        <label for="officerStartWork" class="font-semibold w-24"
          >Дата начала работы</label
        >
        <InputText
          id="officerStartWork"
          v-model="newNodeOfficer.startWork"
          class="flex-auto"
          autocomplete="off"
          v-keyfilter.num
        />
      </div>
      <div class="dialog-footer">
        <Button
          type="button"
          label="Отмена"
          severity="secondary"
          @click="visibleModal = false"
        ></Button>
        <Button type="button" label="Сохранить" @click="addNewNode"></Button>
      </div>
    </div>
  </Dialog>
  <li class="list-item">
    <div class="item">
      <span v-if="isFolder" @click="toggle" class="toggle-icon">
        <span class="arrow" :class="{ 'arrow-down': isOpen }"></span>
      </span>
      <div
        :class="{ bold: isFolder }"
        @contextmenu="onItemRightClick"
        @click="showOfficers"
        class="item-name"
      >
        {{ model.name }}
      </div>
    </div>

    <transition name="slide">
      <ul v-show="isOpen" v-if="isFolder" class="child-list">
        <TreeItem
          class="item"
          v-for="model in model.children"
          :model="model"
          :parent="props.model"
          @setOfficers="emit('setOfficers', $event)"
          :key="model.key"
        >
        </TreeItem>
      </ul>
    </transition>
  </li>

  <ContextMenu ref="menuItem" :model="itemsItem" />
</template>

<style scoped>
.list-item {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.item {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.item-active {
  background-color: #cccbcb;
}

.item:hover {
  background-color: #f0f0f0;
}

.item-name {
  flex-grow: 1;
}

.toggle-icon {
  margin-right: 8px;
  display: flex;
  align-items: center;
  width: 20px;
  height: 20px;
}

.arrow {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #666;
  transition: transform 0.2s;
}

.arrow-down {
  transform: rotate(180deg);
}

.child-list {
  margin-left: 15px;
  padding-left: 20px;
  border-left: 1px solid #ccc;
  list-style-type: none;
}

.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 1000px;
  opacity: 1;
}

.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dialog-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  width: 100%;
  justify-content: space-between;
}

.dialog-footer {
  display: flex;
  gap: 8px;
  justify-content: space-between;
}
</style>
