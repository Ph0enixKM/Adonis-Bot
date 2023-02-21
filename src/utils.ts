export const chooseRandom = (array : any[]) : any => array[
      Math.floor(Math.random() * array.length)
    ];
