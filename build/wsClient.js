(() => {
    console.log('init....');
    const ws = new WebSocket('ws://localhost:3334');
    const reactMap = {
        'reload': () =>  location.reload(),
    };
    ws.onopen = () => {
    
        // ws.onclose =  () => {
        // };

        ws.onmessage = message => {
           const react =  reactMap[message.data];
           react && react();
        };
    };
})();