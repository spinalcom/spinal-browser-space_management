<template>
  <div class="roomsSidebar">

<!--     <div class="room_equipment_select">
      <select-bar width="100%"
                class="selectRoom"
                :model="typeSelected"
                :for="selectOptions"
      ></select-bar>
    </div> -->

    <div class="list-item"
         v-for="(item,index) of  data"
         :key="index"
         @mouseover="mouseOver(item)"
         @mouseleave="mouseLeave()"
         @click="isolate(item)"
         :class="{'selected' : isSelected(item.id)}">

      {{item.name}}
    </div>

    <div class="noItems"
         v-if="floorSelected && data.length === 0">
      No Items found !
    </div>

    <div class="noItems"
         v-if="!floorSelected">
      Please select a floor !
    </div>
  </div>
</template>

<script>
import { EventBus } from "../../config/event";
import SelectBar from "../selectbar/selectbar.vue";

export default {
  name: "Rooms",
  components: {
    SelectBar
  },
  props: ["floorSelected", "rooms", "equipments"],
  data() {
    this.selectOptions = [
      {
        value: "rooms",
        title: "Rooms"
      },
      { value: "equipments", title: "Equipments" }
    ];
    return {
      typeSelected: "rooms",
      roomsSelected: null,
      data: []
    };
  },
  methods: {
    mouseOver(item) {
      EventBus.$emit("mouse-over", item);
    },
    isolate(item) {
      this.roomsSelected = item.id;
      EventBus.$emit("click-room", item);
    },
    update() {
      this.data = [];
      //switch (this.typeSelected) {
        //case "rooms":
          var dataFiltered = this.rooms.filter(el => {
            return el.floor === this.floorSelected;
          });

          for (let index = 0; index < dataFiltered.length; index++) {
            const element = dataFiltered[index];
            this.data = this.data.concat(element.rooms);
          }
         // break;

        //default:
         // break;
     // }
    },
    mouseLeave() {
      EventBus.$emit("mouse-leave");
    },
    isSelected(id) {
      return this.roomsSelected === id;
    }
  },
  watch: {
    typeSelected: function() {
      this.update();
    },
    floorSelected: function() {
      this.update();
    }
  }
};
</script>

<style scoped>
.roomsSidebar {
  overflow: auto;
  background: #333333;
  font-style: sans-serif;
}

.list-item {
  width: 100%;
  border-bottom: 1px solid gray;
  text-align: left;
  font-size: 81%;
  padding: 10px;
  text-transform: capitalize;
  color: white;
}

.noItems {
  width: 100%;
  text-align: center;
  padding: 10px;
  text-transform: capitalize;
  color: white;
}

.list-item:hover {
  cursor: pointer;
  color: #356BAB;
}

.list-item.selected {
  border-right: 4px solid #356BAB;
}

.room_equipment_select {
  border-bottom: 1px solid gray;
  padding-bottom: 10px;
}

@media screen and (max-width: 900px) {
  .roomsSidebar {
    width: 100%;
    height: calc(40%);
    display: block;
  }
}
</style>

<style>
.vs-select--label {
  color: white !important;
}
</style>
