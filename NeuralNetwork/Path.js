class Path {
    constructor(neurons) {
        this.map = new Map();
        this.step = 0;

        neurons.forEach(neuron => {
            this.setStep(neuron);
        });
    }

    getDistance(neuron) {
        const valueArray = Array.from(this.map.values());
        const distance = valueArray.indexOf(neuron);

        if(distance === -1) {
            throw new Error(`Neuron not found in path. Given Neuron: ${neuron} Path: ${Array.from(this.map.values())}`)
        }

        return distance
    }

    setStep(neuron) {
        this.map.set(this.step++, neuron);
    }

    writePath() {
        const neurons = Array.from(this.map.values());
        const pathArray = [];

        neurons.reverse().forEach(neuron => {
            pathArray.push(`->${neuron}`);
        });

        return pathArray.join("");
    }

    getLength() {
        return Array.from(this.map.values()).length
    }
}

module.exports = { Path }