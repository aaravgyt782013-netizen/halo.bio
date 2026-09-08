const fs = require("fs");
let code = fs.readFileSync("src/routes/dashboard.tsx", "utf8");

code = code.replace(
  /await auth\.signOut\(\);/g,
  "await firebaseAuth.signOut();",
);
code = code.replace(/import \{ auth \}/g, "import { auth as oldAuth }"); // Or something better

fs.writeFileSync("src/routes/dashboard.tsx", code);
