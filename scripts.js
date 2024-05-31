function generateCombinations(e, t = "", asteriskPositions = []) {
  if (!(results.length >= maxResults)) {
    if (0 === e.length) {
      if (t.length > 0 && luhnCheck(t)) {
        results.push({ number: t, asteriskPositions: asteriskPositions });
      }
    } else {
      let n = e[0];
      if (n >= "0" && n <= "9") {
        generateCombinations(e.substring(1), t + n, asteriskPositions);
      } else if (n.match(/[a-zA-Z]/)) {
        let l = n.toLowerCase();
        if (void 0 === letterMap[l]) {
          for (let n = 0; n < 10; n++) {
            letterMap[l] = n;
            generateCombinations(e.substring(1), t + n, asteriskPositions);
          }
          letterMap[l] = void 0;
        } else {
          generateCombinations(
            e.substring(1),
            t + letterMap[l],
            asteriskPositions
          );
        }
      } else if ("*" === n) {
        for (let n = 0; n < 10; n++) {
          generateCombinations(e.substring(1), t + n, [
            ...asteriskPositions,
            t.length,
          ]);
        }
      }
    }
  }
}

function startGeneration() {
  let e = document.getElementById("inputField").value,
    t = e.replace(/[^a-zA-Z0-9*]/g, "");
  (results = []),
    (letterMap = {}),
    t.length > 0 && generateCombinations(t),
    displayResults();
}

function displayResults() {
  let e = document.getElementById("inputField").value,
    formattedResults = results.map((result) => {
      let n = result.number;
      let formattedNumber = "";
      let offset = 0;

      for (let t = 0; t < e.length; t++) {
        if (" " === e[t]) {
          formattedNumber += " ";
          offset++;
        } else if ("*" === e[t]) {
          formattedNumber +=
            '<span style="color:red">' + n[t - offset] + "</span>";
        } else {
          formattedNumber += n[t - offset];
        }
      }

      return formattedNumber;
    }),
    n = "生成的卡号数量：",
    l =
      results.length >= maxResults
        ? `生成的卡号过多，仅显示前 ${maxResults} 条`
        : results.length;
  document.getElementById("countText").textContent = n;
  document.getElementById("count").textContent = l;
  document.getElementById("result").innerHTML = formattedResults.join("<br>");
}

function clearInput() {
  (document.getElementById("inputField").value = ""), handleInput();
}

function handleInput() {
  let e = document.getElementById("inputField"),
    t = e.value,
    n = t.replace(/[^a-zA-Z0-9*\s]/g, "").replace(/\s+/g, " ");
  e.value = n;
  let l = n.replace(/[^a-zA-Z0-9*]/g, "").length;
  document.getElementById("validCount").textContent = `${l}`;
}

function luhnCheck(e) {
  let t = e.length,
    n = t % 2,
    l = 0;
  for (let u = t - 1; u >= 0; u--) {
    let t = parseInt(e[u], 10);
    (u + n) % 2 == 0 && ((t *= 2), t > 9 && (t -= 9)), (l += t);
  }
  return l % 10 == 0;
}

let results = [],
  letterMap = {},
  maxResults = 5e4;

document.getElementById("inputField").addEventListener("input", function () {
  handleInput(), startGeneration();
});

document
  .getElementById("generateButton")
  .addEventListener("click", function () {
    clearInput(),
      document.getElementById("inputField").focus(),
      startGeneration();
  });
