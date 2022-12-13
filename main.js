const header = document.getElementById("header")
const colorSection = document.getElementById("colors")

const schemeItem = document.getElementsByClassName("schemeItem")
const currentValues = document.getElementById("currentValues")
const hexHeading = document.getElementsByClassName("hexHeading")
const copiedEl = document.getElementById("copiedEl")

const colorPicker = document.getElementById("seedPicker")
const selectList = document.getElementById("selectList")
const generateBtn = document.getElementById("getButton")
const randomBtn = document.getElementById("randomButton")

const schemeModes = [
  "monochrome",
  "monochrome-dark",
  "monochrome-light",
  "analogic",
  "complement",
  "analogic-complement",
  "triad",
]

let randomScheme = ""
let randomHexString = ""

/*Generates a random color scheme on load */

window.addEventListener("DOMContentLoaded", () => {
  randomizeHex()
  randomizeScheme()
  getScheme(randomHexString, randomScheme)
  currentValues.innerHTML = `<h1>COLOR SCHEME GENERATOR</h1>
  <h2>CLICK TO COPY</h2>
  <h2>SPACE TO RANDOMIZE</h2>`
})

/*Generates color scheme from selections */

generateBtn.addEventListener("click", () => {
  let baseColor = colorPicker.value.slice(1)
  let schemeMode = selectList.value
  getScheme(baseColor, schemeMode)
})

/*Generates a random color scheme */

randomBtn.addEventListener("click", generateRandom)

/*Generates random color scheme when pressing space key*/

document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    generateRandom()
  }
})

/*FUNCTIONS */

/*Fetches colors for the scheme based on and updates the content for the color section*/

function generateRandom() {
  randomizeHex()
  randomizeScheme()
  getScheme(randomHexString, randomScheme)
}

/*Fetches the scheme data and updates the content, and adds eventlisteners to each color div that lets you copy the hex*/

function getScheme(seed, mode) {
  seedUpper = seed.toUpperCase()
  modeUpper = mode.toUpperCase()
  fetch(`
    https:////www.thecolorapi.com/scheme?hex=${seed}&mode=${mode}
    `)
    .then((res) => res.json())
    .then((data) => {
      colorScheme = data.colors
      for (let i = 0; i < schemeItem.length; i++) {
        const hex = colorScheme[i].hex.value
        const hexClean = colorScheme[i].hex.clean
        const name = colorScheme[i].name.value
        getContrast(hexClean)
        if (getContrast(hexClean) == "white") {
          hexHeading[i].style.color = "white"
        } else {
          hexHeading[i].style.color = "black"
        }
        hexHeading[
          i
        ].innerHTML = `${colorScheme[i].hex.clean}<br><h3 id="nameHeading">"${name}"</h3>`
        schemeItem[i].style.background = hex
        //Copies the hex of the element clicked
        schemeItem[i].addEventListener("click", () => {
          copyTextToClipboard(hex)
          copiedEl.innerHTML = `<h3>${hex}</h3><p>copied to clipboard</p>`
          copiedEl.classList.add("copyAnimation")
          copiedEl.addEventListener("animationend", () => {
            copiedEl.classList.remove("copyAnimation")
          })
        })
      }
    })

  /* Shows the current scheme mode and seed color */
  currentValues.innerHTML = `<h1>${modeUpper}</h1><h1>#${seedUpper}</h1>`

  /*Sets the color of the input element and the mode of the selectList to current */
  colorPicker.value = "#" + seed
  selectList.value = mode
}

/*Randomizes a hex string */

function randomizeHex() {
  randomHexString = ""
  const hex = "abcdef0123456789"
  for (let i = 0; i < 6; i++) {
    randomHexString += hex[Math.round(Math.random() * 6)]
  }
  return randomHexString
}

/*Randomizes scheme mode */

function randomizeScheme() {
  randomScheme = schemeModes[Math.round(Math.random() * 6)]
  return randomScheme
}

/*Copies text to clipboard */

function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text)
}

function getContrast(hexcolor) {
  var r = parseInt(hexcolor.substr(0, 2), 16)
  var g = parseInt(hexcolor.substr(2, 2), 16)
  var b = parseInt(hexcolor.substr(4, 2), 16)
  var yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? "black" : "white"
}
