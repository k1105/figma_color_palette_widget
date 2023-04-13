export const RGBToHEX = (R: number, G: number, B: number) => {
    const hR = (R < 16 ? "0"+R.toString(16) : R.toString(16)).toUpperCase(); 
    const hG = (G < 16 ? "0"+G.toString(16) : G.toString(16)).toUpperCase(); 
    const hB = (B < 16 ? "0"+B.toString(16) : B.toString(16)).toUpperCase(); 
    return ("#"+hR+hG+hB);
};