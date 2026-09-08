const fs = require("fs");
let code = fs.readFileSync("src/components/ProfileView.tsx", "utf8");

const target = '            )}\n          <div className="mt-5 space-y-2.5">';
const idx = code.indexOf(target);
if (idx !== -1) {
  console.log("Found!");
  code =
    code.substring(0, idx) +
    '            )}\n          </div>\n          <div className="mt-5 space-y-2.5">' +
    code.substring(idx + target.length);
  fs.writeFileSync("src/components/ProfileView.tsx", code);
} else {
  console.log("Not found target. Trying generic search.");
  // try another
  code = code.replace(
    /<\/div>[\s\n]*\)\}[\s\n]*<div className="mt-5 space-y-2\.5">/m,
    '</div>\n            )}\n          </div>\n          <div className="mt-5 space-y-2.5">',
  );
  fs.writeFileSync("src/components/ProfileView.tsx", code);
}
