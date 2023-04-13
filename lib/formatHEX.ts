export const formatHEX = (hex: string) => {
    if(hex[0] !== "#") {
        hex = "#" + hex;
    }

    if(hex.length < 4) {
        hex = hex + 0*(4-hex.length);
    }

    if(hex.length == 4) {
        return ("#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]).toUpperCase();
    }

    if (hex.length < 7) {
        hex +=  0*(7-hex.length);
    }    
    return hex.slice(0, 7).toUpperCase();
};