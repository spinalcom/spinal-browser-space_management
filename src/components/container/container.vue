
<template>
  <div class="container">
    <div class=" mainRow">
      <contextual-list :floorSelected="floorSelected"
                     :rooms="rooms"
                     :equipments="equipments"></contextual-list>
      <app-viewer class="middleBar-dataView-display"></app-viewer>
      <data-view :allData="allData">
    </data-view>
    </div>
  </div>
</template>

<script>
import appViewer from "../viewer/viewer.vue";
import Rooms from "../rooms/rooms.vue";
import MiddleBar from "../middlebar/middlebar.vue";
import DataView from "../dataview/dataview.vue";
import contextualList from "../contextualList/contextualList.vue";

export default {
  name: "MainContainer",
  props: ["collapsed", "floorSelected", "rooms", "equipments", "allData"],
  components: {
    "rooms-sidebar": Rooms,
    "app-viewer": appViewer,
    MiddleBar,
    DataView,
    contextualList
  },
  computed: {
    getStyle() {
      if (this.collapsed) {
        return {};
      } else {
        return {
          width: "calc(100% - 350px)",
          background: "black"
        };
      }
    }
  }
};
</script>

<style scoped>
.container {
  position: relative;
  float: right;
  width: calc(100% - 200px);
}

.middleBar-dataView-display {
  margin-left: 10px;
}

.mainRow {
  margin: 0px;
  height: calc(109vh - 40px);
}
</style>
