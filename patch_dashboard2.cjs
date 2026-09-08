const fs = require("fs");
let code = fs.readFileSync("src/routes/dashboard.tsx", "utf8");

code = code.replace(
  /import \{/,
  'import { firebaseAuth } from "@/lib/firebase";\nimport {',
);

fs.writeFileSync("src/routes/dashboard.tsx", code);
