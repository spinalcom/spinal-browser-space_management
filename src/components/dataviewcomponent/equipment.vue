<template>
  <div class="equipmentPreview">
        <vs-table :data="floorData"
                  @selected="handleSelected">
      <template slot="thead">
        <vs-th v-if="getFloor == 1">
          Floor
        </vs-th>
        <vs-th>
          Room
        </vs-th>
        <vs-th>
          Name
        </vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :data="indextr" :key="indextr" v-for="(tr, indextr) in data" >
          <vs-td :data="data[indextr].Floor" v-if="getFloor == 1">
            {{data[indextr].Floor}}
          </vs-td>

          <vs-td :data="data[indextr].Room">
            {{data[indextr].Room}}
          </vs-td>

          <vs-td :data="data[indextr].Name">
            {{data[indextr].Name}}
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
import { EventBus } from "../../config/event";

export default {
  name: "equipmentData",
  props: ["allData", "floorSelected"],
  data() {
    return {
      data: [],
      floorData: [],
      getFloor: -1
    }
  },
  methods: {
    update() {
      this.getFloor = 1;
      this.floorData = [];
      let arr = this.data.rooms;
      let self = this;

      for (var iterator in arr)
        self.extractEquipmentInfo(arr[iterator], iterator);
    },
    selectFloor(int) {
      this.floorData = [];
      let self = this;
      let arr = this.data;

      for (var iterator in arr)
        for (var floors in arr[iterator])
          if (floors === int)
            self.extractEquipmentInfo(arr[iterator][floors], floors);
    },
    extractEquipmentInfo(arr, iterator) {
      let self = this;
      for (var rooms in arr)
              for (var index in arr[rooms])
              if (typeof arr[rooms][index]['equipements'] != "undefined")
                for (var element in arr[rooms][index]["equipements"])
                  if (typeof arr[rooms][index]["equipements"][element].id !== "undefined") {
                    self.floorData.push({ Floor: self.data.floors[iterator].name,
                            Room: arr[rooms][index].name,
                            Name: arr[rooms][index]["equipements"][element].name,
                            Id : arr[rooms][index]["equipements"][element].id });
                    //console.log(arr[rooms][index]["equipements"][element]);
                  }
    },
    getEvents() {
     EventBus.$on("click-event", (it) => {
      this.getFloor = 0;
      for (var iterator in this.data) {
        for (var floor in this.data[iterator])
            if (this.data[iterator][floor].id === it.id)
              this.selectFloor(floor, it.title);
      }
     });
    },
    handleSelected(lvl) {
      EventBus.$emit("select-equipment", this.floorData[lvl].Id.get())
    },
    updateComponent() {
      if (this.floorSelected != "") {
          for (var ite in this.data.floors)
            if (this.data.floors[ite].name == this.floorSelected)
              this.selectFloor(ite);
        }
        else
          this.update();
    }
  },
  mounted() {
    this.data = this.allData;
    this.getEvents();
  },
   watch: {
    data: function() {
      this.updateComponent();
    },
    floorSelected: function() {
      this.updateComponent();
    }
  }
};
</script>

<style scoped>

</style>

