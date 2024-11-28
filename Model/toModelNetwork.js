import { NeuralNetwork, Genome, Innovation } from "./Network.js";

(async () => {
    await fetch("../Storage/Networks/ModelPop/ModelInnovationTable.json")
    .then(raw => raw.json())
    .then(data => data.innovations.forEach(innovation => {
        Innovation.newInnovation(innovation)
    }));
})();


const toNetwork = async path => {
    path = "../Storage/Networks/" + path;

    let JSONnetwork = null;

    await fetch(path)
    .then(raw => raw.json())
    .then(data => JSONnetwork = data);

    const genome = new Genome(
        JSONnetwork.neurons, 
        JSONnetwork.weights, 
        JSONnetwork.ids, 
        JSONnetwork.order, 
        JSONnetwork.layers
    );


    return new NeuralNetwork(genome, Innovation.innovationTable);
}

export default toNetwork;