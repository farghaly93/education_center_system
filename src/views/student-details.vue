<template>
  <div>
    <h1 class="text-center">معلومات الطالب</h1>
    <hr />
    <div v-if="student" class="group" dir="rtl">
      <h3 class="heading">
        {{ student.name }}
      </h3>
      <div class="row">
        <div class="col-md-6">
          <div class="details p-4">
            <div>
              <div class="prop">رقم التليفون:</div>
              <p>{{ student.phone }}</p>
            </div>
            <div>
              <div class="prop">العنوان:</div>
              <p>{{ student.address }}</p>
            </div>
            <div>
              <div class="prop">السنة الدراسية:</div>
              <p>{{ student.stage | stage }}</p>
            </div>
            <hr />
            <div>
              <button
                @click="() => $router.push('/editStudent/' + student._id)"
                class="btn btn-primary"
              >
                تعديل بيانات الطالب
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <barcode :value="barcodeId"> Show this if the rendering fails. </barcode>
        </div>
      </div>
    </div>
    <div class="scrollable" dir="rtl">
      <h3 class="heading">المجموعات الملتحق بها الطالب ({{ student_groups.length }})</h3>
      <div class="p-3">
        <div
          v-for="(group, i) in student_groups"
          :key="group._id"
          @click="getStudentLog(group._id)"
          class="student row px-3"
        >
          <div class="col-md-1">
            {{ i + 1 }}
          </div>
          <div class="col-md-2">
            <span>مجموعة رقم</span>
            <p>({{ group.number }})</p>
          </div>
          <div class="col-md-2">
            <p>{{ group.subject }}</p>
          </div>
          <div class="col-md-2">
            <p>{{ group.stage | stage }}</p>
          </div>
          <div class="col-md-2">
            <p>{{ group.teacherName }}</p>
          </div>
          <div class="col-md-2">
            <p>تم الحضور ({{ attended(group._id) }}) مرات</p>
          </div>
          <div class="col-md-1">
            <router-link :to="'/groupDetails/' + group._id">تفاصيل</router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="logss" dir="rtl">
      <h3 class="heading">
        سجل حضور الطالب (<span
          style="cursor: pointer"
          @click="() => (student_log = studentAttendanceLog)"
          >الكل</span
        >)
      </h3>
      <div class="p-3">
        <logs model="groups" :logs="student_log" />
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import VueBarcode from "vue-barcode";
import Logs from "../components/logs";

export default {
  components: {
    barcode: VueBarcode,
    Logs,
  },
  created() {
    this.student = this.students.find((s) => s._id === this.$route.params.id);
    this.barcodeId = this.$route.params.id.split("").slice(9, 24).join("");

    this.student_groups = this.groups.filter((g) => this.student.groups.includes(g._id));

    axios.get("/getStudentAttendanceLog/" + this.$route.params.id).then((res) => {
      this.studentAttendanceLog = res.data.log;
      this.student_log = res.data.log;
    });
  },
  data() {
    return {
      student: null,
      student_groups: [],
      studentAttendanceLog: [],
      student_log: [],
      barcodeId: "",
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
      this.student_groups = val.filter((g) => this.student.groups.includes(g._id));
    },
    students(val) {
      this.student = val.find((s) => s._id === this.$route.params.id);
      this.barcodeId = this.$route.params.id.split("").slice(9, 24).join("");
    },
  },
  methods: {
    getStudentLog(id) {
      this.student_log = this.studentAttendanceLog.filter((sal) => sal.groupId === id);
    },
    attended(id) {
      return this.studentAttendanceLog.filter((sal) => sal.groupId === id).length;
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
