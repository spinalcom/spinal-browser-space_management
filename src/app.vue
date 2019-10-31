<template>
  <div v-if="data"
       class="container-fluid">
    <app-header></app-header>

      <app-sidebar 
                class="sidebarContext-display"
                :floors="data.floors"
                @selectFloor="selecFloor"
                :rooms="data.rooms" 
                :allData="data" ></app-sidebar>
      <app-viewer class="app-viewer-display"></app-viewer>

      <ticket-data class="dataViewDisplay"
                   :allData="data" ></ticket-data>

  </div>
</template>

<script>
import { EventBus } from "./config/event";
import Vue from "vue";
import appViewer from "./components/viewer/viewer.vue";
import appHeader from "./components/header/header.vue";
import sidebar from "./components/sidebar/sidebar.vue";
import ticketData from "./components/ticketComponent/ticketData.vue";
import sidebarContext from "./components/sidebar/sidebarContext.vue";
import sidebarCategory from "./components/sidebar/sidebarCategory.vue";
import DataView from "./components/dataview/dataview.vue";
import MiddleBar from "./components/middlebar/middlebar.vue";
import sidebarProcess from "./components/sidebar/sidebarElement.vue";
import MainContainer from "./components/container/container.vue";
import dataService from "./config/data";
import contextualList from "./components/contextualList/contextualList.vue";

export default Vue.extend({
  data() {
    return {
      collapseMenu: false,
      data: null,
      floorSelected: null,
      test: {},
      bindObj: []
    };
  },
  components: {
    "app-sidebar": sidebar,
    "app-main": MainContainer,
    contextualList,
    sidebarContext,
    sidebarCategory,
    appViewer,
    DataView,
    sidebarProcess,
    MiddleBar,
    appHeader,
    ticketData
  },
  created() {
    let self = this;
    dataService.getAllData().then(allData => {
      self.data = allData;
    });

    setTimeout(function() {
      self.bindAllData();
  }, 3000)
  },
  methods: {
    mounted() {
      console.log(this.data);
    },
    bindAllData() {
      let self = this;
     // console.log("binding", dataService.ContextNode, dataService.ProcessNodes, dataService.StepsNodes);

      this.bindObj.push(dataService.ContextNode);
      this.bindObj.push(dataService.ContextNode.bind(function() {
        self.refreshBind();
        dataService.getAllData().then(allData => {
          self.updateData(allData);
          //self.data = allData;

        });
      }, false));

      for (var ProcessNode in dataService.ProcessNodes) {
        this.bindObj.push(dataService.ProcessNodes[ProcessNode]);
        this.bindObj.push(dataService.ProcessNodes[ProcessNode].bind(function() {
          self.refreshBind();
          dataService.getAllData().then(allData => {
            self.updateData(allData);
            //self.data = allData;
          });
        }, false));
      }

      for (var Node in dataService.StepsNodes) {
        this.bindObj.push(dataService.StepsNodes[Node]);
        this.bindObj.push(dataService.StepsNodes[Node].bind(function() {
          self.refreshBind();
          dataService.getAllData().then(allData => {
            self.updateData(allData);
            //self.data = allData;
          });
        }, false));
      }

      setTimeout(function() {
   //     console.log("binobj = ", self.bindObj);
      }, 2000)

    },
    refreshBind() {
      let iterator = 0;

      while(iterator > this.bindObj.length) {
        this.bindObj[iterator].unbind(this.bindObj[iterator + 1])
        iterator=iterator+2;
      }

    },
    updateData(data) {
      let self = this;
      setTimeout(function() {
        self.data = data;
        self.bindAllData();
      }, 500);
      //EventBus.$emit("test", data);
    },
    onCollapsed(value) {
      this.collapseMenu = value;
    },
    selecFloor(id) {
      let self = this;
      this.data.floors.forEach(function(el) {
        if (el.id === id)
          self.floorSelected = el.name;
      });
      //console.log(id, "== id, data", this.data);
      //this.floorSelected = id;
    }
  }
});
</script>

<style scoped>
.roomcontext {
  position: absolute;
  /*min-height: calc(100%);*/
  margin-left: 11%;
  width: calc(16%);
}
.container-fluid {
  width: calc(100%);
  height: calc(100%);
  font-family: sans-serif;
}
@media screen and (max-width: 992px) {
  .dataViewDisplay {
    background-color: grey;
    height: calc(49%) !important;
    margin-left: calc(189px) !important;
    margin-top: calc(50%);
    margin-left: 4%;
  }
/*  .app-viewer-display {
    box-sizing: unset !important;
  }*/
}

.container-data {

}


.sidebarContext-display {
  position:absolute;
  display: block;
}
.dataViewDisplay {
  margin-left: calc(160px + 51.4%);
  background-color: rgba(1,2,1,0);
/*  height: 93%;
  width: 78%;*/
/*  margin-left: 11%;
  background-color: rgba(1,2,1,0);
  display: inline;
  height: 46%;
  width: 74%;
*/}
</style>
