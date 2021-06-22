<template>
  <div
    class="modal fade"
    id="import-image"
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
                  id="imageinput"
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  multiple="true"
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
import { CanvasKitUtils } from "figures";
export default {
  emits: ["dialog:hidden", "dialog:shown"],
  methods: {
    loadFile() {
      let f = this.$refs["localFile"];
      if (f) {
        let files = f.files;
        if (!files || files.length == 0) {
          return;
        }
        this.localLoading = true;
        let ps = [];
        files.forEach((file) => {
          ps.push(
            new Promise((resolve, reject) => {
              var reader = new FileReader();
              reader.onload = (e) => {
                var contents = e.target.result;
                let img =
                  CanvasKitUtils.CanvasKit.MakeImageFromEncoded(contents);
                reader.onload = (e) => {
                  resolve({
                    image: img,
                    width: img.width(),
                    height: img.height(),
                    dataUrl: e.target.result,
                    name: file.name,
                  });
                };
                reader.readAsDataURL(file);
              };
              reader.onabort = (e) => {
                reject(e);
              };
              reader.onerror = (e) => {
                reject(e);
              };
              reader.readAsArrayBuffer(file);
            })
          );
        });
        Promise.allSettled(ps)
          .then((results) => {
            results.forEach((result) => {
              if (result.status == "fulfilled") {
                this.image.push(result.value);
              }
            });
          })
          .finally(() => {
            this.localLoading = false;
            this.$nextTick(() => {
              this.dialog.hide();
            });
          });
      }
    },
  },
  data() {
    return {
      dialog: null,
      localLoading: false,
      loadFileErrorMsg: null,
      image: null,
    };
  },
  mounted() {
    let dialogElement = document.getElementById("import-image");
    if (!dialogElement) return;
    dialogElement.addEventListener("hidden.bs.modal", (event) => {
      this.$emit("dialog:hidden", { images: this.image });
    });
    dialogElement.addEventListener("shown.bs.modal", (event) => {
      this.image = [];
      this.$emit("dialog:shown");
    });
    this.dialog = new bootstrap.Modal(dialogElement);
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