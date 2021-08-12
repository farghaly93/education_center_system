<template>
  <div style="margin: 30px" class="d-flex justify-content-center">
    <div class="spinner-border" role="status"></div>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      default: "#000",
    },
  },
};
</script>
