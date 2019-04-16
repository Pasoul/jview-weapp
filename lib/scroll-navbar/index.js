"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var DIRECTION_H = "horizontal";
var DIRECTION_V = "vertical";
component_1.VantComponent({
    props: {
        direction: {
            type: String,
            value: DIRECTION_H
        },
        labels: {
            type: Array,
            value: []
        }
        // txts: {
        //   type: Array,
        //   value: this.labels
        // }
    },
    watch: {
        direction: function (val) {
            if (val !== DIRECTION_H && val !== DIRECTION_V) {
                console.error("direction\u503C\u5FC5\u987B\u662F" + DIRECTION_H + "\u6216" + DIRECTION_V + "\uFF0C\u5F53\u524D\u8BBE\u7F6E" + val);
            }
        }
    }
});
