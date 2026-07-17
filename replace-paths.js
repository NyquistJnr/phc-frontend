const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const dirs = [
  "c:/Users/nyqui/Work/phc/phc-frontend/src/components/iho-dashboard/patients",
  "c:/Users/nyqui/Work/phc/phc-frontend/src/components/iho-dashboard/appointments",
  "c:/Users/nyqui/Work/phc/phc-frontend/src/components/iho-dashboard/referrals",
  "c:/Users/nyqui/Work/phc/phc-frontend/src/components/iho-dashboard/generics",
  "c:/Users/nyqui/Work/phc/phc-frontend/src/app/iho-dashboard/patients",
  "c:/Users/nyqui/Work/phc/phc-frontend/src/app/iho-dashboard/appointments",
  "c:/Users/nyqui/Work/phc/phc-frontend/src/app/iho-dashboard/referrals"
];

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir, function(filePath) {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.replace(/nurse-dashboard/g, 'iho-dashboard');
        if (content !== newContent) {
          fs.writeFileSync(filePath, newContent, 'utf8');
          console.log('Updated: ' + filePath);
        }
      }
    });
  }
});
