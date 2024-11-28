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
        
        this.canvas = document.createElement(`canvas`);
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = 100//maxArrayLength(this.network.genome.layers) * 60 + 20;
        
        this.canvas.style.backgroundColor = "lightblue";
        
        document.body.appendChild(this.canvas);
        
        Model.count++;
    }
    static count = 0;

    modelX(index) {
        return index * 60 + 20;
    }

    modelY(layer) {
        return this.canvas.height - (layer * 70 + 20);
    }

    circle(index, layer, r = 10) {
        this.ctx.beginPath();
        this.ctx.arc(this.modelX(index), this.modelY(layer), r, 0, 2 * Math.PI);
        this.ctx.stroke();
    }
}

document.getElementById("modelTest").innerHTML = "model working";

export default Model;