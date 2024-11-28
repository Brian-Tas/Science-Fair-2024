const maxArrayLength = arr => {
    let longest = 0;
    
    for (let i = 0; i < arr.length; i++) {
        if(arr[i].length > longest) {
            longest = arr[i].length;
        }
    }
    
    return longest;
}


class Model {
    constructor(network) {
        this.network = network;
        const layers = this.network.genome.layers;
        
        this.canvas = document.createElement(`canvas`);
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = maxArrayLength(layers) * 60 + 20;
        this.canvas.height = 500
        
        this.canvas.style.backgroundColor = "lightblue";
        
        document.body.appendChild(this.canvas);
        
        Model.count++;

        // Model the network

        for(let i = 0; i < layers.length; i++) {
            for(let j = 0; j < layers[i].length; j++) {
                this.circle(j, i, 10, layers[i].length);
            }
        }

        // Connects



        document.getElementById("test").innerHTML = this.network.genome.layers
    }
    static count = 0;

    modelX(index, layer, indexLength) {
        return this.canvas.width/index/2;
    }

    modelY(layer) {
        return this.canvas.height - (layer * 70 + 20);
    }

    circle(index, layer, r = 10, indexLength) {
        this.ctx.beginPath();
        this.ctx.arc(this.modelX(index, layer, indexLength), this.modelY(layer), r, 0, 2 * Math.PI);
        this.ctx.stroke();
    }
}

document.getElementById("modelTest").innerHTML = "model working";

export default Model;