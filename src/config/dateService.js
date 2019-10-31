
import { EventBus } from "../config/event";

let dateService = {
	tickets: [],
	init(date) {
		this.tickets = date;
	},
	displayPerDay(date) {
		let arrayOfTickets = [];
		let tmp;
		let toCompare;
		toCompare = new Date(date);
		for (var ticket in this.tickets) {
			tmp = new Date(this.tickets[ticket].creationDate.get());
			if (tmp.toDateString() == toCompare.toDateString())
				arrayOfTickets.push(this.tickets[ticket]);
		}
		EventBus.$emit("calendar-tickets", arrayOfTickets);
	},
	count(date) {
		let tmp;
		let toCompare;
		let count = 0;
		toCompare = new Date(date);

		for (var ticket in this.tickets) {
			tmp = new Date(this.tickets[ticket].creationDate.get());
			if (tmp.toDateString() == toCompare.toDateString())
				count++;
		}
		return count;
	},
	monthDigitToString(digitMonth) {
		const month = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre']

		return month[digitMonth];
	}
}

export default dateService;