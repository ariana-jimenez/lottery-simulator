document.addEventListener("DOMContentLoaded", function () {
    const playButton = document.getElementById("play-button");
    const errorMessage = document.getElementById("error-message");
    const resultMessage1 = document.getElementById("result-message-1");
    const resultMessage2 = document.getElementById("result-message-2");
    const resultMessage3 = document.getElementById("result-message-3");
    const resultContainer = document.getElementById("results-section");
    const acc = document.getElementsByClassName("accordion");
    const gamesWon = document.getElementById("games-won");
    const gamesLost = document.getElementById("games-lost");
    const generateRandomInput = document.getElementById("generate-random");
    const numberInputs = [
        document.getElementById("first-number"),
        document.getElementById("second-number"),
        document.getElementById("third-number"),
        document.getElementById("fourth-number"),
        document.getElementById("fifth-number"),
    ];

    const powerballInput = document.getElementById("powerball");

    generateRandomInput.addEventListener("change", function () {

        if (generateRandomInput.checked) {
            // Generate random numbers and fill the input fields
            const randomNumbers = generateRandomLotteryNumbers();
            for (let i = 0; i < numberInputs.length; i++) {
                numberInputs[i].value = randomNumbers[i];
            }
            // Generate random powerball and fill the input field
            const inputPowerball = Math.floor(Math.random() * 26) + 1;
            powerballInput.value = inputPowerball;
            
        } else {
            // Clear the input fields when unchecked
            for (let i = 0; i < numberInputs.length; i++) {
                numberInputs[i].value = "";
            }
            powerballInput.value = "";
        }
    });

    // Clear results section
    function clearChildElements(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    // Results accordion
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
            } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
            } 
        });
    }

    playButton.addEventListener("click", function () {

        // Clear any prior results
        resultMessage1.textContent = "";
        resultMessage2.textContent = "";
        resultMessage3.textContent = "";
        clearChildElements(gamesWon);
        clearChildElements(gamesLost);
        
        // Gather user inputs & run simulation
        const numbers = numberInputs.map(input => parseInt(input.value, 10));
        const powerball = parseInt(powerballInput.value, 10);
        const numPlaysInput = document.getElementById("num-plays").value;
        const result = simulateLottery(numbers, powerball, numPlaysInput);

        // Display the results
        if(result.error){
            errorMessage.textContent = result.error;
            resultMessage1.textContent = "";
            resultMessage2.textContent = "";
            resultMessage3.textContent = "";
        }
        else {
            errorMessage.textContent = "";
            resultMessage1.textContent = `Out of ${result.plays} plays, you won ${result.wins} times and lost ${result.losses} times.`;
            resultMessage2.textContent = `$${result.totalCost}`;
            resultMessage3.textContent = `$${result.totalWins}`;
            const winningPlays = result.winningPlays;
            const allPlays = result.allPlays;

            if (winningPlays.length > 0) {

                // Iterate through the winning plays list and create a new div for each winning number
                winningPlays.forEach((winningSet) => {

                    // Create a container div for each winning set
                    const setContainer = document.createElement("div");
                    setContainer.classList.add("winning-numbers-set");

                    // Create divs for each individual number in the set
                    winningSet.numbers.forEach((number) => {
                        const numberDiv = document.createElement("div");
                        numberDiv.classList.add("winning-numbers");
                        numberDiv.textContent = number;

                        // Check if the number matches the user's numbers
                        if (numbers.includes(number)) {
                            numberDiv.classList.add("matching-number");
                        }

                        setContainer.appendChild(numberDiv);
                    });

                    // Create a div for the Powerball number
                    const powerballDiv = document.createElement("div");
                    powerballDiv.classList.add("winning-numbers");
                    powerballDiv.classList.add("winning-powerball");
                    powerballDiv.textContent = winningSet.powerball;

                    if (powerball === winningSet.powerball) {
                        powerballDiv.classList.add("matching-number");
                    }

                    setContainer.appendChild(powerballDiv);
                    gamesWon.appendChild(setContainer);
                });

                
        
            } else {
                // No winning plays to display
                resultMessage1.textContent = `You lost all ${result.losses} games.`;
                const lostMessage = document.createElement("p");
                lostMessage.textContent = "No games won";
                gamesWon.appendChild(lostMessage);
            }
                // Iterate through the lost plays list and create a new div for each winning number
                allPlays.forEach((winningSet) => {

                    // Create a container div for each winning set
                    const setContainer = document.createElement("div");
                    setContainer.classList.add("winning-numbers-set");

                    // Create divs for each individual number in the set
                    winningSet.numbers.forEach((number) => {
                        const numberDiv = document.createElement("div");
                        numberDiv.classList.add("winning-numbers");
                        numberDiv.textContent = number;
                        setContainer.appendChild(numberDiv);
                    });

                    // Create a div for the Powerball number
                    const powerballDiv = document.createElement("div");
                    powerballDiv.classList.add("winning-numbers");
                    powerballDiv.classList.add("winning-powerball");
                    powerballDiv.textContent = winningSet.powerball;
                    setContainer.appendChild(powerballDiv);

                    gamesLost.appendChild(setContainer);

                });

            resultContainer.scrollIntoView({ behavior: "smooth" });
        }
    });


    function generateRandomLotteryNumbers() {
        const randomNumbers = [];
        while (randomNumbers.length < 5) {
            const randomNum = Math.floor(Math.random() * 69) + 1;
            if (!randomNumbers.includes(randomNum)) {
                randomNumbers.push(randomNum);
            }
        }

        // Sort the numbers in ascending order
        randomNumbers.sort((a, b) => a - b); 
        return randomNumbers;
    }
});


