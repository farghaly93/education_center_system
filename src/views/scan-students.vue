<template>
  <div style="position: relative">
    <audio style="display: none" id="beep1" ref="beep1" controls>
      <source
        :src="'https://www.soundjay.com/misc/censor-beep-01.mp3'"
        type="audio/mp3"
      />
    </audio>
    <audio style="display: none" id="beep2" ref="beep2" controls>
      <source
        :src="'https://res.cloudinary.com/farghaly-developments/video/upload/v1627542604/access-granted_phnfgu.mp3'"
        type="audio/mp3"
      />
    </audio>
    <audio style="display: none" id="beep3" ref="beep3" controls>
      <source
        :src="'https://res.cloudinary.com/farghaly-developments/video/upload/v1627542604/access-denied_pxtxyq.mp3'"
        type="audio/mp3"
      />
    </audio>
    <div class="scanner">
      <h1 class="text-center p-2">فحص صلاحية دخول الطلاب</h1>
      <p class="text-center">
        ضع الباركود في المكان او المسافة المناسبة ولا تنسى ظبط فوكاس الكاميرا
      </p>

      <div class="insert bg-dark mx-auto w-70 p-4 row">
        <!-- <h4 class="text-center">أو قم بالفحص عن طريق ادخال ID الطالب مبشارة</h4> -->
        <div class="col-md-10">
          <input
            @keydown="
              (e) => {
                if (e.keyCode == '13') checkStudentIdManually();
              }
            "
            v-model="insertedId"
            type="text"
            class="form-control"
            placeholder="أو قم بأدخال رقم الطالب مباشرة"
            dir="rtl"
          />
        </div>
        <div class="col-md-2">
          <button
            :disabled="!insertedId"
            @click="checkStudentIdManually"
            class="btn btn-primary"
          >
            فحص
          </button>
        </div>
      </div>

      <hr />
      <div v-if="ready" class="scanner-cont">
        <div class="camera">
          <StreamBarcodeReader
            @decode="onDecode"
            @loaded="onLoaded"
          ></StreamBarcodeReader>
        </div>
        <div v-if="!loaded" class="center">
          <loading />
        </div>
      </div>
    </div>
    <div v-if="!ready" class="report">
      <div :class="{ granted: accessGranted }" class="report-cont">
        <h2
          v-if="accessGranted"
          class="text-center p-2"
          style="background: #246b2ee3; color: #fff"
        >
          تم منح الأذن
        </h2>
        <h2
          v-if="!accessGranted"
          class="text-center p-2"
          style="background: #cc3030fc; color: #fff"
        >
          غير مصرح للطالب
        </h2>
        <hr />
        <div v-if="!noStudent" class="data" dir="rtl">
          <div class="student-info">
            <h3 class="heading">معلومات الطالب</h3>
            <div class="info">
              <div>
                <span>الأسم: </span>
                <p>{{ studentInfo.name }}</p>
              </div>
              <div>
                <span>التليفون: </span>
                <p>{{ studentInfo.phone }}</p>
              </div>
              <div>
                <span>العنوان: </span>
                <p>{{ studentInfo.address }}</p>
              </div>
              <div>
                <span>السنة الدراسية: </span>
                <p>
                  {{ studentInfo.stage | stage }}
                </p>
              </div>
            </div>
          </div>
          <hr />
          <div class="groups-info">
            <h3 class="heading">المجموعات الملتحق بها الطالب</h3>
            <div class="info">
              <div v-for="group in groupsInfo" :key="group._id" class="group-info">
                <div class="sub-heading">
                  <span>مجموعة رقم </span>
                  <p>{{ group.number }}</p>
                </div>
                <div>
                  <span>اسم المدرس: </span>
                  <p>{{ group.teacherName }}</p>
                </div>
                <div>
                  <span>المادة: </span>
                  <p>{{ group.subject }}</p>
                </div>
                <div>
                  <span>السنة الدراسية: </span>
                  <p>{{ group.stage | stage }}</p>
                </div>
                <div>
                  <span>اليوم: </span>
                  <p>{{ group.day }}</p>
                </div>
                <div>
                  <span>المجموعة من الساعة: </span>
                  <p>{{ group.timeFrom }}</p>
                </div>
                <div>
                  <span>تليفون المدرس: </span>
                  <p>{{ group.teacherPhone }}</p>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div class="today-groups">
            <h3 class="heading">المجموعات المقررة اليوم للطالب</h3>
            <div v-if="accessGranted" class="groups">
              <div
                :class="{ choosen: choosenGroups.includes(group) }"
                class="group"
                @click="chooseGroup(group)"
                v-for="group in studentTodayGroups"
                :key="group"
              >
                {{ readGroup(group) }}
              </div>
            </div>
            <div v-if="!accessGranted" class="groups">
              <div
                :class="{ choosen: choosenGroups.includes(group) }"
                class="group"
                @click="chooseGroup(group)"
                v-for="group in todayGroups"
                :key="group"
              >
                {{ readGroup(group) }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="noStudent" :class="{ granted: accessGranted }" class="data">
          <h2 style="color: #fff" class="text-center">هذا الطالب غير ملتحق هنا</h2>
          <div v-if="noStudent" style="">
            <button
              style="color: #fff"
              @click="refuse"
              class="btn btn-primary w-100"
              type="submit"
            >
              استكمال
            </button>
          </div>
        </div>
        <hr />
        <div v-if="!noStudent" class="options p-1" dir="rtl">
          <div v-if="attendError" class="error">{{ attendError }}</div>
          <div class="btns d-flex justify-content-around flex-wrap">
            <button @click="accept" class="btn btn-success m-1" type="submit">
              السماح للطالب
            </button>
            <button @click="refuse" class="btn btn-danger m-1" type="submit">
              عدم السماح للطالب
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { StreamBarcodeReader } from "vue-barcode-reader";
import axios from "axios";
import Loading from "../components/loading";
export default {
  created() {
    this.$store.dispatch("getTodayGroups");
  },
  components: {
    StreamBarcodeReader,
    Loading,
  },
  data() {
    return {
      audio: "",
      ready: true,
      accessGranted: true,
      noStudent: false,
      studentInfo: {},
      groupsInfo: [],
      choosenGroups: [],
      studentTodayGroups: [],
      attendError: null,
      loaded: false,
      insertedId: null,
    };
  },
  computed: {
    todayGroups() {
      return this.$store.getters.todayGroups;
    },
    students() {
      return this.$store.getters.students;
    },
    groups() {
      return this.$store.getters.groups;
    },
  },
  watch: {
    todayGroups(val) {
      console.log(val);
    },
    studentTodayGroups(val) {
      this.choosenGroups = [...val];
    },
  },
  methods: {
    onDecode(result) {
      if (!this.ready) return;
      console.log(result);
      this.studentInfo = {};
      this.groupsInfo = [];
      this.audio = "../assets/audio/beep.mp3";
      const beep1 = document.getElementById("beep1");
      const beep2 = document.getElementById("beep2");
      const beep3 = document.getElementById("beep3");
      beep1.play();
      this.ready = false;
      this.loaded = false;
      const student = this.students.filter(
        (std) => std._id.split("").slice(9, 24).join("") === result
      );
      if (student.length < 1) {
        this.accessGranted = false;
        this.noStudent = true;
        beep3.play();
      } else {
        this.studentInfo = student[0];
        const groupsJoined = student[0].groups;
        groupsJoined.forEach((groupId) => {
          const groupInfo = this.groups.find((g) => g._id === groupId);
          this.groupsInfo.push(groupInfo);
        });
        this.noStudent = false;
        this.studentTodayGroups = this.todayGroups.filter((g) =>
          this.studentInfo.groups.includes(g)
        );
        let matched = false;
        groupsJoined.forEach((gj) => {
          if (this.todayGroups.includes(gj)) matched = true;
        });
        if (matched) {
          beep2.play();
          this.accessGranted = true;
          beep2.play();
        } else {
          this.accessGranted = false;
          beep3.play();
        }
      }
    },
    onLoaded() {
      console.log("loaded");
      this.loaded = true;
    },
    accept() {
      this.attendError = null;
      const body = {
        studentId: this.studentInfo._id,
        choosenGroups: this.choosenGroups,
        date: new Date().getTime(),
      };
      this.accessGranted ? (body["isGuest"] = false) : (body["isGuest"] = true);
      if (!this.studentInfo._id || this.choosenGroups.length < 1) return;
      axios.post("/attendStudent", body).then((res) => {
        if (res.data.done) {
          this.ready = true;
        } else {
          this.attendError = res.data.error;
          const beep3 = document.getElementById("beep3");
          beep3.play();
        }
      });
    },
    refuse() {
      this.attendError = null;
      this.ready = true;
    },
    readGroup(gId) {
      const group = this.groups.find((g) => g._id === gId);
      return group.subject + "(" + group.teacherName + ")";
    },
    chooseGroup(gId) {
      if (!this.choosenGroups.includes(gId)) {
        this.choosenGroups.push(gId);
      } else {
        const i = this.choosenGroups.findIndex((chg) => chg === gId);
        this.choosenGroups.splice(i, 1);
      }
    },
    checkStudentIdManually() {
      if (!this.insertedId) return;
      this.onDecode(this.insertedId);
    },
  },
};
</script>
<style lang="scss">
h2 {
  color: #fff;
}
.scanner {
  .scanner-cont {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 500px;
    padding: 20px;
    background: #17171787;

    .camera {
      max-width: 635px;
    }
  }
}
.report {
  z-index: 4000;
  position: fixed;
  top: 0;
  left: 0;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  width: 100vw;
  height: 100vh;
  background: rgba(48, 47, 47, 0.565);
}
.report-cont {
  box-shadow: 2px 2px 12px 12px #444;
  width: 90%;
  height: 90vh;
  overflow: auto;
  padding: 10px 30px;
  margin: 0px auto;
  margin-top: 2%;
  background: #fd6767e9;
  &.granted {
    background: rgba(76, 153, 104, 0.782);
  }
  .data {
    background: rgba(45, 46, 46, 0.51);
    padding: 10px;
    .today-groups {
      .groups {
        .group {
          margin: 10px;
          cursor: pointer;
          width: auto;
          padding: 5px;
          background: rgba(78, 76, 76, 0.688);
          color: #fff;
          &.choosen {
            background: #235253de;
          }
        }
      }
    }
  }
}
.info {
  div {
    background: rgba(85, 85, 85, 0.184);
    padding: 3px;
    margin: 8px 0;
    &.sub-heading {
      background: rgba(211, 209, 209, 0.85);
      color: rgb(63, 62, 62);
      padding: 7px;
      font-size: 1.4rem;
      span,
      p {
        color: #666;
      }
    }
    p {
      display: inline;
      color: rgb(223, 230, 230);
      font-weight: 500;
      font-size: 1.2rem;
    }
    span {
      font-weight: 800;
      color: rgb(201, 193, 193);
    }
  }
}

.group-info {
  padding: 13px;
  border-bottom: 3px solid #444;
}

.options {
  background: #fff;
  padding: 15px;
  button {
    color: #fff;
  }
}
</style>
