<template>
  <div
    style="
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
    "
  >
    <div
      style="height: 30px; padding: 10px 0px 10px 0px; box-sizing: border-box"
      @mousedown.prevent="clickPointer"
      @mousemove.prevent="movePointer"
      @mouseup.prevent="releasePointer"
      @mouseleave.prevent="releasePointer"
    >
      <div
        id="time-scale-bar"
        style="
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 5px;
        "
        class="blackbg"
      >
        <div
          id="time-scale-percent-bar"
          :style="timeScalePercentStyle"
          class="graybg time-scale-percent"
        ></div>
        <div
          id="left-time-scale"
          class="time-scale"
          :style="leftScaleStyle"
        ></div>
        <div
          id="right-time-scale"
          class="time-scale"
          :style="rightScaleStyle"
        ></div>
      </div>
    </div>
    <div style="flex-grow: 1; padding: 10px 0px; box-sizing: border-box">
      <div
        style="
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 5px;
          padding: 0px 10px;
        "
        class="blackbg"
      >
        <div
          style="width: 100%; height: 100%; position: relative"
          class="hide-overflow-children"
        >
          <div
            id="kedu-div"
            :style="keduDivStyle"
            @mousedown.prevent="clickTimePointer"
            @mousemove.prevent="moveTimePointer"
            @mouseup.prevent="releaseTimePointer"
            @mouseleave.prevent="pointerLeave"
          >
            <div id="kedu-marker" style="background-color: gray">
              <div class="kedu-marker-item"></div>
              <div class="kedu-marker-item"></div>
              <div class="kedu-marker-item"></div>
            </div>
          </div>

          <div
            id="time-pointer-line"
            :style="timePointerLineStyle"
            @mouseup.prevent="releaseTimePointer"
          >
            <div id="time-pointer"></div>
            <div style="width: 1px; flex-grow: 1; background-color: blue"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeMove: false,
      timeMove: false,
      pointerPosition: {},
      rightScalePosition: 0,
      leftScalePosition: 0,
      timePointerPosition: 0,
      barWidth: 0,
    };
  },

  mounted() {
    let observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.id == "time-scale-bar") {
          const contentBoxSize = Array.isArray(entry.contentBoxSize)
            ? entry.contentBoxSize[0]
            : entry.contentBoxSize;
          let percent = this.timeScalePercent;
          this.barWidth = contentBoxSize.inlineSize;
          if (percent == null) return;
          let w = this.barWidth * percent;
          this.rightScalePosition = this.barWidth - this.leftScalePosition - w;
          if (this.rightScalePosition < 0) {
            this.rightScalePosition = 0;
            this.leftScalePosition = this.barWidth - w;
          }
        }
      });
    });
    let bar = this.$el.querySelector("#time-scale-bar");
    if (bar) observer.observe(bar);
  },

  computed: {
    timePointerLineStyle() {
      return {
        left: `${this.timePointerPosition + 5}px`,
      };
    },
    rightScaleStyle() {
      return { right: `${this.rightScalePosition}px` };
    },

    leftScaleStyle() {
      return { left: `${this.leftScalePosition}px` };
    },
    timeScalePercentStyle() {
      return {
        position: "absolute",
        height: "10px",
        width: `${this.timeScaleProgressWidth}px`,
        top: "0px",
        left: `${this.leftScalePosition}px`,
        "border-radius": "5px",
      };
    },

    keduDivStyle() {
      let percent = this.timeScalePercent;
      if (percent == null || percent > 1) percent = 1;
      let p1 = 1 / percent;
      let p2 = this.leftScalePosition / this.barWidth;
      let l = p1 * this.barWidth * p2;
      return { width: `${p1 * 100}%`, left: `${-l}px` };
    },

    timeScaleProgressWidth() {
      let w = this.rightScalePosition + this.leftScalePosition;
      return this.barWidth - w;
    },
    timeScalePercent() {
      if (this.barWidth == 0) return;
      return this.timeScaleProgressWidth / this.barWidth;
    },
  },

  methods: {
    clickTimePointer(event) {
      if (this.timeMove) return;
      this.timeMove = true;
      this.timePointerPosition = event.offsetX;
    },
    moveTimePointer(event) {
      if (this.timeMove) {
        this.timePointerPosition = event.offsetX;
      }
    },
    releaseTimePointer(event) {
      console.log("release");
      this.timeMove = false;
    },
    pointerLeave(event) {
      if (event.toElement.id == "time-pointer") return;
      this.timeMove = false;
    },
    clickPointer(event) {
      if (this.activeMove) return;
      this.activeMove = true;
    },

    releasePointer(event) {
      if (!this.activeMove) return;
      this.activeMove = false;
    },

    movePointer(event) {
      if (this.activeMove) {
        let id = event.target.id;
        if (id == "right-time-scale") {
          this.rightScalePosition -= event.movementX;
          if (this.timeScalePercent < 0.1) {
            let w = this.barWidth * 0.1;
            this.rightScalePosition =
              this.barWidth - this.leftScalePosition - w;
          }
        }
        if (id == "left-time-scale") {
          this.leftScalePosition += event.movementX;
          if (this.timeScalePercent < 0.1) {
            let w = this.barWidth * 0.1;
            this.leftScalePosition =
              this.barWidth - this.rightScalePosition - w;
          }
        }

        if (id == "time-scale-percent-bar") {
          this.rightScalePosition -= event.movementX;
          this.leftScalePosition += event.movementX;
          if (this.rightScalePosition < 0) {
            this.leftScalePosition -= event.movementX;
          }
          if (this.leftScalePosition < 0) {
            this.rightScalePosition += event.movementX;
          }
        }

        if (this.rightScalePosition < 0) {
          this.rightScalePosition = 0;
        }
        if (this.leftScalePosition < 0) {
          this.leftScalePosition = 0;
        }
      }
    },
  },
};
</script>

<style>
#time-pointer {
  font-size: 0px;
  line-height: 0%;
  width: 0px;
  border-top: 10px solid #3d8bfd;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
}
#time-pointer:hover {
  cursor: pointer;
}

#time-pointer-line {
  position: absolute;
  top: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 10px;
  height: 100%;
}

.hide-overflow-children {
  overflow: hidden;
}

.time-scale-percent {
  cursor: move;
}

.time-scale {
  position: absolute;
  width: 20px;
  height: 10px;
  background-color: #3d8bfd;
  border: 1px solid whitesmoke;
}

.time-scale:hover {
  cursor: pointer;
}
.kedu-marker-item {
  height: 10px;
  flex-grow: 1;
  border-left: 1px solid whitesmoke;
  overflow: hidden;
  text-align: left;
  font-size: 4px;
  font-family: Arial, Helvetica, sans-serif;
}

#kedu-div {
  min-height: 100%;
  border-left: 1px solid red;
  border-right: 1px solid red;
  padding: 0px 10px;
  box-sizing: border-box;
  position: absolute;
}

#kedu-marker {
  width: 100%;
  height: 20px;
  border-bottom: 1px solid whitesmoke;
  display: flex;
  align-items: flex-end;
  justify-content: stretch;
}

#left-time-scale {
  top: 0px;
  left: 0px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

#right-time-scale {
  top: 0px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
</style>