<template>
  <div id="animations-list-container">
    <div style="padding: 0px 5px 5px 0px; box-sizing: border-box">
      <div id="animations-list-title">
        <small>
          <i class="iconfont icon-animation" style="margin-right: 10px"></i>
          <label><b>Animations</b></label></small
        >
        <div><i class="iconfont icon-pen"></i></div>
      </div>
    </div>
    <div id="animations-list-contents">
      <div
        v-for="animation in animations"
        :key="animation.id"
        class="animation-item"
      >
        <small>Animation{{ animation.id }}</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      animations: [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ],
    };
  },
};
</script>

<style>
#animations-list-container {
  display: flex;
  flex-direction: column;
}

#animations-list-contents {
  display: flex;
  flex-direction: column;
}

.animation-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 5px;
  box-sizing: border-box;
  color: #777777;
}

.animation-item:hover {
  color: whitesmoke;
  cursor: pointer;
  background-color: teal;
}

#animations-list-title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid whitesmoke;
  padding: 5px 15px 5px 5px;
  box-sizing: border-box;
}
</style>