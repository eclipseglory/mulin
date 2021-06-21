<template>
  <nav id="header" class="darkbg navbar navbar-expand-sm navbar-dark">
    <a ref="downloadLink" style="display: none" />
    <div class="container-fluid">
      <label class="navbar-brand"
        ><span style="font-weight: bold">MU</span
        ><span style="color: #aaaaaa">LIN</span></label
      >
      <button
        class="navbar-toggler btn-sm"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDarkDropdown"
        aria-controls="navbarNavDarkDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDarkDropdown">
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              id="fileMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <small><label>File</label></small>
            </a>
            <ul class="dropdown-menu" aria-labelledby="fileMenuLink">
              <li>
                <a class="dropdown-item" @click="openNewDocDialog">
                  <small><label>New</label></small></a
                >
              </li>
              <li>
                <a class="dropdown-item" @click="openLoadDialog">
                  <small><label>Load</label></small></a
                >
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a
                  class="dropdown-item"
                  @click="save"
                  :class="canSave ? '' : 'disabled'"
                >
                  <small><label>Download Document</label></small></a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  @click="generateSVG"
                  :class="canGenerateSVG ? '' : 'disabled'"
                >
                  <small><label>Export to SVG</label></small></a
                >
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <new-doc-dialog :show="showDocDialog" @dialog:hidden="docDialogHidden" />
      <load-dialog :show="showLoadDialog" @dialog:hidden="loadDialogHidden" />
    </div>
  </nav>
</template>

<script>
import NewDocDialog from "./NewDocDialog.vue";
import docstoremapper from "../store/doc-store-mapper";
import LoadDialog from "./LoadDialog.vue";
import { exportToSVG } from "figures/exporter";

export default {
  mixins: [docstoremapper],
  name: "Header",
  components: { NewDocDialog, LoadDialog },
  emits: ["document:new", "svg:create", "document:update"],

  data() {
    return {
      showDocDialog: false,
      showLoadDialog: false,
    };
  },

  methods: {
    save() {
      if (this.canSave)
        this.document.toJsonObject().then((obj) => {
          let json = JSON.stringify(obj);
          if (this.downloadLink) {
            let link = this.downloadLink;
            link.setAttribute(
              "href",
              "data:json/plain;charset=utf-8," + encodeURIComponent(json)
            );
            link.setAttribute("download", `${this.document.name}.json`);
            link.click();
          }
        });
    },
    openNewDocDialog(e) {
      if (this.showDocDialog) return;
      this.showDocDialog = true;
    },
    openLoadDialog(e) {
      if (this.showLoadDialog) return;
      this.showLoadDialog = true;
    },
    loadDialogHidden(event) {
      this.showLoadDialog = false;
      if (event.doc) {
        this.$emit("document:update", event.doc);
      }
    },
    docDialogHidden(event) {
      this.showDocDialog = false;
      if (event.type == "create") this.$emit("document:new", event);
    },
    generateSVG() {
      if (this.document) {
        this.document.getSVGString().then((svg) => {
          let link = this.downloadLink;
          link.setAttribute(
            "href",
            "data:xml/plain;charset=utf-8," + encodeURIComponent(svg)
          );
          link.setAttribute("download", `${this.document.name}.svg`);
          link.click();
        });
      }
    },
  },

  computed: {
    downloadLink() {
      return this.$refs["downloadLink"];
    },

    canGenerateSVG() {
      return this.document != null && this.documentChildren.length > 0;
    },

    canSave() {
      return this.document != null && this.documentChildren.length > 0;
    },
  },
};
</script>

<style>
#header {
  padding: 2px 20px 2px 20px;
  box-sizing: border-box;
}
</style>