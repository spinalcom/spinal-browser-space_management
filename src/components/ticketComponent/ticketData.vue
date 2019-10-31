<template class="renderDataTicket">
	<div v-if="active == 'default'">
		<process-component :processList="allData.process"
							:allData="allData"
							:backFrom="backFrom"
							:load="load"
							>
		</process-component>
	</div>
	<div v-else-if="active == 'table'">
		<ticket-table :allTickets="selectedTicket"
					  :steps="steps"
					  :selectedSteps="selectedSteps"
					  :title="selectProcess">
		</ticket-table>
	</div>
	<div v-else-if="active == 'detail'">
		<ticket-details :ticket="ticketDetails">
			
		</ticket-details>
	</div>
	<div v-else-if="active == 'calendar'">
		<ticket-calendar :selectedTicket="selectedTicket"
					  	:steps="steps"
		>
			
		</ticket-calendar>
	</div>
</template>

<script>
import { EventBus } from "../../config/event";
import graph from "../../config/GraphService";
import processComponent from "./processComponent.vue";
import ticketTable from "./ticketTable.vue";
import ticketDetails from "./ticketDetails";
import ticketCalendar from './ticketCalendar.vue'

export default {
	name: "ticketData",
	data() {
    return {
      active: "default",
      levelSelected: "",
      process: [],
      steps: [],
      ticketDetails: {},
      allTickets: [],
      selectedTicket: [],
      selectedSteps: [],
      init: true,
      selectProcess: "",
      eventRoom: false,
      overTickets: [],
      backFrom: "",
      load: false
    };
  },
  components: {
	processComponent,
	ticketTable,
	ticketDetails,
	ticketCalendar
  },
  props: ["allData"],
  mounted() {
	let self = this;
	this.getEvents();
	setTimeout(function() {
		self.getAllTickets().then(self.extractProcess());
	}, 1000)
  },
  methods: {
    getEvents() {
      let self = this;
      EventBus.$on("click-event", item => self.levelSelected = item.name );
      EventBus.$on("select-process", process => {
		self.active = "table";
		self.selectProcess = process;
		self.triTicket();
		self.load = true;
     });
     EventBus.$on("getBackToProcess", (lvl) => {
		self.active = "default";
		if (lvl === true)
			self.backFrom = self.levelSelected;
     });
     EventBus.$on("getBackToTable", () => {
		self.active = "table";
     });
     EventBus.$on("select-steps", selected => {
		self.selectedSteps = selected;
		self.init = false;
		self.triTicket();
     });
     EventBus.$on("calendar-tickets", arrayOfNode =>  { 
     	console.log("calendar-tickets", arrayOfNode);
     	this.selectedTicket = arrayOfNode;
     	this.active = "table";
     });
     EventBus.$on("click-room", item => self.addOverOnTableElement(item) );
     EventBus.$on("ticket-details", item => self.showDetails(item));
     EventBus.$on("export", () => self.exportCsv());
     EventBus.$on("show-analytics", () => self.active = 'calendar');
     EventBus.$on("close-details", () => self.active = "table");
     EventBus.$on("reset-select", () => {
     	self.backFrom = '';
		self.resetOverOnTableElement();
		self.levelSelected = "";
		self.triTicket();
     })
	},
	exportCsv() {
		let result = [];
		result.push(["floor", "room", "process", "name", "step", "creation date", "author", "note"])
		for (var node in this.selectedTicket) {
			result.push([ this.selectedTicket[node].floorName, this.selectedTicket[node].roomName, this.selectedTicket[node].processName, this.selectedTicket[node].name.get(),
							this.selectedTicket[node].stepName, this.timeConverter(this.selectedTicket[node].creationDate.get()), this.selectedTicket[node].username.get(),
							this.selectedTicket[node].note.get() ]);
		}

		this.download("ticket_export.csv", result);
	},
	showDetails(item){
		this.ticketDetails = item;
		this.active = 'detail';
	},
	extractProcess() {
		this.steps = [];
		for (var ticket in this.selectedTicket) {
			if (this.steps.indexOf(this.selectedTicket[ticket]['stepName']) == -1 && this.selectedTicket[ticket]['stepName'] !== undefined)
				this.steps.push(this.selectedTicket[ticket]['stepName']);
		}
	},
	addOverOnTableElement(items) {
	if (items === 'reset') {
		if (this.overTickets.length !== 0) {
			for (var el in this.overTickets) {
				this.overTickets[el].over = 'false';
			}
		}
		return;
	}

	if (items.tickets !== undefined) {
		if (this.selectProcess === "") {
			this.eventRoom = true;
		} else {
			this.overTickets = items.tickets;
			for (var el in items.tickets) {
				items.tickets[el].over = true;
			}
		}
	}
	},
	resetOverOnTableElement() {
		this.eventRoom = false;
	},
	triTicket() {
		this.selectedTicket = []
		if (this.levelSelected === "") {
			for (var ticket in this.allTickets)
				for (var el in this.allTickets[ticket])
					if (this.allTickets[ticket][el]['processName'] === this.selectProcess) {
						if (this.selectedSteps.indexOf(this.allTickets[ticket][el]['stepName']) !== -1 || this.init === true )
							this.selectedTicket.push(this.allTickets[ticket][el]);
					}
		}
		else
			for (var level in this.allTickets)
				if (level === this.levelSelected)
					for (var ticket in this.allTickets[level])
						if (this.allTickets[level][ticket]['processName'] === this.selectProcess)
							if (this.selectedSteps.indexOf(this.allTickets[level][ticket]['stepName']) !== -1 || this.init === true )
								this.selectedTicket.push(this.allTickets[level][ticket]);
		this.extractProcess();
	},
	addStep(node, processName) {
		let self = this;
		graph.SpinalGraphService.getChildren(node.processId.get()).then(processNode =>  {
		let array = [];
			for (var i in processNode) {
				if (processNode[i].type.get() === "SpinalSystemServiceTicketTypeStep") {
					if (self.process.indexOf(processName === -1)) {
						self.process[processName] = [];
					}
					if (self.process[processName].indexOf(processNode[i].name.get() === -1)) {
						array.push(processNode[i].name.get());
						self.process[processName].push(array);
					}
					if (node.stepId.get() == processNode[i].id.get()) {
						node['stepName'] = processNode[i].name.get();
					}
				}
			}

		});
	},
	timeConverter(UNIX_timestamp){
		var a = new Date(UNIX_timestamp);
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var year = a.getFullYear();
		var month = months[a.getMonth()];
		var date = a.getDate();
		var hour = a.getHours();
		var min = a.getMinutes();
		var sec = a.getSeconds();
		var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
		return time;
	},
	getAllTickets() {
		let self = this;
		let tmp;
		return new Promise((resolve) => {

			for (var floorLvl in self.allData.rooms)
				for (var allRooms in self.allData.rooms[floorLvl].rooms) {
					if (self.allData.rooms[floorLvl].rooms[allRooms].tickets != undefined) {
						if (self.allTickets[self.allData.rooms[floorLvl].floor] == undefined) {
							self.allTickets[self.allData.rooms[floorLvl].floor] = [];
							self.allData.rooms[floorLvl].rooms[allRooms].tickets.forEach(el => {
								tmp = graph.SpinalGraphService.getRealNode(el.processId.get());
								el['idObject'] = self.allData.rooms[floorLvl].rooms[allRooms].id;
								el['processName'] = tmp.info.name.get();
								el['floorName'] = self.allData.rooms[floorLvl].floor;
								el['roomName'] = self.allData.rooms[floorLvl].rooms[allRooms].name;
								self.addStep(el, tmp.info.name.get());
								self.allTickets[self.allData.rooms[floorLvl].floor].push(el);
							})
						}
						else
							self.allData.rooms[floorLvl].rooms[allRooms].tickets.forEach(el => {
								tmp = graph.SpinalGraphService.getRealNode(el.processId.get());
								if (tmp !== undefined) {
								el['processName'] = tmp.info.name.get();
								el['idObject'] = self.allData.rooms[floorLvl].rooms[allRooms].id;
								el['floorName'] = self.allData.rooms[floorLvl].floor;
								el['roomName'] = self.allData.rooms[floorLvl].rooms[allRooms].name;
								self.addStep(el, tmp.info.name.get());
								self.allTickets[self.allData.rooms[floorLvl].floor].push(el);
								}
							});
					}
					if (floorLvl == (self.allData.rooms.length - 1) && allRooms == (self.allData.rooms[floorLvl].rooms.length - 1) )
						resolve(true);
				}
		});
	},
	download( filename, arr ) {
		let element = document.createElement( 'a' );
		let doc = '';
		for (var key in arr) {
			doc += `${arr[key]}\n`;
		}
		element.setAttribute( 'href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( doc ) );
		element.setAttribute( 'download', filename );
		element.style.display = 'none';
		document.body.appendChild( element );
		element.click();
		document.body.removeChild( element );
	}
  },
  watch: {
	levelSelected() {
		this.triTicket();
		this.extractProcess();
	},
	allData() {
		this.allTickets = [];
		this.process = [];
		this.getAllTickets().then(() => {
			this.triTicket();
			this.extractProcess();
		});
	}
  }
};
</script>

<style>
.renderDataTicket {
  margin-left: 57%;
  background-color: rgba(1,2,1,0);
  height: 93%;
  width: 43%;
}

</style>