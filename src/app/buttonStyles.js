import * as tinyColor from "./tinyColor"
const LIGHTNING_BUTTON = "lightning/button";
const LIGHTNING_COLOR = "lightning/colorScheme";

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
    $ref: '$textStyles.Heading1',
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
    $ref: '$textStyles.Heading2',
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
    $ref: '$textStyles.BodyFontStyles',
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
let globalButtonStyles = {
  "neutral" : {
    label: "Neutral Button",
    id: "neutral",
    style: "NeutralButton",
    properties: {
      typography: textStyles.BodyFontStyles,
      color: globalColorStyles.base,
      boundingbox: boundingboxStyles.even
    }
  },
  "brand": {
    label: "Brand Button",
    id: "brand",
    style: "BrandButton",
    properties: {
      typography: textStyles.BodyFontStyles,
      color: globalColorStyles.primaryAccent,
      boundingbox: boundingboxStyles.even
    }
  },
  "success": {
    label: "Success Button",
    id: "success",
    style: "SuccessButton",
    properties: {
      typography: textStyles.BodyFontStyles,
      color: globalColorStyles.success,
      boundingbox: boundingboxStyles.even
    }
  },
  "destructive": {
    id: "destructive",
    style: "DestructiveButton",
    label: "Destructive Button",
    properties: {
      typography: textStyles.BodyFontStyles,
      color: globalColorStyles.destructive,
      boundingbox: boundingboxStyles.even
    }
  }
}

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

function isObject(objValue) {
  return objValue && typeof objValue === 'object' && objValue.constructor === Object;
}

let globalTokens = {}
let globalColorTokens = {};
class ButtonMixin {
  _variant = ""
  _styles = ""
  _namespace = "button"
  constructor(variant, styles) {
    this._variant = variant
    this._styles = styles
  }

