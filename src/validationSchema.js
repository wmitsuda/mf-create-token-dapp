import * as Yup from "yup";

const initialValues = {
  tokenName: "Testcoin",
  tokenSymbol: "TEST",
  initialSupply: "100",
  initialOwner: "0xe3f0D0ECfD7F655F322A05d15C996748Ad945561"
};

const createValidationSchema = web3 => {
  return Yup.object().shape({
    tokenName: Yup.string()
      .required("Value is required")
      .min(5, "Token name must have a minimum of 5 characters")
      .max(30, "Token name must have a maximum of 30 characters")
      .matches(
        /^\s*\w+[\w\s]*$/,
        "Token name must have at least one alphanumeric character"
      ),
    tokenSymbol: Yup.string()
      .required("Value is required")
      .min(1, "Token symbol must have a minimum of 1 character")
      .max(20, "Token symbol must have a maximum of 20 characters")
      .matches(
        /^[A-Z][A-Z\d]*$/,
        "Token symbol must start with a letter followed by letters or numbers"
      ),
    initialSupply: Yup.number()
      .typeError("Value must be an integer number")
      .integer("Value must be an integer number")
      .required("Value is required")
      .min(1, "Value must be at least 1")
      .max(1000000000, "Value must be less than 1 billion"),
    initialOwner: Yup.string()
      .trim()
      .required("Value is required")
      .test("isAddress", "Value is not an ETH address", value => {
        return web3.utils.isAddress(value);
      })
  });
};

export { initialValues, createValidationSchema };
