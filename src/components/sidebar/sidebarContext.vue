
<template>
  <div class="sidebarContext">

      <div v-for="element in elements" >
        <v-icon v-on:click="onClick" class="icon-display" :data="element.data">{{element.icon}}</v-icon>
      </div>

  </div>
</template>

<script>
import { EventBus } from "../../config/event";

export default {
  data() {
    return {
      elements: [
      { icon: "event",
        data: "tickets" }
      ]
    };
  },
  props: ["floors"],
  mounted() { },
  methods: {
    onClick: function(event) {
      EventBus.$emit("selectContext", event.target.getAttribute('data'));
    }
  }
};
</script>

<style>
.sidebarContext {
  background: #333333;
  width: 11%;
  height: 46.4%;
  display: flex;
  overflow: auto;
  padding-left: 15px;
  margin-top: calc(49.6vh);
}
.icon-display {
  margin-top: 2vh;
}
</style>
