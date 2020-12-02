import * as t from "type-shift";

/**
 * Input of add lambda.
 */
interface InputType {
  first: number;
  second: number;
}

/**
 * Validates or defaults inputs.
 */
const inputTypeConverter = t
  .shape<InputType>({
    first: t.number.default(() => 0),
    second: t.number.default(() => 0),
  })
  .default(() => ({ first: 0, second: 0 }));

/**
 * Add two numbers together. Takes in a payload of
 *   numbers.
 * 
 * @throws Error if input is incorrect.
 * 
 * @param {first} - First number to add
 * @param {second} - Second number to add
 */
export const add = async (payload: InputType) => {
  // Log some stuff.
  const { first, second } = inputTypeConverter(payload);
  console.log("Welcome to my super TYPESCRIPT math lambda!");
  console.log("I'm about to do some TYPED science. Are you ready?");
  console.log(`Time to add ${first} and ${second}!`);
  // Return the answer.
  return first + second;
};