function simulateLottery(numbers, powerball, numPlays) {

    // Calculate the total cost to play
    const totalCost = numPlays * 2;

    // Convert input values to arrays and numbers
    const inputNumbersArray = numbers.map(Number);
    const inputPowerballNumber = Number(powerball);

    // Check if the input values are valid
      if (
          inputNumbersArray.length !== 5 ||
          inputNumbersArray.some(num => isNaN(num) || num < 1 || num > 69) ||
          isNaN(inputPowerballNumber) || inputPowerballNumber < 1 || inputPowerballNumber > 26 ||
          isNaN(numPlays) || numPlays < 1 || numPlays > 1000000 || inputNumbersArray.length !== new Set(inputNumbersArray).size
      ) {
          return { error: 'Invalid input. Please try again.' };
      }

      // Run the simulation with user-entered numbers
      return runSimulation(inputNumbersArray, inputPowerballNumber, numPlays, totalCost);
  
}


function runSimulation(numbers, powerball, numPlays, totalCost) {
    // Track number of wins and losses
    let wins = 0;
    let losses = 0;
    let winningNumbersList = [];
    let winningPlaysList = [];
    let totalWinnings = 0;

    // Simulate the lottery for the specified number of plays
    for (let play = 0; play < numPlays; play++) {

        // Generate random winning numbers and Powerball
        const winningNumbers = [];
        while (winningNumbers.length < 5) {
            const randomNum = Math.floor(Math.random() * 69) + 1;
            if (!winningNumbers.includes(randomNum)) {
                winningNumbers.push(randomNum);
            }
        }
        const winningPowerball = Math.floor(Math.random() * 26) + 1;

        // Check if the player's numbers match the winning numbers
        const matchingNumbers = numbers.filter(num => winningNumbers.includes(num));

        // Check if the player's numbers match the winning Powerball
        const matchingPowerball = powerball === winningPowerball;

        // Calculate winnings based on matches
        let winnings = 0;
        if (matchingPowerball) {
            if (matchingNumbers.length === 0) {
                winnings = 4;
            } else if (matchingNumbers.length === 1) {
                winnings = 4;
            } else if (matchingNumbers.length === 2) {
                winnings = 7;
            } else if (matchingNumbers.length === 3) {
                winnings = 7;
            } else if (matchingNumbers.length === 4) {
                winnings = 50000;
            } else if (matchingNumbers.length === 5) {
                winnings = 100000000;
            }
        } else {
            if (matchingNumbers.length === 3) {
                winnings = 100;
            } else if (matchingNumbers.length === 4) {
                winnings = 10000;
            } else if (matchingNumbers.length === 5) {
                winnings = 1000000;
            }
        }

        // Update win/loss count
        if (winnings > 0) {
            wins++;
            totalWinnings += winnings;
            winningPlaysList.push({
                numbers: [...winningNumbers],
                powerball: winningPowerball,
                winnings: winnings,
            });
        } else {
            losses++;
            winningNumbersList.push({
                numbers: [...winningNumbers],
                powerball: winningPowerball,
                winnings: winnings,
            });
        }
    }

    // Build a result object
    const resultObject = {
        plays: numPlays,
        wins: wins,
        losses: losses,
        totalWins: totalWinnings,
        totalCost: totalCost,
        numbers: numbers,
        powerball: powerball,
        winningPlays: [],
        allPlays: [],
    };

    if (wins > 0) {
        
        winningPlaysList.forEach((winningSet) => {
            resultObject.winningPlays.push({
                numbers: [...winningSet.numbers],
                powerball: winningSet.powerball,
                winnings: winningSet.winnings,
            });
        });
    }

    winningNumbersList.forEach((winningSet) => {
            resultObject.allPlays.push({
                numbers: [...winningSet.numbers],
                powerball: winningSet.powerball,
                winnings: winningSet.winnings,
            });
        });

    return resultObject;
}
