
const adjectives = [
    "funny","cool"
];

const nouns = [
    "banana","bean"
];

export function generateUsername(): string {
    const adjective = adjectives[Math.floor(Math.random()*adjectives.length)];
    const noun = nouns[Math.floor(Math.random()*nouns.length)];
    const number = Math.floor(Math.random()*1000);

    return `${adjective}-${noun}-${number}`;
}