  comuputeStyles(nameSpace) {
    const styleProperties = this._styles.properties

    const textProps = styleProperties["typography"].properties
    const colorProps = styleProperties["color"]
    const boundingBox = styleProperties["boundingbox"]
    const buttonRendition = `${this._variant}`;
    const globalNamespace = nameSpace.replace("/", "--");

    const brandingStyleMap = {}

    for (let prop in textProps) {
      const textRendition = `${kebabCase(prop)}`
      let tokenName = `--${globalNamespace}-${buttonRendition}-${textRendition}`
      brandingStyleMap[tokenName] = `${textProps[prop]}`
    }

    if(isObject(colorProps)){
      for (let prop in colorProps) {
        if (prop === "label" || prop === "id" || prop === "derived") {
          continue;
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
      }
    }else {
      const colorRenditions = ['root', 'contrast'];
      colorRenditions.forEach((rendition)=> {
        let tokenName = `--${globalNamespace}-${buttonRendition}-color-${rendition}`
        let colorValue = colorProps;
        if(rendition === 'contrast'){
          colorValue = getContrastColor(colorProps);
        }
        brandingStyleMap[tokenName] = colorValue;
        //generate derived colors for button styles
        const derivedColors = calcDerivedColorValues('noStore', colorValue, colorValue);
        for (let i = 0; i < 3; i++) {
          brandingStyleMap[`${tokenName}-${i + 1}`] = derivedColors[i].value;
        }
      });
    }

    for (let key in boundingBox) {
      for (let prop in boundingBox[key]) {
        const boundingBoxRendition = `-${key}-${kebabCase(prop)}`
        let tokenName = `--${globalNamespace}-${buttonRendition}-${boundingBoxRendition}`
        brandingStyleMap[tokenName] = `${boundingBox[key][prop]}`;
      }
    }
    return brandingStyleMap
  }
}

let brandingStyleMap = {}
let brandingButtonStyleMap = {};

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
function getOrCreateStyleTag(styleTagId, rootDocument) {
  
  let styleTag = rootDocument.head.querySelector(`#${styleTagId}`)
  if (!styleTag) {
    styleTag = rootDocument.createElement("style")
    styleTag.id = styleTagId
    rootDocument.head.append(styleTag)
  }

  return styleTag;
}
function getRootDocumentNode() {
  const surface = document.surfaceFrame;
  if(!surface){
    return;
  }
  return surface.frameElement.contentDocument;
}

function updateAppLevelCSSVars() {
  brandingStyleMap = Object.assign(brandingStyleMap, globalTokens)
  function appendStyles(docE){
    // generate token -> branding value map
    const brandingTag = getOrCreateStyleTag("theme-branding", docE)
    // build out the style definitions inside of the :root selector, replace existing innerHTML since
    brandingTag.innerHTML = scopedStyleBuilder(":root", brandingStyleMap)
  }
  appendStyles(window.document);
  //if ifram surface doc is present append to surface doc as well.
  const rootDocument = getRootDocumentNode()
  if(rootDocument){
    appendStyles(rootDocument)
  }
}



var updateCSSVars = function ({ buttonStyle, colorStyle, colorValue }) {
  //update the button styles with choosen color style    
  let requiredButtonStyle;
  for(let style in globalButtonStyles){
    if(globalButtonStyles[style].style === buttonStyle){
        globalButtonStyles[style].properties.color = globalColorStyles[colorStyle] || colorValue;
        requiredButtonStyle = globalButtonStyles[style];
    }
  }
  let buttonMixin = new ButtonMixin(requiredButtonStyle.id, requiredButtonStyle)
  const styleMap = buttonMixin.comuputeStyles(LIGHTNING_BUTTON)
  brandingButtonStyleMap[requiredButtonStyle.style] = styleMap;
  brandingStyleMap = Object.assign(brandingStyleMap, styleMap)
  updateAppLevelCSSVars();
  reloadStyleHooks(brandingStyleMap);
}
var reloadStyleHooks = function(brandingStyleMap){
  const reloadStyleHooksEvt = new CustomEvent('reload-style-hooks', {
    detail: {
      stylingHooks: brandingStyleMap,
      themeJSON: ThemeJSON
    }
  });
  window.dispatchEvent(reloadStyleHooksEvt);
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

var updateThemeColors = function ({ style, color }) {
  const themeColor = ThemeJSON[LIGHTNING_COLOR][style]
  themeColor.root = color
  themeColor.contrast = getContrastColor(color)
  generateGlobalThemeColorTokens( LIGHTNING_COLOR, ThemeJSON[LIGHTNING_COLOR])
  updateAppLevelCSSVars()
  reloadStyleHooks(brandingStyleMap);
}

function reloadWindowStyleHooks(details){
  updateAppLevelCSSVars(details);

  //adding button css stylehooks
  const textContent = '\n .slds-button {\n  color: var(--sds-c-button-text-color, var(--lightning-brand-color, #0176d3));\n}\n.slds-button:focus,\n.slds-button:hover {\n  color: var(--sds-c-button-text-color-hover, var(--dxp-s-button-color-hover, var(--lightning--color-scheme-primary-accent-root-1, #014486)));\n}\n.slds-button:focus {\n  box-shadow: var(--sds-c-button-shadow-focus, 0 0 3px var(--dxp-s-button-color-focus, var(--lightning--color-scheme-primary-accent-root-1, #0176d3)));\n}\n.slds-button:active {\n  color: var(--sds-c-button-text-color-active, var(--dxp-s-button-color-active, var(--lightning--color-scheme-primary-accent-root-1, #014486)));\n}\n.slds-button--neutral,\n.slds-button_neutral {\n  background-color: var(--sds-c-button-neutral-color-background, var(--lightning--button-neutral-color-root, #fff));\n  border-color: var(--sds-c-button-neutral-color-border, var(--lightning--color-scheme-neutral-root-1, #aeaeae));\n  color: var(--sds-c-button-brand-text-color, var(--lightning--button-neutral-color-contrast, #fff));\n  transition: var(--dxp-c-button-neutral-transition);\n}\n.slds-button--neutral:focus,\n.slds-button--neutral:hover,\n.slds-button_neutral:focus,\n.slds-button_neutral:hover {\n  background-color: var(--sds-c-button-neutral-color-background-hover, var(--lightning--button-neutral-color-root-1, var(--lightning--color-scheme-base-root-1, #f3f3f3)));\n  border-color: var(--sds-c-button-neutral-color-border-hover, var(--lightning--button-neutral-color-root-1, var(--lightning--color-scheme-neutral-root-2, #aeaeae)));\n  color: var(--sds-c-button-brand-text-color-hover, var(--lightning--button-neutral-color-contrast-1, var(--lightning--color-scheme-neutral-contrast-1, #fff)));\n  \n}\n.slds-button--neutral:active,\n.slds-button_neutral:active {\n  background-color: var(--sds-c-button-neutral-color-background-active, var(--lightning--button-neutral-color-root-1, var(--lightning--color-scheme-base-root-1, #e5e5e5)));\n  border-color: var(--sds-c-button-neutral-color-border-active, var(--lightning--button-neutral-color-root-1, var(--lightning--color-scheme-neutral-root-2, #aeaeae)));\n  color: var(--sds-c-button-text-color-active, var(--lightning--button-neutral-color-contrast-1, var(--lightning--color-scheme-primary-accent-root-1, #014486)));\n}\n.slds-button--brand,\n.slds-button_brand {\n  background-color: var(--sds-c-button-brand-color-background, var(--lightning--button-brand-color-root, #0176d3));\n  border-color: var(--sds-c-button-brand-color-border, var(--lightning--button-brand-color-root, #0176d3));\n  color: var(--sds-c-button-brand-text-color, var(--lightning--button-brand-color-contrast, #fff));\n  transition: var(--dxp-c-button-brand-transition);\n}\n.slds-button--brand:focus,\n.slds-button--brand:hover,\n.slds-button_brand:focus,\n.slds-button_brand:hover {\n  background-color: var(--sds-c-button-brand-color-background-hover, var(--lightning--button-brand-color-root-1, var(--lightning--color-scheme-primary-accent-root-1, #014486)));\n  border-color: var(--sds-c-button-brand-color-border-hover, var(--lightning--button-brand-color-root-1, var(--lightning--color-scheme-primary-accent-root-1, #014486)));\n  color: var(--sds-c-button-brand-text-color-hover, var(--lightning--button-brand-color-contrast-1, var(--lightning-brand-color-contrast-1, #fff)));\n}\n.slds-button--brand:active,\n.slds-button_brand:active {\n  background-color: var(--sds-c-button-brand-color-background-active, var(--lightning--button-brand-color-root-1, var(--lightning--color-scheme-primary-accent-root-1, #014486)));\n  border-color: var(--sds-c-button-brand-color-border-active, var(--lightning--button-brand-color-root-1, var(--lightning--color-scheme-primary-accent-root-1, #014486)));\n  color: var(--sds-c-button-brand-text-color-active, var(--lightning--button-brand-color-contrast-1, var(--lightning-brand-color-contrast-1, #fff)));\n}\n\n.slds-button--destructive,\n.slds-button_destructive {\n  background-color: var(--sds-c-button-destructive-color-background, var(--lightning--button-destructive-color-root, #ba0517));\n  border-color: var(--sds-c-button-destructive-color-border, var(--lightning--button-destructive-color-root, #ba0517));\n  color: var(--sds-c-button-destructive-text-color, var(--lightning--button-destructive-color-contrast, #fff));\n  transition: var(--dxp-c-button-destructive-transition);\n}\n.slds-button--destructive:focus,\n.slds-button--destructive:hover,\n.slds-button_destructive:focus,\n.slds-button_destructive:hover {\n  background-color: var(--sds-c-button-destructive-color-background-hover,var(--lightning--button-destructive-color-root-1, var(--lightning--color-scheme-destructive-root-1, #ba0517)));\n  border-color: var(--sds-c-button-destructive-color-border-hover, var(--lightning--button-destructive-color-root-1, var(--lightning--color-scheme-destructive-root-1, #ba0517)));\n  color: var(--sds-c-button-destructive-text-color-hover,var(--lightning--button-destructive-color-contrast-1, var(--lightning--color-scheme-destructive-contrast-1, #fff)));\n}\n.slds-button--destructive:active,\n.slds-button_destructive:active {\n  background-color: var(--sds-c-button-destructive-color-background-active,var(--lightning--button-destructive-color-root-1, var(--lightning--color-scheme-destructive-root-1, #8e030f)));\n  border-color: var(--sds-c-button-destructive-color-border-active,var(--lightning--button-destructive-color-root-1, var(--lightning--color-scheme-destructive-root-1, #8e030f)));\n  color: var(--sds-c-button-destructive-text-color-active,var(--lightning--button-destructive-color-contrast-1, var(--lightning--color-scheme-destructive-contrast-1, #fff)));\n}\n\n.slds-button--success,\n.slds-button_success {\n  background-color: var(--sds-c-button-success-color-background, var(--lightning--button-success-color-root, #45c65a));\n  border-color: var(--sds-c-button-success-color-border, var(--lightning--button-success-color-root, #91db8b));\n  color: var(--sds-c-button-success-text-color, var(--lightning--button-success-color-contrast, #181818));\n  transition: var(--dxp-c-button-success-transition);\n}\n.slds-button--success:focus,\n.slds-button--success:hover,\n.slds-button_success:focus,\n.slds-button_success:hover {\n  background-color: var(--sds-c-button-success-color-background-hover, var(--lightning--button-success-color-root-1, var(--lightning--color-scheme-success-root-1, #2e844a)));\n  border-color: var(--sds-c-button-success-color-border-hover, var(--lightning--button-success-color-root-1, var(--lightning--color-scheme-success-root-1, #2e844a)));\n  color: var(--sds-c-button-success-text-color-hover, var(--lightning--button-success-color-contrast-1, var(--lightning--color-scheme-success-contrast-1, #fff)));\n}\n.slds-button--success:active,\n.slds-button_success:active {\n  background-color: var(--sds-c-button-success-color-background-active,var(--lightning--button-success-color-root-1, var(--lightning--color-scheme-success-root-1, #2e844a)));\n  border-color: var(--sds-c-button-success-color-border-active,var(--lightning--button-success-color-root-1, var(--lightning--color-scheme-success-root-1, #2e844a)));\n  color: var(--sds-c-button-success-text-color-active,var(--lightning--button-success-color-contrast-1, var(--lightning--color-scheme-success-contrast-1, #fff)));\n}\n/* Standard Button */\n/* .slds-button {\n  font-family: var(--dxp-s-button-font-family);\n  font-size: var(--dxp-s-button-font-size);\n  font-style: var(--dxp-s-button-font-style);\n  font-weight: var(--dxp-s-button-font-weight);\n  text-decoration: var(--dxp-s-button-text-decoration-active);\n  text-transform: var(--dxp-s-button-text-transform);\n  line-height: var(--dxp-s-button-line-height);\n  letter-spacing: var(--dxp-s-button-letter-spacing);\n  border-radius: var(--sds-c-button-radius-border, var(--dxp-s-button-radius-border, 0.25em));\n\n  --sds-c-button-brand-spacing-inline-start: var(--dxp-s-button-padding, 1em);\n  --sds-c-button-brand-spacing-inline-end: var(--dxp-s-button-padding, 1em);\n\n  --sds-c-button-outline-brand-spacing-inline-start: var(--dxp-s-button-padding, 1em);\n  --sds-c-button-outline-brand-spacing-inline-end: var(--dxp-s-button-padding, 1em);\n\n  --sds-c-button-destructive-spacing-inline-start: var(--dxp-s-button-padding, 1em);\n  --sds-c-button-destructive-spacing-inline-end: var(--dxp-s-button-padding, 1em);\n\n  --sds-c-button-text-destructive-spacing-inline-start: var(--dxp-s-button-padding, 1em);\n  --sds-c-button-text-destructive-spacing-inline-end: var(--dxp-s-button-padding, 1em);\n\n  --sds-c-button-success-spacing-inline-start: var(--dxp-s-button-padding, 1em);\n  --sds-c-button-success-spacing-inline-end: var(--dxp-s-button-padding, 1em);\n} */';
  var styleSheetEl = document.createElement('style');
  styleSheetEl.type = 'text/css';
  styleSheetEl.id = 'theme-button-styles';

  if (styleSheetEl.styleSheet)
    styleSheetEl.styleSheet.cssText = textContent;
  else
  styleSheetEl.appendChild(document.createTextNode(textContent));
  
  /* Append style to the tag name */
  getRootDocumentNode().head.appendChild(styleSheetEl);
}

window.addEventListener("reload-styles", (e) => updateCSSVars(e.detail))
window.addEventListener("reload-window-style-hooks", (e) => reloadWindowStyleHooks(e.detail));
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
    if(propertyNameBase !== 'noStore'){
      globalTokens[propertyNameBase + "-" + i] = derivation.toHexString()
    }
  }
  return newValues
}

