
<template>
  <div class="sidebarProcess">

      <div v-for="element in elements" >
        <v-icon v-on:click="onClick" class="icon-display" :data="element.data">{{element.icon}}</v-icon>
      </div>

  </div>
</template>

<script>
import { EventBus } from "../../config/event";
import { SpinalServiceTicket } from 'spinal-service-ticket';

export default {
  data() {
    return {
      elements: []
    };
  },
  props: ["floors"],
  mounted() {
    this.getEvents();
  },
  methods: {
   update: function(el, parentName) {
      console.log("update process", el, parentName);
      SpinalServiceTicket.init();
      SpinalServiceTicket.getAllProcessAsync().then(ok => console.log("-------", ok))
    },
    getEvents: function() {
      EventBus.$on("selectCategory", (type, parentName) => this.update(type, parentName));
    },
    onClick: function(event) {
      EventBus.$emit("selectProcess", event.target.getAttribute('data'));
    }
  }
};
</script>

<style>
.sidebarProcess {
  background: grey;
  width: 55px;
  height: 51%;
  display: flex;
  overflow: auto;
  padding-left: 15px;
  margin-top: calc(49vh);
  margin-left: calc(9.5vh);
  z-index: 400;
}
.icon-display {
  margin-top: 2vh;
}
</style>
