import { VantComponent } from "../common/component";
import { transition } from "../common/mixins/transition";
VantComponent({
    mixins: [transition(true)],
    props: {
        name: {
            type: String,
            value: "fade"
        }
    }
});
