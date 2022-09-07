import { LightningElement, api } from 'lwc';

export default class ButtonStyles extends LightningElement {
    activeSections = ['A'];
    activeSectionsMessage = '';
    showCustomColorPicker = false;
    disableThemeColors = false;
    handleSectionToggle(event) {
        const openSections = event.detail.openSections;
        if (openSections.length === 0) {
            this.activeSectionsMessage = 'All sections are closed';
        } else {
            this.activeSectionsMessage =
                'Open sections: ' + openSections;
        }
    }
    @api themeStyles = {};
    @api activeButtonStyle = '';
    @api buttonStyles = {};

    value = 'inProgress';
    _selectedColorStyle = '';

    get colorStyles() {
        let colorThemeStyles = [];
        const colorStyle = this.themeStyles.color;
        for(let style in colorStyle){
            let themeStyle = { label: colorStyle[style].label, value: style }
            colorThemeStyles.push(themeStyle);
        }
        return colorThemeStyles;
    }

    getActiveButtonStyle(){
        const activeButtonStyle = this.buttonStyles.find(el => el.style == this.activeButtonStyle);
        return activeButtonStyle.properties;
    }

    get selectedColorStyle(){
        const buttonStyles = this.getActiveButtonStyle();
        const colorStyles = buttonStyles.color;
        return colorStyles.id;
    }

    handleColorStyleChange(event) {
        this._selectedColorStyle = event.detail.value;
        const reloadStylesEvt = new CustomEvent('reload-styles', {
            detail: {
              colorStyle: this._selectedColorStyle,
              buttonStyle: this.activeButtonStyle
            }
        });
        window.dispatchEvent(reloadStylesEvt);
    }
    handleOverrideClick(event) {
        this.disableThemeColors = event.target.checked;
        this.showCustomColorPicker = event.target.checked;
    }

    handleColorChange(event){
        const colorValue = event.detail.value;
        const reloadStylesEvt = new CustomEvent('reload-styles', {
            detail: {
              colorStyle: null,
              colorValue: colorValue,
              buttonStyle: this.activeButtonStyle
            }
        });
        window.dispatchEvent(reloadStylesEvt);
    }
}