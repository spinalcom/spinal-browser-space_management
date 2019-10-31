<template>
	<div>
	<div>
		<button class="backButton" @click="backToProcess"><v-icon color="white">arrow_back</v-icon></button>
		<div id="displayMonth"> {{ month}} </div>
	</div>

	<div class="calendar">
	 <v-layout wrap>
    <v-flex
      xs12
      class="mb-3"
    >
      <v-sheet height="500" @click="onClick">
        <v-calendar
          ref="calendar"
          v-model="start"
          :type="type"
          color="primary"
        >
        	<template v-slot:day="{present, past, date}">
        		<div :data="date" class="calendarElement" v-if="totalTicketPerDay(date) != ''">{{ totalTicketPerDay(date) }} </div>
        	</template>
        </v-calendar>
      </v-sheet>
    </v-flex>

    <v-flex
      sm4
      xs12
      class="text-sm-left text-xs-center"
    >
      <v-btn @click="downCalendar">
        <v-icon
          dark
          left
        >
          keyboard_arrow_left
        </v-icon>
        Prev
      </v-btn>
    </v-flex>
    <v-flex
      sm4
      xs12
      class="text-xs-center"
    >
      <v-select
        v-model="type"
        :items="typeOptions"
        label="Type"
      ></v-select>
    </v-flex>
    <v-flex
      sm4
      xs12
      class="text-sm-right text-xs-center"
    >
      <v-btn @click="upCalendar">
        Next
        <v-icon
          right
          dark
        >
          keyboard_arrow_right
        </v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
  </div>
</div>
</template>

<script>
import { EventBus } from "../../config/event";
import dateService from "../../config/dateService";

export default {
	name: "ticketCalendar",
	props: ["selectedTicket", "steps"],
	data: () => ({
    type: 'month',
    start: '',
    month: "",
    end: '2019-01-06',
    typeOptions: [
      { text: 'Day', value: 'day' },
      { text: '4 Day', value: '4day' },
      { text: 'Week', value: 'week' },
      { text: 'Month', value: 'month' },
      { text: 'Custom Daily', value: 'custom-daily' },
      { text: 'Custom Weekly', value: 'custom-weekly' }
    ]
  }),
	methods: {
		backToProcess() {
			EventBus.$emit("getBackToTable");
		},
		onClick(item) {
			let child = item.target.children[1];
			let date = item.target.getAttribute("data");
			if (date !== null)
				dateService.displayPerDay(date);
			else if (child !== undefined)
				if (child.getAttribute("data") !== null)
					dateService.displayPerDay(child.getAttribute("data"));
		},
		totalTicketPerDay(date) {
			return dateService.count(date);
		},
		upCalendar() {
			let self = this;
			this.$refs.calendar.next();


			setTimeout(function() {
				let tmp = self.$refs.calendar.value;
				tmp = new Date(tmp);
				self.month = dateService.monthDigitToString(tmp.getMonth());
			}, 100);
		},
		downCalendar() {
			this.$refs.calendar.prev();
			let self = this;

			setTimeout(function() {
				let tmp = self.$refs.calendar.value;
				tmp = new Date(tmp);
				self.month = dateService.monthDigitToString(tmp.getMonth());
			}, 100);
		}
	},
	mounted() {
		var d = new Date();
		this.start = d.toDateString();
		dateService.init(this.selectedTicket);
		this.month = dateService.monthDigitToString(d.getMonth());
		console.log("->>> ", this.$refs.calendar);
	}
};
</script>

<style>
.backButton {
	box-sizing: border-box !important;
	background-color: black;
    color: white;
    padding: 9px;
    margin-top: 5px;
    margin-left: 8px;
    font-size: 17px; 
    font-family: sans-serif;
    padding-top: 4px;
    width: 90px;
    padding-bottom: 8px;
}
.calendar {
	margin: 15px;
}
#displayMonth {
	display: inline;
	margin-left: 10%;
}
.calendarElement {
    text-align: center;
    margin-top: 9px;
    width: 24px;
    height: 21px;
    border-radius: 50%;
    margin: auto;
    color: white;
    background-color: red;
    padding-top: 2px;
}
</style>