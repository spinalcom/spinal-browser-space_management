
<template>
  <div class="mySidebarx" v-if="rendering">
  <div class="mySidebarx" v-if="selectedLevel">
      <p id="HeaderTitle">Building</p>

        <div 
          v-for="(item, index) in floors"
          :key="item.name"
          @click="onItemClick(item)"
          @mouseover="mouseOver(item)"
          @mouseleave="mouseLeave()"
          :title="item.name"
        >
        <v-divider style="width: 190px" color="white"></v-divider>

        <p class="sitebarElement">
        {{ shortenText(item.name) }}</p>

        <div class="displayBadge" v-if="counter[index].count!==undefined">
          <p style="color:white !important">{{ counter[index].count }}</p>
        </div>

        </div>
  </div>
  <div v-else class="mySidebarx">
    <p id="floorSelectedTitleId" @click="backToFloor">← {{ floor }}</p>
    <div 
       v-for="item in roomsDisplayed"
      :key="item.name"
      >
        <v-divider style="width: 190px" color="white"></v-divider>
      <div class="test">
      <p class="sitebarElement"
        :value="item"
        :title="item.name"
        @mouseover="mouseOver(item)"
        @mouseleave="mouseLeave"
        @click="onItemClick(item, $event)">{{ shortenText(item.name) }}
        </p>

        <div class="displayBadge" v-if="numberForBadge(item.tickets)!==0">
            <p style="color:white !important">{{ numberForBadge(item.tickets) }}</p>
        </div>

     </div>
    </div>
  </div>
</div>
</template>

<script>
import { EventBus } from "../../config/event";

export default {
  data() {
    return {
      active: true,
      notExpand: false,
      reduce: true,
      menus: [],
      selectedLevel: true,
      roomsDisplayed: [],
      roomSelected: '',
      oldTarget: {},
      selectedProcess: "",
      rendering: true,
      counter: {}
    };
  },
  props: ["floors", "rooms", "allData"],
  mounted() {
    let content = {
      title: "Floors",
      icon: "fa fa-building",
      child: []
    };

    if (this.floors.length === 0) {
      content.child.push({
        title: "No Floors found !",
        disabled: true
      });
    } else {
      this.floors.forEach(el => {
        content.child.push({
          id: el.id,
          title: el.name,
          type: "floor",
          icon: "location_city"
        });
      });
    }

    EventBus.$on("select-process", processName => {
     this.selectedProcess = processName
      for (var item in this.floors) {
        this.calculeTotalTicket(this.floors[item]);
      }
      let self = this;
      setTimeout(function() {
       self.rendering = false;
       self.rendering = true;
    }, 1000)
   });

    EventBus.$on("getBackToProcess", () => {
      this.selectedProcess = ''
      for (var item in this.floors) {
        this.calculeTotalTicket(this.floors[item]);
      }
      let self = this;
      setTimeout(function() {
       self.rendering = false;
       self.rendering = true;
    }, 1000)

    });

    this.menus.push(content);
  },
  created() {
    let self = this;
    for (var item in this.floors) {
      this.calculeTotalTicket(this.floors[item]);
    }

    setTimeout(function() {
      for (var item in self.floors) {
        self.calculeTotalTicket(self.floors[item]);
      }
    }, 3000)
    setTimeout(function() {
      self.rendering = false;
      self.rendering = true;
    }, 3002)
  },
  methods: {
    calculeTotalTicket(item) {
      let self = this;
      let iterator;
      let count = 0;
      if (item !== undefined) {
      for (var i in self.allData.rooms) {
        if (self.allData.rooms[i].floor === item.name) {
          iterator = i;
          for (var el in self.allData.rooms[i].processNumber) {
            if (this.selectedProcess !== '') {
              if (this.selectedProcess === el)
                count = count + self.allData.rooms[i].processNumber[el];
            }
            else
              count = count + self.allData.rooms[i].processNumber[el];
          }
        }
      }
      if (count == 0) {
        self.counter[iterator] = {};
        self.counter[iterator].count = undefined;
        return 0;
      }
        self.counter[iterator] = {};
        self.counter[iterator].count = count;
        return count;
      }
      return 0;
    },
    onItemClick(item, target) {
      if (target !== undefined)
        if (this.roomSelected !== item.id) {
          if (this.oldTarget.target !== undefined) {
            this.oldTarget.target.parentElement.style.backgroundColor = '#272727';
          }
          this.roomSelected = item.id;
          target.target.parentElement.style.backgroundColor = '#2D3D93';
          this.oldTarget = target;
        } else {
          this.roomSelected = '';
          target.target.parentElement.style.backgroundColor = '#272727';
          this.oldTarget = {};
          EventBus.$emit("click-room", 'reset');
          return;
        }
      switch (item.type) {
        case "geographicFloor":
          EventBus.$emit("click-event", item);
          this.openFloor(item.name);
          break;

        default:
          break;
      }
      this.roomsSelected = item.id;
      EventBus.$emit("click-room", item);
      return;
    },
    shortenText(text) {
      return text.replace(/(.{18})..+/, "$1…");
    },
    numberForBadge(tickets) {
      let count = 0;
      if (tickets !== undefined) {
        if (this.selectedProcess !== '') {
          for (var el in tickets)
            if (tickets[el].processName == this.selectedProcess)
              count++;
            return count;
        } else {
          return tickets.length;
        }
      } else
      return 0;
    },
    backToFloor() {
      this.selectedLevel = true;
      EventBus.$emit("reset-select");
    },
    openFloor(floorSelected) {
      if (this.selectedLevel)
        this.selectedLevel = false;
      else
        this.selectedLevel = true;

      for (var i in this.rooms) {
        if ( this.rooms[i].floor == floorSelected )
          this.roomsDisplayed = this.rooms[i].rooms;
        }

      this.floor = floorSelected;
    },
    mouseOver(item) {
      EventBus.$emit("mouse-over", item);
    },
    isolate(item) {
      this.roomsSelected = item.id;
      EventBus.$emit("click-room", item);
    },
    mouseLeave() {
      EventBus.$emit("mouse-leave");
    }
  }
};
</script>

<style scoped>
#HeaderTitle {
    color: white;
    background-color: grey;
    margin-left: -6px;
    height: 32px;
    padding-top: 9px;
    padding-left: 9px;
    margin-top: -6px;
    margin-left: 0px;
    margin-bottom: 0px !important;
}
.test span {
  /*margin-top: 10px;*/
}

.span.v-badge__badge.red {
  margin-top: 1px !important;
}

p {
  margin-bottom: 10px !important;
}

#floorSelectedTitleId {
  background-color: grey;
  border-radius: 0px 0px 10% 10%;
  color: white;
  height: 24px;
  padding-left: 2px;
  padding-top: 2px;
  margin-bottom: 0px !important;
}
.mySidebarx {
  z-index: 100;
  background-color: #272727;
  height: calc(93.7%);
  width: 191px;
  overflow: auto;

}
.badgeElementInSidebar {
  margin-top: 18px;

  background-color: white;
}
.displayBadge {
  display: inline-flex;
  height: 20px;
  width: 20px;
  padding-top: 3px;
  padding-left: 5px;
  border-radius: 50%;
  background-color: red;
  float: right;
  margin-top: 8px;
}

.sitebarElement {
  width: 150px;
  color: white;
  display: inline-grid;
  margin-bottom: 10px;
  margin-top: 10px;
  padding-left: 8px;
  cursor: pointer;
}
.sitebarElement:hover {
  color: #356BAB;  
}

.sidebarDivider {
  width: 92%;
}

</style>