export const RGBToCMYK = (r:number, g:number, b:number) => {
    r = r /255 *100;
    g = g /255 *100;
    b = b /255 *100;
    let K = 100 - Math.max(r, g, b);
    const C = K == 100 ? 0 : Math.floor((100-r-K)/(100-K) *100);
    const M = K == 100 ? 0 : Math.floor((100-g-K)/(100-K) *100);
    const Y = K == 100 ? 0 : Math.floor((100-b-K)/(100-K) *100);
    K = Math.floor(K); //Kだけ丸める処理を最後に持ってくる
    return {C: C, M: M, Y: Y, K: K};
  }