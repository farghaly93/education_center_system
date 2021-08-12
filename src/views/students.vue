<template>
  <div class="groups">
    <h2 class="text-center" style="color: #0009">الطلاب</h2>
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
    <v-data-table :headers="headers" :items="filteredStudents" class="elevation-1">
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
    this.getStudents();
  },
  data() {
    return {
      filteredGroups: [],
      filteredStudents: [],
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
          text: "الأسم",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "التليفون", align: "start", sortable: false, value: "phone" },
        {
          text: "العنوان",
          align: "start",
          sortable: false,
          value: "address",
        },
        { text: "المرحلة الدراسية", align: "start", sortable: false, value: "stage" },
        { text: "المجموعات", align: "start", sortable: false, value: "groups" },
        // { text: "اليوم", align: "start", sortable: false, value: "pay" },
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

    getStudents() {
      this.filteredStudents = this.students.map((student) => {
        return {
          ...student,
          groups: student.groups.map((groupId) => {
            const filtered = this.groups.find((g) => g._id === groupId);
            return filtered.subject + "(" + filtered.teacherName + ")/";
          }),
        };
      });
    },

    async remove(id) {
      const confirmed = await confirm("مسح الطالب نهائيا..؟");
      if (!confirmed) return;
      axios.get("/deleteStudent/" + id).then((res) => {
        if (res.data.done) {
          const index = this.filteredStudents.findIndex((fs) => {
            return fs._id === res.data.id;
          });
          this.students.splice(index, 1);
          this.filteredStudents.splice(index, 1);
        }
      });
    },
    edit(id) {
      this.$router.push("/editStudent/" + id);
    },
    preview(id) {
      this.$router.push("/studentDetails/" + id);
    },
    search(event) {
      this.filter = {
        name: "",
        phone: "",
        stage: "",
        address: "",
      };
      const filteredStudents = this.students.filter((stud) => {
        return (
          stud.name.toString().includes(event.target.value) ||
          stud.phone.toString().includes(event.target.value) ||
          stud.stage.toString().includes(event.target.value) ||
          stud.address.toString().includes(event.target.value)
        );
      });
      this.filteredStudents = filteredStudents;
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
        if (matched) this.filteredGroups.push(group._id);
      });
      const filteredStudents = this.students.filter((student) => {
        let found = false;
        this.filteredGroups.forEach((fg) => {
          if (student.groups.includes(fg)) {
            found = true;
          }
        });
        return found;
      });
      this.filteredStudents = filteredStudents.map((student) => {
        return {
          ...student,
          groups: student.groups.map((groupId) => {
            const filtered = this.groups.find((g) => g._id === groupId);
            return filtered.subject + "(" + filtered.teacherName + ")";
          }),
        };
      });
    },
  },
  computed: {
    students() {
      return this.$store.getters.students;
    },
    groups() {
      return this.$store.getters.groups;
    },

    subjects() {
      return this.$store.getters.subjects;
    },
  },
  watch: {
    students(val) {
      if (val.length > 0) {
        this.getStudents();
      }
    },
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
