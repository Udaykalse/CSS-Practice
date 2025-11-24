// Get DOM elements
const redSlider = document.getElementById("red");
const greenSlider = document.getElementById("green");
const blueSlider = document.getElementById("blue");
const alphaSlider = document.getElementById("alfa");
const redValue = document.getElementById("redValue");
const greenValue = document.getElementById("greenValue");
const blueValue = document.getElementById("blueValue");
const alphaValue = document.getElementById("alfaValue");
const colorName = document.getElementById("cName");
const body = document.getElementById("bod");
const colorPreview = document.getElementById("colorPreview");

// Initialize display values
updateColor();

// Add event listeners for all sliders
[redSlider, greenSlider, blueSlider, alphaSlider].forEach(slider => {
    slider.addEventListener("input", updateColor);
});

// Function to update color based on slider values
function updateColor() {
    // Get values from sliders
    const redVal = Math.round(redSlider.value * 2.55);
    const greenVal = Math.round(greenSlider.value * 2.55);
    const blueVal = Math.round(blueSlider.value * 2.55);
    const alphaVal = (alphaSlider.value * 0.01).toFixed(2);
    
    // Update display values
    redValue.textContent = redSlider.value;
    greenValue.textContent = greenSlider.value;
    blueValue.textContent = blueSlider.value;
    alphaValue.textContent = alphaVal;
    
    // Create RGBA color string
    const rgbaColor = `rgba(${redVal}, ${greenVal}, ${blueVal}, ${alphaVal})`;
    
    // Update UI
    colorName.textContent = rgbaColor;
    body.style.backgroundColor = rgbaColor;
    colorPreview.style.backgroundColor = rgbaColor;
}