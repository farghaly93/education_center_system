<template>
  <div class="container-register">
    <h3 class="text-center">
      {{ method == "edit" ? "تعديل بيانات الطالب" : "اضافة طالب جديد" }}
    </h3>
    <hr />
    <br /><br /><br />
    <div class="row">
      <div class="col-md-6">
        <img
          src="../../src/assets/imgs/students.svg"
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
                <label>اسم الطالب</label>
                <input
                  class="form-control"
                  v-model="studentName"
                  placeholder="اسم الطالب"
                  required
                  @input="$v.studentName.$touch()"
                  @blur="$v.studentName.$touch()"
                />
                <p class="error-msg" v-for="err in studentNameErrors" :key="err">
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
                <label>تليفون الطالب</label>
                <input
                  class="form-control"
                  v-model="studentPhone"
                  placeholder="تليفون الطالب"
                  required
                  @input="$v.studentPhone.$touch()"
                  @blur="$v.studentPhone.$touch()"
                />
                <p class="error-msg" v-for="err in studentPhoneErrors" :key="err">
                  {{ err }}
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label>عنوان الطالب</label>
                <input
                  class="form-control"
                  v-model="studentAddress"
                  placeholder="عنوان الطالب"
                  required
                  @input="$v.studentAddress.$touch()"
                  @blur="$v.studentAddress.$touch()"
                />
                <p class="error-msg" v-for="err in studentAddressErrors" :key="err">
                  {{ err }}
                </p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label>المجموعات التي يلتحق بها الطالب</label>
                <div class="groups">
                  <div
                    @click="toggleGroup(group._id)"
                    :class="{ choosen: groupsJoined.includes(group._id) }"
                    v-for="group in groups"
                    :key="group.number"
                    class="group"
                  >
                    {{ group.subject }} ({{ group.teacherName }})
                    {{ group.day | arabicDay }}
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div class="col-12">
              <div id="barcode" v-if="barcodeId">
                <barcode :value="barcodeId"> Show this if the rendering fails. </barcode>
              </div>
              <app-loading v-if="loading" />
              <div v-if="success" class="success">{{ success }}</div>
              <div v-if="error" class="error">{{ error }}</div>
              <button
                @click="submit"
                :disabled="$v.$anyError"
                class="btn btn-primary ml-2 btn-block"
              >
                {{ method == "edit" ? "تعديل البيانات" : "اضافة طالب جديد" }}
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
import VueBarcode from "vue-barcode";
import html2canvas from "html2canvas";

export default {
  mounted() {
    html2canvas(document.querySelector("#barcode")).then((canvas) => {
      document.querySelector("#barcode").innerHTML = null;
      document.querySelector("#barcode").appendChild(canvas);
    });
  },
  created() {
    const path = this.$router.history.current.path.split("/");
    if (path[1] == "editStudent") this.method = "edit";
    else if (path[1] == "addStudent") this.method = "add";
    if (this.method === "edit") {
      const params = this.$router.history.current.params;
      this.id = params.id;
      this.barcodeId = params.id.split("").slice(9, 24).join("");
      axios.get("/getStudentData/" + this.id).then((res) => {
        const studentData = { ...res.data.studentData };
        delete studentData["_id"];
        this.studentName = studentData.name;
        this.studentPhone = studentData.phone;
        this.studentAddress = studentData.address;
        this.stage = studentData.stage;
        this.groups = this.$store.getters.groups.filter((g) => g.stage == this.stage);
        this.groupsJoined = studentData.groups;
      });
    }
  },
  components: {
    appLoading: loading,
    barcode: VueBarcode,
  },
  data() {
    return {
      method: "add",
      loading: false,
      id: null,
      barcodeId: null,
      success: null,
      error: null,
      studentName: "",
      studentPhone: "",
      studentAddress: "",
      stage: 3,
      groups: [],
      groupsJoined: [],
    };
  },
  watch: {
    stage(val) {
      this.groups = this.$store.getters.groups.filter((g) => g.stage == val);
    },
  },
  validations: {
    studentName: {
      required,
      minLen: minLength(6),
    },
    studentPhone: {
      required,
      minLen: minLength(11),
    },
    stage: {
      required,
    },
    studentAddress: {
      required,
      minLen: minLength(4),
    },
  },
  computed: {
    studentNameErrors() {
      const errors = [];
      if (!this.$v.studentName.$dirty) return errors;
      !this.$v.studentName.required && errors.push("اسم الطالب مطلوب");
      !this.$v.studentName.minLen && errors.push("الاسم قصير");
      return errors;
    },
    studentPhoneErrors() {
      const errors = [];
      if (!this.$v.studentPhone.$dirty) return errors;
      !this.$v.studentPhone.required && errors.push("رقم الطالب مطلوب");
      !this.$v.studentPhone.minLen && errors.push("رقم التليفون قصير");
      return errors;
    },
    studentAddressErrors() {
      const errors = [];
      if (!this.$v.studentAddress.$dirty) return errors;
      !this.$v.studentAddress.required && errors.push("عنوان الطالب مطلوب");
      !this.$v.studentAddress.minLen && errors.push("العنوان قصير");
      return errors;
    },
    stageErrors() {
      const errors = [];
      if (!this.$v.stage.$dirty) return errors;
      !this.$v.stage.required && errors.push("المرحلة الدراسية مطلوبة");
      return errors;
    },
  },
  methods: {
    submit() {
      this.loading = true;
      if (this.$v.$anyError) return;
      const studentData = {
        name: this.studentName,
        phone: this.studentPhone,
        stage: this.stage,
        address: this.studentAddress,
        groups: this.groupsJoined,
      };
      const method = this.method == "edit" ? "/editStudent/" + this.id : "/addStudent";
      axios.post(method, studentData).then((res) => {
        this.loading = false;
        this.success = null;
        this.error = null;
        if (res.data.done) {
          this.success = "تم اضافة الطالب بنجاح";
          if (res.data.student) {
            console.log(res.data.student._id.split("").slice(9, 24).join(""));
            this.barcodeId = res.data.student._id.split("").slice(9, 24).join("");
          }
        } else {
          this.error = res.data.error.includes("E11000")
            ? "هذا الطالب موجود بالفعل"
            : res.data.error;
        }
      });
    },
    toggleGroup(id) {
      if (!this.groupsJoined.includes(id)) {
        this.groupsJoined.push(id);
      } else {
        const index = this.groupsJoined.findIndex((groupId) => groupId === id);
        this.groupsJoined.splice(index, 1);
      }
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
.groups {
  height: 170px;
  overflow: auto;
  .group {
    cursor: pointer;
    padding: 6px;
    margin: 5px;
    background: #eee;
    &.choosen {
      background: rgb(21, 100, 30);
      color: #fff;
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
