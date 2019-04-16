"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var component_1 = require("../common/component");
var transition_1 = require("../common/mixins/transition");
component_1.VantComponent({
    mixins: [transition_1.transition(true)],
    props: {
        name: {
            type: String,
            value: "fade"
        }
    }
});