var generateGlobalThemeColorTokens = function (theme, themeColors) {
  for (let key in themeColors) {
    const colorStyle = themeColors[key]
    for (let color in colorStyle) {
      if (!colorStyle["derived"]) {
        colorStyle["derived"] = {}
      }
      let tokenName = `--${kebabCase(theme).replace("/", "--")}-${kebabCase(key)}-`
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
      }
    }
  }
}

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

var generateGlobalThemeButtonTokens = function(nameSpace, buttonStyles){
  for(let style in buttonStyles){
    let buttonMixin = new ButtonMixin(style, buttonStyles[style]);
    const styleMap = buttonMixin.comuputeStyles(nameSpace);
    brandingButtonStyleMap[buttonStyles[style].style] = styleMap;
    brandingStyleMap = Object.assign(brandingStyleMap, styleMap)
  }
}

let ThemeJSON = {
  brandColor: "#0176D3",
  "lightning/colorScheme" : globalColorStyles,
  "lightning/button" : globalButtonStyles,
  lables: textStyles
}
const globalNamespace = "lightning"

var generateGlobalThemeTokens = function(themeJSON){
  for(let theme in themeJSON){
    if(typeof themeJSON[theme] !== 'object'){
      let tokenName = `--${globalNamespace}-${kebabCase(theme)}`
      globalTokens[tokenName] = themeJSON[theme]
    }else if(theme.includes('color')){
      generateGlobalThemeColorTokens(theme, themeJSON[theme])
    }else if(theme.includes('button')){
      generateGlobalThemeButtonTokens(theme, themeJSON[theme]);
    }
  }
}
generateGlobalThemeTokens(ThemeJSON);
updateAppLevelCSSVars();


export { globalButtonStyles, globalColorStyles, ThemeJSON , brandingStyleMap as stylingHooks, brandingButtonStyleMap as buttonStyleHooks}
