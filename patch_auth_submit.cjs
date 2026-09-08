const fs = require("fs");
let code = fs.readFileSync("src/routes/auth.tsx", "utf8");

const regex =
  /const submit = async \(e: React\.FormEvent\) => \{[\s\S]*?\} catch \(err: unknown\) \{[\s\S]*?setBusy\(false\);\n  \};/m;

const replacement = `const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in both email and password.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setBusy(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(firebaseAuth, email, password);
        toast.success("Account created successfully!");
        if (claimUsername) {
          navigate({ to: "/claim", search: { u: claimUsername } });
        } else {
          navigate({ to: "/dashboard" });
        }
      } else {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        toast.success("Welcome back!");
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err?.message || "Authentication failed.");
    } finally {
      setBusy(false);
    }
  };`;

code = code.replace(regex, replacement);

code = code.replace(
  /const handleGoogle = async \(\) => \{[\s\S]*?\} catch \(err\) \{[\s\S]*?setBusy\(false\);\n  \};/m,
  `const handleGoogle = async () => {
    setBusy(true);
    try {
      const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
      toast.success("Logged in with Google!");
      if (claimUsername) {
        navigate({ to: "/claim", search: { u: claimUsername } });
      } else {
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to log in with Google");
    } finally {
      setBusy(false);
    }
  };`,
);

fs.writeFileSync("src/routes/auth.tsx", code);
