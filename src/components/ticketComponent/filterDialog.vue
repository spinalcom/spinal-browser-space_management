<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" scrollable max-width="300px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">filter</v-btn>
      </template>
      <v-card>
        <v-card-title>Select Categories</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
    
  <v-container fluid>
    <div v-for="step in allSteps">
    <v-checkbox v-model="selected" :label="step" :value="step"></v-checkbox>
    </div>
  </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="clickOnSave">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { EventBus } from "../../config/event";

  export default {
    data () {
      return {
        dialog: false,
        allSteps: ["All"],
        selected: ["All"],
        previousSelect: ["All"]
      }
    },
    props: ['steps', "selectedSteps"],
    mounted: function() {
      for (var el in this.steps)
        if (this.allSteps.indexOf(this.steps[el]) == -1 && el !== undefined) {
          this.allSteps.push(this.steps[el]);
          this.selected = this.allSteps;
        }
    },
    methods: {
      clickOnSave() {
        this.triSelection();
        this.dialog = false;
      },
      triSelection() {
        if (this.selected.indexOf("All") !== -1)
          EventBus.$emit("select-steps", this.allSteps );
        else
          EventBus.$emit("select-steps", this.selected );
      },
      arr_diff (a1, a2) {

      var a = [], diff = [];

      for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
      }

      for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
      }

      for (var k in a) {
        diff.push(k);
      }

      return diff;
    }
    },
    watch: {
      selected() {
        let result = this.arr_diff(this.selected, this.allSteps);

        if ( result.indexOf("All") === -1 && result.length != 0) {
          if (this.selected.indexOf("All") !== -1) {
            this.selected.splice(this.selected.indexOf("All"), 1)
          }
        }
        if ( this.selected.indexOf("All") == -1 ) {
          if ( this.selected.length == (this.allSteps.length - 1) )
            this.selected = this.allSteps;
        }
        this.previousSelect = this.selected;
      }
    }
  };
</script>
