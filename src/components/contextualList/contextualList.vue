<template>
  <div class="contextualList">

    <rooms :floorSelected="floorSelected"
                     :rooms="rooms"
                     :equipments="equipments"></rooms>
  </div>
</template>

<script>
import Rooms from "../rooms/rooms.vue";

export default {
  name: "contextualList",
  components: {
    Rooms
  },
  props: ["floorSelected", "rooms", "equipments"],
  data() {
     return {
      data: []
    };
  },
  mounted() {},
  methods: {},
  watch: {
    rooms() {
      console.log("rooms update", this.rooms);
    }
  }
};
</script>

<style scoped>
.contextualList {
  display: inline-block;
  width: 13%;
  height: calc(50%);
  margin-left: -5.9%;
  padding: 10px;
  overflow: auto;
  background: #333333;
}

@media screen and (max-width: 900px) {
  .contextualList {
    width: 100%;
    display: inline-block;
    height: calc(40%);
    display: block;
  }
}
</style>