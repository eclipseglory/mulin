<template>
  <div
    class="modal fade"
    id="new-doc-dialog"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered doc-root">
      <div class="modal-content">
        <div class="modal-header">
          <small class="modal-title modal-title-sm" id="staticBackdropLabel">
            <i class="iconfont icon-document"></i>
            New Document
          </small>
          <button
            type="button"
            class="btn-close btn-sm"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form class="row g-3">
            <div class="col-12">
              <div class="input-group input-group-sm">
                <label class="input-group-text">Name</label>
                <input
                  v-model="documentName"
                  type="text"
                  class="form-control"
                  :class="docNameValidated ? '' : 'is-invalid'"
                  id="docName"
                  required
                />
                <div class="invalid-feedback dialog-label" style="width: 100%">
                  {{ docNameErrorMsg }}
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="input-group input-group-sm">
                <label class="input-group-text">Size Templates</label>
                <select
                  id="size-templates"
                  class="form-select form-select-sm"
                  aria-label="Default select example"
                  v-model="selectedTemplate"
                >
                  <option
                    v-for="template in sizeTemplate"
                    v-bind:key="template.name"
                  >
                    {{ template.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="col-md-6">
              <div class="input-group input-group-sm">
                <label class="input-group-text">Width</label>
                <input
                  v-model="width"
                  type="number"
                  class="form-control"
                  :class="widthValidated ? '' : 'is-invalid'"
                  aria-label="document height"
                  :min="8"
                  :max="16382"
                  required
                />
                <span class="input-group-text">px</span>
                <div class="invalid-feedback dialog-label" style="width: 100%">
                  {{ widthErrorMsg }}
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="input-group input-group-sm">
                <span class="input-group-text">Height</span>
                <input
                  v-model="height"
                  type="number"
                  class="form-control"
                  :class="heightValidated ? '' : 'is-invalid'"
                  aria-label="document width"
                  :min="8"
                  :max="16382"
                  required
                />
                <span class="input-group-text">px</span>
                <div class="invalid-feedback dialog-label" style="width: 100%">
                  {{ heightErrorMsg }}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            :class="canCreateDoc ? '' : 'disabled'"
            @click="createDocument"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewDocumentDialog",
  emits: ["dialog:hidden", "dialog:shown"],
  mounted() {
    let docElement = document.getElementById("new-doc-dialog");
    if (!docElement) return;
    docElement.addEventListener("hidden.bs.modal", (event) => {
      this.$emit("dialog:hidden", {
        type: this.type,
        width: Number.parseFloat(this.width),
        height: Number.parseFloat(this.height),
        name: this.documentName,
      });
    });
    docElement.addEventListener("shown.bs.modal", (event) => {
      this.$emit("dialog:shown");
    });
    this.dialog = new bootstrap.Modal(docElement);
  },
  methods: {
    createDocument() {
      this.type = "create";
      this.dialog.hide();
    },

    validateDimension(value, name) {
      if (value == null || value.length == 0) return `Please input ${name}`;
      let h = Number.parseFloat(value);
      if (isNaN(h)) return "Input must be a number";
      if (h < 8) return `${name} should larger than 8 `;
      if (h > 16382) return `${name} should larger than 16382`;
    },
  },
  data() {
    return {
      dialog: null,
      width: 300,
      height: 300,
      documentName: "Mydocument",
      type: "cancel",
      sizeTemplate: [
        { name: "Default", width: 300, height: 300 },
        { name: "Letter", width: 612, height: 792 },
        { name: "A4", width: 595.28, height: 841.89 },
        { name: "A3", width: 841.89, height: 1190.55 },
        { name: "B5", width: 515.91, height: 728.5 },
        { name: "B4", width: 728.5, height: 1031.81 },
      ],
      selectedTemplate: "Default",
    };
  },
  computed: {
    canCreateDoc() {
      return (
        this.docNameErrorMsg == null &&
        this.heightErrorMsg == null &&
        this.widthErrorMsg == null
      );
    },
    docNameErrorMsg() {
      if (this.documentName == null || this.documentName.length == 0)
        return "Name can not be empty";
    },
    docNameValidated() {
      return this.docNameErrorMsg == null;
    },
    heightErrorMsg() {
      return this.validateDimension(this.height, "height");
    },
    heightValidated() {
      return this.heightErrorMsg == null;
    },
    widthErrorMsg() {
      return this.validateDimension(this.width, "width");
    },
    widthValidated() {
      return this.widthErrorMsg == null;
    },
  },
  watch: {
    show(c, old) {
      if (!this.dialog) return;
      if (c) {
        this.type = "cancel";
        this.dialog.show();
      } else {
        this.dialog.hide();
      }
    },

    selectedTemplate(c, old) {
      this.sizeTemplate.forEach((p) => {
        if (p.name == c) {
          this.width = p.width;
          this.height = p.height;
        }
      });
    },
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
.doc-root {
  color: #333333;
}

.dialog-label {
  width: 100%;
  padding-left: 10px;
  box-sizing: border-box;
  text-align: left;
}
</style>