<script setup lang="ts">
import { faker } from "@faker-js/faker";
import moment from "moment";

const props = defineProps({
  datalist: {
    type: Array
  },
});

const chooseColor = () => {
  let colors = ["red", "indigo", "blue", "cyan", "teal"];
  let randomColor = colors[Math.floor(Math.random() * colors.length)];
  return randomColor;
};

const generateMessage = () => {
  return {
    // 生成4位id
    avatar: faker.internet.avatar(),
    username: faker.internet.userName(),
    usermail: faker.internet.email(),
    phone: faker.phone.number(),
    jdate: moment(faker.date.past()).format("YYYY/MM/DD"),
    role: faker.name.jobTitle(),
    rolestatus: chooseColor(),
  };
};

const list = () => {
  let list = [] as any[];
  list = Array.from({ length: 20 }, (value, index) => ({
    id: "#1000" + index + "",
    ...generateMessage(),
  }));
  return list;
};

onMounted(() => {
  console.log(list());
});

const dialog = ref(false);
const search = ref("");
const rolesbg = ref(["primary", "secondary", "error", "success", "warning"]);
const desserts = ref(list());
const editedIndex = ref(-1);
const refForm = ref();
const editedItem = ref({
  id: "",
  avatar: "1.jpg",
  username: "",
  usermail: "",
  phone: "",
  jdate: "",
  role: "",
  rolestatus: "",
});
const defaultItem = ref({
  id: "",
  create_time: "",
  question: "",
  answer: "",
});

const nameRules = [
  (v) => !!v || "Name is required",
  (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
];

//Methods
const filteredList = computed(() => {
  return desserts.value.filter((user: any) => {
    return user.username.toLowerCase().includes(search.value.toLowerCase());
  });
});

function editItem(item: any) {
  editedIndex.value = desserts.value.indexOf(item);
  editedItem.value = Object.assign({}, item);
  dialog.value = true;
}
function deleteItem(item: any) {
  const index = desserts.value.indexOf(item);
  confirm("Are you sure you want to delete this item?") &&
    desserts.value.splice(index, 1);
  ``;
}

function close() {
  dialog.value = false;
  setTimeout(() => {
    editedItem.value = Object.assign({}, defaultItem.value);
    editedIndex.value = -1;
  }, 300);
}

function save() {
  if (editedIndex.value > -1) {
    Object.assign(desserts.value[editedIndex.value], editedItem.value);
  } else {
    desserts.value.push(editedItem.value);
  }
  close();
}

//Computed Property
const formTitle = computed(() => {
  return editedIndex.value === -1 ? "New Contact" : "Edit Contact";
});
</script>
<template>
  <v-container>
  

    <v-card class="mt-2">
      <v-table class="mt-5">
        <thead>
          <tr >
            <th class="text-subtitle-1 font-weight-semibold">Id</th>
            <th class="text-subtitle-1 font-weight-semibold">create_time</th>
            <th class="text-subtitle-1 font-weight-semibold">question</th>
            <th class="text-subtitle-1 font-weight-semibold">answer</th>
          </tr>
        </thead>
        <tbody class="text-body-1">
          <tr v-for="item in props.datalist" :key="item.id">
            <td class="font-weight-bold">{{ item.id }}</td>
            <td>{{ item.create_time }}</td>
            <td>{{ item.question }}</td>
            <td>{{ item.answer }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>
