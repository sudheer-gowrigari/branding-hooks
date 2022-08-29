import { LightningElement, api } from 'lwc';

export default class ButtonPreview extends LightningElement {
    @api activeButtonStyle;
    _buttonStyles = [];
    fontStyleMappings = {
        'fontStyle': 'font-style',
        'textDecoration':'text-decoration',
        'textTransform' :'text-transform',
        'fontSize':'font-size',
        'fontWeight':'font-weight',
        'fontFamily': 'font-family',
        'fontColor': 'color'
    };
    colorStyleMappings = {
        'root': 'background-color',
        'border': 'border-color',
        'contrast': 'color'
    };
    _connected = false;
    @api
    get buttonStyles(){
        return this._buttonStyles;
    }
    set buttonStyles(data){
        this._buttonStyles = data;
        if(this._connected){
            this.updateActiveButtonStyles();
        }
    }
    connectedCallback(){
        //console.log('activeButtonStyle' , this.activeButtonStyle, this.buttonStyles);
        //this.updateActiveButtonStyles();
        this._connected = true;
    }
    renderedCallback(){
        //this.updateActiveButtonStyles();
    }
    updateActiveButtonStyles(){
       const styleString = this.computeButtonStyles();
       let previewEl = this.getPreviewEl();
        if(!previewEl){ return }
        previewEl.style = styleString;
    }
    getPreviewEl(){
        let selector = ''
        if(this.showBaseBrand){
            selector = 'base-button'
        }else if(this.showSuccessButton){
            selector = 'success-button'
        }else if(this.showTextDestructiveButton){
            selector = 'text-destructive-button'
        }else if(this.showNeutral){
            selector = 'neutral-button'
        }else if(this.showBrand){
            selector = 'brand-button'
        }else if(this.showOutlineBrand){
            selector = 'outline-button'
        }else if(this.showDestructiveBrand){
            selector = 'destructive-button';
        }
        return this.template.querySelector(`button.${selector}`);
    }
    computeButtonStyles(){
        const buttonStyle = this.buttonStyles.find(button => button.style === this.activeButtonStyle)
        const styleProperties = buttonStyle.properties;
        let styleString = '';
        for(let style in styleProperties){
            if(style === 'typography'){
                styleString += this.getFontStyles(styleProperties[style].properties); 
            }else if(style === 'boundingbox'){
                styleString += this.getBoundingBoxStyles(styleProperties[style].properties);
            } else if(style === 'color'){
                styleString += this.getColorStyles(styleProperties[style])
            }
        }
        return styleString;
    }
    getColorStyles(styles){
        let styleString = '';
        for(let key in styles){
            styleString += this.colorStyleMappings[key]+":"+styles[key]+"; ";
            if(key === 'root'){
                styleString += this.colorStyleMappings['border']+":"+styles[key]+"; ";
            }
        }
        console.log('color style string ', styleString);
        return styleString;
    }
    getBoundingBoxStyles(styles){
        let styleString = '';
        for(let style in styles){
            if(typeof styles[style] === 'object') {
                const propObj = styles[style];
                for(let key in propObj){
                    styleString += `${style}-${key}:${propObj[key]}` 
                    + ((key === 'width' || style === 'padding' || key === 'radius') ? 'px' : '')+"; "
                }
            }
        }
        console.log(" bounding box ", styleString);
        return styleString;
    }
    getFontStyles(styles){
        let styleString = '';
        for(let key in styles){
            styleString += this.fontStyleMappings[key]+":"+styles[key]+(key === 'Font Size'? 'rem' : '')+";";
        }
        //console.log('font style string ', styleString);
        return styleString;
    }

    get showBaseBrand(){
        return this.activeButtonStyle === 'BaseButton';
    }
    get showTextDestructiveButton(){
        return this.activeButtonStyle === 'TextDestructiveButton';
    }
    get showSuccessButton(){
        return this.activeButtonStyle === 'SuccessButton';
    }
    get showNeutral(){
        return this.activeButtonStyle === 'NeutralButton';
    }
    get showBrand(){
        return this.activeButtonStyle === 'BrandButton'
    }
    get showOutlineBrand(){
        return this.activeButtonStyle === 'OutlineBrandButton'
    }
    get showDestructiveBrand(){
        return this.activeButtonStyle === 'DestructiveButton'
    }
}