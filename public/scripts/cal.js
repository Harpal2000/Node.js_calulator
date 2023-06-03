
let num = '';
function appendNumber(number) {
    num = number;
    const outputDiv = document.getElementById('output_div');
    if (outputDiv.textContent === '0') {
        outputDiv.textContent = number;
    } else {
        outputDiv.textContent += number;
    }
}

function changeSign() {
    currentNum = (parseFloat(num) * -1).toString();
    const outputDiv = document.getElementById('output_div');
    outputDiv.textContent = currentNum;
}

function appendOperator(operator) {
    const outputDiv = document.getElementById('output_div');
    if (outputDiv.textContent === '0') {
        outputDiv.textContent = operator;
        return;
    }
    outputDiv.textContent += operator;
}

function clearOutput() {
    const outputDiv = document.getElementById('output_div');
    outputDiv.textContent = '0';
}

function calculateResult() {
    const outputDiv = document.getElementById('output_div');
    const expression = outputDiv.innerText;

    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/calculate', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);
            outputDiv.innerText = result;
            localStorage.setItem('expression', expression);
            localStorage.setItem('result', result);
        } else {
            console.error('Error:', xhr.status);
        }
    };

    xhr.onerror = function () {
        console.error('Request failed');
    };

    xhr.send(JSON.stringify({ expression }));
}

function saveData() {
    const name = document.getElementById('getName').value;
    const expression = localStorage.getItem('expression');
    const result = localStorage.getItem('result');


    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/store_data', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Data saved successfully.');
                location.reload();
            } else {
                console.error('Failed to save data.');
            }
        }
    };
    xhr.send(JSON.stringify({ name, expression, result }));
}

function getData() {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.response);
            var tableTag = ` <table id="calTable" cellspacing="0" cellpadding="15">
                <thead>
                    <tr>
                        <th><input type="checkbox" name="sno" id="sno" checked></th>
                        <th>Name</th>
                        <th>Calculations</th>
                        <th>Result</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>`;
            data.forEach(function (value, index) {
                tableTag += `<tr>`;
                tableTag += `<td><input type="checkbox" name="sno" id="sno" checked></td>`;
                tableTag += `<td>${value.name}</td>`;
                tableTag += `<td>${value.expression}</td>`;
                tableTag += `<td>${value.result}</td>`;
                tableTag += `<td><button onclick="deleteCal('${value.id}')" id="delBtn"><i class="fa fa-trash"></i></button></td>`;
                tableTag += `</tr>`;
            });
            tableTag += `</tbody></table>`;
            document.getElementById("tableBody").innerHTML = tableTag;
        }
    }
    http.open("get", "/getData", true);
    http.send();
}


function deleteCal(id) {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.response);
            location.reload();
        }
    }
    http.open("get", `/deleteCal?id=${id}`, true);
    http.send();
}