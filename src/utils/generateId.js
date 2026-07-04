// This will just contain a function to generate random unique ids for every reservations
export function generateId(){
    return crypto.randomUUID().toString();
}


// generating random number between 0 and 1
// const random = Math.random()
// console.log(random)

// generating random number between 0 and 10
// const randomInt = Math.floor(Math.random() * 10); 
// console.log(randomInt)


// GUID -> Globally Unique Identifier
// UUID -> Universally Unique Identifier
// generating random unique id using crypto module
// const randomID = crypto.randomUUID()
// console.log(randomID)
// console.log(randomID.length)
