import React, { useState, useEffect } from 'react';

// TEST: calling simple api
// callBackendApi = async () => {
//     const response = await fetch('/api/hello');
//     const hello = await response.json();
//     return hello;
// }

// index.php
function Home() {
    // state variables
    const [hello, setHello] = useState(0);

    // similar to componentDidMount
    useEffect(() => {
        async function callBackendApi () {
            const response = await fetch('/api/hello');
            const hello = await response.json();
            setHello(hello);
        }
        callBackendApi();
    });
    
    // read a state variable by simply placing {} around the variable name
    return (
        <h4> HELLO WORLD! || {hello} </h4>
    );
}

export default Home;