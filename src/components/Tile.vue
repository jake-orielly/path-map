<template>
    <td 
        class="clickable"
        :style="{ backgroundColor: getColor(),
        border: (showingGridLines ? '1px solid black' : '')}"
        @click="$emit('click', x, y)"
        @mousedown="$emit('setDrag',x, y, true)"
        @mouseup="$emit('setDrag',x, y, false)"
        @mouseover="$emit('dragEvent',x, y)"
    >
        <img 
            v-if="tile.entity"
            :src="getImgUrl(tile.entity)"
            class="entity-img"
        >
        <img 
            v-if="showingTerrain"
            :src="getImgUrl(tile.terrain)"
            class="terrain-img"
        >
        <span
            v-if="shouldShow()"
        >
            {{tile.value}}
        </span>
        <div 
            class="path-node" 
            v-if="showingPath"
        ></div>
    </td>
</template>

<script>
import utilities from "../js/utilities.js"

export default {
    props: {
        tile: {
            type: Object,
            required: true
        },
        x: {
            type: Number,
            required: true
        },
        y: {
            type: Number,
            required: true
        },
        showingValues: {
            type: Boolean,
            required: true
        },
        showingColors: {
            type: Boolean,
            required: true
        },
        showingPath: {
            type: Boolean,
            required: true
        },
        showingTerrain: {
            type: Boolean,
            required: true
        },
        showingGridLines: {
            type: Boolean,
            required: true
        },
        rgbMapColor: {
            type: Array,
            required: true
        }
    },
	methods: {
        shouldShow() {
            if (this.tile.terrain.substr(0,4) == "wall" || this.tile.entity)
                return false;
            return this.showingValues || isNaN(this.tile.value)
        },
        getColor() {
            if (!this.showingColors || isNaN(this.tile.value))
                return "rgba(0,0,0,0)";
            else {
                return `rgba(${this.rgbMapColor.join(",")},${(this.tile.value / this.maxVal) * 0.7})`;
            }
        },
        getImgUrl(item) {
            return utilities.getImgUrl(item);
        }
	}
};
</script>

<style scoped>

img, td {
    height: 3rem;
    width: 3rem;
}

td {
    position: relative;
    font-size: 2rem;
    text-align: center;
    margin: 0;
    padding: 0;
}


span {
    z-index: 3;
}

.terrain-img, .entity-img {
    position: absolute;
    top: 0;
    left: 0;
}

.terrain-img {
    z-index: -1;
}

.entity-img {
    z-index: 2;
}

.path-node {
    position: absolute;
    width: 1rem;
    height: 1rem;
    border-radius: 1rem;
    bottom: 0rem;
    background-color: blue;
    z-index: 2;
}
</style>