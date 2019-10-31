<template>
  <div class="dataTickets">
        <vs-table :data="floorData"
                  @selected="handleSelected">
      <template slot="thead">
        <vs-th v-if="showFloor == 1">
          Floor
        </vs-th>
        
        <vs-th>
          Room
        </vs-th>

        <vs-th>
          Name
        </vs-th>

        <vs-th>
          Process
        </vs-th>

        <vs-th>
          Importance
        </vs-th>

        <vs-th>
          Note
        </vs-th>

        <vs-th>
          
        </vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :data="indextr" :key="indextr" v-for="(tr, indextr) in data" >
          <vs-td :data="data[indextr].Floor" v-if="showFloor == 1">
            {{data[indextr].Floor}}
          </vs-td>

          <vs-td :data="data[indextr].Room">
            {{data[indextr].Room}}
          </vs-td>

          <vs-td :data="data[indextr].Name">
            {{data[indextr].Name}}
          </vs-td>

          <vs-td :data="data[indextr].Process">
            {{data[indextr].Process}}
          </vs-td>

          <vs-td :data="data[indextr].Name" v-bind:style="data[indextr].color">
            
          </vs-td>

          <vs-td :data="data[indextr].Note">
            {{data[indextr].Note}}
          </vs-td>

          <vs-td :data="data[indextr].Note">
            <md-icon class="material-icons custom-icon" value="ticket" v-on:click.native="onClick">event</md-icon>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
import { EventBus } from "../../config/event";
import graph from "../../config/GraphService";

export default {
  name: "ticketData",
  props: ["allData", "floorSelected"],
  data() {
    return {
      data: [],
      floorData: [],
      showFloor: 2
    }
  },
  methods: {
    update() {
      this.showFloor = 1;
      this.floorData = [];
      let self = this;
      let arr = this.data.rooms;

      for (var iterator in arr)
        for (var floors in arr[iterator])
          self.extractTicketInfo(arr[iterator][floors], iterator);
    },
    selectFloor(int) {
      this.floorData = [];
      let self = this;
      let arr = this.data;

      for (var iterator in arr)
        for (var floors in arr[iterator])
          if (floors === int)
          for (var rooms in arr[iterator][floors])
            self.extractTicketInfo(arr[iterator][floors][rooms], floors);
    },
    extractTicketInfo(arr, floor_lvl) {
      let self = this;

      for (var rooms in arr)
            if (typeof arr[rooms].id != "undefined")
              for (var allTicket in arr[rooms].tickets)
                if (typeof arr[rooms].tickets[allTicket].name !== "undefined") {
                  self.floorData.push({ Floor: self.data.floors[floor_lvl].name,
                    Room: arr[rooms].name,
                    Name: arr[rooms].tickets[allTicket].name,
                    Process: "",
                    Note: arr[rooms].tickets[allTicket].note,
                    Id: arr[rooms].tickets[allTicket].id,
                    color: { backgroundColor: arr[rooms].tickets[allTicket].color.get()} });
                  //console.log(arr[rooms].tickets[allTicket])
                  self.addProcess(arr[rooms].tickets[allTicket].processId.get());
                }
    },
    onClick: function(event) {
      console.log("onclick", event);
      event.stopPropagation();
    },
    predicat: function( node ) {
      return node.info.type.get() === "BIMObject";
    },
    zoomRoom: function(id) {
      graph.SpinalGraphService.findNodes(id, [
        "SpinalSystemServiceTicketHasLocation",
        "hasBIMObject",
        'hasReferenceObject'
        ],
      self.predicat
      ).then( lst => {
        EventBus.$emit("select-tickets-room", lst);
      } );
    },
    addProcess(id) {
      let self = this;
      let count = this.floorData.length - 1;

      graph.SpinalGraphService.getNodeAsync(id).then(ProcessNode =>
       self.floorData[count]['Process'] = ProcessNode.name.get() );
    },
    getEvents() {
     EventBus.$on("click-event", (it) => {
      this.showFloor = 0;
      for (var iterator in this.data) {
        for (var floor in this.data[iterator])
            if (this.data[iterator][floor].id === it.id)
              this.selectFloor(floor, it.title);
      }
     });
    },
    handleSelected(tr) {
      this.zoomRoom(this.floorData[tr].Id.get())
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

