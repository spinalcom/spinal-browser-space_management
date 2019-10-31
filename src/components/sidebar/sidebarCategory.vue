
<template>
  <div class="sidebarCategory">

      <div v-for="element in elements" >
        <v-icon v-on:click="onClick" class="icon-display" :parent="parent" :data="element.data">{{element.icon}}</v-icon>
      </div>

  </div>
</template>

<script>
import { EventBus } from "../../config/event";

export default {
  data() {
    return {
      elements: [],
      parent: ""
    };
  },
  props: ["floors"],
  mounted() {
    this.getEvents();
  },
  methods: {
    update: function(el) {
      this.parent = el;
      this.elements = [];
      this.elements.push({ icon: "add_circle",
                           data: "process" })
    },
    getEvents: function() {
      EventBus.$on("selectContext", type => this.update(type));
    },
    onClick: function(event) {
      EventBus.$emit("selectCategory", event.target.getAttribute('data'), event.target.getAttribute("parent"));
    }
  }
};
</script>

<style>
.sidebarCategory {
  width: calc(15%);
  height: 46.2%;
  display: flex;
  background-color: grey;
  overflow: auto;
  padding-left: 15px;
  margin-top: calc(49.8vh);
  margin-left: calc(11%);
  z-index: 200;
}
.icon-display {
  margin-top: 2vh;
}
</style>
