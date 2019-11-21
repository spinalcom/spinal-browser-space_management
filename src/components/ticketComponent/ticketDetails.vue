<template>
<div>
	<button class="backButton" @click="backToProcess"><v-icon color="white">arrow_back</v-icon></button>
	<select>
		<option value="circle">circle</option>
		<option value=""></option>
	</select>
	<canvas id="myChart"></canvas>
</div>
</template>

<script>
import { EventBus } from "../../config/event";
import chart from "chart.js"
export default {
	name: "ticketDetails",
	data () {
      return {
      	data: {
       	labels: [],
       	datasets: [{ 
           	backgroundColor: [],
           	borderColor: 'black',
           	data: []
       	}]
    	},
      }
    },
    props: ["room", "title","ticket"],
    mounted() { 
	var ctx = document.getElementById('myChart').getContext('2d');
 	let count = 0;
	for (var item in this.ticket) {
		this.data.labels.push(this.ticket[item].name.get())
		this.data.datasets[0].backgroundColor.push(this.ticket[item].color.get())
		for (var room in this.ticket[item].allRooms)
			for (var iterator in this.ticket[item].allRooms[room].space)
				if (this.ticket[item].allRooms[room].space[iterator].space)
					count = count + parseInt(this.ticket[item].allRooms[room].space[iterator].space);

		this.data.datasets[0].data.push(count);
		count = 0;
	}
	let data = this.data;
	var chart = new Chart(ctx, {
    	// The type of chart we want to create
    	type: 'doughnut',

    	// The data for our dataset
    	data,

    	// Configuration options go here
    	options: {}
	});
    },
    methods: {
    	backToProcess() {
    		EventBus.$emit("close-details");
    	},
    	onClick() {
    		EventBus.$emit("click-details", this.ticket.idObject )
    	}
    }
};
</script>

<style>
.displayInline {
	display: inline-flex;
}
#displayDetails {
	padding-top: 50px;
}
.colorPatchDisplay {
	width: 100px;
	padding-top : 14px;
	margin-left: 10px;
	border-style: solid;
}
.backButton {
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
.applicationDetailsDisplay {
	border: 1px solid;
	height: 25px;
}
.applicationFloatDisplay {
	float: right;
}
.processDisplayColor {
	margin-top: 10px;
	border: 1px solid;
	height: 100px;
	width:  18%;
	display: inline-block;
}
.informationTicketDisplay {
	border: 1px solid;
	height: 100px;
	padding-left: 5px;
	width: 80%;
	float: right;
    margin-top: 11px;
}
.lineDisplayInfo {
	margin-top: 6px;
}
#textDetails {
	border: 1px solid;
	height: 60px;
}
.elementToDisplayDetails {
border: 0.1px solid;
}
</style>