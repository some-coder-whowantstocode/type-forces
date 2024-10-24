export function LinearCongruentialGenerator(seed : number){
    const modulus = 2 ** 31 -1;
    const multiplier = 48271;
    const increment = 0;

    return (multiplier * seed + increment) % modulus;
}