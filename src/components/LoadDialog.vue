<template>
  <div
    class="modal fade"
    id="load-dialog"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered doc-root">
      <div class="modal-content">
        <div class="modal-header">
          <small class="modal-title modal-title-sm" id="staticBackdropLabel">
            <i class="iconfont icon-document"></i>
            Load
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
                <input
                  ref="localFile"
                  class="form-control form-control-sm"
                  :class="loadLocalFileSuccess ? '' : 'is-invalid'"
                  id="formFileSm"
                  type="file"
                />
                <div class="invalid-feedback dialog-label" style="width: 100%">
                  {{ loadFileErrorMsg }}
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
            :class="canLoad ? '' : 'disabled'"
            @click="loadFile"
          >
            <span
              v-if="localLoading"
              class="spinner-grow spinner-grow-sm"
              role="status"
            ></span>
            {{ localLoading ? `Load...` : "Load" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loadFromJson } from "figures/parser";

export default {
  name: "load-dialog",
  emits: ["dialog:hidden", "dialog:shown"],
  mounted() {
    let docElement = document.getElementById("load-dialog");
    if (!docElement) return;
    docElement.addEventListener("hidden.bs.modal", (event) => {
      this.$emit("dialog:hidden", { doc: this.doc });
    });
    docElement.addEventListener("shown.bs.modal", (event) => {
      this.doc = null;
      this.$emit("dialog:shown");
    });
    this.dialog = new bootstrap.Modal(docElement);
  },
  methods: {
    loadFile() {
      let f = this.$refs["localFile"];
      if (f) {
        let file = f.files[0];
        if (!file) {
          return;
        }
        this.localLoading = true;
        var reader = new FileReader();
        reader.onload = (e) => {
          var contents = e.target.result;
          new Promise((resolve, reject) => {
            try {
              resolve(JSON.parse(contents));
            } catch (e) {
              reject(e);
            }
          })
            .then((json) => {
              return loadFromJson(json);
            })
            .then((doc) => {
              this.doc = doc;
              this.$nextTick(() => {
                this.dialog.hide();
              });
            })
            .catch((e) => {
              this.loadFileErrorMsg = e.toString();
            })
            .finally((e) => {
              this.localLoading = false;
            });
        };
        reader.onabort = (e) => {
          this.localLoading = false;
        };
        reader.onerror = (e) => {
          this.localLoading = false;
        };
        reader.readAsText(file);
      }
    },
  },
  data() {
    return {
      doc: null,
      dialog: null,
      localLoading: false,
      loadFileErrorMsg: null,
    };
  },
  computed: {
    canLoad() {
      // let f = this.$refs["localFile"];
      // if (f) {
      //   let file = f.files[0];
      //   return file != null;
      // }
      return true;
    },
    loadLocalFileSuccess() {
      return this.loadFileErrorMsg == null;
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