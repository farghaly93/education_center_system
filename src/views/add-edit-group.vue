<template>
  <div class="container-register">
    <h3 class="text-center">
      {{ method == "edit" ? "تعديل بيانات المجموعة" : "اضافة مجموعة جديدة" }}
    </h3>
    <hr />
    <br /><br /><br />
    <div class="row">
      <div class="col-md-6">
        <img
          src="../../src/assets/imgs/group.jpg"
          class="img-fluid"
          alt=""
          width="600"
          height="auto"
        />
      </div>
      <div class="col-md-6 bg-light">
        <div class="form">
          <h3 class="register-heading">تأكد من صحة البيانات المدخلة</h3>
          <hr />
          <div class="row register-form g-3">
            <div class="col-md-6">
              <div class="form-group">
                <label>رقم المجموعة</label>
                <input
                  class="form-control"
                  v-model="number"
                  :counter="10"
                  placeholder="رقم المجموعة"
                  required
                  @input="$v.number.$touch()"
                  @blur="$v.number.$touch()"
                />
                <p class="error-msg" v-for="err in numberErrors" :key="err">
                  {{ err }}
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label>اسم المدرس</label>
                <input
                  class="form-control"
                  v-model="teacherName"
                  placeholder="اسم المدرس"
                  required
                  @input="$v.teacherName.$touch()"
                  @blur="$v.teacherName.$touch()"
                />
                <p class="error-msg" v-for="err in teacherNameErrors" :key="err">
                  {{ err }}
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label>المرحلة الدراسية</label>
                <select
                  id="stage"
                  class="form-control"
                  v-model="stage"
                  :counter="10"
                  required
                  @input="$v.stage.$touch()"
                  @blur="$v.stage.$touch()"
                >
                  <option disabled>السنة الدراسية</option>
                  <option value="1">الصف الأول الثانوي</option>
                  <option value="2">الصف الثاني الثانوي</option>
                  <option value="3">الصف الثالث الثانوي</option>
                </select>
                <p class="error-msg" v-for="err in stageErrors" :key="err">{{ err }}</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label>تليفون المدرس</label>
                <input
                  class="form-control"
                  v-model="teacherPhone"
                  placeholder="تليفون المدرس"
                  required
                  @input="$v.teacherPhone.$touch()"
                  @blur="$v.teacherPhone.$touch()"
                />
                <p class="error-msg" v-for="err in teacherPhoneErrors" :key="err">
                  {{ err }}
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label>المادة</label>
                <select
                  id="stage"
                  class="form-control"
                  v-model="subject"
                  :counter="10"
                  required
                  @input="$v.subject.$touch()"
                  @blur="$v.subject.$touch()"
                >
                  <option v-for="subject in subjects" :key="subject" :value="subject">
                    {{ subject }}
                  </option>
                </select>
                <p class="error-msg" v-for="err in subjectErrors" :key="err">{{ err }}</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label>اليوم</label>
                <select
                  id="day"
                  class="form-control"
                  v-model="day"
                  :counter="10"
                  required
                  @input="$v.day.$touch()"
                  @blur="$v.day.$touch()"
                >
                  <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
                </select>
                <p class="error-msg" v-for="err in dayErrors" :key="err">{{ err }}</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label>من الساعة</label>
                <select
                  id="timeFrom"
                  class="form-control"
                  v-model="timeFrom"
                  :counter="10"
                  required
                  @input="$v.timeFrom.$touch()"
                  @blur="$v.timeFrom.$touch()"
                >
                  <option v-for="time in times" :key="time" :value="time">
                    {{ time }}
                  </option>
                </select>
                <p class="error-msg" v-for="err in timeFromErrors" :key="err">
                  {{ err }}
                </p>
              </div>
            </div>
            <hr />
            <div class="col-12">
              <app-loading v-if="loading" />
              <div v-if="success" class="success">{{ success }}</div>
              <div v-if="error" class="error">{{ error }}</div>
              <button
                @click="submit"
                :disabled="$v.$anyError"
                class="btn btn-primary ml-2 btn-block"
              >
                {{ method == "edit" ? "تعديل البيانات" : "اضافة مجموعة جديدة" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { required, minLength } from "vuelidate/lib/validators";
import loading from "../components/loading.vue";
export default {
  created() {
    const path = this.$router.history.current.path.split("/");
    const params = this.$router.history.current.params;
    this.id = params.id;
    if (path[1] == "editGroup") this.method = "edit";
    else if (path[1] == "addGroup") this.method = "add";
    console.log(this.method);
    if (this.method === "edit") {
      axios.get("/getGroupData/" + this.id).then((res) => {
        const groupData = { ...res.data.groupData };
        delete groupData["_id"];
        this.number = groupData.number;
        this.teacherName = groupData.teacherName;
        this.teacherPhone = groupData.teacherPhone;
        this.stage = groupData.stage;
        this.subject = groupData.subject;
        this.day = groupData.day;
        this.timeFrom = groupData.timeFrom;
      });
    }
  },
  components: {
    appLoading: loading,
  },
  data() {
    return {
      method: "add",
      loading: false,
      id: "",
      number: "",
      teacherName: "",
      teacherPhone: "",
      stage: 3,
      subject: "فيزياء",
      day: "saturday",
      timeFrom: "1pm",
      success: null,
      error: null,

      // groupData: {},
      days: [
        "saturday",
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
      ],
      times: [
        "1pm",
        "2pm",
        "3pm",
        "4pm",
        "5pm",
        "6pm",
        "7pm",
        "8pm",
        "9pm",
        "10pm",
        "11pm",
        "12pm",
        "1am",
        "2am",
        "3am",
        "4am",
        "5am",
        "6am",
        "7am",
        "8am",
        "9am",
        "10am",
        "11am",
        "12am",
      ],
    };
  },
  validations: {
    number: {
      required,
    },
    teacherName: {
      required,
      minLen: minLength(6),
    },
    teacherPhone: {
      required,
      minLen: minLength(11),
    },
    stage: {
      required,
    },
    subject: {
      required,
      minLen: minLength(2),
    },
    day: {
      required,
    },
    timeFrom: {
      required,
    },
  },
  computed: {
    subjects() {
      return this.$store.getters.subjects;
    },
    numberErrors() {
      const errors = [];
      console.log(this.$v.number);
      if (!this.$v.number.$dirty) return errors;
      !this.$v.number.required && errors.push("رقم المجموعة مطلوب");
      return errors;
    },
    teacherNameErrors() {
      const errors = [];
      if (!this.$v.teacherName.$dirty) return errors;
      !this.$v.teacherName.required && errors.push("اسم المدرس مطلوب");
      !this.$v.teacherName.minLen && errors.push("الاسم قصير");
      return errors;
    },
    teacherPhoneErrors() {
      const errors = [];
      if (!this.$v.teacherPhone.$dirty) return errors;
      !this.$v.teacherPhone.required && errors.push("تليفون المدرس مطلوب");
      !this.$v.teacherPhone.minLen && errors.push("الرقم قصير");
      return errors;
    },
    stageErrors() {
      const errors = [];
      if (!this.$v.stage.$dirty) return errors;
      !this.$v.stage.required && errors.push("المرحلة الدراسية مطلوبة");
      return errors;
    },
    subjectErrors() {
      const errors = [];
      if (!this.$v.subject.$dirty) return errors;
      !this.$v.subject.required && errors.push("المادة مطلوبة");
      !this.$v.subject.minLen && errors.push("اسم المادة قصير");
      return errors;
    },
    dayErrors() {
      const errors = [];
      if (!this.$v.day.$dirty) return errors;
      !this.$v.day.required && errors.push("اليوم مطلوب");
      return errors;
    },
    timeFromErrors() {
      const errors = [];
      if (!this.$v.timeFrom.$dirty) return errors;
      !this.$v.timeFrom.required && errors.push("وقت المجموعة مطلوب");
      return errors;
    },
  },
  methods: {
    submit() {
      this.loading = true;
      if (this.$v.$anyError) return;
      const groupData = {
        number: this.number,
        teacherName: this.teacherName,
        teacherPhone: this.teacherPhone,
        stage: this.stage,
        subject: this.subject,
        day: this.day,
        timeFrom: this.timeFrom,
      };
      const method = this.method == "edit" ? "/editGroup/" + this.id : "/addGroup";
      axios.post(method, groupData).then((res) => {
        this.loading = false;
        this.success = null;
        this.error = null;
        if (res.data.done) {
          this.success = "تم اضافة المجموعة بنجاح";
        } else {
          this.error = res.data.error.includes("E11000")
            ? "هذه المجموعة موجودة بالفعل"
            : res.data.error;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  direction: rtl;
  text-align: right;
}
.register-heading {
  h3 {
    font-size: 2rem;
    @media (max-width: 500px) {
      font-size: 1rem;
    }
  }
}
.container-register {
  padding: 20px;
  // background: rosybrown;
  @media (max-width: 500px) {
    padding: 60px 2px;
  }
}
.form {
  width: 100%;
  h3 {
    color: rgba(85, 85, 85, 0.782);
  }
  label {
    color: #666;
  }
}
.form-group {
  .error-msg {
    color: #dc3545;
    margin-top: 5px;
    &::before {
      content: "\f06a";
      font: normal normal normal 14px/1;
      font-size: 14px;
      font-size: inherit;
      text-rendering: auto;
      -moz-osx-font-smoothing: grayscale;
      margin-left: 5px;
    }
  }
}

.success,
.error {
  margin: 12px auto;
  padding: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 2px 2px 12px 5px;
  color: #fff;
  font-size: 1.5rem;
}
.success {
  background: rgb(10, 136, 25);
}
.error {
  background: crimson;
}
</style>
