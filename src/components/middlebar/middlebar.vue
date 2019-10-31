<template>
  <div class="middleBar">

    <md-icon class="material-icons custom-icon" value="room" v-on:click.native="onClick">room</md-icon>
    <div class="display-icon"></div>
    <md-icon class="material-icons custom-icon" value="device" v-on:click.native="onClick">devices</md-icon>
    <div class="display-icon"></div>
    <md-icon class="material-icons custom-icon" value="ticket" v-on:click.native="onClick">event</md-icon>

  </div>
</template>

<script>
import { EventBus } from "../../config/event";

export default {
  name: "MiddleBar",
  data() {
    return {
      data: []
    }
  },
  mounted() {
     this.getEvents();
  },
  methods: {
    onClick: function() {

      let choice = event.target.getAttribute("value");

      if (choice === "room")
        EventBus.$emit("choose-room");
      else if (choice === "device")
        EventBus.$emit("choose-device");
      else if (choice === "ticket")
        EventBus.$emit("choose-ticket");

    },



    // getEvents() {
    //   EventBus.$on("choose-room", () => {
    //     // this.Dosomething();
    //   });

    //   EventBus.$on("choose-device", () => {
    //     // this.Dosomething();
    //   });

    //   EventBus.$on("choose-ticket", () => {
    //     // this.Dosomething();
    //   });

    // }
    update: function(el) {
      console.log("update", el);
    },
    getEvents: function() {
      EventBus.$on("selectBar", type => this.update(type));
    }
  }
};
</script>

<style scoped>
.middleBar {
  background-color: white;
  width: 78%;
  border: solid;
  float: right;
  border-width: 1px;
  margin-left: 4px;
  height: 5%;
  overflow: auto;
}
.material-icons {
  font-size: 230% !important;
  margin-top: 0.4%;  
}

.display-icon {
  padding-right: 2px;
  display: inline-block;
}

.custom-icon {
  color: black;
}


</style>
