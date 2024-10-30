<script setup>
import { ref } from 'vue';
import TreeItem from './components/TreeItem.vue';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Officer from './components/Officer.vue';
import Message from 'primevue/message';
import declOfNum from './plugins/DeclOfNum';
import ContextMenu from 'primevue/contextmenu';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { data } from './data/TreeData.js';

const officers = ref();
const selectedOfficer = ref(null);
const visibleEditModal = ref(false);
const treeData = ref(data);
const openTree = ref(false);
const newAdministration = ref();

const editOfficer = (officer) => {
  selectedOfficer.value = { ...officer };
  visibleEditModal.value = true;
};

const saveOfficer = () => {
  updateOfficerInTreeData(selectedOfficer.value);
  visibleEditModal.value = false;
};

const deleteOfficer = () => {
  deleteOfficerFromTreeData(selectedOfficer.value.id);
  visibleEditModal.value = false;
};

const getAverageAge = (officers) => {
  let sum = 0;
  for (let officer of officers) {
    sum += new Date().getFullYear() - new Date(officer.birthday).getFullYear();
  }
  if (officers.length === 0) {
    return 0;
  }
  return Math.floor(sum / officers.length);
};

const getAverageWork = (officers) => {
  let sum = 0;
  for (let officer of officers) {
    sum += new Date().getFullYear() - new Date(officer.startWork).getFullYear();
  }
  if (officers.length === 0) {
    return 0;
  }
  return Math.floor(sum / officers.length);
};
const updateOfficerInTreeData = (officer) => {
  const updateOfficer = (data) => {
    if (data.officers) {
      const index = data.officers.findIndex((o) => o.id === officer.id);
      if (index !== -1) {
        data.officers[index] = { ...officer };
        return true;
      }
    }
    if (data.children) {
      for (let child of data.children) {
        if (updateOfficer(child)) {
          return true;
        }
      }
    }
    return false;
  };

  for (let item of treeData.value) {
    if (updateOfficer(item)) {
      break;
    }
  }
};

const deleteOfficerFromTreeData = (officerId) => {
  const deleteOfficer = (data) => {
    if (data.officers) {
      const index = data.officers.findIndex((o) => o.id === officerId);
      if (index !== -1) {
        data.officers.splice(index, 1);
        return true;
      }
    }
    if (data.children) {
      for (let child of data.children) {
        if (deleteOfficer(child)) {
          return true;
        }
      }
    }
    return false;
  };

  for (let item of treeData.value) {
    if (deleteOfficer(item)) {
      break;
    }
  }
};

const addAdministration = () => {
  treeData.value.push({
    key: Date.now(),
    id: Date.now(),
    name: 'Новая служба',
    officers: [],
    children: [],
  });
};
</script>

<template>
  <Header></Header>
  <div class="wrapper-main">
    <div class="wrapper">
      <div class="tree" @contextmenu="onItemRightClick">
        <p class="header-tree">Выберите подразделение</p>
        <Button
          label="Добавить службу"
          @click="addAdministration"
          severity="info"
        />
        <TreeItem
          v-for="data in treeData"
          class="item"
          :model="data"
          @setOfficers="officers = $event"
          @editOfficer="editOfficer"
          :key="data.key"
          :openTree="openTree"
        ></TreeItem>
      </div>

      <div class="right-wrapper">
        <div v-if="officers" class="info">
          <Message severity="info" class="info-item"
            >Количество сотрудников: {{ officers.length }}</Message
          >
          <Message severity="info" class="info-item"
            >Средний возраст: {{ getAverageAge(officers) }}
            {{ declOfNum(getAverageAge(officers), ['год', 'года', 'лет']) }}
          </Message>
          <Message severity="info" class="info-item"
            >Средний стаж работы в подразделении:
            {{ getAverageWork(officers) }}
            {{
              declOfNum(getAverageWork(officers), ['год', 'года', 'лет'])
            }}</Message
          >
        </div>
        <div class="officers-list">
          <Officer
            v-for="officer in officers"
            :key="officer.id"
            :officer="officer"
            @click="editOfficer(officer)"
          />
        </div>
      </div>
    </div>

    <Dialog
      v-model:visible="visibleEditModal"
      modal
      header="Изменить сотрудника"
      :style="{ width: '28rem' }"
    >
      <div class="dialog-body">
        <div class="dialog-item">
          <label for="editOfficerName" class="font-semibold w-24">ФИО</label>
          <InputText
            id="editOfficerName"
            v-model="selectedOfficer.name"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="dialog-item">
          <label for="editOfficerPodr" class="font-semibold w-24"
            >Подразделение</label
          >
          <InputText
            id="editOfficerPodr"
            v-model="selectedOfficer.podr"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="dialog-item">
          <label for="editOfficerPost" class="font-semibold w-24"
            >Должность</label
          >
          <InputText
            id="editOfficerPost"
            v-model="selectedOfficer.post"
            class="flex-auto"
            autocomplete="off"
          />
        </div>
        <div class="dialog-item">
          <label for="editOfficerBirthday" class="font-semibold w-24"
            >Дата рождения</label
          >
          <InputText
            id="editOfficerBirthday"
            v-model="selectedOfficer.birthday"
            class="flex-auto"
            autocomplete="off"
            v-keyfilter.num
          />
        </div>
        <div class="dialog-item">
          <label for="editOfficerStartWork" class="font-semibold w-24"
            >Дата начала работы</label
          >
          <InputText
            id="editOfficerStartWork"
            v-model="selectedOfficer.startWork"
            class="flex-auto"
            autocomplete="off"
            v-keyfilter.num
          />
        </div>
        <div class="dialog-footer">
          <Button
            type="submit"
            label="Отмена"
            severity="secondary"
            @click="visibleEditModal = false"
          ></Button>
          <Button
            type="button"
            label="Удалить"
            @click="deleteOfficer"
            severity="danger"
          ></Button>
          <Button type="button" label="Сохранить" @click="saveOfficer"></Button>
        </div>
      </div>
    </Dialog>
  </div>
  <Footer></Footer>
</template>

<style>
.item {
  cursor: pointer;
  line-height: 1.5;
}
.bold {
  font-weight: bold;
}
.drawer {
  width: 30% !important;
}

.wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.officer-item {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.officer-item:hover {
  background-color: #f0f0f0;
}

.officers-list {
  margin-top: 8px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: space-around;
}

.right-wrapper {
  grid-column: span 2;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  align-items: center;
  text-align: center;
  gap: 8px;
  font-size: 20px;
  cursor: pointer;
}

.header-tree {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 8px;
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
.wrapper-main {
  padding: 0 16px !important;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.tree {
  height: 100%;
}
</style>
