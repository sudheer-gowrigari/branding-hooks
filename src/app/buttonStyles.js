import * as tinyColor from "./tinyColor"
const colorMixin = {
  properties: {
    value: ""
  }
}
const typographyMixin = {
  properties: {
    fontSize: "",
    fontWeight: "",
    fontFamily: "",
    textDecoration: "",
    textAlignment: "",
    lineHeight: "",
    fontStyle: ""
  }
}

const boxDimensions = {
  properties: {
    left: "",
    top: "",
    right: "",
    bottom: ""
  }
}
const borderStyles = {
  properties: {
    width: "",
    radius: "",
    style: ""
  }
}
const boundingBoxMixin = {
  properties: {
    padding: boxDimensions.properties,
    margin: boxDimensions.properties,
    border: borderStyles.properties
  }
}
const buttonMixinStyle = {
  properties: {
    color: colorMixin.properties,
    text: typographyMixin.properties,
    boxstyles: boundingBoxMixin.properties,
    width: "lightning/Dimension",
    hover: "ColorValueType"
  }
}
const textStyles = {
  Heading1: {
    label: "Heading Extra LargeFont",
    properties: {
      fontFamily: "Salesforce Sans",
      fontSize: "2.5rem",
      fontWeight: "900",
      fontStyle: "normal",
      textDecoration: "none",
      lineHeight: "1rem"
    }
  },
  Heading2: {
    label: "Heading LargeFont",
    properties: {
      fontFamily: "Salesforce Sans",
      fontSize: "1.75rem",
      fontWeight: "900",
      fontStyle: "normal",
      textDecoration: "none",
      lineHeight: "1rem"
    }
  },
  BodyFontStyles: {
    label: "Body Font",
    properties: {
      fontFamily: "Salesforce Sans",
      fontSize: "1rem",
      fontWeight: "400",
      fontStyle: "normal",
      textDecoration: "none",
      lineHeight: "1rem"
    }
  }
}

let globalColorStyles = {
  base: {
    id: "base",
    label: "Root Color",
    root: "#ffffff",
    contrast: "#0176d3"
  },
  primaryAccent: {
    id: "primaryAccent",
    label: "Primary Accent Color",
    root: "#005fb2",
    contrast: "#ffffff"
  },
  // "brand": {
  //     id: "brand",
  //     "label": "Brand Color",
  //     "root": "#0176d3",
  //     "contrast": "#ffffff"
  // },
  neutral: {
    id: "neutral",
    label: "Neutral Color",
    root: "#ecebea",
    contrast: "#000000"
  },
  success: {
    id: "success",
    label: "Success Color",
    root: "#4bca81",
    contrast: "#000000"
  },
  destructive: {
    id: "destructive",
    label: "Destructive Color",
    root: "#c23934",
    contrast: "#fff"
  }
}
const boundingboxStyles = {
  even: {
    padding: {
      left: "16px",
      top: "16px",
      right: "16px",
      bottom: "16px"
    },
    margin: {},
    border: {
      width: "1px",
      radius: "1pm",
      style: "solid"
    }
  }
}
let globalButtonStyles = [
  {
    label: "Neutral Button",
    id: "neutral",
    style: "NeutralButton",
    properties: {
      typography: textStyles.BodyFontStyles,
      color: globalColorStyles.base,
      boundingbox: boundingboxStyles.even
    }
  },
  {
    label: "Brand Button",
    id: "brand",
    style: "BrandButton",
    properties: {
      typography: textStyles.BodyFontStyles,
      color: globalColorStyles.primaryAccent,
      boundingbox: boundingboxStyles.even
    }
  },
  {
    label: "Success Button",
    id: "success",
    style: "SuccessButton",
    properties: {
      typography: textStyles.BodyFontStyles,
      color: globalColorStyles.success,
      boundingbox: boundingboxStyles.even
    }
  },
  {
    id: "destructive",
    style: "DestructiveButton",
    label: "Destructive Button",
    properties: {
      typography: textStyles.BodyFontStyles,
      color: globalColorStyles.destructive,
      boundingbox: boundingboxStyles.even
    }
  }
  // {
  //     id: 'test',
  //     style: 'testButton',
  //     label: 'Test Button',
  //     properties: {
  //         "typography" : textStyles.BodyFontStyles,
  //         "color": {
  //             "label": "test Color",
  //             "root": "#c9c9c9",
  //             "contrast": "#ea001e"
  //         },
  //         "boundingbox": boundingboxStyles.even
  //     }
  // }
]

