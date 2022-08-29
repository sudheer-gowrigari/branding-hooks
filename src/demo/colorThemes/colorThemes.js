import { LightningElement, api } from 'lwc';

export default class ColorThemes extends LightningElement {
    activeSections = ['A'];
    activeSectionsMessage = '';

    @api colorStyles = {};
    @api activeThemeColor = '';
    handleSectionToggle(event) {
        const openSections = event.detail.openSections;
        if (openSections.length === 0) {
            this.activeSectionsMessage = 'All sections are closed';
        } else {
            this.activeSectionsMessage =
                'Open sections: ' + openSections;
        }
    }
    handleColorChange(evt){
        const newColor = evt.detail.value;
        const updateThemeColorsEvt = new CustomEvent('update-theme-colors', {
            detail: {
              style: this.activeThemeColor,
              color: newColor
            }
        });
        window.dispatchEvent(updateThemeColorsEvt);
    }

    getActiveColorStyle(){
        const activeColorStyle = this.colorStyles.find(el => el.id == this.activeThemeColor);
        return activeColorStyle;
    }
    get selectedColorStyle(){
        const colorStyles = this.getActiveColorStyle();
        return colorStyles.root;
    }

    get derivedColors(){
        const activeColorStyle = this.getActiveColorStyle();
        const derivedColorStyle = activeColorStyle.derived;
        const derivedColors = [];
        for(let key in derivedColorStyle){
            for(let index in derivedColorStyle[key]){
                derivedColors.push(
                    {
                        id: `${key}-${index}`,
                        style: `background-color: var(${derivedColorStyle[key][index]?.name})`,
                        color: derivedColorStyle[key][index]?.value
                    }
                )
            }
        }
        console.log("derived colors ", derivedColors);
        return derivedColors;
    }

}