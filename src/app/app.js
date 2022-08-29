import {LightningElement, track} from "lwc"
import {globalButtonStyles, globalColorStyles, ThemeJSON, stylingHooks, buttonStyleHooks} from "./buttonStyles"

export default class App extends LightningElement {
  selectedItem = "colorstyles"
  selectedButtonSetting = "NeutralButton"
  selectedThemeColorSetting = "base"
  currentContent = "typography"
  _globalButtonStyles = globalButtonStyles
  _showButtonStyles = false;
  _showButtonThemes = false;
  _showColorSettings = false
  _themeSettings = [
    {
      id: "126",
      name: "colorstyles",
      label: "Color Styles"
    },
    {
      id: "1236",
      name: "buttonstyles",
      label: "Button Styles"
    }
  ]
  connectedCallback(){
    window.addEventListener("reload-style-hooks", (e) => this.populateButtonStyleHooks(e.detail))
  }
  disconnectedCallback(){
    window.removeEventListener("reload-style-hooks", this.populateButtonStyleHooks)
  }
  renderedCallback(){
    this.populateThemeJSON();
    this.populateButtonStyleHooks();
  }

  get themeSettings() {
    return this._themeSettings
  }

  get buttonStyles() {
    return this._globalButtonStyles;
  }

  get buttonThemeStyleHooks(){
    return buttonStyleHooks;
  }
  get themeStyles() {
    return {
      color: globalColorStyles
    }
  }
  get themeColors() {
    let _themeColors = []
    for (let colorStyle in globalColorStyles) {
      _themeColors.push(Object.assign({}, globalColorStyles[colorStyle]))
    }
    console.log(" theme color ", _themeColors)
    return _themeColors
  }

  get showButtonPreview() {
    return this.showButtonStyles
  }

  get showButtonStyles() {
    return this._showButtonStyles
  }
  get showColorSettings() {
    return this._showColorSettings
  }

  get showButtonThemes() {
    return this._showButtonStyles
  }
  handleSelect(event) {
    const selected = event.detail.name
    this._showTypoGraphySettings = this._showBoundingBox = this._showButtonStyles = false
    this._showColorSettings = false
    if (selected == "buttonstyles") {
      this._showButtonStyles = true
      this._showButtonThemes = true
    } else if (selected == "colorstyles") {
      this._showColorSettings = true
    }
    this.currentContent = selected
  }

  handleThemeColorSelect(evt) {
    const selected = evt.detail.name
    this.selectedThemeColorSetting = selected
  }
  handleButtonSettingSelect(event) {
    const selected = event.detail.name
    this.selectedButtonSetting = selected
  }

  populateThemeJSON(){
    const options = {
      collapsed: true,
      rootCollapsable: false,
      withQuotes: true,
      withLinks: true
    };
    const themeJson = this.template.querySelector('pre.theme-json');
    $(themeJson).jsonViewer(ThemeJSON, options);
  }

  handleStyleHooksActive(){
    const options = {
      collapsed: true,
      rootCollapsable: false,
      withQuotes: false,
      withLinks: true
    };
    setTimeout(() => {
      const styleHooks = this.template.querySelector('pre.style-hooks');
      $(styleHooks).jsonViewer(stylingHooks, options);
    });
  }

  populateButtonStyleHooks(detail){
    if(!this.showButtonPreview){
      return;
    }
    const options = {
        collapsed: true,
        rootCollapsable: false,
        withQuotes: false,
        withLinks: true
    };
    let styleHooks = buttonStyleHooks;
    if(detail && detail.buttonStyleHooks){
      styleHooks = detail.buttonStyleHooks
    }
    const hooks = JSON.parse(JSON.stringify(styleHooks[this.selectedButtonSetting]));
    const styleHook = this.template.querySelector('pre.button-style-hooks');
    $(styleHook).jsonViewer(hooks, options);
  }
}