var formatToken = function (str, args) {
  // store arguments in an array
  //var args;
  // use replace to iterate over the string
  // select the match and check if the related argument is present
  // if yes, replace the match with the argument
  return str.replace(/{([0-9]+)}/g, function (match, index) {
    // check if the argument is present
    return typeof args[index] == "undefined" ? match : args[index]
  })
}


var kebabCase = function (str) {
  return str.replace(/[A-Z][a-z]*/g, (str) => "-" + str.toLowerCase())
}

let globalTokens = {}
let globalColorTokens = {}
const globalNamespace = "lightning"

var generateGlobalThemeColorTokens = function () {
  for (let key in globalColorStyles) {
    const colorStyle = globalColorStyles[key]
    for (let color in colorStyle) {
      if (!colorStyle["derived"]) {
        colorStyle["derived"] = {}
      }
      let tokenName = `--${globalNamespace}-${kebabCase(key)}-color-`
      if (color !== "label" && color !== "id" && color !== "derived") {
        tokenName += color
        globalTokens[tokenName] = colorStyle[color]
        globalColorTokens[`${key}-${color}`] = tokenName
        const derivedColorValues = calcDerivedColorValues(
          tokenName,
          colorStyle[color],
          colorStyle[color]
        )
        colorStyle["derived"][`${key}-${color}`] = derivedColorValues
        console.log("derived color values for ", key, derivedColorValues)
      }
    }
  }
}
//generate global color tokens
generateGlobalThemeColorTokens()

function getColorTokenValue(key, prop) {
  if (globalColorTokens[`${key}-${prop}`]) {
    return `var(${globalColorTokens[`${key}-${prop}`]});`
  }
  return
}

function getDerivedButtonColorToken(key, prop, index) {
  if (globalColorTokens[`${key}-${prop}`]) {
    return `var(${globalColorTokens[`${key}-${prop}`]}-${index});`
  }
  return
}

class ButtonMixin {
  _variant = ""
  _styles = ""
  _namespace = "button"
  constructor(variant, styles) {
    this._variant = variant
    this._styles = styles
  }

  comuputeStyles() {
    console.log("variant ", this._variant, " styles : ", this._styles)
    const styleProperties = this._styles.properties

    const textProps = styleProperties["typography"].properties
    const colorProps = styleProperties["color"]
    const boundingBox = styleProperties["boundingbox"]
    const buttonRendition = `-button-${this._variant}`

    const brandingStyleMap = {}

    for (let prop in textProps) {
      const textRendition = `${kebabCase(prop)}`
      let tokenName = `--${globalNamespace}-${buttonRendition}-${textRendition}`
      brandingStyleMap[tokenName] = `${textProps[prop]}`
      console.log("token value ", tokenName)
    }

    for (let prop in colorProps) {
      if (prop === "label" || prop === "id" || prop === "derived") {
        continue
      }
      const colorRendition = `${kebabCase(prop)}`
      let tokenName = `--${globalNamespace}-${buttonRendition}-color-${colorRendition}`
      brandingStyleMap[tokenName] =
        getColorTokenValue(colorProps.id, prop) || colorProps[prop]

      //generate derived colors for button styles
      for (let i = 0; i < 3; i++) {
        brandingStyleMap[`${tokenName}-${i + 1}`] = getDerivedButtonColorToken(
          colorProps.id,
          prop,
          i + 1
        )
      }

      console.log("token value ", tokenName)
    }

    for (let key in boundingBox) {
      for (let prop in boundingBox[key]) {
        const boundingBoxRendition = `-${key}-${kebabCase(prop)}`
        let tokenName = `--${globalNamespace}-${buttonRendition}-${boundingBoxRendition}`
        brandingStyleMap[tokenName] = `${boundingBox[key][prop]}`
        console.log("token value ", tokenName)
      }
    }
    console.log("branding style map ", brandingStyleMap)
    return brandingStyleMap
  }
}

const GlobalTheme = {
  defaultColor: "#0176D3"
}

let brandingStyleMap = {}
globalButtonStyles.forEach((style) => {
  let buttonMixin = new ButtonMixin(style.id, style)
  const styleMap = buttonMixin.comuputeStyles()
  brandingStyleMap = Object.assign(brandingStyleMap, styleMap)
})

