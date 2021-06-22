<template>
  <div class="resource-root blackbg">
    <div class="resource-header">
      <small>
        <i class="iconfont icon-document" style="margin-right: 5px"></i
        ><span style="font-weight: bold">Resources</span>
      </small>
    </div>
    <div
      style="
        background-color: #777777;
        height: 1px;
        margin-top: 5px;
        margin-bottom: 10px;
      "
    ></div>
    <div class="resource-content">
      <div
        v-for="(img, index) in images"
        :id="'img_res_' + index"
        :key="img.name"
        :title="img.name"
        style="
          width: 100%;
          white-space: nowrap;
          text-align: left;
          text-overflow: ellipsis;
        "
        draggable="true"
        @dragstart="dragStart"
        class="image-resource-item"
      >
        <img
          class="preview-image"
          :src="img.dataUrl"
          style="margin-right: 5px"
        />
        <small
          ><label> {{ img.name }}</label></small
        >
      </div>

      <!-- <tree-node
        v-for="node in documentChildren"
        v-bind:key="node.id"
        :model="node"
      /> -->
    </div>
  </div>
</template>

<script>
import docstoremapper from "../../store/doc-store-mapper";
export default {
  mixins: [docstoremapper],
  methods: {
    dragStart(event) {
      let id = event.target.id;
      if (!id) return;
      let index = id.substring(8);
      let img = this.images[index];
      if (!img) return;
      event.dataTransfer.setData("imageIndex", index);
      event.dataTransfer.dropEffect = "link";
    },
  },
};
</script>

<style>
.resource-root {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 5px 20px 5px 20px;
  box-sizing: border-box;
}

.preview-image {
  width: 1.5em;
  height: 1.5em;
  object-fit: contain;
  border: 1px solid whitesmoke;
}

.image-resource-item {
  display: flex;
  padding: 5px;
  box-sizing: border-box;
}

.resource-header {
  box-sizing: border-box;
  color: whitesmoke;
  text-align: left;
}

.resource-content {
  flex-grow: 1;
  width: 100%;
  max-width: 100%;
  overflow: scroll;
  box-sizing: border-box;
  padding: 5px 0px 5px 0px;
  display: flex;
  flex-direction: column;
  /* background-color: #444444; */
}

.resource-content::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.resource-content::-webkit-scrollbar-track {
  background: #313131;
}

.resource-content::-webkit-scrollbar-thumb {
  background: #525252;
  padding: 5px;
}

.resource-content::-webkit-scrollbar-corner {
  background: #313131;
}
</style>