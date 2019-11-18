<template>
<div>
	<button class="backButton" @click="backToProcess"><v-icon color="white">arrow_back</v-icon></button>
	<canvas id="myChart"></canvas>
</div>
</template>

<script>
import { EventBus } from "../../config/event";
import chart from "chart.js"
export default {
	name: "ticketDetails",
	data () {
      return { }
    },
    props: ["room", "title","ticket"],
    mounted() { 
	var ctx = document.getElementById('myChart').getContext('2d');
	let data = {
       	labels: [],
       	datasets: [{
           	backgroundColor: [],
           	borderColor: 'black',
           	data: [2, 10]
       	}]
    };
 	console.log("data",this.ticket);

	for (var item in this.ticket) {
		console.log("--->", this.ticket[item])
		data.labels.push(this.ticket[item].name.get())
		data.datasets[0].backgroundColor.push(this.ticket[item].color.get())
	}
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