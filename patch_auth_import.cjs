const fs = require("fs");
let code = fs.readFileSync("src/routes/auth.tsx", "utf8");

code = code.replace(
  'import { useAuth } from "../lib/useAuth";',
  'import { useAuth } from "../hooks/useAuth";',
);

fs.writeFileSync("src/routes/auth.tsx", code);
