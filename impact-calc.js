
const driversRates          = { A: 0.015, B: 0.06, C: 0.04, D: 0.10 };
const customersRates        = { A: 0.025, B: 0.09, C: 0.05, D: 0.12 };
const handlingTimeDrivers   = 60 * 4.5
const handlingTimeCustomers = 60 * 8;

//selecting all elements that will be needed later 
const form            = document.querySelector("form");
const userType        = document.getElementsByName("userType");
const amountInput     = document.querySelector(`input[name = "amount"]`)
const body            = document.querySelector("body")
const effectOr        = document.getElementsByName("effectOr")
const responseTime    = document.getElementsByName("responseTime")


// below are placeholders for when both segments are targeted

let amountDriversInput;   
let amountCustomersInput;
const bothContainer = document.createElement("div")

const resultContainer = document.createElement("div")
resultContainer.style.display = "none"
resultContainer.classList.add("result");
body.appendChild(resultContainer);


// Converts user type to array for use in later function and adds listener to each radio
Array.from(userType).forEach(radio => {
  radio.addEventListener("change", handleUserType);
});

function handleUserType () {
    const selection = Array.from(userType).find(r => r.checked).value;

    if (selection === "both"){
        amountInput.style.display = "none";

        if (!amountDriversInput && !amountCustomersInput){

            //driver input
            const driverLabel         = document.createElement("label");
            driverLabel.textContent   = "Amount of drivers";
            const driverInput         = document.createElement("input");
            driverInput.type          = "text";
            driverInput.id            = "amountDrivers";

            //customers
            const customerLabel       = document.createElement("label");
            customerLabel.textContent = "Amount of Customers";
            const customerInput       = document.createElement("input");
            customerInput.type        = "text";
            customerInput.id          = "amountCustomers";
        
            //append to invisible container
            bothContainer.appendChild(driverLabel);
            bothContainer.appendChild(driverInput);
            bothContainer.appendChild(customerLabel);
            bothContainer.appendChild(customerInput);

            //store in variables created above
            amountDriversInput   = driverInput;
            amountCustomersInput = customerInput;

            //insert into DOM 
             amountInput.after(bothContainer);
            } 
            //if not both are selected, remove container
        } else {
            amountInput.style.display = "block"
          while (bothContainer.firstChild){
            bothContainer.removeChild(bothContainer.firstChild)
          }
          amountDriversInput   = null;
          amountCustomersInput = null;
        }
};


const submitButton = document.getElementById("submitAll");
submitButton.addEventListener("click",formHandler);

