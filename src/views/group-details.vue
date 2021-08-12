<template>
  <div>
    <h1 class="text-center">تفاصيل المجموعة</h1>
    <hr />
    <div v-if="group" class="group" dir="rtl">
      <h3 class="heading">
        <span>مجموعة رقم </span>
        {{ group.number }}
      </h3>
      <div class="details p-4">
        <div>
          <div class="prop">اسم المدرس:</div>
          <p>{{ group.teacherName }}</p>
        </div>
        <div>
          <div class="prop">المادة:</div>
          <p>{{ group.subject }}</p>
        </div>
        <div>
          <div class="prop">السنة الدراسية:</div>
          <p>{{ group.stage | stage }}</p>
        </div>
        <div>
          <div class="prop">اليوم:</div>
          <p>{{ group.day | arabicDay }}</p>
        </div>
        <div>
          <div class="prop">المجموعة من الساعة:</div>
          <p>{{ group.timeFrom }}</p>
        </div>
        <div>
          <div class="prop">تليفون المدرس:</div>
          <p>{{ group.teacherPhone }}</p>
        </div>
        <hr />
        <div>
          <button
            @click="() => $router.push('/editGroup/' + group._id)"
            class="btn btn-primary"
          >
            تعديل المجموعة
          </button>
        </div>
      </div>
    </div>
    <div class="scrollable" dir="rtl">
      <h3 class="heading">الطلاب الملتحقين ({{ group_students.length }})</h3>
      <div class="p-3">
        <div
          v-for="(student, i) in group_students"
          :key="student._id"
          @click="getStudentLog(student._id)"
          class="student row px-3"
        >
          <div class="col-md-1">
            {{ i + 1 }}
          </div>
          <div class="col-md-2">
            <p>{{ student.name }}</p>
          </div>
          <div class="col-md-2">
            <p>{{ student.phone }}</p>
          </div>
          <div class="col-md-2">
            <p>{{ student.address }}</p>
          </div>
          <div class="col-md-2">
            <p>{{ student.stage | stage }}</p>
          </div>
          <div class="col-md-2">
            <p>تم الحضور ({{ attended(student._id) }}) مرات</p>
          </div>
          <div class="col-md-1">
            <router-link :to="'/studentDetails/' + student._id">تفاصيل</router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="logss" dir="rtl">
      <h3 class="heading">
        سجل حضور الطلاب (<span
          style="cursor: pointer"
          @click="() => (student_log = groupAttendanceLog)"
          >الكل</span
        >)
      </h3>
      <logs :logs="student_log" model="students" />
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Logs from "../components/logs.vue";
export default {
  components: {
    Logs,
  },
  created() {
    this.group = this.groups.find((g) => g._id === this.$route.params.id);
    this.group_students = this.students.filter((g) => g.groups.includes(this.group._id));
    axios.get("getGroupAttendanceLog/" + this.$route.params.id).then((res) => {
      this.groupAttendanceLog = res.data.log;
      this.student_log = res.data.log;
    });
  },
  data() {
    return {
      group: null,
      group_students: [],
      groupAttendanceLog: [],
      student_log: [],
    };
  },
  computed: {
    groups() {
      return this.$store.getters.groups;
    },
    students() {
      return this.$store.getters.students;
    },
  },
  watch: {
    groups(val) {
      this.group = val.find((g) => g._id === this.$route.params.id);
    },
    students(val) {
      this.group_students = val.filter((g) => g.groups.includes(this.group._id));
    },
  },
  methods: {
    getStudentLog(id) {
      this.student_log = this.groupAttendanceLog.filter((gal) => gal.studentId === id);
    },
    attended(id) {
      return this.groupAttendanceLog.filter((gal) => gal.studentId === id).length;
    },
  },
};
</script>
<style scoped lang="scss">
.group,
.student {
  div {
    margin: 5px 0;
    p {
      display: inline;
    }
  }
}
.student {
  padding: 4px 0;
  cursor: pointer;
  &:nth-child(odd) {
    background: rgb(179, 177, 177);
  }
}
</style>
