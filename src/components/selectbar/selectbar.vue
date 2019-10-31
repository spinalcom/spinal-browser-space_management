<template>
  <div class="selectBar">
    <md-icon class="md-size-1x material-icons custom-icon" value="room" v-on:click.native="onClick">room</md-icon>
    <div class="display-icon"></div>
    <md-icon class="md-size-1x material-icons custom-icon" value="device" v-on:click.native="onClick">devices</md-icon>
    <div class="display-icon"></div>
    <md-icon class="md-size-1x material-icons custom-icon" value="ticket" v-on:click.native="onClick">event</md-icon>
    </div>
  </template>

<script>
import { EventBus } from "../../config/event";

export default {
  name: "SelectBar",
  data() {
    return {
      data: [],
      selectOptions: this.for,
      typeSelected: this.model
    }
  },
  methods: {
    onClick(event) {

      let choice = event.target.getAttribute("value");

      if (choice === "room")
        EventBus.$emit("choose-room");
      else if (choice === "device")
        EventBus.$emit("choose-device");
      else if (choice === "ticket")
        EventBus.$emit("choose-ticket");

    }
  },
  props: ["model", "for"]
};
</script>

<style scoped>
.selectBar {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #333333;
}

.display-icon {
  padding-right: 2px;
  display: inline-block;
}

.custom-icon {
  color: white;
}

</style>
