import Model from "./Model.js";
import toNetwork from "./toModelNetwork.js";

const population = 1;
let models = [];

/*(async () => {
    models.push(new Model(toNetwork("model")))
})();

models[0].circle(0, 0)
models[0].circle(1, 0)*/

document.getElementById("mainTest").innerHTML = "main working";

(async () => {
    const network = (await toNetwork("ModelPop/Model1.json"))
    const model = new Model(network);
})();