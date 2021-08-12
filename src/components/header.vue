<template>
  <nav class="navbar navbar-dark bg-dark navbar-expand-lg fixed-top">
    <div class="container-fluid d-flex justify-content-between">
      <div>
        <a class="navbar-brand">Center System</a>
        <button
          type="button"
          class="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsiveExtraLarge"
          aria-controls="navbarResponsiveExtraLarge"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
      <div class="collapse navbar-collapse" id="navbarResponsiveExtraLarge" dir="rtl">
        <ul class="navbar-nav" dir="rtl">
          <li class="nav-item">
            <a
              @click="() => $router.push('/')"
              class="nav-link active"
              aria-current="page"
              >فحص تصريح الطلاب</a
            >
          </li>
          <li class="nav-item">
            <a
              @click="() => $router.push('/students')"
              class="nav-link active"
              aria-current="page"
              >الطلاب</a
            >
          </li>
          <li class="nav-item">
            <a
              @click="() => $router.push('/groups')"
              class="nav-link active"
              aria-current="page"
              >المجموعات</a
            >
          </li>
          <li class="nav-item">
            <a
              @click="() => $router.push('/addGroup')"
              class="nav-link active"
              aria-current="page"
              >اضافة مجموعة جديدة</a
            >
          </li>
          <li class="nav-item">
            <a
              @click="() => $router.push('/addStudent')"
              class="nav-link active"
              aria-current="page"
              >اضافة طالب جديد</a
            >
          </li>
          <li class="nav-item">
            <a
              @click="() => $router.push('/exams')"
              class="nav-link active"
              aria-current="page"
              >الامتحانات</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  created() {
    const path = this.$route;
    console.log(path);
  },
};
</script>
<style scoped lang="scss">
.cont {
}
a {
  cursor: pointer;
}
</style>
