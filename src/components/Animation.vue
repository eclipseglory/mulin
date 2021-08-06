<template>
  <div id="animation-main-workspace">
    <div id="animation-drawer-contianer">
      <div style="flex-grow: 1"><Canvas /></div>
      <div style="width: 14.6%; padding: 5px; box-sizing: border-box">
        <property-bar />
      </div>
    </div>
    <div style="padding: 5px; box-sizing: border-box; width: 100%">
      <div class="graybg" style="height: 1px; width: 100%"></div>
    </div>
    <div id="animation-panel">
      <div id="animation-column">
        <animation-list />
      </div>
      <div id="animation-controller-panel" class="darkbg">
        <div style="width: 23.6%"></div>
        <div style="flex-grow: 1">
          <AnimationKeyFrameView />
        </div>
        <div style="width: 14.8%"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Canvas from "./workspace/Canvas.vue";
import PropertyBar from "./property/PropertyBar.vue";
import AnimationList from "./animations/AnimationList.vue";
import AnimationKeyFrameView from "./animations/AnimationKeyFrameView.vue";

const components = {
  Canvas,
  PropertyBar,
  AnimationList,
  AnimationKeyFrameView,
};
export default { components };
</script>

<style>
#animation-main-workspace {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

#animation-controller-panel {
  flex-grow: 1;
  display: flex;
  align-items: stretch;
}

#animation-drawer-contianer {
  display: flex;
  width: 100%;
  height: 61.8%;
}


#animation-column {
  display: flex;
  flex-direction: column;
  width: 14.6%;
  padding: 10px 0px 0px 10px;
  box-sizing: border-box;
}

#animation-panel {
  width: 100%;
  flex-grow: 1;
  display: flex;
  align-items: stretch;
  padding: 5px;
  box-sizing: border-box;
}
</style>