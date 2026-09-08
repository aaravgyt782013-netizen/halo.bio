const fs = require("fs");
let code = fs.readFileSync("src/routes/auth.tsx", "utf8");

code = code.replace(
  /import \{ auth \} from "@\/lib\/bio";/,
  'import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";\nimport { firebaseAuth } from "@/lib/firebase";',
);

code = code.replace(
  /const \{ data, error \} = await auth.signUp\(\{\s+email: formData.email,\s+password: formData.password,\s+options: \{\s+data: \{ full_name: formData.name \},\s+\},\s+\}\);/,
  `let error = null;
        try {
          await createUserWithEmailAndPassword(firebaseAuth, formData.email, formData.password);
        } catch (err) {
          error = err;
        }`,
);

code = code.replace(
  /const \{ error \} = await auth.signInWithPassword\(\{\s+email: formData.email,\s+password: formData.password,\s+\}\);/,
  `let error = null;
        try {
          await signInWithEmailAndPassword(firebaseAuth, formData.email, formData.password);
        } catch (err) {
          error = err;
        }`,
);

fs.writeFileSync("src/routes/auth.tsx", code);