function formHandler (event) {
    event.preventDefault();

    //get values from inputs used in calculation
    const selection = Array.from(userType).find(r => r.checked).value;
    const inputReq  = Array.from(effectOr).find(r => r.checked).value;
    const backlogg  = Array.from(responseTime).find(r => r.checked).value;

    //get numeric values of amounts
    let amount         = 0
    let driversAmount  = 0
    let customerAmount = 0 
    if (selection === "customers"){
        amount = Number(amountInput.value);
    } else if (selection === "both") {
        driversAmount  = Number(amountDriversInput.value);
        customerAmount = Number(amountCustomersInput.value);
    } else if (selection === "drivers") {
        amount = Number(amountInput.value);
    } 

    //figure out scenario 
        let scenario;
        if (backlogg === "less3" && inputReq === "no") {
            scenario = "A";
        } else if (backlogg === "less3" && inputReq === "yes"){
            scenario = "C";
        } else if (backlogg === "more3" && inputReq === "no") {
            scenario = "B";
        } else if (backlogg === "more3" && inputReq === "yes") {
            scenario = "D";
        } else if (backlogg === "unknown" && inputReq === "yes") {
            scenario = "D";
        } else {
            scenario = "C";
        }

        //determine rate to calculate number of enquiries
            let driverRate; 
            let customerRate;
            let expectedDriver;
            let expectedCustomer;
            let expectedWorkload;
            if (selection === "drivers"){
                driverRate       = driversRates[scenario] 
                expectedDriver   = driverRate * amount
                expectedWorkload = ((expectedDriver * handlingTimeDrivers) / 3600).toFixed(1)
            } else if (selection === "customers"){
                customerRate     = customersRates[scenario]
                expectedCustomer = customerRate * amount
                expectedWorkload = ((expectedCustomer * handlingTimeCustomers) / 3600).toFixed(1)
            } else {
                customerRate     = customersRates[scenario]
                driverRate       = driversRates[scenario]
                expectedDriver   = driverRate   * driversAmount
                expectedCustomer = customerRate * customerAmount
                expectedWorkload = (((expectedDriver * handlingTimeDrivers)+ (expectedCustomer * handlingTimeCustomers)) / 3600).toFixed(1)
            }
        form.style.display = "none"
        while (resultContainer.firstChild){
            resultContainer.removeChild(resultContainer.firstChild);
        }
        console.log(scenario, selection);
        //driver scenarios
        if (scenario === "A" && selection === "drivers") {
            resultContainer.style.display = "block"
            const aText = document.createElement("h3");
            aText.textContent = "Drivers - sending out emails with low response times and no response required";
            const responses = document.createElement("p");
            responses.textContent = `Expected enquiry volume : ${expectedDriver} enquiries.`
            const workLoad = document.createElement("p");
            workLoad.textContent = `Calculated workload : ${expectedWorkload} hours.`
            resultContainer.appendChild(aText);
            resultContainer.appendChild(responses);
            resultContainer.appendChild(workLoad);

        } else if (scenario === "B" && selection === "drivers") {
            resultContainer.style.display = "block"
            const aText = document.createElement("h3");
            aText.textContent = "Drivers - sending out emails with high response times and no response required";
            const responses = document.createElement("p");
            responses.textContent = `Expected enquiry volume : ${expectedDriver} enquiries.`
            const workLoad = document.createElement("p");
            workLoad.textContent = `Calculated workload : ${expectedWorkload} hours.`
            resultContainer.appendChild(aText);
            resultContainer.appendChild(responses);
            resultContainer.appendChild(workLoad);

        } else if (scenario === "C" && selection === "drivers") {
            resultContainer.style.display = "block"
            const aText = document.createElement("h3");
            aText.textContent = "Drivers - sending out emails with low response times and response required";
            const responses = document.createElement("p");
            responses.textContent = `Expected enquiry volume : ${expectedDriver} enquiries.`
            const workLoad = document.createElement("p");
            workLoad.textContent = `Calculated workload : ${expectedWorkload} hours.`
            resultContainer.appendChild(aText);
            resultContainer.appendChild(responses);
            resultContainer.appendChild(workLoad);

        } else if (scenario === "D" && selection === "drivers") {
            resultContainer.style.display = "block"
            const aText = document.createElement("h3");
            aText.textContent = "Drivers - sending out emails with high response times and response required";
            const responses = document.createElement("p");
            responses.textContent = `Expected enquiry volume : ${expectedDriver} enquiries.`
            const workLoad = document.createElement("p");
            workLoad.textContent = `Calculated workload : ${expectedWorkload} hours.`
            resultContainer.appendChild(aText);
            resultContainer.appendChild(responses);
            resultContainer.appendChild(workLoad);

            //customer scenarios
        } else  if (scenario === "A" && selection === "customers") {
            resultContainer.style.display = "block"
            const aText = document.createElement("h3");
            aText.textContent = "Customers - sending out emails with low response times and no response required";
            const responses = document.createElement("p");
            responses.textContent = `Expected enquiry volume : ${expectedCustomer} enquiries.`
            const workLoad = document.createElement("p");
            workLoad.textContent = `Calculated workload : ${expectedWorkload} hours.`
            resultContainer.appendChild(aText);
            resultContainer.appendChild(responses);
            resultContainer.appendChild(workLoad);

        } else if (scenario === "B" && selection === "customers") {
            resultContainer.style.display = "block"
            const aText = document.createElement("h3");
            aText.textContent = "Customers - sending out emails with high response times and no response required";
            const responses = document.createElement("p");
            responses.textContent = `Expected enquiry volume : ${expectedCustomer} enquiries.`
            const workLoad = document.createElement("p");
            workLoad.textContent = `Calculated workload : ${expectedWorkload} hours.`
            resultContainer.appendChild(aText);
            resultContainer.appendChild(responses);
            resultContainer.appendChild(workLoad);

        } else if (scenario === "C" && selection === "customers") {
            resultContainer.style.display = "block"
            const aText = document.createElement("h3");
            aText.textContent = "Customers - sending out emails with low response times and response required";
            const responses = document.createElement("p");
            responses.textContent = `Expected enquiry volume : ${expectedCustomer} enquiries.`
            const workLoad = document.createElement("p");
            workLoad.textContent = `Calculated workload : ${expectedWorkload} hours.`
            resultContainer.appendChild(aText);
            resultContainer.appendChild(responses);
            resultContainer.appendChild(workLoad);

        } else if (scenario === "D" && selection === "customers") {
            resultContainer.style.display = "block"
            const aText = document.createElement("h3");
            aText.textContent = "Customers - sending out emails with high response times and response required";
            const responses = document.createElement("p");
            responses.textContent = `Expected enquiry volume : ${expectedCustomer} enquiries.`
            const workLoad = document.createElement("p");
            workLoad.textContent = `Calculated workload : ${expectedWorkload} hours.`
            resultContainer.appendChild(aText);
            resultContainer.appendChild(responses);
            resultContainer.appendChild(workLoad);

        //both scenarios
        }  else  if (scenario === "A" && selection === "both") {
            resultContainer.style.display = "block"
            const aText = document.createElement("h3");
            aText.textContent = "Customers & drivers - sending out emails with low response times and no response required";
            const responses = document.createElement("p");
            responses.textContent = `Expected customer volume : ${expectedCustomer} enquiries.`
            const dResponses = document.createElement("p");
            dResponses.textContent = `Expected driver volume : ${expectedDriver} enquiries.`
            const workLoad = document.createElement("p");
            workLoad.textContent = `Calculated workload : ${expectedWorkload} hours.`
            resultContainer.appendChild(aText);
            resultContainer.appendChild(responses);
            resultContainer.appendChild(dResponses);
            resultContainer.appendChild(workLoad);

        } else if (scenario === "B" && selection === "both") {
            resultContainer.style.display = "block"
            const aText = document.createElement("h3");
            aText.textContent = "Customers & drivers - sending out emails with high response times and no response required";
            const responses = document.createElement("p");
            responses.textContent = `Expected customer volume : ${expectedCustomer} enquiries.`
            const dResponses = document.createElement("p");
            dResponses.textContent = `Expected driver volume : ${expectedDriver} enquiries.`
            const workLoad = document.createElement("p");
            workLoad.textContent = `Calculated workload : ${expectedWorkload} hours.`
            resultContainer.appendChild(aText);
            resultContainer.appendChild(responses);
            resultContainer.appendChild(dResponses);
            resultContainer.appendChild(workLoad); 

        } else if (scenario === "C" && selection === "both") {
            resultContainer.style.display = "block"
            const aText = document.createElement("h3");
            aText.textContent = "Customers & drivers - sending out emails with low response times and response required";
            const responses = document.createElement("p");
            responses.textContent = `Expected customer volume : ${expectedCustomer} enquiries.`
            const dResponses = document.createElement("p");
            dResponses.textContent = `Expected driver volume : ${expectedDriver} enquiries.`
            const workLoad = document.createElement("p");
            workLoad.textContent = `Calculated workload : ${expectedWorkload} hours.`
            resultContainer.appendChild(aText);
            resultContainer.appendChild(responses);
            resultContainer.appendChild(dResponses);
            resultContainer.appendChild(workLoad);
            
        } else if (scenario === "D" && selection === "both") {
            resultContainer.style.display = "block"
            const aText = document.createElement("h3");
            aText.textContent = "Customers - sending out emails with high response times and response required";
            const responses = document.createElement("p");
            responses.textContent = `Expected customer volume : ${expectedCustomer} enquiries.`
            const dResponses = document.createElement("p");
            dResponses.textContent = `Expected driver volume : ${expectedDriver} enquiries.`
            const workLoad = document.createElement("p");
            workLoad.textContent = `Calculated workload : ${expectedWorkload} hours.`
            resultContainer.appendChild(aText);
            resultContainer.appendChild(responses);
            resultContainer.appendChild(dResponses);
            resultContainer.appendChild(workLoad);
        } 
        const newCalc = document.createElement("button")
        newCalc.textContent = "New calculation";
        resultContainer.appendChild(newCalc)

        newCalc.addEventListener("click", newCalculation)
}

function newCalculation (event) {
    event.preventDefault();
    resultContainer.style.display = "none";
    form.style.display = "block";
    amountInput.value = "";
    

    if (amountDriversInput) amountDriversInput.value = "";
    if (amountCustomersInput) amountCustomersInput.value = "";

    Array.from(userType).forEach(radio => radio.checked = false)
    Array.from(effectOr).forEach(radio => radio.checked = false)
    Array.from(responseTime).forEach(radio => radio.checked = false)
}
