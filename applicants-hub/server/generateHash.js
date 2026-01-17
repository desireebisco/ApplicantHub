import bcrypt from "bcryptjs";

const password = "test101";

bcrypt.hash(password, 10, (err, hash) => {
  if (err) return console.error(err);
  console.log("Hashed password:", hash);
});