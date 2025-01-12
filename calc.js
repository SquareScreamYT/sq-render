let calculatorState = {
  equation: "0",
  result: "0",
  display: "0",
  width: 125,
  height: 100,
  originx: 65,
  originy: 20,
  isDragging: false,
  dragOffsetX: 0,
  dragOffsetY: 0
};

function handleCalculatorDrag(mouseX, mouseY) {
  if (calculatorState.isDragging) {
    calculatorState.originx = mouseX - calculatorState.dragOffsetX;
    calculatorState.originy = mouseY - calculatorState.dragOffsetY;
  }
}

const calcColors = {
  body: hexColor("#495057"),
  title: hexColor("#f8f9fa"),
  minimizeRect: hexColor("#fcc419"),
  minimizeLine: hexColor("#f59f00"),
  closeRect: hexColor("#ff6b6b"),
  closeLine: hexColor("#f03e3e"),
  display: hexColor("#212529"),
  text: hexColor("#f8f9fa"),
  buttonBack: hexColor("#868e96")
};

function calculatorApp() {
  const x = calculatorState.originx;
  const y = calculatorState.originy;
  
  // Calculate dynamic measurements
  const titleHeight = 12;
  const displayHeight = Math.round(calculatorState.height * 0.15);
  const displayMargin = Math.round(calculatorState.height * 0.05);
  const buttonAreaHeight = calculatorState.height - titleHeight - displayHeight - (displayMargin * 2);
  const buttonHeight = Math.floor(buttonAreaHeight / 5) - 3;
  
  // Main calculator body
  drawRect(x, y, x + calculatorState.width, y + calculatorState.height, calcColors.body, true, 4);
  drawRect(x, y, x + calculatorState.width, y + calculatorState.height, calcColors.buttonBack, false, 4);
  
  // Title bar elements
  drawText("Calculator", x + 5, y + 4, calcColors.title, "small");
  drawRect(x + calculatorState.width - 18, y + 3, x + calculatorState.width - 12, y + 9, calcColors.minimizeRect, true, 2);
  drawLine(x + calculatorState.width - 16, y + 6, x + calculatorState.width - 14, y + 6, calcColors.minimizeLine);
  drawRect(x + calculatorState.width - 9, y + 3, x + calculatorState.width - 3, y + 9, calcColors.closeRect, true, 2);
  drawLine(x + calculatorState.width - 7, y + 5, x + calculatorState.width - 5, y + 7, calcColors.closeLine);
  drawLine(x + calculatorState.width - 5, y + 5, x + calculatorState.width - 7, y + 7, calcColors.closeLine);
  
  // Display
  const displayY = y + titleHeight + displayMargin;
  drawRect(x + 5, displayY, x + calculatorState.width - 5, displayY + displayHeight, calcColors.display, true, 2);
  drawText(calculatorState.display, x + 10, displayY + 5, calcColors.text, "small");
  
  const buttons = [
    ["C", "^", "(", ")"],
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"]
  ];
  
  // Draw buttons
  let buttonY = displayY + displayHeight + displayMargin;
  const buttonWidth = Math.round((calculatorState.width - 25) / 4);
  
  buttons.forEach((row) => {
    let buttonX = x + 5;
    row.forEach((btn) => {
      drawRect(buttonX, buttonY, buttonX + buttonWidth, buttonY + buttonHeight, calcColors.buttonBack, true, 2);
      drawText(btn, buttonX + Math.floor(buttonWidth/2), buttonY + Math.floor(buttonHeight/2)-2, calcColors.text, "small");
      buttonX += buttonWidth + 5;
    });
    buttonY += buttonHeight + 3;
  });
  
  // Cursor handling
  if (isMouseWithin(x + calculatorState.width - 18, y + 3, x + calculatorState.width - 12, y + 9)) {
    currentCursor = "pointer";
  } else if (isMouseWithin(x + calculatorState.width - 9, y + 3, x + calculatorState.width - 3, y + 9)) {
    currentCursor = "pointer";
  } else if (isMouseWithin(x, y, x + calculatorState.width - 20, y + 12)) {
    currentCursor = "move";
  } else if (isMouseWithin(x, y, x + calculatorState.width, y + calculatorState.height)) {
    let isOverButton = false;
    let checkButtonY = displayY + displayHeight + displayMargin;
    
    for (let row = 0; row < 5; row++) {
      let buttonX = x + 5;
      for (let col = 0; col < 4; col++) {
        if (isMouseWithin(buttonX, checkButtonY, buttonX + buttonWidth, checkButtonY + buttonHeight)) {
          isOverButton = true;
          break;
        }
        buttonX += buttonWidth + 5;
      }
      checkButtonY += buttonHeight + 3;
      if (isOverButton) break;
    }
    
    currentCursor = isOverButton ? "pointer" : "cursor";
  }
}

