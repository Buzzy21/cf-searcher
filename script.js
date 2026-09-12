const APIURL = 'https://codeforces.com/api/problemset.problems';

let problemsList = []

async function fetchCodeforces() {
    let response = await fetch(APIURL);
    let data = await response.json();
    problemsList = data.result.problems;
}
fetchCodeforces();

const problemInput = document.getElementById("problemKey");
const problemDisplay = document.getElementById("problemDisplay");
const ratingInput = document.getElementById("showRating");

let showingRating = ratingInput.checked;

function getMatchValue(key, id, prefLen) {
    key = key.toLowerCase(); id = id.toLowerCase();
    key = key.replaceAll(" ",""); id.replaceAll(" ","");

    /*
    Calculation:
    For each starting index i of id, use two pointer to get how similar their subsequence is
    consecutive squared (negative up to a bound when gaps), and sum all these similarities

    Can probably improve speed of this algorithm, but string lengths aren't long anyways
    */

    let totalValue = 0;

    for(let i = 0; i < id.length; i++) {
        let index = 0, streak = 0;
        
        for(let j = i; j < id.length; j++) {
            if(index < key.length && key[index]===id[j]) {
                streak += 1;
                totalValue += streak**3;
                if(j+1==prefLen && streak==prefLen) return 9999999;

                index++;
            }
            else {
                streak = 0;
            }
        }
    }

    return totalValue;
}

function getProblems(key, matchThreshold) {
    let qualified = [];

    for(let i = 0; i < problemsList.length; i++) {
        let problem = problemsList[i];
        let id = problem.contestId+problem.index+problem.name;

        let matchValue = getMatchValue(key,id,String(problem.contestId).length+problem.index.length);

        if(matchValue >= matchThreshold*id.length) {
            qualified.push([matchValue,problem]);
        }
    }
    qualified.sort(); qualified.reverse();
    return qualified;
}

problemForm.addEventListener("submit",function(event) {
    event.preventDefault();
    
    const keyInput = problemInput.value;
    
    const qualifiedProblems = getProblems(keyInput,50);
    problemDisplay.innerHTML = '';

    for(let i = 0; i < qualifiedProblems.length; i++) {
        const problem = qualifiedProblems[i][1];

        const li = document.createElement('li');
        li.textContent = `${problem.contestId}${problem.index} ${problem.name} - `;

        if(showingRating) li.textContent += `${problem.rating} - `
        
        const link = document.createElement('a');
        link.href = `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`;
        link.textContent = "View Problem";
        link.target = "_blank";

        li.append(link);
        problemDisplay.append(li);
    };
});

ratingInput.addEventListener("change", function(){
    showingRating = ratingInput.checked;
});