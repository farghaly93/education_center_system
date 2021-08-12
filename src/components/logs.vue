<template>
  <div>
    <div class="date-filter row p-4">
      <div class="col-md-6">
        <div class="form-group">
          <label>تحديد شهر</label>
          <select v-model="month" class="form-control">
            <option
              v-for="month in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]"
              :key="month"
              :value="month"
            >
              {{ month | arabicMonth }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for="">حدد يوم</label>
          <input class="form-control" type="date" v-model="date" />
        </div>
      </div>
    </div>
    <div class="count px-4">
      <span>عدد مرات الحضور: </span>
      <strong>({{ logsss.length }})</strong>
    </div>
    <div v-if="model == 'students'" class="logs scrollable p-3">
      <div
        v-for="(log, i) in logsss"
        :key="i"
        :style="{
          background: log.isGuest ? '#b33b3b' : '#eee',
          color: log.isGuest ? '#fff' : '#444',
        }"
        class="log row px-3"
      >
        <div
          style="cursor: pointer"
          @click="() => $router.push('/studentDetails/' + log.studentId)"
          class="col-md-3"
        >
          <p>{{ log.studentId | student("name") }}</p>
        </div>
        <div class="col-md-3">
          <p>{{ log.studentId | student("phone") }}</p>
        </div>
        <div class="col-md-4">
          <p>{{ log.date | date }}</p>
        </div>
        <div class="col-md-2">
          <p style="color: green">{{ isExam(log.groupId, log.date) }}</p>
        </div>
      </div>
    </div>
    <div v-if="model == 'groups'" class="logs scrollable p-3">
      <div
        v-for="(log, i) in logsss"
        :key="i"
        :style="{
          background: log.isGuest ? '#b33b3b' : '#eee',
          color: log.isGuest ? '#fff' : '#444',
        }"
        class="log row px-3"
      >
        <div
          style="cursor: pointer"
          @click="() => $router.push('/groupDetails/' + log.groupId)"
          class="col-md-2"
        >
          <span>المجموعة رقم </span>
          <p>{{ log.groupId | group("number") }}</p>
        </div>
        <div class="col-md-2">
          <p>{{ log.groupId | group("subject") }}</p>
        </div>
        <div class="col-md-3">
          <p>{{ log.groupId | group("teacherName") }}</p>
        </div>
        <div class="col-md-3">
          <p>{{ log.date | date }}</p>
        </div>
        <div class="col-md-2">
          <p style="color: green">{{ isExam(log.groupId, log.date) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatDate } from "../functions";
import axios from "axios";
export default {
  props: ["model", "logs"],
  data() {
    return {
      month: "",
      date: null,
      logss: [],
      logsss: [],
      exams: [],
    };
  },
  created() {
    this.logss = this.logs;
    this.logsss = this.logs;
    axios.get("/getExams").then((res) => {
      this.exams = res.data.exams;
    });
  },
  watch: {
    logs(val) {
      this.logss = val;
      this.logsss = val;
    },
    month(val) {
      this.logsss = this.logss.filter((log) => {
        return new Date(log.date).getMonth() == val;
      });
    },
    date(val) {
      this.logsss = this.logss.filter((log) => {
        return formatDate(log.date) == val;
      });
    },
  },
  methods: {
    isExam(groupId, date) {
      const index = this.exams.findIndex((ex) => {
        if (
          ex.groupId === groupId &&
          new Date(ex.date).getDate() == new Date(date).getDate() &&
          new Date(ex.date).getMonth() == new Date(date).getMonth()
        )
          return true;
      });
      if (index > -1) {
        console.log("matched");

        return "امتحان";
      } else return "";
    },
  },
};
</script>
<style scoped lang="scss">
.logs {
  .log {
    padding: 6px 0;
    border: 2px solid #555;
    margin: 7px 0;
    p {
      display: inline;
    }
  }
}
</style>
