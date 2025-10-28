
const responseRates = {
  drivers: {
    A: [0.01, 0.02], //<3 days response times & no input required
    B: [0.05, 0.07], //>3 Days response times & no input required
    C: [0.03, 0.05], //<3 days response times & input required
    D: [0.08, 0.12]  //>3 days response times & input required
  },
  customers: {
    A: [0.02, 0.03], //<3 days response times & no input required
    B: [0.08, 0.10], //>3 Days response times & no input required
    C: [0.04, 0.06], //<3 days response times & input required
    D: [0.10, 0.14]  //>3 days response times & input required
  }
};

//selecting all elements that will be needed later 
const form = document.querySelector("form");
const userType = document.getElementsByName("userType");
const amountInput = document.querySelector(`input[name = "amount"]`)
const resultContainer = document.createElement("div")


// below are placeholders for when both segments are targeted

let amountDriversInput;   
let amountCustomersInput;
const bothContainer = document.createElement("div")

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
                if (!bothContainer.parentNode){
                    form.insertBefore(bothContainer,amountInput.nextSibling)
                }
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
