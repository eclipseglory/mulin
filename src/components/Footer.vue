<template>
  <div id="footer" class="bluebg">
    <div>
      <small>{{ tooltip }}</small>
    </div>
    <div>
      <small>v0.0.1</small>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
  props: {
    tooltip: {
      type: String,
      default: "NONE",
    },
  },
};
</script>

<style>
#footer {
  width: 100%;
  padding: 0px 20px 0px 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  color: #dddddd;
}
</style>