<template>
  <div>
    <div v-if="!ready" class="loading">
      <loading />
    </div>
    <div v-if="ready">
      <app-header />
      <div class="page">
        <router-view></router-view>
      </div>
      <app-footer />
    </div>
  </div>
</template>

<script>
import Loading from "./components/loading";
import Header from "./components/header";
import Footer from "./components/footer";
export default {
  name: "App",
  created() {
    this.$store.dispatch("getGroups");
  },
  components: {
    appHeader: Header,
    Loading,
    appFooter: Footer,
  },

  data: () => ({
    ready: false,
  }),
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
      if (val.length > 0) {
        this.$store.dispatch("getStudents");
      }
    },
    students(val) {
      if (val.length > 0) {
        this.ready = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  font-family: "Cairo";
}
.page {
  padding-top: 70px;
  padding-bottom: 70px;
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.599);
  display: flex;
  justify-content: center;
  align-items: center;
}
button {
  color: #fff;
}
</style>
