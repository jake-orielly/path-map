<template>
    <div>
        <label class="switch">
            <input type="checkbox" v-model="sliderVal" @change="toggled"/>
            <span class="slider round"></span>
        </label>
        <span v-if="sliderVal">{{onLabel}}</span>
        <span v-if="!sliderVal">{{offLabel}}</span>
    </div>
</template>

<script>
export default {
    props: {
        onLabel: {
            type: String,
            required: true
        },
        offLabel: {
            type: String,
            required: true
        },
        defaultValue: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    created() {
        this.sliderVal = this.defaultValue;
    },
    data() {
        return {
            sliderVal:true
        };
	},
	methods: {
		toggled() {
			this.$emit("toggle");
		}
	}
};
</script>

<style scoped>
span {
    font-size: 2rem;
    vertical-align: bottom;
}

.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    margin-right: 1rem;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.1s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 1.75rem;
    width: 1.75rem;
    left: 2px;
    bottom: 3px;
    background-color: white;
    transition: 0.1s;
}

input:checked + .slider {
    background-color: #2196f3;
}

input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
    transform: translateX(1.75rem);
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}

@media(max-width:1300px) {
    span {
        font-size: 1.5rem;
        vertical-align: middle;
    }

    .slider:before {
        height: 1.5rem;
        width: 1.5rem;
        left: 4px;
        bottom: 2px;
    }

    .slider.round {
        height: 1.75rem;
    }
}
</style>