function calculateResult(equation) {
  try {
    const processedEquation = equation.replace(/\^/g, '**');
    return eval(processedEquation).toString();
  } catch (error) {
    return "ERROR";
  }
}

function handleCalculatorInput(button) {
  if (button === "C") {
    calculatorState.equation = "0";
    calculatorState.result = "0";
  } else if (button === "=") {
    calculatorState.result = calculateResult(calculatorState.equation);
    calculatorState.equation = calculatorState.result;
  } else {
    if (calculatorState.equation === "0") {
      calculatorState.equation = button;
    } else {
      calculatorState.equation += button;
    }
  }
  calculatorState.display = calculatorState.equation;
}

function onCalculatorMouseClick() {
  const x = calculatorState.originx;
  const y = calculatorState.originy;
  
  if (currentApp === "calculator") {
    const titleHeight = 12;
    const displayHeight = Math.round(calculatorState.height * 0.15);
    const displayMargin = Math.round(calculatorState.height * 0.05);
    const buttonAreaHeight = calculatorState.height - titleHeight - displayHeight - (displayMargin * 2);
    const buttonHeight = Math.round(buttonAreaHeight / 5) - 3;
    
    if (isMouseWithin(x, y, x + calculatorState.width - 20, y + 12)) {
      calculatorState.isDragging = true;
      calculatorState.dragOffsetX = mouseX - calculatorState.originx;
      calculatorState.dragOffsetY = mouseY - calculatorState.originy;
      return;
    }

    if (isMouseWithin(x + calculatorState.width - 18, y + 3, x + calculatorState.width - 12, y + 9)) {
      currentApp = "desktop";
    }
    
    if (isMouseWithin(x + calculatorState.width - 9, y + 3, x + calculatorState.width - 3, y + 9)) {
      currentApp = "desktop";
      calculatorState = {
        equation: "0",
        result: "0",
        display: "0",
        width: 125,
        height: 100,
        originx: 65,
        originy: 20,
        isDragging: false,
        dragOffsetX: 0,
        dragOffsetY: 0
      };
    }
    
    const buttons = [
      ["C", "^", "(", ")"],
      ["7", "8", "9", "/"],
      ["4", "5", "6", "*"],
      ["1", "2", "3", "-"],
      ["0", ".", "=", "+"]
    ];
    
    const displayY = y + titleHeight + displayMargin;
    let buttonY = displayY + displayHeight + displayMargin;
    const buttonWidth = Math.round((calculatorState.width - 25) / 4);
    
    buttons.forEach((row) => {
      let buttonX = x + 5;
      row.forEach((btn) => {
        if (isMouseWithin(buttonX, buttonY, buttonX + buttonWidth, buttonY + buttonHeight)) {
          handleCalculatorInput(btn);
        }
        buttonX += buttonWidth + 5;
      });
      buttonY += buttonHeight + 3;
    });
  }
}

function onCalculatorMouseUp() {
  calculatorState.isDragging = false;
}

function onCalculatorMouseMove(mouseX, mouseY) {
  if (currentApp === "calculator" && calculatorState.isDragging) {
    handleCalculatorDrag(mouseX, mouseY);
  }
}
