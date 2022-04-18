const dircompare = require("dir-compare");
const colors = require("colors");

const options = { compareSize: true };
// Multiple compare strategy can be used simultaneously - compareSize, compareContent, compareDate, compareSymlink.
// If one comparison fails for a pair of files, they are considered distinct.
const path1 = "./dir1";
const path2 = "./dir2";

// Synchronous
// const res = dircompare.compareSync(path1, path2, options)
// print(res)

// Asynchronous
dircompare
  .compare(path1, path2, options)
  .then(res => print(res))
  .catch(error => console.error(error));

function print(result) {
  if (result.same) return console.log(colors.green("Directories are identical."));
  else {
    console.log(colors.red("Directories are NOT identical.\n"));

    // Statistics
    // console.log(colors.cyan("\nStatistics:"));
    // console.log("equal entries: " + result.equal);
    // console.log("distinct entries: " + result.distinct);
    // console.log("left only entries: " + result.left);
    // console.log("right only entries: " + result.right);
    // console.log("differences: " + result.differences + "\n");

    // Difference
    console.log(result);
    const separator = "-----------------";
    result.diffSet.forEach(dif => {
      // file changed
      if (dif.name1 === dif.name2 && dif.type1 === dif.type2 && dif.state === "distinct") {
        const isFile = dif.type1 === "file";
        const type = isFile ? "file" : "directory";
        console.log(colors.cyan(dif.path1 + "/" + dif.name1) + " >> " + colors.cyan(dif.path2 + "/" + dif.name2));
        console.log(colors.white.bold('  "' + dif.name1 + '" ' + type) + colors.yellow(" has been changed!"));
        console.log(separator);
      }
      // file removed/added
      else if (
        (dif.name1 === undefined || dif.name2 === undefined) &&
        (dif.type1 === "missing" || dif.type2 === "missing") &&
        ["left", "right"].includes(dif.state)
      ) {
        const existsInPath1 = dif.state === "left";
        const isFile = dif.type1 === "file" || dif.type2 === "file";
        const type = isFile ? "file" : "directory";
        if (existsInPath1) {
          // list paths
          console.log(colors.cyan(dif.path1 + "/" + dif.name1) + " >> " + colors.cyan(path2 + "/") + colors.red("undefined"));

          // list status aded/removed
          console.log(
            colors.white.bold('  "' + (dif.name1 || dif.name2) + '" ' + type) +
              colors.cyan(" has been added at ") +
              colors.green(dif.path1) +
              colors.cyan(" but removed at ") +
              colors.red(path2)
          );
          console.log(separator);
        } else {
          // list paths
          console.log(colors.cyan(path1 + "/") + colors.red("undefined") + " >> " + colors.cyan(dif.path2 + "/" + dif.name2));

          // list status aded/removed
          console.log(
            colors.white.bold('  "' + (dif.name1 || dif.name2) + '" ' + type) +
              colors.cyan(" has been added at ") +
              colors.green(dif.path2) +
              colors.cyan(" but removed at ") +
              colors.red(path1)
          );
          console.log(separator);
        }
      }
    });
  }
}
