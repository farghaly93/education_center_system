<template>
  <div class="groups">
    <h2 class="text-center" style="color: #0009">المجموعات</h2>
    <hr />
    <div class="search input-group">
      <span class="input-group-text fa fa-search"></span>
      <input @input="search" class="form-control" type="text" placeholder="بحث" />
    </div>
    <hr />
    <div class="filters">
      <div class="row">
        <div class="col-md-3">
          <label>المادة</label>
          <select
            @change="filterGroups"
            v-model="filter.subject"
            class="form-control"
            :counter="10"
          >
            <option value="">كل المواد</option>
            <option v-for="subject in subjects" :key="subject" :value="subject">
              {{ subject }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label>اليوم</label>
          <select
            v-model="filter.day"
            @change="filterGroups"
            class="form-control"
            :counter="10"
          >
            <option value="">كل الأيام</option>
            <option v-for="day in days" :key="day" :value="day">
              {{ day }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label>المرحلة الدراسية</label>
          <select
            v-model="filter.stage"
            @change="filterGroups"
            class="form-control"
            :counter="10"
          >
            <option value="">كل المراحل</option>
            <option value="1">الصف الأول الثانوي</option>
            <option value="2">الصف الثاني الثانوي</option>
            <option value="3">الصف الثالث الثانوي</option>
          </select>
        </div>
        <div class="col-md-3">
          <label>المدرس</label>
          <select
            @change="filterGroups"
            v-model="filter.teacher"
            class="form-control"
            :counter="10"
          >
            <option value="">كل المدرسين</option>
            <option v-for="teacher in teachers" :key="teacher" :value="teacher">
              {{ teacher }}
            </option>
          </select>
        </div>
      </div>
      <hr />
    </div>
    <v-data-table :headers="headers" :items="filteredGroups" class="elevation-1">
      <template v-slot:item.controls="row">
        <div class="controls">
          <button
            @click="() => remove(row.item._id)"
            type="button"
            class="btn btn-outline-danger btn-xs"
          >
            <i class="fa fa-trash" aria-hidden="true"></i>
          </button>
          <button
            @click="() => edit(row.item._id)"
            type="button"
            class="btn btn-outline-danger btn-xs"
          >
            <i class="fa fa-pen" aria-hidden="true"></i>
          </button>
          <button
            @click="() => preview(row.item._id)"
            type="button"
            class="btn btn-outline-danger btn-xs"
          >
            <i class="fa fa-list" aria-hidden="true"></i>
          </button>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  created() {
    this.getGroups();
  },
  data() {
    return {
      filteredGroups: [],
      days: [
        "saturday",
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
      ],
      teachers: [],
      filter: {
        subject: "",
        day: "",
        teacher: "",
        stage: "",
      },
      headers: [
        {
          text: "رقم المجموعة",
          align: "start",
          sortable: false,
          value: "number",
        },
        { text: "اسم المدرس", align: "start", sortable: false, value: "teacherName" },
        {
          text: "رقم تليفون المدرس",
          align: "start",
          sortable: false,
          value: "teacherPhone",
        },
        { text: "المرحلة الدراسية", align: "start", sortable: false, value: "stage" },
        { text: "المادة", align: "start", sortable: false, value: "subject" },
        { text: "اليوم", align: "start", sortable: false, value: "day" },
        { text: "من الساعة", align: "start", sortable: false, value: "timeFrom" },
        { text: "التحكم", align: "start", sortable: false, value: "controls" },
      ],
    };
  },
  methods: {
    getGroups() {
      this.filteredGroups = this.groups;
      this.groups.forEach((group) => {
        if (!this.teachers.includes(group.teacherName)) {
          this.teachers.push(group.teacherName);
        }
      });
    },
    async remove(id) {
      const confirmed = await confirm("مسح المجموعة نهائيا..؟");
      if (!confirmed) return;
      axios.get("/deleteGroup/" + id).then((res) => {
        if (res.data.done) {
          const index = this.filteredGroups.findIndex((fg) => {
            return fg._id === res.data.id;
          });
          this.groups.splice(index, 1);
          this.filteredGroups.splice(index, 1);
        }
      });
    },
    edit(id) {
      this.$router.push("/editGroup/" + id);
    },
    preview(id) {
      this.$router.push("/GroupDetails/" + id);
    },
    search(event) {
      this.filter = {
        subject: "",
        day: "",
        teacher: "",
        stage: "",
      };
      const filteredGroups = this.groups.filter((group) => {
        return (
          group.teacherName.toString().includes(event.target.value) ||
          group.teacherPhone.toString().includes(event.target.value) ||
          group.subject.toString().includes(event.target.value) ||
          group.day.toString().includes(event.target.value) ||
          group.timeFrom.toString().includes(event.target.value)
        );
      });
      this.filteredGroups = filteredGroups;
    },
    filterGroups() {
      this.filteredGroups = [];
      this.groups.forEach((group) => {
        let matched = true;
        if (this.filter.subject !== "") {
          matched = group.subject == this.filter.subject;
          if (!matched) return;
        }
        if (this.filter.day !== "") {
          matched = group.day == this.filter.day;
          if (!matched) return;
        }
        if (this.filter.teacher !== "") {
          matched = group.teacherName == this.filter.teacher;
          if (!matched) return;
        }
        if (this.filter.stage !== "") {
          matched = group.stage == this.filter.stage;
          if (!matched) return;
        }
        if (matched) this.filteredGroups.push(group);
      });

      // this.filteredGroups = this.groups.filter((fG) => {
      //   return (
      //     [this.filter.subject !== "" && fG.subject == this.filter.subject] && [
      //       this.filter.day !== "" && fG.day == this.filter.day,
      //     ] && [this.filter.teacher !== "" && fG.teacher == this.filter.teacher] && [
      //       this.filter.stage !== "" && fG.stage == this.filter.stage,
      //     ]
      //   );
      // });
    },
  },
  computed: {
    subjects() {
      return this.$store.getters.subjects;
    },

    groups() {
      return this.$store.getters.groups;
    },
  },
  watch: {
    groups(val) {
      if (val.length > 0) {
        this.getGroups();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
* {
}
.groups {
  padding: 20px;
  position: relative;
}
// @import "../../assets/styles/table.scss";
.search {
  margin: 15px;
  right: 0;
  // position: absolute;
  width: 40%;
  @media (max-width: 600px) {
    width: 100%;
  }
  i {
    position: absolute;
    right: 2%;
  }
}
.controls {
  display: flex;
  flex-direction: row;
  justify-items: center;
  align-content: center;
  button {
    margin: 2px;
  }
  .input {
    // box-shadow: rgb(71, 71, 71) 1px 1px 1px 1px;
    background-color: rgb(226, 224, 224);
    text-align: center;
    border: 1px #555 solid;
    border-radius: 20px;
  }
}
</style>