for (let key in GlobalTheme) {
  let tokenName = `--${globalNamespace}-${kebabCase(key)}`
  globalTokens[tokenName] = GlobalTheme[key]
}

/**
 * Returns a formatted CSS string for all of the branding property key/value pairs
 *
 * e.g. for selector `.test` and map `{ '--dxp-prop1': '#fff', '--dxp-prop2': '#000' }` it'll generate the following:
 *
 * ```
 * .test {
 *   --dxp-prop1: #fff,
 *   --dxp-prop2: #000
 * }
 * ```
 * @param {String} selector css selector to use for the style definition
 * @param {Object} styleMap token -> value map
 */
function scopedStyleBuilder(selector, styleMap) {
  const style = Object.entries(styleMap).reduce((acc, [key, value]) => {
    return `${acc}\n\t${key}: ${value};`
  }, "")

  return `${selector} {${style}\n}`
}

/**
 * If a designmode_branding styletag exists from previous updates, get that style tag
 *
 * Otherwise, append a new style tag to use for branding value updates
 */
function getOrCreateStyleTag(styleTagId) {
  let styleTag = window.document.head.querySelector(`#${styleTagId}`)
  if (!styleTag) {
    styleTag = window.document.createElement("style")
    styleTag.id = styleTagId
    window.document.head.append(styleTag)
  }

  return styleTag
}

function updateAppLevelCSSVars() {
  console.log(
    "number of globalTokens ",
    Object.keys(globalTokens).length,
    globalTokens
  )
  brandingStyleMap = Object.assign(brandingStyleMap, globalTokens)
  // generate token -> branding value map
  const brandingTag = getOrCreateStyleTag("theme-branding")
  // build out the style definitions inside of the :root selector, replace existing innerHTML since
  brandingTag.innerHTML = scopedStyleBuilder(":root", brandingStyleMap)
}

updateAppLevelCSSVars()

var updatesCSSVars = function ({buttonStyle, colorStyle}) {
  //update the button styles with choosen color style
  const requiredButtonStyle = globalButtonStyles
    .map((el) => {
      if (el.style === buttonStyle) {
        el.properties.color = globalColorStyles[colorStyle]
      }
      return el
    })
    .find((el) => el.style === buttonStyle)
  console.log(
    "event details ",
    buttonStyle,
    colorStyle,
    requiredButtonStyle,
    globalButtonStyles
  )

  let buttonMixin = new ButtonMixin(requiredButtonStyle.id, requiredButtonStyle)
  const styleMap = buttonMixin.comuputeStyles()
  brandingStyleMap = Object.assign(brandingStyleMap, styleMap)
  updateAppLevelCSSVars()
}

var getContrastColor = function (colorValue) {
  var color = tinycolor(colorValue)
  var rgb = color.toRgb()

  // https://stackoverflow.com/a/3943023
  var uicolors = [rgb.r / 255, rgb.g / 255, rgb.b / 255]
  var c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92
    }
    return Math.pow((col + 0.055) / 1.055, 2.4)
  })
  var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
  return L > 0.179 ? "#000" : "#fff"
}

var updateThemeColors = function ({style, color}) {
  console.log(" update theme color ", style, color)
  const themeColor = globalColorStyles[style]
  themeColor.root = color
  themeColor.contrast = getContrastColor(color)
  console.log(" theme color found ", themeColor)
  generateGlobalThemeColorTokens()
  updateAppLevelCSSVars()
}

window.addEventListener("reload-styles", (e) => updatesCSSVars(e.detail))

window.addEventListener("update-theme-colors", (e) =>
  updateThemeColors(e.detail)
)

function calcDerivedColorValues(
  propertyNameBase,
  rootColorValue,
  colorValue,
  iterations
) {
  var newValues = []
  var rootColor = tinycolor(rootColorValue)
  var color = tinycolor(colorValue)

  for (var i = 1; i <= (iterations || 3); i++) {
    var amount = i * 8
    var derivation = rootColor.isLight()
      ? color.darken(amount)
      : color.lighten(amount)

    newValues.push({
      name: propertyNameBase + "-" + i,
      value: derivation.toHexString()
    })
    globalTokens[propertyNameBase + "-" + i] = derivation.toHexString()
  }
  return newValues
}
export {globalButtonStyles, globalColorStyles}
