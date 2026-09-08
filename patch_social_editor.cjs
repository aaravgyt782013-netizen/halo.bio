const fs = require("fs");
let code = fs.readFileSync("src/components/SocialLinksEditor.tsx", "utf8");

// 1. Add states
code = code.replace(
  /const \[customIconUrl, setCustomIconUrl\] = useState\(""\);/,
  `const [customIconUrl, setCustomIconUrl] = useState("");
  const [customFullCover, setCustomFullCover] = useState(false);
  const [customRemoveBg, setCustomRemoveBg] = useState(false);`,
);

code = code.replace(
  /const \[editIconUrlValue, setEditIconUrlValue\] = useState\(""\);/,
  `const [editIconUrlValue, setEditIconUrlValue] = useState("");
  const [editFullCover, setEditFullCover] = useState(false);
  const [editRemoveBg, setEditRemoveBg] = useState(false);`,
);

// 2. Set edit states when clicking edit
code = code.replace(
  /setEditIconUrlValue\(link\.icon_url \|\| ""\);/,
  `setEditIconUrlValue(link.icon_url || "");
      setEditFullCover(!!link.full_cover);
      setEditRemoveBg(!!link.remove_bg);`,
);

// 3. Add to new custom icon
code = code.replace(
  /icon_url: customIconUrl\.trim\(\) \|\| undefined,/,
  `icon_url: customIconUrl.trim() || undefined,
        full_cover: customFullCover,
        remove_bg: customRemoveBg,`,
);

// Reset them after add
code = code.replace(
  /setCustomIconUrl\(""\);/,
  `setCustomIconUrl("");
      setCustomFullCover(false);
      setCustomRemoveBg(false);`,
);

// 4. Add to edited icon
code = code.replace(
  /icon_url: editIconUrlValue\.trim\(\) \|\| undefined,/,
  `icon_url: editIconUrlValue.trim() || undefined,
            full_cover: editFullCover,
            remove_bg: editRemoveBg,`,
);

fs.writeFileSync("src/components/SocialLinksEditor.tsx", code);
