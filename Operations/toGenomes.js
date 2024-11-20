const toGenomes = networks => {
    const genomes = [];
    networks.forEach(network => {
        genomes.push(network.genome)
    });
    return genomes;
}

module.exports = { toGenomes }