document.getElementById("btn").addEventListener("click", async () => {
    let items = parseCsv(document.getElementById("csv").value);
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true});
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: onRun,
        args: [items],
    });
});
function onRun(items) {
    let itemsCount = items.length;
    let numberString = function (str, num) {
        if (num < 10) {
            return str + "0" + num;
        }
        else {
            return str + num;
        }
    };
    for (let i = 0; i < itemsCount; ++i) {
        let model = numberString("your-model", i + 1);
        let sw = numberString("your-software", i + 1);
        let cond = numberString("your-condition", i + 1);
        
        let elemModel = document.getElementsByName(model);
        let elemSw = document.getElementsByName(sw);
        let elemCond = document.getElementsByName(cond);

        if (elemModel.length != 1 || elemSw.length != 1 || elemCond.length != 1) {
            continue;
        }
        let item = items[i];
        elemModel[0].value = item.model;
        elemSw[0].value = item.sw;
        elemCond[0].value = item.condition;
    }
}
class Item {
    constructor (model, sw, condition) {
        this.model = model;
        this.sw = sw;
        this.condition = condition;
    }
}
function parseCsv(text) {
    let lines = text.split(/\n|\r\n/);
    let linesCount = lines.length;
    let items = [];
    for (let i = 0; i < linesCount; ++i) {
        let tokens = lines[i].split(/[\t,]/);
        if (tokens.length < 3) {
            continue;
        }
        items.push(new Item(tokens[0], tokens[1], tokens[2]));
    }
    return items;
}
