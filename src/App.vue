<template>
  <div id="app" class="blackbg">
    <div
      v-if="showLoader"
      id="main-loader"
      class="blackbg"
      :class="initCompleted ? 'fadeout' : ''"
    >
      <div id="loadingMessage">
        <small>{{ loadingMessage }}</small>
      </div>
      <div class="progress" style="height: 1px; width: 20%">
        <div
          id="progress-bar"
          class="progress-bar"
          role="progressbar"
          :style="'width:' + progressWidth"
          :aria-valuenow="currentProgress"
          aria-valuemin="0"
          :aria-valuemax="totalProgress"
        ></div>
      </div>
    </div>
    <div v-else id="main-workspace">
      <Header
        @document:new="newDocument"
        @document:update="updateDoc"
        @svg:create="createSVG"
        @image:imported="imageImported"
      />
      <Main ref="main" @tooltip:update="tooltipUpdate" />
      <Footer :tooltip="tooltip" />
    </div>
  </div>
</template>
<script>
import Header from "./components/Header.vue";
import Main from "./components/Main.vue";
import Footer from "./components/Footer.vue";
import { CanvasKitUtils, DocumentRoot } from "figures";
export default {
  name: "App",
  created() {
    this.$VERSION = process.env.VUE_APP_VERSION;
  },
  mounted() {
    let el = this.$el;
    let loader = el.querySelector("#main-loader");
    if (loader) {
      loader.addEventListener("transitionend", (event) => {
        if (event.target.id == "main-loader") this.showLoader = false;
        if (event.target.id == "progress-bar") {
          if (this.currentProgress >= this.totalProgress) {
            for (let family in CanvasKitUtils.fontCache) {
              this.$store.commit("addFontFamily", family);
            }
            this.initCompleted = true;
          }
        }
      });
      loader.addEventListener("animationend", (event) => {
        if (event.target.id == "main-loader") this.showLoader = false;
        if (event.target.id == "progress-bar") {
          if (this.currentProgress >= this.totalProgress) {
            this.initCompleted = true;
            console.log(CanvasKitUtils.fontCache);
          }
        }
      });
    }
    // 初始化CanvasKit： 加载CanvasKit WASM，加载默认字体
    let fontsNum = CanvasKitUtils.DEFAULT_FONTS.length;
    fontsNum += 1;
    this.totalProgress = fontsNum;
    this.loadingMessage = "Loading CanvasKit WASM...";
    CanvasKitUtils.initCanvasKit("lib/").then((canvaskit) => {
      this.currentProgress++;
      this.loadingMessage = "Loading Fonts...";
      CanvasKitUtils.DEFAULT_FONTS.forEach((font) => {
        let path = font.path;
        if (!path) {
          this.currentProgress++;
          return;
        } else {
          fetch(path)
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
              return CanvasKitUtils.loadFont(buffer, font.descriptors);
            })
            .finally(() => {
              this.currentProgress++;
            });
        }
      });
    });
  },
  methods: {
    imageImported(images) {
      images.forEach((image) => {
        this.$store.commit("addImage", image);
      });
    },
    tooltipUpdate(event) {
      this.tooltip = event;
    },
    newDocument(event) {
      let doc = new DocumentRoot(null, 0, 0, {
        width: event.width,
        height: event.height,
        name: event.name,
      });
      this.updateDoc(doc);
    },
    updateDoc(doc) {
      this.$store.commit("updateDocument", doc);
    },
    createSVG(event) {
      this.$refs["main"].createSVG();
    },
  },

  computed: {
    progressWidth() {
      if (this.totalProgress == 0) return "0%";
      return (
        ((this.currentProgress / this.totalProgress) * 100).toFixed(2) + "%"
      );
    },
  },

  data() {
    return {
      initCompleted: false,
      showLoader: true,
      tooltip: "",
      loadingMessage: "Loading",
      currentProgress: 0,
      totalProgress: Infinity,
    };
  },

  components: {
    Header,
    Main,
    Footer,
  },
};
</script>
<style>
#main-space {
  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100vh;
  position: relative;
}

#main-workspace {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: whitesmoke;
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  display: block;
}

#main-loader {
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#loadingMessage {
  padding: 10px;
  box-sizing: border-box;
  font-size: 1em;
  color: whitesmoke;
}
</style>
