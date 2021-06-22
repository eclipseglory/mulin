<template>
  <div class="document-root blackbg">
    <div class="document-header">
      <small>
        <i class="iconfont icon-document" style="margin-right: 5px"></i
        ><span style="font-weight: bold">Shape Structure</span>
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
    <div class="document-content">
      <tree-node
        v-for="node in documentChildren"
        v-bind:key="node.id"
        :model="node"
      />
    </div>
  </div>
</template>

<script>
import TreeNode from "./TreeNode.vue";
import docstoremapper from "../../store/doc-store-mapper";
export default {
  mixins: [docstoremapper],
  components: { TreeNode },
  name: "Document",
};
</script>

<style>
.document-root {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 20px 20px 5px 20px;
  box-sizing: border-box;
}

.document-header {
  box-sizing: border-box;
  color: whitesmoke;
  text-align: left;
}

.document-content {
  flex-grow: 1;
  width: 100%;
  overflow: scroll;
  box-sizing: border-box;
  padding: 5px 0px 5px 0px;
  /* background-color: #444444; */
}

.document-content::-webkit-scrollbar {
  width: 5px; /* width of the entire scrollbar */
  height: 5px;
}

.document-content::-webkit-scrollbar-track {
  background: #313131; /* color of the tracking area */
}

.document-content::-webkit-scrollbar-thumb {
  background: #525252;
  padding: 5px;
  /* border: transparent solid 5px; */
  /* background-color: blue;  */
}

.document-content::-webkit-scrollbar-corner {
  background: #313131;
}
</style>