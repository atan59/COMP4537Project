// Constants
const endpointsTable = document.querySelector('#endpointsTable');
const url = "http://localhost:3000/API/v1/stats";

// Globals
let endpoints = [];
let response = null;

loadEndpoints = async () => {
    response = await fetch(url);
    if (response.ok) {
        endpoints = await response.json();
        endpointsTable.innerHTML = endpoints.map(stat => {
            return `
                <tr>
                    <td class="end-point">${stat.method}</td>
                    <td class="end-point">${stat.endpoint}</td>
                    <td class="end-point">${stat.requests}</td>
                </tr>
            `
        }).join('');
    };
}

loadEndpoints();