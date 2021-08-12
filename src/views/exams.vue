<template>
  <div>
    <div class="exams" dir="rtl">
      <h3 class="heading text-center">الامتحانات({{ exams.length }})</h3>
      <div class="filters bg-dark p-2 row">
        <div class="col-md-6">
          <div class="form-group">
            <label>اختر المجموعة</label>
            <select v-model="group" class="form-control">
              <option selected value="">كل المجموعات</option>
              <option v-for="group in groups" :key="group._id" :value="group._id">
                <span>{{ group.subject }} </span>
                <span>{{ group.stage | stage }} </span>
                <span>({{ group.teacherName }}) </span>
                <span>{{ group.day | arabicDay }}</span>
              </option>
            </select>
          </div>
        </div>
        <div class="col-md-3">
          <label>حدد تاريخ الامتحان</label>
          <input v-model="date" type="date" class="form-control" />
        </div>
        <div class="col-md-3 d-flex align-items-end">
          <button @click="date = null" class="btn btn-outline-info">كل الأيام</button>
        </div>
      </div>
      <hr />
      <div v-if="filteredExams.length < 1" class="no-exams">
        <h3 class="text-center">لا يوجد امتحانات</h3>
      </div>
      <div class="scrollable p-3 my-4">
        <div v-for="(exam, i) in filteredExams" :key="exam._id" class="exam row px-3">
          <div class="col-md-1">
            {{ i + 1 }}
          </div>
          <div @click="getStudents(exam.groupId, exam.date)" class="col-md-2">
            <span>مجموعة رقم</span>
            <p>{{ exam.groupId | group("number") }}</p>
          </div>
          <div class="col-md-2">
            <p>{{ exam.groupId | group("subject") }}</p>
          </div>
          <div class="col-md-2">
            <p>{{ exam.groupId | group("teacherName") }}</p>
          </div>
          <div class="col-md-2">
            <span>يوم </span>
            <p>{{ exam.groupId | group("day") | arabicDay }}</p>
          </div>
          <div class="col-md-2">
            <p>{{ exam.date }}</p>
          </div>
          <div class="col-md-1">
            <p @click="remove(exam._id)">ازالة</p>
          </div>
        </div>
      </div>
      <hr />
    </div>

    <div class="m-4">
      <h3 class="heading text-center">الطلاب الملتحقين بالمجموعة</h3>
      <div class="bg-dark p-2" dir="rtl">
        <div class="form-group">
          <label>ابحث عن الطالب </label>
          <input
            @input="searchStudents"
            type="text"
            class="form-control"
            style="width: 40%"
            placeholder="ابحث عن الطالب بالأسم او التليفون او المستوى وا العنوان"
          />
        </div>
      </div>
      <div class="indicators" dir="rtl">
        <div>
          <div class="green"></div>
          <span>حاضر</span>
        </div>
        <div>
          <div class="blue"></div>
          <span>متغيب</span>
        </div>
      </div>
      <div class="scrollable p-3 my-4" dir="rtl">
        <div
          :class="{ attended: attendedStudents.includes(student._id) }"
          v-for="(student, i) in filteredStudents"
          :key="student._id"
          class="student row px-3"
        >
          <div class="col-md-1">
            {{ i + 1 }}
          </div>
          <div
            style="cursor: pointer"
            @click="() => $router.push('/studentDetails/' + student._id)"
            class="col-md-3"
          >
            <p>{{ student.name }}</p>
          </div>
          <div class="col-md-2">
            <p>{{ student.phone }}</p>
          </div>
          <div class="col-md-3">
            <p>{{ student.address }}</p>
          </div>
          <div class="col-md-3">
            <p>{{ student.stage | stage }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="add-exam m-4" dir="rtl">
      <h3 class="heading text-center">اضافة امتحان</h3>
      <div class="bg-dark p-4 row">
        <div class="col-md-6">
          <div class="form-group">
            <label>اختر المجموعة</label>
            <select v-model="choosenGroup" class="form-control">
              <option selected value="">اختر مجموعة</option>
              <option v-for="group in groups" :key="group._id" :value="group._id">
                <span>{{ group.subject }} </span>
                <span>{{ group.stage | stage }} </span>
                <span>({{ group.teacherName }}) </span>
                <span>{{ group.day | arabicDay }}</span>
              </option>
            </select>
          </div>
        </div>
        <div class="col-md-3">
          <label>حدد تاريخ الامتحان</label>
          <input v-model="choosenDate" type="date" class="form-control" />
        </div>
        <div class="col-md-3 d-flex justify-content-center align-items-end">
          <button
            :disabled="!choosenGroup || !choosenDate"
            @click="addExam"
            class="btn btn-primary"
            style="width: 90%"
          >
            اضف الامتحان
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { formatDate } from "../functions";
import axios from "axios";
export default {
  created() {
    this.$store.dispatch("getExams");
  },
  data() {
    return {
      group: null,
      date: null,
      choosenGroup: null,
      choosenDate: null,
      filteredExams: [],
      groupStudents: [],
      filteredStudents: [],
      attendedStudents: [],
    };
  },
  computed: {
    exams() {
      return this.$store.getters.exams;
    },
    groups() {
      return this.$store.getters.groups;
    },
    students() {
      return this.$store.getters.students;
    },
  },
  watch: {
    group() {
      this.filterExams();
    },
    date() {
      this.filterExams();
    },
    exams(val) {
      this.filteredExams = val;
    },
  },
  methods: {
    addExam() {
      if (!this.choosenGroup || !this.choosenDate) return;
      axios
        .post("/addExam", { groupId: this.choosenGroup, date: this.choosenDate })
        .then((res) => {
          this.filteredExams.push(res.data.exam);
        });
    },
    remove(id) {
      const confirmed = confirm("مسح الامتحان نهائيا...");
      if (!confirmed) return;
      axios.get("/deleteExam/" + id).then((res) => {
        if (res.data.done) {
          this.filteredExams.splice(
            this.filteredExams.findIndex((fe) => fe._id === id),
            1
          );
        }
      });
    },
    getStudents(groupId, date) {
      this.groupStudents = this.students.filter((fs) => fs.groups.includes(groupId));
      this.filteredStudents = [...this.groupStudents];
      axios.get("/getGroupAttendanceLogByDate/" + groupId + "/" + date).then((res) => {
        this.attendedStudents = res.data.log.map((log) => log.studentId);
      });
    },
    searchStudents(event) {
      const val = event.target.value;
      if (val == null) {
        this.filteredStudents = [...this.groupStudents];
        return;
      }
      this.filteredStudents = this.groupStudents.filter((st) => {
        if (
          st.name.toString().includes(val) ||
          st.phone.toString().includes(val) ||
          st.address.toString().includes(val) ||
          st.stage.toString().includes(val)
        )
          return true;
      });
    },
    filterExams() {
      this.filteredExams = this.exams.filter((ex) => {
        let matched = true;
        if (this.group != "") {
          console.log("not empty");
          matched = false;
          if (ex.groupId === this.group) matched = true;
        }
        if (this.date != null) {
          matched = false;
          if (ex.date === this.date) matched = true;
        }
        return matched;
      });
    },
  },
};
</script>
<style scoped lang="scss">
label {
  color: #fff;
}
.exam {
  div {
    margin: 5px 0;
    p {
      display: inline;
    }
  }
}
.exam {
  padding: 4px 0;
  cursor: pointer;
  &:nth-child(odd) {
    background: rgb(179, 177, 177);
  }
}
.student {
  background: rgba(42, 88, 110, 0.844);
  color: #fff;
  margin: 5px 0;
  padding: 2px;
}
.attended {
  background: rgba(30, 92, 30, 0.762);
}
.indicators {
  margin-top: 8px;
  div {
    display: flex;
    span {
      margin-right: 5px;
      color: #666;
    }
  }
}
.green {
  width: 20px;
  height: 20px;
  background: rgba(30, 92, 30, 0.762);
}

.blue {
  width: 20px;
  height: 20px;
  background: rgba(42, 88, 110, 0.844);
}
</style>
