/**
 * Add two numbers together. Takes in a payload of
 *   numbers.
 *
 * @param {first} - First number to add
 * @param {second} - Second number to add
 */
exports.add = async ({ first = 0, second = 0 }) => {
  // Log some stuff.
  console.log("Welcome to my super deluxe math lambda!");
  console.log("I'm about to do some extreme science. Are you ready?");
  console.log(`Time to add ${first} and ${second}!`);
  // Return the answer.
  return first + second;
};
